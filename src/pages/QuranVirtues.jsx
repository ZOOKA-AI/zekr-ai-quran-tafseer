import React from 'react';
import { Card } from '@/components/ui/card';

const ARTICLES = [
  {
    title: 'فضائل تلاوة القرآن',
    bullets: [
      'الحسنة بعشر أمثالها لكل حرف',
      'رفعة في الدنيا والآخرة',
      'شفاعة يوم القيامة'
    ],
    ref: 'أحاديث صحيحة: (اقرؤوا القرآن فإنه يأتي يوم القيامة شفيعًا لأصحابه)'
  },
  {
    title: 'أهمية التدبر',
    bullets: [
      'تحقيق مقاصد الهداية',
      'إصلاح القلب والسلوك',
      'العمل بالآيات وتطبيقها'
    ],
    ref: '﴿ أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ ﴾'
  },
  {
    title: 'آداب حامل القرآن',
    bullets: [
      'الإخلاص والتطهر',
      'تحسين الصوت والوقار',
      'العمل بما علِم'
    ],
    ref: 'آثار عن السلف وأحاديث في تعظيم القرآن'
  }
];

export default function QuranVirtues() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 font-arabic">فضائل القرآن وتدبره</h1>
          <p className="text-gray-700">مقالات مختصرة ومرتبة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTICLES.map((a, idx) => (
            <Card key={idx} className="bg-white/90 border-2 border-emerald-200 p-6 shadow">
              <h3 className="text-2xl text-emerald-700 font-arabic mb-3">{a.title}</h3>
              <ul className="list-disc pr-6 text-gray-800 space-y-2 font-arabic text-lg mb-3">
                {a.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <p className="text-amber-700 text-sm">📖 {a.ref}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}