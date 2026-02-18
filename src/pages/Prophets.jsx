import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const PROPHETS = [
  {
    name: 'آدم عليه السلام',
    era: 'أبو البشر',
    summary: 'أول أنبياء الله، خلقه الله بيده وأسجد له ملائكته، وأسكنه الجنة ثم هبط إلى الأرض، فتاب الله عليه.' ,
    lessons: ['التوبة والرجوع إلى الله', 'الشيطان عدو مبين', 'فضل العلم والتعلم'],
  },
  {
    name: 'نوح عليه السلام',
    era: 'أقدم الرسل',
    summary: 'دعا قومه ألف سنة إلا خمسين عاماً، فصبر وثبت، وصنع السفينة ونجّاه الله والمؤمنين.',
    lessons: ['الصبر الطويل في الدعوة', 'التوكل على الله', 'سنّة النجاة لأهل الإيمان'],
  },
  {
    name: 'إبراهيم عليه السلام',
    era: 'خليل الرحمن',
    summary: 'حطم الأصنام، وابتلاه الله بكلمات فأتمهن، وبنى الكعبة مع ابنه إسماعيل.',
    lessons: ['التوحيد الخالص', 'الابتلاء سنة المؤمنين', 'البر بالأسرة والذرية'],
  },
  {
    name: 'موسى عليه السلام',
    era: 'كليم الله',
    summary: 'أرسله الله إلى فرعون، فآواه الله وأيّده بالمعجزات وشقّ له البحر وأنزل عليه التوراة.',
    lessons: ['الثبات أمام الطغيان', 'الشكر بعد النجاة', 'القيادة بالوحي'],
  },
  {
    name: 'عيسى عليه السلام',
    era: 'روح الله وكلمته',
    summary: 'كلّمه الله وهو في المهد، وأيّده بالمعجزات، وبشّر برسول يأتي من بعده اسمه أحمد.',
    lessons: ['طهارة الأنبياء', 'البشارة بمحمد ﷺ', 'الرحمة واللين'],
  },
  {
    name: 'محمد ﷺ',
    era: 'خاتم الأنبياء',
    summary: 'أرسله الله رحمة للعالمين، بُعث في مكة وهاجر إلى المدينة، أقام دولة الإسلام وختمت به النبوة.',
    lessons: ['الرحمة العامة', 'كمال الهدي', 'شمولية الشريعة'],
  },
];

export default function Prophets() {
  const [q, setQ] = useState('');
  const filtered = useMemo(
    () => PROPHETS.filter((p) => p.name.includes(q) || p.summary.includes(q)),
    [q]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 font-arabic">قصص الأنبياء</h1>
          <p className="text-gray-700">سرد مبسط ودروس مستفادة</p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث باسم النبي أو ملخص القصة..."
            className="h-12 border-emerald-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((p, i) => (
            <Card key={i} className="bg-white/90 border-2 border-emerald-200 p-6 shadow">
              <h3 className="text-3xl font-arabic text-emerald-700 mb-2">{p.name}</h3>
              <p className="text-sm text-amber-700 mb-3">{p.era}</p>
              <p className="text-lg text-gray-800 font-arabic leading-relaxed mb-4">{p.summary}</p>
              <div className="flex flex-wrap gap-2">
                {p.lessons.map((l, idx) => (
                  <Badge key={idx} className="bg-emerald-100 text-emerald-800">{l}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}