// استرجاع نص التفسير من مصدر مفتوح وتخزينه على الجهاز.
// لا يُستخدم هنا أي نموذج ذكاء اصطناعي: النص يُعرض كما هو مع اسم مصدره.
//
// البيانات: مشروع spa5k/tafsir_api (رخصة MIT، مصدر النصوص qul.tarteel.ai).
// ملف لكل آية بهذا الشكل بالضبط، والنص عادي بلا HTML:
//   { "text": "…", "ayah": 2, "surah": 1 }
// الآيات التي يشرحها التفسير ضمن آية سابقة لا ملف لها (404).
//
// ترتيب الجلب:
//   1) سورة الفاتحة: نسخة محلية مرفقة مع التطبيق (public/tafsir-seed) تعمل دون إنترنت.
//   2) غيرها: CDN مثبّت على إيداع محدد، ثم تُحفظ في Cache Storage لتبقى متاحة دون اتصال.

const DATA_COMMIT = 'b6d01854b1b2e019e66cdaef6132e25521ee86f2';
const CDN_BASE = `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@${DATA_COMMIT}/tafsir`;
const SEED_BASE = `${import.meta.env?.BASE_URL ?? '/'}tafsir-seed`;
const SEED_SURAH = 1;
const CACHE_NAME = 'zekr-tafsir-v1';
const MAX_LOOKBACK = 15;

export const TAFSIR_SOURCES = [
  { slug: 'ar-tafsir-ibn-kathir', name: 'تفسير ابن كثير', author: 'ابن كثير (ت 774هـ)' },
  { slug: 'ar-tafseer-al-saddi', name: 'تفسير السعدي', author: 'عبد الرحمن السعدي (ت 1376هـ)' },
  { slug: 'ar-tafsir-al-tabari', name: 'تفسير الطبري', author: 'ابن جرير الطبري (ت 310هـ)' },
];

// النصوص تحمل حواشي المحقق بين [[ ]] (فروق النسخ ونحوها). نحذفها من العرض ومن
// المقطع المُمرَّر للنموذج لأنها ليست من كلام المفسّر وتقطع الجمل.
export function stripFootnotes(text) {
  return text
    .replace(/\[\[[^\]]*\]\]/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/ ([،.؛:])/g, '$1')
    .trim();
}

function parseAyah(data, surah, ayah) {
  if (
    !data ||
    typeof data.text !== 'string' ||
    Number(data.surah) !== Number(surah) ||
    Number(data.ayah) !== Number(ayah)
  ) {
    throw new Error('tafsir-unexpected-shape');
  }
  return stripFootnotes(data.text);
}

/** يعيد نص الآية، أو null إن لم يكن لها ملف (404). */
async function fetchAyah(slug, surah, ayah) {
  if (Number(surah) === SEED_SURAH) {
    const res = await fetch(`${SEED_BASE}/${slug}/${surah}/${ayah}.json`);
    if (!res.ok) throw new Error(`tafsir-seed-http-${res.status}`);
    return parseAyah(await res.json(), surah, ayah);
  }

  const url = `${CDN_BASE}/${slug}/${surah}/${ayah}.json`;
  let cache = null;
  try {
    if (typeof caches !== 'undefined') cache = await caches.open(CACHE_NAME);
  } catch {
    cache = null;
  }
  if (cache) {
    const hit = await cache.match(url);
    if (hit) return parseAyah(await hit.json(), surah, ayah);
  }

  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`tafsir-http-${res.status}`);
  const text = parseAyah(await res.clone().json(), surah, ayah);
  if (cache) {
    try {
      await cache.put(url, res);
    } catch {
      // التخزين ممتلئ أو غير متاح: نكمل دون حفظ
    }
  }
  return text;
}

/**
 * يجلب تفسير آية. إن لم يكن للآية ملف فهي مشروحة ضمن آية سابقة، فنرجع إليها.
 * @returns {Promise<{ text: string, fromAyah: number }>}
 */
export async function getTafsir(slug, surah, ayah) {
  const first = Math.max(1, ayah - MAX_LOOKBACK);
  for (let a = ayah; a >= first; a--) {
    const text = await fetchAyah(slug, surah, a);
    if (text) return { text, fromAyah: a };
  }
  return { text: '', fromAyah: ayah };
}

const STOP_WORDS = new Set([
  'ما', 'ماذا', 'من', 'في', 'على', 'عن', 'الى', 'هل', 'كيف', 'لماذا', 'هذه', 'هذا', 'هي', 'هو',
  'معني', 'معنى', 'الايه', 'ايه', 'تفسير', 'اشرح', 'شرح', 'التي', 'الذي', 'ان', 'او', 'ثم', 'قد', 'لي',
]);

export function normalizeArabic(s) {
  return (s || '')
    .replace(/[ً-ٰٟۖ-ۭـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
}

/**
 * يختار من نص التفسير المقاطع الأقرب للسؤال بحيث لا تتجاوز maxChars،
 * حتى يتسع النص لنافذة سياق نموذج صغير. المقطع الأول يُضمَّن دائماً.
 */
export function selectPassages(text, question, maxChars = 1600) {
  if (!text) return '';
  if (text.length <= maxChars) return text;

  const chunks = [];
  text.split(/\n+/).forEach((para) => {
    let buf = '';
    para.split(/([.؟!]\s+)/).forEach((piece) => {
      buf += piece;
      if (buf.length >= 220) {
        chunks.push(buf.trim());
        buf = '';
      }
    });
    if (buf.trim()) chunks.push(buf.trim());
  });

  const words = normalizeArabic(question)
    .split(/[^ء-ي]+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));

  const scored = chunks.map((c, i) => {
    const norm = normalizeArabic(c);
    const score = words.reduce((n, w) => n + (norm.includes(w) ? 1 : 0), 0);
    return { i, c, score };
  });

  const picked = new Set([0]);
  let total = Math.min(scored[0].c.length, maxChars);
  [...scored]
    .slice(1)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .forEach((s) => {
      if (total + s.c.length + 1 <= maxChars) {
        picked.add(s.i);
        total += s.c.length + 1;
      }
    });

  return scored
    .filter((s) => picked.has(s.i))
    .map((s) => s.c)
    .join('\n')
    .slice(0, maxChars);
}
