import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { BookOpen, Award, TrendingUp, Calendar, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { offlineStorage } from '../components/utils/offlineStorage';

export default function StatsPage() {
  const [stats, setStats] = useState({
    versesRead: 0,
    suwarsCompleted: 0,
    totalMinutes: 0,
    streak: 0,
    lastRead: null
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    // تحميل من التخزين المحلي - لا حاجة لحساب
    const localStats = offlineStorage.loadStats();
    setStats(localStats);
  };

  const incrementVerses = async () => {
    const newCount = stats.versesRead + 1;
    const newStats = { ...stats, versesRead: newCount };
    
    // حفظ محلي فقط - بدون حساب
    setStats(newStats);
    offlineStorage.saveStats(newStats);
    toast.success('✅ تم تحديث عدد الآيات!');
  };

  const incrementStreak = async () => {
    const newStreak = stats.streak + 1;
    const newStats = { ...stats, streak: newStreak };
    
    // حفظ محلي فقط
    setStats(newStats);
    offlineStorage.saveStats(newStats);
    toast.success('🔥 استمر في التقدم!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">📊</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4 font-arabic">إحصائياتي</h1>
          <p className="text-xl text-gray-700">تابع إنجازاتك في القرآن الكريم</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-8 shadow-2xl border-4 border-emerald-300">
            <BookOpen className="w-12 h-12 mb-4" />
            <p className="text-5xl font-bold mb-2">{stats.versesRead}</p>
            <p className="text-xl font-semibold mb-3">آية مقروءة</p>
            <Button onClick={incrementVerses} className="bg-white text-emerald-600 hover:bg-emerald-50 w-full">
              + إضافة آية
            </Button>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-8 shadow-2xl border-4 border-amber-300">
            <CheckCircle className="w-12 h-12 mb-4" />
            <p className="text-5xl font-bold mb-2">{stats.suwarsCompleted}</p>
            <p className="text-xl font-semibold">سورة مكتملة</p>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-8 shadow-2xl border-4 border-blue-300">
            <Clock className="w-12 h-12 mb-4" />
            <p className="text-5xl font-bold mb-2">{stats.totalMinutes}</p>
            <p className="text-xl font-semibold">دقيقة قراءة</p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-8 shadow-2xl border-4 border-purple-300">
            <TrendingUp className="w-12 h-12 mb-4" />
            <p className="text-5xl font-bold mb-2">{stats.streak}</p>
            <p className="text-xl font-semibold mb-3">يوم متتالي</p>
            <Button onClick={incrementStreak} className="bg-white text-purple-600 hover:bg-purple-50 w-full">
              + يوم جديد
            </Button>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card className="p-8 mb-8 border-4 border-emerald-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">تقدمك الشهري</h2>
          <div className="h-64 flex items-end justify-around gap-2">
            {[...Array(7)].map((_, i) => {
              const height = Math.random() * 100 + 20;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all hover:from-emerald-700 hover:to-emerald-500"
                    style={{ height: `${height}%` }}
                  />
                  <p className="text-sm text-gray-600 mt-2">اليوم {i + 1}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Motivational Section */}
        <Card className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-8 text-center border-4 border-amber-400">
          <Award className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-3">ممتاز! استمر في التقدم 🌟</h3>
          <p className="text-xl font-arabic leading-relaxed">
            ﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾
          </p>
        </Card>
      </div>
    </div>
  );
}