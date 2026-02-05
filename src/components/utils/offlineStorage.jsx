// نظام التخزين المحلي الكامل - يعمل بدون إنترنت 100%
const STORAGE_KEYS = {
  VERSES: 'quran_verses',
  BOOKMARKS: 'quran_bookmarks',
  STATS: 'user_stats',
  DUAS: 'duas_data',
  ADHKAR: 'adhkar_data',
  READING_HISTORY: 'reading_history',
  ACHIEVEMENTS: 'achievements_data',
  MEMORIZATION_PLAN: 'memorization_plan',
  LAST_SYNC: 'last_sync_time'
};

class OfflineStorage {
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error('Save error:', err);
      return false;
    }
  }

  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (err) {
      console.error('Load error:', err);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      return false;
    }
  }

  clearAll() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / 1024).toFixed(2) + ' KB';
  }

  saveStats(stats) {
    return this.save(STORAGE_KEYS.STATS, stats);
  }

  loadStats() {
    return this.load(STORAGE_KEYS.STATS, {
      versesRead: 0,
      suwarsCompleted: 0,
      totalMinutes: 0,
      streak: 0,
      lastRead: null
    });
  }

  saveBookmarks(bookmarks) {
    return this.save(STORAGE_KEYS.BOOKMARKS, bookmarks);
  }

  loadBookmarks() {
    return this.load(STORAGE_KEYS.BOOKMARKS, []);
  }

  saveAchievements(achievements) {
    return this.save(STORAGE_KEYS.ACHIEVEMENTS, achievements);
  }

  loadAchievements() {
    return this.load(STORAGE_KEYS.ACHIEVEMENTS, null);
  }

  saveMemorizationPlan(plan) {
    return this.save(STORAGE_KEYS.MEMORIZATION_PLAN, plan);
  }

  loadMemorizationPlan() {
    return this.load(STORAGE_KEYS.MEMORIZATION_PLAN, null);
  }

  updateLastSync() {
    return this.save(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }

  getLastSync() {
    return this.load(STORAGE_KEYS.LAST_SYNC, null);
  }
}

export const offlineStorage = new OfflineStorage();
export { STORAGE_KEYS };