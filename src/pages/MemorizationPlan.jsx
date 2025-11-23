import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, BookOpen, Target, Award, CheckCircle2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const PLANS = {
  beginner: {
    name: 'خطة المبتدئين',
    duration: '12 شهر',
    daily: 'صفحة واحدة يومياً',
    description: 'مناسبة للمبتدئين - حفظ القرآن في سنة',
    icon: '🌱'
  },
  intermediate: {
    name: 'خطة متوسطة',
    duration: '6 أشهر',
    daily: 'صفحتان يومياً',
    description: 'للذين لديهم خبرة في الحفظ',
    icon: '🌿'
  },
  advanced: {
    name: 'خطة متقدمة',
    duration: '3 أشهر',
    daily: '4 صفحات يومياً',
    description: 'للمتقدمين والمتفرغين',
    icon: '🌳'
  }
};

const SAMPLE_SCHEDULE = [
  { day: 1, surah: 'الفاتحة', pages: 1, completed: true },
  { day: 2, surah: 'البقرة (1-5)', pages: 1, completed: true },
  { day: 3, surah: 'البقرة (6-10)', pages: 1, completed: false },
  { day: 4, surah: 'البقرة (11-15)', pages: 1, completed: false },
  { day: 5, surah: 'البقرة (16-20)', pages: 1, completed: false },
];

export default function MemorizationPlanPage() {
  const [selectedPlan, setSelectedPlan] = useState('beginner');
  const [schedule, setSchedule] = useState(SAMPLE_SCHEDULE);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const user = await base44.auth.me();
      if (user.memorization_schedule) {
        setSchedule(user.memorization_schedule);
      }
    } catch (error) {
      // استخدام البيانات الافتراضية
    }
  };

  const toggleComplete = async (day) => {
    const newSchedule = schedule.map(item => 
      item.day === day ? { ...item, completed: !item.completed } : item
    );
    setSchedule(newSchedule);
    
    try {
      await base44.auth.updateMe({ memorization_schedule: newSchedule });
      toast.success('تم حفظ التقدم! 🎉');
    } catch (error) {
      toast.success('تم التحديث محلياً! 🎉');
    }
  };

  const addNewDay = async () => {
    const lastDay = schedule[schedule.length - 1]?.day || 0;
    const newItem = {
      day: lastDay + 1,
      surah: 'جديد',
      pages: 1,
      completed: false
    };
    const newSchedule = [...schedule, newItem];
    setSchedule(newSchedule);
    
    try {
      await base44.auth.updateMe({ memorization_schedule: newSchedule });
      toast.success('تمت إضافة يوم جديد! ✨');
    } catch (error) {
      toast.success('تمت الإضافة محلياً! ✨');
    }
  };

  const plan = PLANS[selectedPlan];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">📖</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4 font-arabic">خطة الحفظ</h1>
          <p className="text-xl text-gray-700">احفظ القرآن الكريم بخطة منظمة</p>
        </div>

        {/* Plan Selection */}
        <Card className="p-8 mb-8 border-4 border-emerald-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">اختر خطتك</h2>
          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
            <SelectTrigger className="h-16 text-xl border-2 border-emerald-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PLANS).map(([key, p]) => (
                <SelectItem key={key} value={key} className="text-xl">
                  {p.icon} {p.name} - {p.duration}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* Plan Details */}
        <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-8 mb-8 border-4 border-amber-400">
          <div className="text-center">
            <div className="text-6xl mb-4">{plan.icon}</div>
            <h2 className="text-4xl font-bold mb-3">{plan.name}</h2>
            <p className="text-xl mb-6">{plan.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <Calendar className="w-8 h-8 mx-auto mb-2" />
                <p className="text-lg font-bold">{plan.duration}</p>
                <p className="text-sm">المدة الكاملة</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <p className="text-lg font-bold">{plan.daily}</p>
                <p className="text-sm">البرنامج اليومي</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <p className="text-lg font-bold">ختمة كاملة</p>
                <p className="text-sm">الهدف النهائي</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Daily Schedule */}
        <Card className="p-8 border-4 border-emerald-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Target className="w-8 h-8 text-emerald-600" />
              جدول الحفظ اليومي
            </h2>
            <Button onClick={addNewDay} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-5 h-5 ml-2" />
              إضافة يوم
            </Button>
          </div>
          <div className="space-y-4">
            {schedule.map((item) => (
              <Card 
                key={item.day}
                className={`p-6 border-2 transition-all ${
                  item.completed 
                    ? 'bg-emerald-50 border-emerald-400' 
                    : 'bg-white border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      item.completed 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {item.day}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.surah}</h3>
                      <p className="text-gray-600">
                        {item.pages} {item.pages === 1 ? 'صفحة' : 'صفحات'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => toggleComplete(item.day)}
                    variant={item.completed ? 'default' : 'outline'}
                    className={item.completed ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  >
                    <CheckCircle2 className="w-5 h-5 ml-2" />
                    {item.completed ? 'مكتمل' : 'تمييز كمكتمل'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Motivational Quote */}
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-8 mt-8 text-center border-4 border-purple-300">
          <p className="text-2xl font-bold font-arabic leading-relaxed mb-3">
            ﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ ﴾
          </p>
          <p className="text-lg">القمر: 17</p>
        </Card>
      </div>
    </div>
  );
}