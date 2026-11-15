// تشغيل نموذج لغوي صغير مفتوح الأوزان داخل المتصفح عبر WebGPU (مكتبة WebLLM).
// السؤال والنص لا يغادران الجهاز. النموذج يُنزَّل مرة واحدة ثم يُحفظ في المتصفح.
//
// المكتبة تُحمَّل عند الطلب فقط من CDN حتى لا تزيد حجم التطبيق لمن لا يستخدم الميزة.

const WEBLLM_URL = 'https://esm.run/@mlc-ai/web-llm@0.2.85';

// كلها 3 مليارات معامل أو أقل. نختار أول نموذج موجود في قائمة المكتبة ويدعمه الجهاز.
const PREFERRED_MODELS = [
  'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
  'Qwen2.5-1.5B-Instruct-q4f32_1-MLC',
  'gemma-2-2b-it-q4f16_1-MLC',
  'gemma-2-2b-it-q4f32_1-MLC',
  'Qwen2-1.5B-Instruct-q4f16_1-MLC',
  'Qwen2-1.5B-Instruct-q4f32_1-MLC',
  'Llama-3.2-1B-Instruct-q4f32_1-MLC',
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

const SYSTEM_PROMPT = `أنت مساعد يبسّط نصاً من كتاب تفسير للقارئ العربي.
القواعد:
- اعتمد على "نص التفسير" المعطى فقط، ولا تضف أي معلومة من خارجه.
- إن لم يكن في النص جواب عن السؤال فقل: "لا أجد جواب هذا السؤال في نص التفسير المعروض."
- لا تُصدر فتاوى ولا أحكاماً شرعية.
- أجب بعربية فصحى سهلة في ثلاث إلى خمس جمل.`;

/**
 * يبسّط المقطع المسترجَع ويجيب عن السؤال منه فقط، مع بثّ الجواب تدريجياً.
 * @param {(partial: string) => void} onToken
 */
export async function explainFromPassage({ verseText, sourceName, passage, question }, onToken) {
  if (!loaded) throw new Error('model-not-loaded');
  const user = [
    verseText ? `الآية: ${verseText}` : null,
    `نص التفسير (${sourceName}):\n${passage}`,
    `السؤال: ${question || 'اشرح معنى الآية بإيجاز.'}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  const stream = await loaded.engine.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: user },
    ],
    temperature: 0.2,
    max_tokens: 350,
    stream: true,
  });

  let out = '';
  for await (const chunk of stream) {
    out += chunk.choices?.[0]?.delta?.content || '';
    onToken?.(out);
  }
  return out;
}
