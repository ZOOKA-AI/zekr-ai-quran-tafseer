import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, BookOpen, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function KhatmahTracker() {
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({ completed: 0, total: 30, streak: 0 });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    const saved = localStorage.getItem('khatmah_progress');
    if (saved) {
      const data = JSON.parse(saved);
      setProgress(data.progress);
      setStats(data.stats);
    } else {
      const newProgress = Array(30).fill(false);
      setProgress(newProgress);
      localStorage.setItem('khatmah_progress', JSON.stringify({ progress: newProgress, stats: { completed: 0, total: 30, streak: 0 } }));
    }
  };

  const toggleDay = (day) => {
    const newProgress = [...progress];
    newProgress[day] = !newProgress[day];
    
    const completed = newProgress.filter(p => p).length;
    const percentage = Math.round((completed / 30) * 100);
    
    const newStats = {
      ...stats,
      completed,
      streak: calculateStreak(newProgress)
    };

    setProgress(newProgress);
    setStats(newStats);
    localStorage.setItem('khatmah_progress', JSON.stringify({ progress: newProgress, stats: newStats }));

    if (newProgress[day]) {
      toast.success(`✅ يوم ${day + 1} مكتمل!`);
    }
  };

  const calculateStreak = (arr) => {
    let streak = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i]) streak++;
      else break;
    }
    return streak;
  };

  const resetProgress = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين التقدم؟')) {
      const newProgress = Array(30).fill(false);
      setProgress(newProgress);
      setStats({ completed: 0, total: 30, streak: 0 });
      localStorage.setItem('khatmah_progress', JSON.stringify({ progress: newProgress, stats: { completed: 0, total: 30, streak: 0 } }));
      toast.success('تم إعادة تعيين التقدم');
    }
  };

  const percentage = Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 shadow-xl border-4 border-amber-400">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">ختمة رمضان</h3>
                <p className="text-lg opacity-90">تتبع تقدمك في ختم القرآن</p>
              </div>
              <BookOpen className="w-12 h-12 opacity-50" />
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="bg-white/20 rounded-full h-6 overflow-hidden backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-amber-300 h-full rounded-full shadow-lg"
                />
              </div>
              <p className="text-right text-sm font-bold">{percentage}% مكتمل</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs opacity-75 mb-1">مكتمل</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs opacity-75 mb-1">متبقي</p>
              <p className="text-2xl font-bold">{stats.total - stats.completed}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-1">
                <Flame className="w-4 h-4" />
                <p className="text-xs opacity-75">يوم متتالي</p>
              </div>
              <p className="text-2xl font-bold">{stats.streak}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Days Grid */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4">أيام الختمة</h4>
        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2">
          {progress.map((completed, idx) => (
            <motion.button
              key={idx}
              onClick={() => toggleDay(idx)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <div className={`
                w-full aspect-square rounded-lg font-bold text-sm md:text-base
                transition-all duration-200 shadow-md
                ${completed
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                  : 'bg-white border-2 border-gray-300 text-gray-900 hover:border-emerald-500'
                }
              `}>
                {completed ? (
                  <CheckCircle2 className="w-full h-full p-1 text-white" />
                ) : (
                  <div className="flex items-center justify-center h-full">{idx + 1}</div>
                )}
              </div>
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                اليوم {idx + 1}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Motivation Message */}
      {percentage === 100 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-xl"
        >
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-xl font-bold">مبروك! أتممت ختمة رمضان!</p>
          <p className="text-sm opacity-90 mt-2">الحمد لله الذي أعانك على كتاب الله</p>
        </motion.div>
      ) : (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 p-4">
          <p className="text-center text-gray-800">
            <span className="font-bold text-lg text-blue-600">{stats.total - stats.completed}</span>
            <span className="text-gray-700"> أيام متبقية حتى تكمل ختمتك - استمر على الجد!</span>
          </p>
        </Card>
      )}

      {/* Reset Button */}
      <div className="text-center">
        <Button
          onClick={resetProgress}
          variant="outline"
          className="border-2 border-red-300 text-red-600 hover:bg-red-50"
        >
          إعادة تعيين التقدم
        </Button>
      </div>
    </div>
  );
}