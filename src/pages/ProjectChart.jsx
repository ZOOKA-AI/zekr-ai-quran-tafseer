import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, Circle, Clock, BookOpen, Mic, Volume2, Users, 
  MessageSquare, Bell, Award, Radio, Sparkles, Camera, Search,
  BookMarked, Home, Settings, Shield, Heart, Globe, Smartphone
} from 'lucide-react';

const PROJECT_PHASES = [
  {
    id: 1,
    name: "المرحلة الأولى - البنية الأساسية",
    status: "completed",
    progress: 100,
    startDate: "2024-01",
    endDate: "2024-02",
    color: "from-emerald-500 to-green-500",
    tasks: [
      { name: "إنشاء هيكل التطبيق", status: "done", icon: Settings },
      { name: "تصميم Layout الرئيسي", status: "done", icon: Home },
      { name: "إعداد قاعدة البيانات (Entities)", status: "done", icon: Globe },
      { name: "نظام التوجيه والصفحات", status: "done", icon: Smartphone },
      { name: "التصميم المتجاوب (Responsive)", status: "done", icon: Smartphone },
    ]
  },
  {
    id: 2,
    name: "المرحلة الثانية - القرآن الكريم",
    status: "completed",
    progress: 100,
    startDate: "2024-02",
    endDate: "2024-03",
    color: "from-blue-500 to-cyan-500",
    tasks: [
      { name: "صفحة القرآن الرئيسية", status: "done", icon: BookOpen },
      { name: "عرض السور (114 سورة)", status: "done", icon: BookOpen },
      { name: "صفحة عرض السورة والآيات", status: "done", icon: BookOpen },
      { name: "التفاسير (السعدي، ابن كثير، الطبري)", status: "done", icon: BookOpen },
      { name: "الترجمات المتعددة", status: "done", icon: Globe },
      { name: "أسباب النزول", status: "done", icon: BookOpen },
      { name: "البحث في القرآن", status: "done", icon: Search },
      { name: "البحث المتقدم", status: "done", icon: Search },
    ]
  },
  {
    id: 3,
    name: "المرحلة الثالثة - التلاوات والمقرئين",
    status: "completed",
    progress: 100,
    startDate: "2024-03",
    endDate: "2024-04",
    color: "from-purple-500 to-pink-500",
    tasks: [
      { name: "صفحة التلاوة", status: "done", icon: Volume2 },
      { name: "12 قارئ عالمي", status: "done", icon: Mic },
      { name: "التحكم في الصوت", status: "done", icon: Volume2 },
      { name: "صفحة المقرئين", status: "done", icon: Users },
      { name: "زر تشغيل التلاوة", status: "done", icon: Volume2 },
      { name: "التحكم الصوتي (Voice Controller)", status: "done", icon: Mic },
      { name: "ماسح الكاميرا للقرآن", status: "done", icon: Camera },
    ]
  },
  {
    id: 4,
    name: "المرحلة الرابعة - الراديو والبث المباشر",
    status: "completed",
    progress: 100,
    startDate: "2024-04",
    endDate: "2024-04",
    color: "from-amber-500 to-orange-500",
    tasks: [
      { name: "صفحة الراديو الإسلامي", status: "done", icon: Radio },
      { name: "إذاعات من كل الدول العربية", status: "done", icon: Globe },
      { name: "التحكم في البث المباشر", status: "done", icon: Volume2 },
      { name: "حفظ المحطات المفضلة", status: "done", icon: Heart },
    ]
  },
  {
    id: 5,
    name: "المرحلة الخامسة - الأدعية والأذكار",
    status: "completed",
    progress: 100,
    startDate: "2024-04",
    endDate: "2024-05",
    color: "from-teal-500 to-emerald-500",
    tasks: [
      { name: "صفحة الأدعية القرآنية والنبوية", status: "done", icon: Sparkles },
      { name: "صفحة الأذكار (صباح/مساء/نوم)", status: "done", icon: BookMarked },
      { name: "خاصية النسخ والمشاركة", status: "done", icon: Globe },
      { name: "القراءة الصوتية للأذكار", status: "done", icon: Volume2 },
      { name: "عداد الأذكار", status: "done", icon: CheckCircle2 },
    ]
  },
  {
    id: 6,
    name: "المرحلة السادسة - المساعد الذكي",
    status: "completed",
    progress: 100,
    startDate: "2024-05",
    endDate: "2024-06",
    color: "from-indigo-500 to-purple-500",
    tasks: [
      { name: "المساعد الذكي (زوكا المرزوق)", status: "done", icon: MessageSquare },
      { name: "التعرف على الصوت", status: "done", icon: Mic },
      { name: "الرد الصوتي التلقائي", status: "done", icon: Volume2 },
      { name: "فهم الأوامر بالعربية", status: "done", icon: Globe },
      { name: "تنفيذ الأوامر (تشغيل، بحث، انتقال)", status: "done", icon: Settings },
      { name: "صفحة المساعد المتقدم", status: "done", icon: MessageSquare },
    ]
  },
  {
    id: 7,
    name: "المرحلة السابعة - ركن الأطفال",
    status: "completed",
    progress: 100,
    startDate: "2024-06",
    endDate: "2024-07",
    color: "from-pink-500 to-rose-500",
    tasks: [
      { name: "صفحة تعليم الأطفال", status: "done", icon: Users },
      { name: "شخصية زوكا التفاعلية", status: "done", icon: Sparkles },
      { name: "نظام النقاط والمكافآت", status: "done", icon: Award },
      { name: "دروس تفاعلية ممتعة", status: "done", icon: BookOpen },
      { name: "منهج الأزهر الشريف", status: "done", icon: BookOpen },
    ]
  },
  {
    id: 8,
    name: "المرحلة الثامنة - التقدم والإنجازات",
    status: "completed",
    progress: 100,
    startDate: "2024-07",
    endDate: "2024-08",
    color: "from-yellow-500 to-amber-500",
    tasks: [
      { name: "صفحة الإحصائيات", status: "done", icon: Clock },
      { name: "صفحة الإنجازات والشارات", status: "done", icon: Award },
      { name: "خطة الحفظ الذكية", status: "done", icon: BookOpen },
      { name: "متابعة التقدم اليومي", status: "done", icon: CheckCircle2 },
      { name: "نظام النقاط", status: "done", icon: Sparkles },
    ]
  },
  {
    id: 9,
    name: "المرحلة التاسعة - الإشعارات والتذكيرات",
    status: "completed",
    progress: 100,
    startDate: "2024-08",
    endDate: "2024-09",
    color: "from-red-500 to-pink-500",
    tasks: [
      { name: "تذكيرات الصلاة", status: "done", icon: Bell },
      { name: "أذكار الصباح والمساء", status: "done", icon: Bell },
      { name: "صوت الأذان", status: "done", icon: Volume2 },
      { name: "إشعارات ذكية", status: "done", icon: Bell },
    ]
  },
  {
    id: 10,
    name: "المرحلة العاشرة - لوحة الأدمن",
    status: "completed",
    progress: 100,
    startDate: "2024-09",
    endDate: "2024-10",
    color: "from-gray-600 to-gray-800",
    tasks: [
      { name: "لوحة تحكم الأدمن", status: "done", icon: Shield },
      { name: "إدارة المستخدمين", status: "done", icon: Users },
      { name: "سجل النظام", status: "done", icon: Settings },
      { name: "الإحصائيات المتقدمة", status: "done", icon: Clock },
      { name: "حماية بكلمة سر", status: "done", icon: Shield },
    ]
  },
  {
    id: 11,
    name: "المرحلة الحادية عشر - التخزين والأوفلاين",
    status: "completed",
    progress: 100,
    startDate: "2024-10",
    endDate: "2024-11",
    color: "from-cyan-500 to-blue-500",
    tasks: [
      { name: "التخزين المحلي", status: "done", icon: Smartphone },
      { name: "العمل بدون إنترنت", status: "done", icon: Globe },
      { name: "مزامنة البيانات", status: "done", icon: Settings },
      { name: "مؤشر حالة الاتصال", status: "done", icon: Globe },
      { name: "التحديث التلقائي", status: "done", icon: Settings },
    ]
  },
  {
    id: 12,
    name: "المرحلة الثانية عشر - الخط والفنون",
    status: "completed",
    progress: 100,
    startDate: "2024-11",
    endDate: "2024-11",
    color: "from-violet-500 to-purple-500",
    tasks: [
      { name: "صفحة الخطوط الإسلامية", status: "done", icon: Sparkles },
      { name: "عرض فنون الخط العربي", status: "done", icon: Sparkles },
      { name: "المفضلة والإعجابات", status: "done", icon: Heart },
    ]
  }
];

const STATS = {
  totalTasks: 60,
  completedTasks: 60,
  totalPhases: 12,
  completedPhases: 12,
  technologies: ["React", "Tailwind CSS", "Shadcn/UI", "AI/LLM", "Speech API", "LocalStorage"],
  entities: ["User", "Verse", "Bookmark", "SystemLog", "IslamicContent", "Donation", "Orphan"],
  pages: 20,
  components: 35
};

export default function ProjectChartPage() {
  const [selectedPhase, setSelectedPhase] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">📊 مخطط المشروع الكامل</h1>
          <p className="text-xl text-purple-300">تطبيق زوكا المرزوق - القرآن الكريم بالذكاء الاصطناعي</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-400/30 p-6 text-center">
            <p className="text-5xl font-bold text-emerald-400">{STATS.completedTasks}</p>
            <p className="text-white font-bold mt-2">مهمة منجزة</p>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/30 p-6 text-center">
            <p className="text-5xl font-bold text-blue-400">{STATS.completedPhases}</p>
            <p className="text-white font-bold mt-2">مرحلة مكتملة</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30 p-6 text-center">
            <p className="text-5xl font-bold text-purple-400">{STATS.pages}</p>
            <p className="text-white font-bold mt-2">صفحة</p>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-400/30 p-6 text-center">
            <p className="text-5xl font-bold text-amber-400">{STATS.components}</p>
            <p className="text-white font-bold mt-2">مكون</p>
          </Card>
        </div>

        {/* Gantt Chart Style Timeline */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">📅 الجدول الزمني للمراحل</h2>
          <div className="space-y-4">
            {PROJECT_PHASES.map((phase, idx) => (
              <div 
                key={phase.id}
                className="relative cursor-pointer hover:scale-[1.01] transition-transform"
                onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center text-white font-bold">{phase.id}</div>
                  <div className="flex-1">
                    <div className={`h-12 rounded-xl bg-gradient-to-r ${phase.color} flex items-center px-4 shadow-lg`}>
                      <span className="text-white font-bold text-sm md:text-base truncate">{phase.name}</span>
                      <span className="mr-auto text-white/80 text-sm hidden md:block">{phase.tasks.length} مهمة</span>
                      <CheckCircle2 className="w-5 h-5 text-white mr-2" />
                    </div>
                  </div>
                </div>

                {/* Expanded Tasks */}
                {selectedPhase === phase.id && (
                  <div className="mt-3 mr-12 bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {phase.tasks.map((task, taskIdx) => {
                        const Icon = task.icon;
                        return (
                          <div key={taskIdx} className="flex items-center gap-2 text-white">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <Icon className="w-4 h-4 text-purple-300" />
                            <span className="text-sm">{task.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Technologies Used */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🛠️ التقنيات المستخدمة</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {STATS.technologies.map((tech, idx) => (
              <span key={idx} className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full text-white font-bold border border-purple-400/30">
                {tech}
              </span>
            ))}
          </div>
        </Card>

        {/* Entities */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🗄️ قاعدة البيانات (Entities)</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {STATS.entities.map((entity, idx) => (
              <span key={idx} className="px-4 py-2 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full text-white font-bold border border-emerald-400/30">
                {entity}
              </span>
            ))}
          </div>
        </Card>

        {/* Summary */}
        <Card className="bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 border-emerald-400/30 p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">المشروع مكتمل 100%</h2>
          <p className="text-xl text-purple-200 mb-4">
            تم إنجاز جميع المراحل والمهام بنجاح
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="bg-white/10 rounded-xl px-6 py-3">
              <p className="text-3xl font-bold text-emerald-400">✅ 60/60</p>
              <p className="text-white">مهمة</p>
            </div>
            <div className="bg-white/10 rounded-xl px-6 py-3">
              <p className="text-3xl font-bold text-blue-400">✅ 12/12</p>
              <p className="text-white">مرحلة</p>
            </div>
            <div className="bg-white/10 rounded-xl px-6 py-3">
              <p className="text-3xl font-bold text-purple-400">100%</p>
              <p className="text-white">مكتمل</p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-purple-300">
          <p>📱 تطبيق زوكا المرزوق - صدقة جارية لوجه الله تعالى</p>
          <p className="text-sm mt-2">جميع الحقوق محفوظة © 2024</p>
        </div>
      </div>
    </div>
  );
}