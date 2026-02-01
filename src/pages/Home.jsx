import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Award, TrendingUp, Play, Users, Sparkles, Heart, Moon, Star, Zap } from 'lucide-react';
import { offlineStorage } from '../components/utils/offlineStorage';
import VerseOfTheDay from '../components/daily/VersOfTheDay';
import DailyNotifications from '../components/notifications/DailyNotifications';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [stats, setStats] = useState({ versesRead: 0, streak: 0 });
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState({ name: '', time: '', remaining: '' });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRamadan, setIsRamadan] = useState(false);
  const [hijriDate, setHijriDate] = useState('');

  useEffect(() => {
    setStats(offlineStorage.loadStats());
    fetchPrayerTimes();
    checkRamadan();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const checkRamadan = async () => {
    try {
      const date = new Date();
      const response = await fetch(
        `https://api.aladhan.com/v1/gToH/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
      );
      const data = await response.json();
      if (data.code === 200) {
        const hijri = data.data.hijri;
        setHijriDate(`${hijri.day} ${hijri.month.ar} ${hijri.year}`);
        setIsRamadan(hijri.month.number === 9);
      }
    } catch (error) {
      console.error('Error fetching Hijri date:', error);
    }
  };

  useEffect(() => {
    if (prayerTimes) {
      calculateNextPrayer();
    }
  }, [prayerTimes, currentTime]);

  const fetchPrayerTimes = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const date = new Date();
          const response = await fetch(
            `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=4`
          );
          const data = await response.json();
          if (data.code === 200) {
            setPrayerTimes(data.data.timings);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

  const calculateNextPrayer = () => {
    if (!prayerTimes) return;

    const prayers = [
      { name: 'الفجر', time: prayerTimes.Fajr },
      { name: 'الظهر', time: prayerTimes.Dhuhr },
      { name: 'العصر', time: prayerTimes.Asr },
      { name: 'المغرب', time: prayerTimes.Maghrib },
      { name: 'العشاء', time: prayerTimes.Isha }
    ];

    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let prayer of prayers) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;

      if (prayerMinutes > currentMinutes) {
        const diff = prayerMinutes - currentMinutes;
        const hoursLeft = Math.floor(diff / 60);
        const minutesLeft = diff % 60;
        
        setNextPrayer({
          name: prayer.name,
          time: prayer.time,
          remaining: `${hoursLeft}س ${minutesLeft}د`
        });
        return;
      }
    }

    // If no prayer left today, show Fajr
    const [hours, minutes] = prayers[0].time.split(':').map(Number);
    const prayerMinutes = hours * 60 + minutes;
    const diff = (24 * 60 - currentMinutes) + prayerMinutes;
    const hoursLeft = Math.floor(diff / 60);
    const minutesLeft = diff % 60;
    
    setNextPrayer({
      name: prayers[0].name,
      time: prayers[0].time,
      remaining: `${hoursLeft}س ${minutesLeft}د`
    });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Star className="w-8 h-8 text-amber-500 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              السلام عليكم ورحمة الله
            </h1>
            <Star className="w-8 h-8 text-amber-500 animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-emerald-600 font-bold mb-2">{formatTime()}</p>
          {hijriDate && (
            <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
              <Moon className="w-5 h-5 text-purple-500" />
              {hijriDate}
            </p>
          )}
          {isRamadan && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg"
            >
              🌙 رمضان كريم 🌙
            </motion.div>
          )}
        </motion.div>

        {/* Next Prayer Card */}
        {nextPrayer.name && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-white p-6 md:p-8 mb-6 shadow-2xl border-4 border-amber-400 text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 md:gap-4 mb-4">
                  <Clock className="w-10 h-10 md:w-12 md:h-12 animate-pulse" />
                  <div>
                    <p className="text-lg md:text-xl font-bold">الصلاة القادمة</p>
                    <h2 className="text-4xl md:text-5xl font-bold">{nextPrayer.name}</h2>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 inline-block border-2 border-white/30">
                  <p className="text-2xl md:text-3xl font-bold mb-1">{nextPrayer.time}</p>
                  <p className="text-lg md:text-xl flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    متبقي: {nextPrayer.remaining}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Verse of the Day */}
        <div className="mb-6">
          <VerseOfTheDay />
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <DailyNotifications />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 md:p-6 shadow-xl border-2 border-emerald-300 h-full">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-emerald-600">{stats.versesRead}</p>
                  <p className="text-gray-700 font-semibold text-sm md:text-base">آية مقروءة</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 md:p-6 shadow-xl border-2 border-amber-300 h-full">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-amber-600">{stats.streak}</p>
                  <p className="text-gray-700 font-semibold text-sm md:text-base">يوم متتالي</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 md:p-6 shadow-xl border-2 border-purple-300 h-full">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-purple-600">0</p>
                  <p className="text-gray-700 font-semibold text-sm md:text-base">إنجازات</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Link to={createPageUrl('Quran')}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-5 md:p-6 shadow-xl hover:shadow-2xl cursor-pointer border-2 border-emerald-300 h-full">
                <div className="text-center">
                  <div className="bg-white/20 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg">
                    <BookOpen className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">اقرأ القرآن</h3>
                  <p className="text-xs md:text-sm opacity-90">114 سورة • 30 جزء</p>
                  <p className="text-xs mt-1 md:mt-2 opacity-75">تصفح المصحف الكامل</p>
                </div>
              </Card>
            </motion.div>
          </Link>

          <Link to={createPageUrl('Kids')}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Card className="bg-gradient-to-br from-pink-500 to-purple-500 text-white p-5 md:p-6 shadow-xl hover:shadow-2xl cursor-pointer border-2 border-pink-300 h-full">
                <div className="text-center">
                  <div className="bg-white/20 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg">
                    <Users className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">ركن الأطفال</h3>
                  <p className="text-xs md:text-sm opacity-90">زوكا معلمك!</p>
                  <p className="text-xs mt-1 md:mt-2 opacity-75">تعليم تفاعلي</p>
                </div>
              </Card>
            </motion.div>
          </Link>

          <Link to={createPageUrl('Tilawa')}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-5 md:p-6 shadow-xl hover:shadow-2xl cursor-pointer border-2 border-blue-300 h-full">
                <div className="text-center">
                  <div className="bg-white/20 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg">
                    <Play className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">استمع للتلاوة</h3>
                  <p className="text-xs md:text-sm opacity-90">قراء مشهورين</p>
                  <p className="text-xs mt-1 md:mt-2 opacity-75">تلاوات عالية الجودة</p>
                </div>
              </Card>
            </motion.div>
          </Link>

          <Link to={createPageUrl('MemorizationPlan')}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-5 md:p-6 shadow-xl hover:shadow-2xl cursor-pointer border-2 border-amber-300 h-full">
                <div className="text-center">
                  <div className="bg-white/20 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg">
                    <Sparkles className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">خطة الحفظ</h3>
                  <p className="text-xs md:text-sm opacity-90">برامج حفظ</p>
                  <p className="text-xs mt-1 md:mt-2 opacity-75">برنامج منظم</p>
                </div>
              </Card>
            </motion.div>
          </Link>

          <Link to={createPageUrl('OrphansService')}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Card className="bg-gradient-to-br from-rose-500 to-pink-500 text-white p-5 md:p-6 shadow-xl hover:shadow-2xl cursor-pointer border-4 border-amber-400 h-full">
                <div className="text-center">
                  <div className="bg-white/20 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg">
                    <Heart className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">خدمة الأيتام</h3>
                  <p className="text-xs md:text-sm opacity-90">صدقة جارية 🤲</p>
                  <p className="text-xs mt-1 md:mt-2 opacity-75">تسجيل • تبرعات</p>
                </div>
              </Card>
            </motion.div>
          </Link>
        </div>

        {/* More Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8">
          <Link to={createPageUrl('Duaa')}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="w-full h-16 md:h-20 bg-white hover:bg-purple-50 text-gray-900 font-bold shadow-lg border-2 border-purple-200 hover:border-purple-400">
                <div className="text-center">
                  <div className="text-xl md:text-2xl mb-1">🤲</div>
                  <div className="text-xs md:text-sm">الأدعية</div>
                </div>
              </Button>
            </motion.div>
          </Link>

          <Link to={createPageUrl('Adhkar')}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="w-full h-16 md:h-20 bg-white hover:bg-green-50 text-gray-900 font-bold shadow-lg border-2 border-green-200 hover:border-green-400">
                <div className="text-center">
                  <div className="text-xl md:text-2xl mb-1">📿</div>
                  <div className="text-xs md:text-sm">الأذكار</div>
                </div>
              </Button>
            </motion.div>
          </Link>

          <Link to={createPageUrl('Radio')}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="w-full h-16 md:h-20 bg-white hover:bg-blue-50 text-gray-900 font-bold shadow-lg border-2 border-blue-200 hover:border-blue-400">
                <div className="text-center">
                  <div className="text-xl md:text-2xl mb-1">📻</div>
                  <div className="text-xs md:text-sm">الراديو</div>
                </div>
              </Button>
            </motion.div>
          </Link>

          <Link to={createPageUrl('Stats')}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="w-full h-16 md:h-20 bg-white hover:bg-amber-50 text-gray-900 font-bold shadow-lg border-2 border-amber-200 hover:border-amber-400">
                <div className="text-center">
                  <div className="text-xl md:text-2xl mb-1">📊</div>
                  <div className="text-xs md:text-sm">الإحصائيات</div>
                </div>
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Ramadan Special Section */}
        {isRamadan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white p-6 md:p-8 shadow-2xl border-4 border-amber-400">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="text-6xl mb-4"
                >
                  🌙
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">رمضان كريم</h2>
                <p className="text-lg md:text-xl mb-4">أعاده الله عليكم باليمن والبركات</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-2xl font-bold">30</p>
                    <p className="text-sm">يوم بركة</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-2xl font-bold">📿</p>
                    <p className="text-sm">ليلة القدر</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-2xl font-bold">🤲</p>
                    <p className="text-sm">الدعاء المستجاب</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}