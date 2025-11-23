import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, Gamepad2, Trophy, Star, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function KidsPage() {
  const [isListening, setIsListening] = useState(false);
  const [zookaMessage, setZookaMessage] = useState('السلام عليكم! أنا زوكا المرزوق 🌟 معلمك الخاص! عايز نتعلم إيه النهاردة؟');
  const [score, setScore] = useState(0);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      utterance.pitch = 1.4;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleZookaTalk = async (topic) => {
    try {
      setZookaMessage('جاري التحضير... 🤔');
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت زوكا المرزوق - معلم قرآن محبوب للأطفال من الأزهر الشريف 🌟

الموضوع: ${topic}

اشرح الموضوع للأطفال بطريقة:
- بسيطة جداً وسهلة
- مليئة بالحماس والتشجيع
- مع أمثلة من حياتهم اليومية
- استخدم إيموجي كثير
- امدح الطفل: "ماشاء الله عليك!" "أنت شاطر!" "ممتاز!"
- اجعلها قصيرة (3-4 جمل فقط)

الرد بالعربية البسيطة:`,
      });

      const message = response || 'ماشاء الله عليك يا شاطر! استمر في التعلم 🌟';
      setZookaMessage(message);
      speak(message);
      
      setScore(prev => prev + 10);
      toast.success('رائع! حصلت على 10 نقاط! 🌟');
      
    } catch (error) {
      setZookaMessage('معلش يا حبيبي، في مشكلة صغيرة! جرب تاني 😊');
      speak('معلش يا حبيبي، جرب تاني');
    }
  };

  const activities = [
    { 
      id: 1, 
      title: '📖 تعلم سورة جديدة', 
      icon: BookOpen, 
      color: 'from-emerald-400 to-green-400',
      topic: 'علمني سورة الفاتحة بطريقة سهلة'
    },
    { 
      id: 2, 
      title: '📚 قصة من القرآن', 
      icon: BookOpen, 
      color: 'from-pink-400 to-purple-400',
      topic: 'احكي لي قصة سيدنا يوسف بطريقة مشوقة'
    },
    { 
      id: 3, 
      title: '🎯 مسابقة سريعة', 
      icon: Gamepad2, 
      color: 'from-blue-400 to-cyan-400',
      topic: 'اسألني سؤال سهل في القرآن'
    },
    { 
      id: 4, 
      title: '⭐ أسماء الله الحسنى', 
      icon: Star, 
      color: 'from-amber-400 to-orange-400',
      topic: 'علمني أسماء الله الحسنى بطريقة جميلة'
    },
    { 
      id: 5, 
      title: '🤲 دعاء اليوم', 
      icon: Heart, 
      color: 'from-rose-400 to-pink-400',
      topic: 'علمني دعاء جميل للأطفال'
    },
    { 
      id: 6, 
      title: '🕌 تعلم الوضوء', 
      icon: Sparkles, 
      color: 'from-indigo-400 to-purple-400',
      topic: 'علمني خطوات الوضوء بطريقة سهلة'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block animate-bounce">
            <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white mb-4">
              <span className="text-6xl">🌟</span>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2">
            ركن الأطفال
          </h1>
          <p className="text-3xl font-bold text-gray-800">مع زوكا المرزوق! 💚</p>
        </div>

        {/* Score */}
        <div className="flex justify-center mb-8">
          <Card className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-8 py-4 shadow-xl border-4 border-amber-300">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8" />
              <div>
                <p className="text-sm font-bold">نقاطك</p>
                <p className="text-3xl font-bold">{score} 🌟</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Zooka Message */}
        <Card className="bg-white p-8 shadow-2xl border-4 border-purple-300 mb-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <span className="text-5xl">🤖</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <p className="text-2xl text-gray-900 leading-relaxed font-bold">
                  {zookaMessage}
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-2 font-bold">🎤 زوكا المرزوق - معلمك من الأزهر</p>
            </div>
          </div>
        </Card>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <Button
                key={activity.id}
                onClick={() => handleZookaTalk(activity.topic)}
                className="h-auto p-0 bg-transparent hover:bg-transparent"
              >
                <Card className="w-full bg-white shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer border-3 border-purple-200 hover:border-purple-400">
                  <div className={`bg-gradient-to-br ${activity.color} p-6 text-white rounded-t-xl`}>
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2">{activity.title}</h3>
                  </div>
                  <div className="p-4 text-center bg-gradient-to-r from-purple-50 to-pink-50">
                    <p className="text-purple-600 font-bold text-sm">👆 اضغط للتعلم</p>
                  </div>
                </Card>
              </Button>
            );
          })}
        </div>

        {/* Encouragement */}
        <Card className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-8 text-center shadow-2xl mt-8 border-4 border-amber-400">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-4xl font-bold mb-3">ماشاء الله عليك!</h2>
          <p className="text-2xl font-bold">أنت طفل ممتاز ومجتهد! 🌟</p>
          <p className="text-xl mt-2">استمر في التعلم وربنا هيحبك أكتر 💚</p>
        </Card>
      </div>
    </div>
  );
}