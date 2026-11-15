// خدمة العمل: تجعل /Tafsir يعمل دون إنترنت بعد أول فتح.
// تخزّن هيكل التطبيق ثم بذرة التفسير المحلية (public/tafsir-seed) تدريجياً.
const SHELL = 'zekr-shell-v2';
const SEED = 'zekr-seed-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL).then((c) => c.addAll(['./', './index.html', './manifest.json'])).catch(() => {}));
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
