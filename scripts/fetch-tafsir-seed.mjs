#!/usr/bin/env node
// يجلب نصوص التفسير من مستودع spa5k/tafsir_api (رخصة MIT، النصوص من qul.tarteel.ai)
// على إيداع مثبّت ويكتبها في public/tafsir-seed لتعمل دون إنترنت من أول تشغيل.
// الاستخدام: node scripts/fetch-tafsir-seed.mjs
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const DATA_COMMIT = 'b6d01854b1b2e019e66cdaef6132e25521ee86f2';
const CDN = `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@${DATA_COMMIT}/tafsir`;
const SOURCES = ['ar-tafsir-ibn-kathir', 'ar-tafseer-al-saddi', 'ar-tafsir-al-tabari'];
const AYAH_COUNTS = {1:7,12:111,18:110,19:98,31:34,56:96,78:40,79:46,80:42,81:29,82:19,83:36,84:25,85:22,86:17,87:19,88:26,89:30,90:20,91:15,92:21,93:11,94:8,95:8,96:19,97:5,98:8,99:8,100:11,101:11,102:8,103:3,104:9,105:5,106:4,107:7,108:3,109:6,110:3,111:5,112:4,113:5,114:6};

const out = join(process.cwd(), 'public', 'tafsir-seed');
const surahs = Object.keys(AYAH_COUNTS).map(Number);
let written = 0, missing = 0, bytes = 0, skipped = 0;
const failed = [];

async function one(slug, surah, ayah) {
  const path = join(out, slug, String(surah), `${ayah}.json`);
  try { await access(path); skipped++; return; } catch { /* غير موجود بعد */ }
  const url = `${CDN}/${slug}/${surah}/${ayah}.json`;
  let res = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try { res = await fetch(url); if (res.ok || res.status === 404) break; } catch { res = null; }
    await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
  }
  if (!res) { failed.push(url); return; }
  if (res.status === 404) { missing++; return; }
  if (!res.ok) { failed.push(`${res.status} ${url}`); return; }
  const text = await res.text();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, text);
  written++; bytes += Buffer.byteLength(text);
}

const queue = [];
for (const slug of SOURCES) for (const s of surahs) for (let a = 1; a <= AYAH_COUNTS[s]; a++) queue.push([slug, s, a]);
console.log(`تحميل ${queue.length} ملفاً من ${SOURCES.length} مصادر…`);

const CONC = 3;
let i = 0;
async function worker() { while (i < queue.length) { const [s, u, a] = queue[i++]; await one(s, u, a); } }
await Promise.all(Array.from({ length: CONC }, worker));

// السجل يُبنى من الملفات الموجودة فعلاً (بعض الآيات لا ملف لها في المصدر)
const { readdir } = await import('node:fs/promises');
const manifest = [];
for (const slug of SOURCES) for (const s of surahs) {
  let names = [];
  try { names = await readdir(join(out, slug, String(s))); } catch { continue; }
  for (const n of names.filter((x) => x.endsWith('.json')).sort((a, b) => parseInt(a) - parseInt(b))) manifest.push(`${slug}/${s}/${n}`);
}
await writeFile(join(out, 'manifest.json'), JSON.stringify({ generatedFrom: DATA_COMMIT, surahs, sources: SOURCES, files: manifest }));
console.log(`كُتب ${written} ملفاً جديداً، تخطّي ${skipped} موجوداً، ${missing} غير موجود (404)، ${failed.length} فشل، ${(bytes / 1048576).toFixed(1)} ميغابايت، وسجل فيه ${manifest.length} مدخلاً.`);
if (failed.length) { console.log('أمثلة على الفشل:', failed.slice(0, 3)); process.exitCode = 1; }
