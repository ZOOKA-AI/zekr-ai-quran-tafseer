import React from 'react';
import { Card } from '@/components/ui/card';

const SECTIONS = [
  {
    title: 'قبل البعثة',
    points: [
      'مولده ﷺ عام الفيل ونسبه الشريف',
      'حفظه الله من دواعي الجاهلية',
      'تحنثه في غار حراء وبشائر النبوة'
    ]
  },
  {
    title: 'المرحلة المكية',
    points: [
      'نزول الوحي وبدء الدعوة سرًّا ثم جهرًا',
      'إيذاء قريش وثبات المستضعفين',
      'الهجرة إلى الحبشة والإسراء والمعراج'
    ]
  },
  {
    title: 'المرحلة المدنية',
    points: [
      'الهجرة إلى المدينة وبناء المسجد والمؤاخاة',
      'غزوات بدر وأحد والخندق وصلح الحديبية',
      'فتح مكة وحجة الوداع وكمال الدين'
    ]
  }
];

export default function Seerah() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 font-arabic">السيرة النبوية</h1>
          <p className="text-gray-700">خط زمني موجز لأهم المحطات</p>
        </div>

        <div className="space-y-6 relative">
          {SECTIONS.map((sec, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <div className="mt-2 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow"></div>
              <Card className="flex-1 bg-white/90 border-2 border-emerald-200 p-6 shadow">
                <h3 className="text-2xl text-emerald-700 font-arabic mb-3">{sec.title}</h3>
                <ul className="list-disc pr-6 text-gray-800 space-y-2 font-arabic text-lg">
                  {sec.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}