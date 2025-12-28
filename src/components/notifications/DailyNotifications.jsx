import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

const NOTIFICATION_TIMES = [
  { id: 'morning', time: '07:00', title: 'أذكار الصباح', message: 'حان وقت أذكار الصباح 🌅' },
  { id: 'noon', time: '12:00', title: 'وقت الظهر', message: 'حان وقت صلاة الظهر 🕌' },
  { id: 'evening', time: '17:00', title: 'أذكار المساء', message: 'حان وقت أذكار المساء 🌆' },
  { id: 'night', time: '21:00', title: 'قبل النوم', message: 'لا تنسَ أذكار النوم 🌙' }
];

export default function DailyNotifications() {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    checkNotificationPermission();
    loadSettings();
  }, []);

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('notifications_enabled');
    setEnabled(saved === 'true');
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('المتصفح لا يدعم الإشعارات');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setEnabled(true);
        localStorage.setItem('notifications_enabled', 'true');
        scheduleNotifications();
        toast.success('✅ تم تفعيل الإشعارات بنجاح!');
        // إشعار تجريبي فوري
        setTimeout(() => testNotification(), 500);
      } else if (result === 'denied') {
        toast.error('⚠️ تم رفض الإشعارات. افتح إعدادات المتصفح لتفعيلها يدوياً');
      } else {
        toast.info('تم إلغاء طلب الإشعارات');
      }
    } catch (error) {
      toast.error('حدث خطأ في طلب أذونات الإشعارات');
    }
  };

  const disableNotifications = () => {
    setEnabled(false);
    localStorage.setItem('notifications_enabled', 'false');
    toast.info('تم إيقاف الإشعارات');
  };

  const scheduleNotifications = () => {
    NOTIFICATION_TIMES.forEach(notif => {
      const [hours, minutes] = notif.time.split(':');
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      if (scheduledTime < now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      const delay = scheduledTime - now;
      
      setTimeout(() => {
        if (localStorage.getItem('notifications_enabled') === 'true') {
          showNotification(notif.title, notif.message);
        }
        // جدولة للغد
        setInterval(() => {
          if (localStorage.getItem('notifications_enabled') === 'true') {
            showNotification(notif.title, notif.message);
          }
        }, 24 * 60 * 60 * 1000);
      }, delay);
    });
  };

  const showNotification = (title, message) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/icon.png',
        badge: '/badge.png',
        tag: 'daily-reminder',
        requireInteraction: false
      });
    }
  };

  const testNotification = () => {
    showNotification('اختبار الإشعار', 'هذا إشعار تجريبي ✨');
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">الإشعارات اليومية</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-emerald-50 rounded-lg p-4">
          <p className="text-gray-800 mb-3">
            سنرسل لك تذكيرات يومية للأذكار ومواقيت الصلاة
          </p>
          
          <div className="space-y-2">
            {NOTIFICATION_TIMES.map(notif => (
              <div key={notif.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{notif.title}</span>
                <span className="text-emerald-600 font-bold">{notif.time}</span>
              </div>
            ))}
          </div>
        </div>

        {permission === 'denied' && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-bold mb-2">⚠️ الإشعارات محظورة</p>
            <p className="text-red-700 text-sm mb-3">
              تم رفض أذونات الإشعارات. لتفعيلها:
            </p>
            <ol className="text-sm text-red-700 space-y-1 mr-4">
              <li>1. اضغط على أيقونة القفل 🔒 في شريط العنوان</li>
              <li>2. اختر "إعدادات الموقع"</li>
              <li>3. غيّر الإشعارات من "محظور" إلى "سماح"</li>
              <li>4. أعد تحميل الصفحة</li>
            </ol>
          </div>
        )}

        {permission === 'granted' && enabled ? (
          <div className="space-y-2">
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3 mb-2">
              <p className="text-green-800 font-bold text-center">
                ✅ الإشعارات مفعّلة
              </p>
            </div>
            
            <Button
              onClick={testNotification}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              🔔 اختبار الإشعار الآن
            </Button>
            
            <Button
              onClick={disableNotifications}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
            >
              <BellOff className="w-5 h-5 ml-2" />
              إيقاف الإشعارات
            </Button>
          </div>
        ) : permission !== 'denied' && (
          <div>
            <Button
              onClick={requestPermission}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6"
            >
              <Bell className="w-6 h-6 ml-2" />
              تفعيل الإشعارات الآن
            </Button>
            <p className="text-xs text-gray-600 text-center mt-2">
              سيظهر لك طلب إذن من المتصفح - اضغط "سماح"
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}