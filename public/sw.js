// خدمة العمل: تجعل /Tafsir يعمل دون إنترنت بعد أول فتح.
// تخزّن هيكل التطبيق ثم بذرة التفسير المحلية (public/tafsir-seed) تدريجياً.
const SHELL = 'zekr-shell-v2';
const SEED = 'zekr-seed-v1';

// تخزين هيكل التطبيق: الصفحة وملفات JS/CSS المبنية
async function cacheShell() {
  const cache = await caches.open(SHELL);
  const html = await fetch('./index.html', { cache: 'reload' }).then((r) => (r.ok ? r.text() : ''));
  const urls = ['./', './index.html', './manifest.json', './favicon.svg'];
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const u = m[1];
    if (u.startsWith('data:') || u.startsWith('http')) continue;
    urls.push(u.startsWith('./') || u.startsWith('/') ? u : `./${u}`);
  }
  await Promise.all(urls.map(async (u) => { try { await cache.add(u); } catch { /* تجاهل */ } }));
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheShell().catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== SEED).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// تنزيل بذرة التفسير في الخلفية بعد التثبيت
async function prefetchSeed() {
  const cache = await caches.open(SEED);
  const res = await fetch('./tafsir-seed/manifest.json');
  if (!res.ok) return;
  const { files = [] } = await res.json();
  for (const f of files) {
    const url = new URL(`./tafsir-seed/${f}`, self.registration.scope).toString();
    if (await cache.match(url)) continue;
    try {
      const r = await fetch(url);
      if (r.ok) await cache.put(url, r);
    } catch {
      return; // انقطع الاتصال: نكمل في مرة أخرى
    }
  }
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'prefetch-seed') event.waitUntil(prefetchSeed());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // بذرة التفسير: من الذاكرة أولاً
  if (url.pathname.includes('/tafsir-seed/')) {
    event.respondWith(
      caches.open(SEED).then(async (c) => {
        const hit = await c.match(req);
        if (hit) return hit;
        const r = await fetch(req);
        if (r.ok) c.put(req, r.clone());
        return r;
      })
    );
    return;
  }

  // ملفات البناء (JS/CSS/خطوط): من الذاكرة أولاً مع تحديث في الخلفية
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.open(SHELL).then(async (c) => {
        const hit = await c.match(req);
        const net = fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
        return hit || (await net) || Response.error();
      })
    );
    return;
  }

  // صفحات التنقل: الشبكة أولاً ثم النسخة المحفوظة
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((r) => {
          caches.open(SHELL).then((c) => c.put(req, r.clone())).catch(() => {});
          return r;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match('./index.html')))
    );
  }
});
