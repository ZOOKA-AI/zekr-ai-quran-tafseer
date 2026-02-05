import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

// تتبع كل الإجراءات في التطبيق
class ActionTracker {
  constructor() {
    this.platform = this.detectPlatform();
    this.deviceInfo = this.getDeviceInfo();
    this.appVersion = '1.0.0';
  }

  detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    if (/android/i.test(userAgent)) {
      return 'android';
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'ios';
    }
    if (/Win/i.test(userAgent)) {
      return 'windows';
    }
    return 'web';
  }

  getDeviceInfo() {
    return `${navigator.platform} - ${navigator.userAgent.substring(0, 100)}`;
  }

  // تسجيل أي إجراء في الكيان
  async logAction(actionType, actionDetails, showNotification = true) {
    try {
      // حفظ في الكيان
      const logData = {
        action_type: actionType,
        action_details: actionDetails,
        platform: this.platform,
        device_info: this.deviceInfo,
        app_version: this.appVersion,
        status: 'success',
        notification_sent: showNotification
      };

      await base44.entities.SystemLog.create(logData);

      // إظهار إشعار للمستخدم
      if (showNotification) {
        this.showNotification(actionType, actionDetails);
      }

      // حفظ محلياً أيضاً
      this.saveLocally(logData);

      console.log('✅ تم تسجيل الإجراء:', actionType, actionDetails);
      return true;
    } catch (error) {
      console.error('❌ خطأ في تسجيل الإجراء:', error);
      return false;
    }
  }

  showNotification(actionType, details) {
    const messages = {
      update: `🔄 تحديث: ${details}`,
      prayer: `🕌 ${details}`,
      read_verse: `📖 ${details}`,
      memorize: `💚 ${details}`,
      achievement: `🏆 ${details}`,
      bookmark: `⭐ ${details}`,
      listen: `🎧 ${details}`,
      duaa: `🤲 ${details}`,
      adhkar: `📿 ${details}`,
      search: `🔍 ${details}`,
      navigation: `➡️ ${details}`,
      voice_command: `🎤 ${details}`,
      camera_scan: `📷 ${details}`
    };

    const message = messages[actionType] || details;
    toast.success(message, {
      duration: 3000,
      position: 'top-center'
    });
  }

  saveLocally(logData) {
    try {
      const logs = JSON.parse(localStorage.getItem('system_logs') || '[]');
      logs.push({
        ...logData,
        timestamp: new Date().toISOString()
      });
      // احتفظ بآخر 100 سجل فقط
      if (logs.length > 100) {
        logs.shift();
      }
      localStorage.setItem('system_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('خطأ في الحفظ المحلي:', error);
    }
  }

  // الحصول على السجلات المحلية
  getLocalLogs() {
    try {
      return JSON.parse(localStorage.getItem('system_logs') || '[]');
    } catch {
      return [];
    }
  }
}

// نسخة واحدة عامة للاستخدام في كل التطبيق
export const actionTracker = new ActionTracker();

// أمثلة سريعة للاستخدام
export const trackUpdate = (details) => actionTracker.logAction('update', details);
export const trackPrayer = (details) => actionTracker.logAction('prayer', details);
export const trackReadVerse = (details) => actionTracker.logAction('read_verse', details);
export const trackMemorize = (details) => actionTracker.logAction('memorize', details);
export const trackAchievement = (details) => actionTracker.logAction('achievement', details);
export const trackBookmark = (details) => actionTracker.logAction('bookmark', details);
export const trackListen = (details) => actionTracker.logAction('listen', details);
export const trackDuaa = (details) => actionTracker.logAction('duaa', details);
export const trackAdhkar = (details) => actionTracker.logAction('adhkar', details);
export const trackSearch = (details) => actionTracker.logAction('search', details);
export const trackNavigation = (details) => actionTracker.logAction('navigation', details);
export const trackVoiceCommand = (details) => actionTracker.logAction('voice_command', details);
export const trackCameraScan = (details) => actionTracker.logAction('camera_scan', details);