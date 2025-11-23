import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Award, TrendingUp, Play, Users, Sparkles } from 'lucide-react';
import { offlineStorage } from '../components/utils/offlineStorage';

export default function HomePage() {
  const [stats, setStats] = useState({ versesRead: 0, streak: 0 });
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState({ name: '', time: '', remaining: '' });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const localStats = offlineStorage.loadStats();
    setStats(localStats);
    
    fetchPrayerTimes();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">السلام عليكم ورحمة الله 🌟</h1>
          <p className="text-2xl text-emerald-600 font-bold">{formatTime()}</p>
        </div>

        {/* Next Prayer Card */}
        {nextPrayer.name && (
          <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-8 mb-8 shadow-2xl border-4 border-amber-400 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Clock className="w-12 h-12" />
              <div>
                <p className="text-xl font-bold">الصلاة القادمة</p>
                <h2 className="text-5xl font-bold">{nextPrayer.name}</h2>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 inline-block">
              <p className="text-3xl font-bold mb-1">{nextPrayer.time}</p>
              <p className="text-xl">متبقي: {nextPrayer.remaining}</p>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white p-6 shadow-xl border-2 border-emerald-300 hover:scale-105 transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-emerald-600">{stats.versesRead}</p>
                <p className="text-gray-700 font-semibold">آية مقروءة</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white p-6 shadow-xl border-2 border-amber-300 hover:scale-105 transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-amber-600">{stats.streak}</p>
                <p className="text-gray-700 font-semibold">يوم متتالي</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white p-6 shadow-xl border-2 border-purple-300 hover:scale-105 transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-600">0</p>
                <p className="text-gray-700 font-semibold">إنجازات</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to={createPageUrl('Quran')}>
            <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-8 shadow-2xl hover:scale-105 transition-all cursor-pointer border-4 border-emerald-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold mb-2">📖 اقرأ القرآن</h3>
                  <p className="text-lg">114 سورة • 30 جزء</p>
                </div>
                <BookOpen className="w-16 h-16" />
              </div>
            </Card>
          </Link>

          <Link to={createPageUrl('Kids')}>
            <Card className="bg-gradient-to-br from-pink-500 to-purple-500 text-white p-8 shadow-2xl hover:scale-105 transition-all cursor-pointer border-4 border-pink-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold mb-2">🌟 ركن الأطفال</h3>
                  <p className="text-lg">زوكا المرزوق في انتظارك!</p>
                </div>
                <Users className="w-16 h-16" />
              </div>
            </Card>
          </Link>

          <Link to={createPageUrl('Tilawa')}>
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-8 shadow-2xl hover:scale-105 transition-all cursor-pointer border-4 border-blue-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold mb-2">🎧 استمع للتلاوة</h3>
                  <p className="text-lg">أشهر القراء</p>
                </div>
                <Play className="w-16 h-16" />
              </div>
            </Card>
          </Link>

          <Link to={createPageUrl('MemorizationPlan')}>
            <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-8 shadow-2xl hover:scale-105 transition-all cursor-pointer border-4 border-amber-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold mb-2">🎯 خطة الحفظ</h3>
                  <p className="text-lg">احفظ بطريقة منظمة</p>
                </div>
                <Sparkles className="w-16 h-16" />
              </div>
            </Card>
          </Link>
        </div>

        {/* Today's Verse */}
        <Card className="bg-white p-8 shadow-2xl border-4 border-emerald-300">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">🌸 آية اليوم 🌸</h3>
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border-2 border-emerald-200">
            <p className="text-4xl text-center font-arabic leading-loose text-gray-900 mb-4">
              ﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾
            </p>
            <p className="text-center text-gray-700 text-lg font-semibold">سورة المزمل - الآية 4</p>
          </div>
        </Card>
      </div>
    </div>
  );
}