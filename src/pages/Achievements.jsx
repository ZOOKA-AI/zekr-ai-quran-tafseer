import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Award, Target, BookOpen, Zap, Crown, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const ACHIEVEMENTS = [
  {
    id: 1,
    title: 'القارئ المبتدئ',
    description: 'اقرأ 10 آيات',
    icon: BookOpen,
    progress: 10,
    target: 10,
    unlocked: true,
    color: 'from-emerald-400 to-green-500',
    reward: '🌟'
  },
  {
    id: 2,
    title: 'المواظب',
    description: 'اقرأ يومياً لمدة 7 أيام',
    icon: Target,
    progress: 7,
    target: 7,
    unlocked: true,
    color: 'from-amber-400 to-orange-500',
    reward: '🔥'
  },
  {
    id: 3,
    title: 'حافظ السور القصيرة',
    description: 'احفظ 5 سور من جزء عم',
    icon: Star,
    progress: 3,
    target: 5,
    unlocked: false,
    color: 'from-blue-400 to-cyan-500',
    reward: '💫'
  },
  {
    id: 4,
    title: 'المستمع الخاشع',
    description: 'استمع لـ 20 سورة كاملة',
    icon: Heart,
    progress: 12,
    target: 20,
    unlocked: false,
    color: 'from-purple-400 to-pink-500',
    reward: '💖'
  },
  {
    id: 5,
    title: 'البطل السريع',
    description: 'اقرأ 100 آية في يوم واحد',
    icon: Zap,
    progress: 0,
    target: 100,
    unlocked: false,
    color: 'from-yellow-400 to-amber-500',
    reward: '⚡'
  },
  {
    id: 6,
    title: 'التاج الذهبي',
    description: 'اختم القرآن كاملاً',
    icon: Crown,
    progress: 0,
    target: 114,
    unlocked: false,
    color: 'from-yellow-500 to-amber-600',
    reward: '👑'
  }
];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).length * 100;

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const user = await base44.auth.me();
      if (user.achievements) {
        setAchievements(user.achievements);
      }
    } catch (error) {
      // استخدام البيانات الافتراضية
    }
  };

  const testUnlock = async (achievementId) => {
    const newAchievements = achievements.map(a => 
      a.id === achievementId ? { ...a, unlocked: true, progress: a.target } : a
    );
    setAchievements(newAchievements);
    
    try {
      await base44.auth.updateMe({ achievements: newAchievements });
      toast.success('🎉 إنجاز جديد مفتوح!');
    } catch (error) {
      toast.success('🎉 إنجاز جديد مفتوح محلياً!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">🏆</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4 font-arabic">الإنجازات</h1>
          <p className="text-xl text-gray-700">احصل على الجوائز وافتخر بإنجازاتك</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-8 shadow-2xl border-4 border-emerald-300 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3" />
            <p className="text-5xl font-bold mb-2">{unlockedCount}</p>
            <p className="text-xl font-semibold">إنجاز مفتوح</p>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-8 shadow-2xl border-4 border-amber-300 text-center">
            <Star className="w-12 h-12 mx-auto mb-3" />
            <p className="text-5xl font-bold mb-2">{totalPoints}</p>
            <p className="text-xl font-semibold">نقطة</p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-8 shadow-2xl border-4 border-purple-300 text-center">
            <Award className="w-12 h-12 mx-auto mb-3" />
            <p className="text-5xl font-bold mb-2">{Math.round((unlockedCount / achievements.length) * 100)}%</p>
            <p className="text-xl font-semibold">نسبة الإكمال</p>
          </Card>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const percentage = Math.min((achievement.progress / achievement.target) * 100, 100);
            
            return (
              <Card 
                key={achievement.id}
                className={`p-6 transition-all border-4 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br ' + achievement.color + ' text-white border-amber-400 shadow-2xl scale-105' 
                    : 'bg-white border-gray-300 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="text-center mb-4">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    achievement.unlocked 
                      ? 'bg-white/30 backdrop-blur-sm' 
                      : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-10 h-10 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  {achievement.unlocked && (
                    <div className="text-5xl mb-2">{achievement.reward}</div>
                  )}
                  <h3 className={`text-2xl font-bold mb-2 ${achievement.unlocked ? 'text-white' : 'text-gray-900'}`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${achievement.unlocked ? 'text-white/90' : 'text-gray-600'}`}>
                    {achievement.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className={`h-3 rounded-full overflow-hidden ${
                    achievement.unlocked ? 'bg-white/30' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-full transition-all duration-500 ${
                        achievement.unlocked 
                          ? 'bg-white' 
                          : 'bg-gradient-to-r from-emerald-400 to-green-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className={`text-center text-sm mt-2 ${achievement.unlocked ? 'text-white' : 'text-gray-600'}`}>
                    {achievement.progress} / {achievement.target}
                  </p>
                </div>

                {achievement.unlocked ? (
                  <Badge className="w-full bg-white/20 text-white text-center justify-center py-2">
                    ✅ مفتوح
                  </Badge>
                ) : (
                  <Button 
                    onClick={() => testUnlock(achievement.id)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                    size="sm"
                  >
                    🔓 افتح (تجريبي)
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        {/* Motivational Section */}
        <Card className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-8 mt-12 text-center border-4 border-amber-400">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-3">استمر في التقدم! 🌟</h3>
          <p className="text-xl font-arabic leading-relaxed">
            كل خطوة في رحلتك مع القرآن هي إنجاز عظيم
          </p>
        </Card>
      </div>
    </div>
  );
}