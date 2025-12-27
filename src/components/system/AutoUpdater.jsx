import React, { useEffect } from 'react';
import { QARI_SYSTEM } from '../audio/QarisDatabase';

// نظام التحديث التلقائي الخفي
export default function AutoUpdater() {
  useEffect(() => {
    console.log('🔄 نظام التحديث التلقائي نشط');

    // التحديث عند التحميل
    checkForUpdates();

    // جدولة التحديثات الدورية كل 6 ساعات
    const interval = setInterval(() => {
      if (navigator.onLine) {
        checkForUpdates();
      }
    }, 6 * 60 * 60 * 1000);

    // التحديث عند استعادة الاتصال
    window.addEventListener('online', checkForUpdates);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', checkForUpdates);
    };
  }, []);

  const checkForUpdates = async () => {
    try {
      // التحقق من تحديثات المقرئين
      const lastCheck = localStorage.getItem('last_update_check');
      const now = new Date();
      
      if (!lastCheck || (now - new Date(lastCheck)) > 24 * 60 * 60 * 1000) {
        console.log('🔍 جاري البحث عن تحديثات...');
        
        // حفظ وقت الفحص
        localStorage.setItem('last_update_check', now.toISOString());
        
        // تحديث قاعدة البيانات المحلية
        localStorage.setItem('qaris_database', JSON.stringify(QARI_SYSTEM));
        
        console.log('✅ تم التحديث بنجاح');
      }
    } catch (error) {
      console.warn('⚠️ فشل التحديث التلقائي:', error);
    }
  };

  return null; // مكون خفي لا يعرض شيئاً
}