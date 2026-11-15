// استرجاع نص التفسير من مصدر مفتوح وتخزينه على الجهاز.
// لا يُستخدم هنا أي نموذج ذكاء اصطناعي: النص يُعرض كما هو مع اسم مصدره.
//
// البيانات: مشروع spa5k/tafsir_api (ملفات JSON ثابتة لكل آية، مصدرها quran.com).
// كل آية تُفتح تُحفظ في Cache Storage فتبقى متاحة دون اتصال بعد أول مرة.

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir';
const CACHE_NAME = 'zekr-tafsir-v1';

export const TAFSIR_SOURCES = [
  { slug: 'ar-tafsir-ibn-kathir', name: 'تفسير ابن كثير', author: 'ابن كثير (ت 774هـ)' },
  { slug: 'ar-tafseer-al-saddi', name: 'تفسير السعدي', author: 'عبد الرحمن السعدي (ت 1376هـ)' },
  { slug: 'ar-tafsir-al-tabari', name: 'تفسير الطبري', author: 'ابن جرير الطبري (ت 310هـ)' },
];

async function fetchJson(url) {
  let cache = null;
  try {
    if (typeof caches !== 'undefined') cache = await caches.open(CACHE_NAME);
  } catch {
    cache = null;
  }
  if (cache) {
    const hit = await cache.match(url);
    if (hit) return hit.json();
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (cache) {
    try {
      await cache.put(url, res.clone());
    } catch {
      // التخزين ممتلئ أو غير متاح: نكمل دون حفظ
    }
  }
  return res.json();
}

// بعض النسخ تضع النص تحت مفتاح مختلف؛ نأخذ أطول نص في الكائن.
function extractText(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (typeof obj.text === 'string') return obj.text;
  let best = '';
  const walk = (v) => {
    if (typeof v === 'string') {
      if (v.length > best.length) best = v;
    } else if (v && typeof v === 'object') {
      Object.values(v).forEach(walk);
    }
  };
  walk(obj);
  return best;
}

export function stripHtml(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(
    html.replace(/<\/(p|div|h\d|li)>/gi, '$&\n').replace(/<br\s*\/?>/gi, '\n'),
    'text/html'
  );
  return (doc.body.textContent || '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

/**
 * يجلب تفسير آية. بعض التفاسير تشرح عدة آيات معاً تحت أول آية في المجموعة،
 * فإن كانت الآية المطلوبة فارغة نرجع إلى أقرب آية سابقة فيها نص.
 * @returns {{ text: string, fromAyah: number }}
 */
export async function getTafsir(slug, surah, ayah) {
  const first = Math.max(1, ayah - 15);
  for (let a = ayah; a >= first; a--) {
    const data = await fetchJson(`${CDN_BASE}/${slug}/${surah}/${a}.json`);
    const text = stripHtml(extractText(data));
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
