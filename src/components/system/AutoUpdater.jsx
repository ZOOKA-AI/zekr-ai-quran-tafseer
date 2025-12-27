import React, { useEffect } from 'react';
import { QARI_SYSTEM } from '../audio/QarisDatabase';

// نظام التحديث التلقائي الخفي
export default function AutoUpdater() {
  useEffect(() => {
    // التحديث عند التحميل فقط
    if (navigator.onLine) {
      checkForUpdates();
    }

    // جدولة التحديثات الدورية كل 24 ساعة
    const interval = setInterval(() => {
      if (navigator.onLine) {
        checkForUpdates();
      }
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const checkForUpdates = async () => {
    try {
      const lastCheck = localStorage.getItem('last_update_check');
      const now = new Date();
      
      if (!lastCheck || (now - new Date(lastCheck)) > 24 * 60 * 60 * 1000) {
        localStorage.setItem('last_update_check', now.toISOString());
        localStorage.setItem('qaris_database', JSON.stringify(QARI_SYSTEM));
      }
    } catch (error) {
      // تجاهل الأخطاء
    }
  };

  return null; // مكون خفي لا يعرض شيئاً
}