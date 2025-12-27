// نظام تخزين مؤقت سريع ومحسّن
class FastCache {
  constructor() {
    this.memoryCache = new Map();
    this.maxSize = 50; // حد أقصى للعناصر
  }

  set(key, value, ttl = 3600000) { // TTL = 1 hour default
    if (this.memoryCache.size >= this.maxSize) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }

    this.memoryCache.set(key, {
      value,
      expiry: Date.now() + ttl
    });

    // حفظ في localStorage للاستمرارية
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({ value, expiry: Date.now() + ttl }));
    } catch (e) {
      // تجاهل أخطاء التخزين
    }
  }

  get(key) {
    // تحقق من الذاكرة أولاً
    if (this.memoryCache.has(key)) {
      const item = this.memoryCache.get(key);
      if (Date.now() < item.expiry) {
        return item.value;
      }
      this.memoryCache.delete(key);
    }

    // تحقق من localStorage
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        const item = JSON.parse(stored);
        if (Date.now() < item.expiry) {
          this.memoryCache.set(key, item);
          return item.value;
        }
        localStorage.removeItem(`cache_${key}`);
      }
    } catch (e) {
      // تجاهل الأخطاء
    }

    return null;
  }

  clear() {
    this.memoryCache.clear();
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

export default new FastCache();