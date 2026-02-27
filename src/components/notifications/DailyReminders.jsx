import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, X, Sun, Moon, BookOpen, Sunrise, Sunset, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { sendAudioEvent, onAudioEvent } from '@/components/system/AudioBus';

// أذان الشيخ عبد المجيد السريجي - سيتم تشغيله عند مواقيت الصلاة
const ADHAN_URL = 'https://download.tvquran.com/download/TvQuran.com__Athan/01.mp3';

const STATIC_REMINDERS = {
  fajr_adhan: {
    time: '04:30',
    icon: Moon,
    title: '🕌 أذان الفجر',
    message: 'حي على الصلاة، حي على الفلاح',
    color: 'from-indigo-500 to-purple-600',
    playAdhan: true,
    isPrayer: true
  },
  sunrise: {
    time: '06:00',
    icon: Sunrise,
    title: '🌅 وقت الشروق',
    message: 'الشمس أشرقت، وقت أذكار الصباح',
    color: 'from-orange-400 to-amber-500',
    playAdhan: false
  },
  morning_adhkar: {
    time: '07:00',
    icon: Sun,
    title: '☀️ أذكار الصباح',
    message: 'ابدأ يومك بذكر الله 🌸',
    color: 'from-amber-400 to-yellow-500',
    playAdhan: false
  },
  duha: {
    time: '09:00',
    icon: Sun,
    title: '🌞 وقت صلاة الضحى',
    message: 'صلاة الضحى ركعتان تجزيان من صدقة',
    color: 'from-yellow-400 to-amber-500',
    playAdhan: false
  },
  dhuhr_adhan: {
    time: '12:15',
    icon: Sun,
    title: '🕌 أذان الظهر',
    message: 'حي على الصلاة، حي على الفلاح',
    color: 'from-emerald-500 to-teal-600',
    playAdhan: true,
    isPrayer: true
  },
  asr_adhan: {
    time: '15:30',
    icon: Clock,
    title: '🕌 أذان العصر',
    message: 'حي على الصلاة، حي على الفلاح',
    color: 'from-blue-500 to-cyan-600',
    playAdhan: true,
    isPrayer: true
  },
  sunset: {
    time: '17:45',
    icon: Sunset,
    title: '🌇 وقت الغروب',
    message: 'غربت الشمس، استعد لصلاة المغرب',
    color: 'from-orange-500 to-red-500',
    playAdhan: false
  },
  maghrib_adhan: {
    time: '17:50',
    icon: Moon,
    title: '🕌 أذان المغرب',
    message: 'حي على الصلاة، حي على الفلاح',
    color: 'from-purple-500 to-pink-600',
    playAdhan: true,
    isPrayer: true
  },
  evening_adhkar: {
    time: '18:30',
    icon: Moon,
    title: '🌙 أذكار المساء',
    message: 'لا تنسَ أذكار المساء 🤍',
    color: 'from-indigo-500 to-purple-600',
    playAdhan: false
  },
  isha_adhan: {
    time: '19:15',
    icon: Moon,
    title: '🕌 أذان العشاء',
    message: 'حي على الصلاة، حي على الفلاح',
    color: 'from-gray-700 to-gray-900',
    playAdhan: true,
    isPrayer: true
  },
  night_adhkar: {
    time: '22:00',
    icon: Moon,
    title: '🌟 أذكار قبل النوم',
    message: 'اقرأ آية الكرسي والمعوذات قبل النوم',
    color: 'from-indigo-600 to-purple-700',
    playAdhan: false
  }
};

export default function DailyReminders() {
  const [showReminder, setShowReminder] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const audioRef = useRef(null);
  const lastNotificationRef = useRef(null);

  // جلب مواقيت الصلاة من API
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const date = new Date();
              const response = await fetch(
                `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=4`
              );
              const data = await response.json();
              if (data.code === 200) {
                setPrayerTimes(data.data.timings);
              }
            },
            (error) => {
              console.error('Error getting location:', error);
            }
          );
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    fetchPrayerTimes();
    const dailyInterval = setInterval(fetchPrayerTimes, 24 * 60 * 60 * 1000); // تحديث يومي

    return () => clearInterval(dailyInterval);
  }, []);

  // تشغيل الأذان
  const playAdhan = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(ADHAN_URL);
        audioRef.current.crossOrigin = "anonymous";
      }
      audioRef.current.volume = 0.9;
      audioRef.current.load();

      // أوقف أي أصوات أخرى قبل بدء الأذان
      sendAudioEvent('requestStopOthers', { except: 'adhan' });
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('أذان الشيخ عبد المجيد السريجي يعمل الآن 🕌');
            sendAudioEvent('notifyStart', { source: 'adhan' });
            toast.success('🕌 الأذان يرفع الآن بصوت الشيخ عبد المجيد السريجي');
          })
          .catch(err => {
            console.error('Error playing adhan:', err);
            toast.error('تعذر تشغيل الأذان - تحقق من الاتصال');
          });
      }
    } catch (err) {
      console.error('Adhan playback error:', err);
    }
  };

  // إيقاف الأذان
  const stopAdhan = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    sendAudioEvent('notifyStop', { source: 'adhan' });
  };

  useEffect(() => {
    if (!reminderEnabled) return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // منع التكرار - إذا تم إظهار نفس الإشعار في نفس الدقيقة
      if (lastNotificationRef.current === currentTime) {
        return;
      }

      // فحص مواقيت الصلاة الحقيقية
      if (prayerTimes) {
        const prayers = {
          fajr: { time: prayerTimes.Fajr, title: '🕌 أذان الفجر', message: 'الصلاة خير من النوم', color: 'from-indigo-500 to-purple-600', playAdhan: true },
          sunrise: { time: prayerTimes.Sunrise, title: '🌅 الشروق', message: 'الشمس أشرقت، وقت أذكار الصباح', color: 'from-orange-400 to-amber-500', playAdhan: false },
          dhuhr: { time: prayerTimes.Dhuhr, title: '🕌 أذان الظهر', message: 'حي على الصلاة، حي على الفلاح', color: 'from-emerald-500 to-teal-600', playAdhan: true },
          asr: { time: prayerTimes.Asr, title: '🕌 أذان العصر', message: 'حي على الصلاة، حي على الفلاح', color: 'from-blue-500 to-cyan-600', playAdhan: true },
          sunset: { time: prayerTimes.Sunset, title: '🌇 الغروب', message: 'غربت الشمس، استعد للمغرب', color: 'from-orange-500 to-red-500', playAdhan: false },
          maghrib: { time: prayerTimes.Maghrib, title: '🕌 أذان المغرب', message: 'حي على الصلاة، حي على الفلاح', color: 'from-purple-500 to-pink-600', playAdhan: true },
          isha: { time: prayerTimes.Isha, title: '🕌 أذان العشاء', message: 'حي على الصلاة، حي على الفلاح', color: 'from-gray-700 to-gray-900', playAdhan: true }
        };

        Object.entries(prayers).forEach(([key, prayer]) => {
          if (prayer.time && prayer.time.substring(0, 5) === currentTime) {
            setCurrentReminder({ ...prayer, icon: Bell, isPrayer: prayer.playAdhan });
            setShowReminder(true);
            lastNotificationRef.current = currentTime;

            toast.info(prayer.title, {
              description: prayer.message,
              duration: 10000
            });

            if (prayer.playAdhan) {
              playAdhan();
              // إيقاف الأذان تلقائياً بعد 3 دقائق
              setTimeout(() => {
                stopAdhan();
                setShowReminder(false);
              }, 180000);
            }
          }
        });
      }

      // فحص الإشعارات الثابتة (الأذكار والأوقات الأخرى)
      Object.entries(STATIC_REMINDERS).forEach(([key, reminder]) => {
        if (currentTime === reminder.time && !reminder.isPrayer) {
          setCurrentReminder(reminder);
          setShowReminder(true);
          lastNotificationRef.current = currentTime;
          
          toast.info(reminder.title, {
            description: reminder.message,
            duration: 5000
          });
        }
      });
    };

    // فحص كل دقيقة
    const interval = setInterval(checkReminders, 60000);
    checkReminders();

    return () => {
      clearInterval(interval);
      stopAdhan();
    };
  }, [reminderEnabled, prayerTimes]);

  // التوقف عن الأذان إذا طُلب إيقاف بقية الأصوات أو بدأت التلاوة
  useEffect(() => {
    const unsubscribe = onAudioEvent(({ action, except, source }) => {
      if ((action === 'requestStopOthers' && except !== 'adhan') || (action === 'notifyStart' && source === 'tilawa')) {
        stopAdhan();
      }
    });
    return unsubscribe;
  }, []);

  const handleClose = () => {
    stopAdhan();
    setShowReminder(false);
  };

  const handleSnooze = () => {
    stopAdhan();
    setShowReminder(false);
    toast.success('سنذكرك مرة أخرى بعد 10 دقائق ⏰');
    
    setTimeout(() => {
      setShowReminder(true);
    }, 600000);
  };

  if (!showReminder || !currentReminder) return null;

  const Icon = currentReminder.icon;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5" dir="rtl">
      <Card className={`bg-gradient-to-r ${currentReminder.color} border-none shadow-2xl max-w-sm`}>
        <div className="p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{currentReminder.title}</h3>
                <p className="text-white/90">{currentReminder.message}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleClose}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-none"
            >
              {currentReminder.isPrayer ? 'إيقاف الأذان' : 'حسناً'}
            </Button>
            {!currentReminder.isPrayer && (
              <Button
                onClick={handleSnooze}
                variant="outline"
                className="flex-1 bg-white text-gray-800 hover:bg-white/90 border-none"
              >
                ذكرني لاحقاً
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}