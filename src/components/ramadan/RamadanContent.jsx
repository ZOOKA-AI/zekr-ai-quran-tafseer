import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Scale, Lightbulb, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const RAMADAN_CONTENT = [
  {
    id: 1,
    title: 'آيات الصيام في القرآن الكريم',
    category: 'tafsir',
    icon: <BookOpen className="w-6 h-6" />,
    description: 'شرح مفصل لآيات الصيام والصوم في القرآن الكريم',
    verses: [
      { text: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ', ref: 'البقرة 185' },
      { text: 'كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ', ref: 'البقرة 183' },
      { text: 'فَمَن شَهِدَ مِنكُمُ الشَّهْرَ فَلْيَصُمْهُ', ref: 'البقرة 185' }
    ]
  },
  {
    id: 2,
    title: 'أحكام الصيام الفقهية',
    category: 'fiqh',
    icon: <Scale className="w-6 h-6" />,
    description: 'أحكام الصيام وشروطه والمفطرات والرخص',
    points: [
      'شروط الصيام: النية والقدرة والسلامة من الموانع',
      'المفطرات: الأكل، الشرب، الإفطار، الجنابة، الحيض والنفاس',
      'الرخص: المريض والمسافر والحامل والمرضع',
      'قضاء الصيام: يجب قضاء أيام الصيام بعد رمضان'
    ]
  },
  {
    id: 3,
    title: 'فضائل شهر رمضان',
    category: 'virtues',
    icon: <Lightbulb className="w-6 h-6" />,
    description: 'معلومات عن فضائل وخصائص شهر رمضان المبارك',
    virtues: [
      'فيه نزل القرآن الكريم - هدى للناس',
      'تفتح فيه أبواب الجنة وتغلق أبواب النار',
      'تصفد فيه الشياطين - فرصة ذهبية للتقوى',
      'ليلة القدر فيه - خير من ألف شهر'
    ]
  },
  {
    id: 4,
    title: 'نصائح عملية للصيام',
    category: 'tips',
    icon: <Play className="w-6 h-6" />,
    description: 'نصائح صحية وعملية لصيام صحي ومريح',
    tips: [
      'تناول السحور قبل الفجر بقليل - يقوي على الصيام',
      'اشرب ماء كافي في السحور والإفطار',
      'تجنب الطعام الدهني والثقيل عند الإفطار',
      'نم مبكراً واستيقظ للسحور والفجر'
    ]
  }
];

export default function RamadanContent() {
  const [activeTab, setActiveTab] = useState('tafsir');

  const categories = [
    { id: 'tafsir', label: 'التفسير', color: 'from-blue-500 to-cyan-500' },
    { id: 'fiqh', label: 'الفقه', color: 'from-emerald-500 to-green-500' },
    { id: 'virtues', label: 'الفضائل', color: 'from-amber-500 to-orange-500' },
    { id: 'tips', label: 'النصائح', color: 'from-purple-500 to-pink-500' }
  ];

  const activeContent = RAMADAN_CONTENT.find(c => c.category === activeTab);

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <Button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={
              activeTab === cat.id
                ? `bg-gradient-to-r ${cat.color} text-white`
                : 'bg-white border-2 border-gray-300 text-gray-900'
            }
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Content Display */}
      {activeContent && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Header Card */}
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 border-2 border-gray-200">
            <div className="flex gap-4 items-start">
              <div className="text-4xl">{activeContent.icon}</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{activeContent.title}</h3>
                <p className="text-gray-700">{activeContent.description}</p>
              </div>
            </div>
          </Card>

          {/* Content Based on Type */}
          {activeContent.category === 'tafsir' && (
            <div className="space-y-3">
              {activeContent.verses.map((verse, idx) => (
                <Card key={idx} className="bg-white p-4 border-2 border-blue-200">
                  <p className="text-xl font-arabic text-gray-900 text-center leading-loose mb-3">
                    ﴿ {verse.text} ﴾
                  </p>
                  <p className="text-center text-blue-600 font-semibold">{verse.ref}</p>
                </Card>
              ))}
            </div>
          )}

          {(activeContent.category === 'fiqh' || activeContent.category === 'tips') && (
            <div className="space-y-3">
              {(activeContent.category === 'fiqh' ? activeContent.points : activeContent.tips).map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-gradient-to-r from-white to-gray-50 p-4 border-l-4 border-emerald-500">
                    <div className="flex gap-3">
                      <div className="text-emerald-600 font-bold text-lg flex-shrink-0">{idx + 1}</div>
                      <p className="text-gray-800 text-lg">{item}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeContent.category === 'virtues' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeContent.virtues.map((virtue, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 border-2 border-amber-300 h-full">
                    <div className="flex gap-2">
                      <span className="text-2xl">✨</span>
                      <p className="text-gray-800 font-semibold">{virtue}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}