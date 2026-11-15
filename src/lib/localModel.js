// تشغيل نموذج لغوي صغير مفتوح الأوزان داخل المتصفح عبر WebGPU (مكتبة WebLLM).
// السؤال والنص لا يغادران الجهاز. النموذج يُنزَّل مرة واحدة ثم يُحفظ في المتصفح.
//
// المكتبة تُحمَّل عند الطلب فقط من CDN حتى لا تزيد حجم التطبيق لمن لا يستخدم الميزة.

const WEBLLM_URL = 'https://esm.run/@mlc-ai/web-llm@0.2.85';

// النموذج: Qwen2.5-1.5B-Instruct (1.5 مليار معامل، أوزان مفتوحة برخصة Apache-2.0)، تكميم 4-بت.
// نسخة f16 أصغر وأسرع لكنها تحتاج ميزة shader-f16 في كرت الشاشة؛ وإلا نستخدم نسخة f32.
// الذاكرة المطلوبة بحسب WebLLM: نحو 1.6 غيغابايت (f16) أو 1.9 غيغابايت (f32).
const PREFERRED_MODELS = [
  'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
  'Qwen2.5-1.5B-Instruct-q4f32_1-MLC',
];

let loaded = null; // { engine, modelId }
let loading = null;

export async function checkSupport() {
  try {
    if (typeof navigator === 'undefined' || !navigator.gpu) return { ok: false };
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) return { ok: false };
    return { ok: true, f16: adapter.features.has('shader-f16') };
  } catch {
    return { ok: false };
  }
}

export function getLoadedModelId() {
  return loaded?.modelId || null;
}

/**
 * @param {(p: { progress: number, text: string }) => void} onProgress
 * @returns {Promise<{ engine: any, modelId: string }>}
 */
export function loadModel(onProgress) {
  if (loaded) return Promise.resolve(loaded);
  if (loading) return loading;

  loading = (async () => {
    const support = await checkSupport();
    if (!support.ok) throw new Error('webgpu-unsupported');

    const webllm = await import(/* @vite-ignore */ WEBLLM_URL);
    const available = new Set(webllm.prebuiltAppConfig.model_list.map((m) => m.model_id));
    const candidates = PREFERRED_MODELS.filter(
      (id) => available.has(id) && (support.f16 || !id.includes('f16'))
    );
    if (candidates.length === 0) throw new Error('no-model-available');

    let lastError = null;
    for (const modelId of candidates) {
      try {
        const engine = await webllm.CreateMLCEngine(modelId, {
          initProgressCallback: (r) =>
            onProgress?.({ progress: r.progress ?? 0, text: r.text ?? '' }),
        });
        loaded = { engine, modelId };
        return loaded;
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error('model-load-failed');
  })();

  loading.catch(() => {}).finally(() => {
    loading = null;
  });
  return loading;
}

// مهمة واحدة ضيقة: إعادة صياغة مقطع واحد من التفسير بلغة أبسط.
// لا سؤال حر ولا استدعاء معرفة خارجية؛ النموذج يعيد كتابة ما أُعطيه فقط.
const SYSTEM_PROMPT = `أنت تعيد صياغة نص عربي من كتاب تفسير بلغة أبسط.
القواعد:
- أعد صياغة النص المعطى فقط، بثلاث إلى خمس جمل، بعربية فصحى سهلة.
- لا تضف أي معلومة ليست في النص: لا أرقام جديدة، ولا أسماء جديدة، ولا سبب نزول، ولا حديث، ولا آية أخرى.
- لا تجب عن أي سؤال ولا تفتِ؛ مهمتك إعادة الصياغة.
- إن كان النص غير واضح، أعد صياغته كما تفهمه دون زيادة.
- ابدأ مباشرة بالنص المُعاد صياغته بلا مقدمة ولا خاتمة.`;

// فحص بعدي بسيط: يكشف أرقاماً أو إحالات لم ترد في المقطع الأصلي.
// ليس حكماً على المعنى، بل إشارة للمستخدم أن النص قد يكون خرج عن المصدر.
export function findOutsideAdditions(answer, passage) {
  const norm = (t) => t.replace(/[\u064B-\u0652\u0670]/g, '');
  const a = norm(answer || '');
  const p = norm(passage || '');
  const nums = (t) => new Set((t.match(/[\u0660-\u0669]+|[0-9]+/g) || []).map((x) => x.replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))));
  const passageNums = nums(p);
  const outside = [...nums(a)].filter((n) => !passageNums.has(n));
  const refs = [...new Set((a.match(/سورة [\u0600-\u06FF]+/g) || []))].filter((r) => !p.includes(r));
  return [...outside.map((n) => `رقم ${n}`), ...refs];
}

/**
 * يعيد صياغة المقطع المسترجَع بلغة أبسط، دون أي معلومة من خارجه.
 * @param {(partial: string) => void} onToken
 * @returns {Promise<{text: string, outside: string[]}>}
 */
export async function explainFromPassage({ verseText, sourceName, passage }, onToken) {
  if (!loaded) throw new Error('model-not-loaded');
  const user = [
    verseText ? `الآية: ${verseText}` : null,
    `نص التفسير (${sourceName}):\n${passage}`,
    'المطلوب: أعد صياغة هذا النص بلغة أبسط دون أي معلومة من خارجه.',
  ]
    .filter(Boolean)
    .join('\n\n');

  const stream = await loaded.engine.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: user },
    ],
    temperature: 0.2,
    max_tokens: 260,
    stream: true,
  });

  let out = '';
  for await (const chunk of stream) {
    out += chunk.choices?.[0]?.delta?.content || '';
    onToken?.(out);
  }
  return { text: out.trim(), outside: findOutsideAdditions(out, passage) };
}
