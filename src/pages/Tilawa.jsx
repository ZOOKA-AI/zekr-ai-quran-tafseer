import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ALL_SURAHS } from '../components/quran/QuranData';
import AdvancedPlayer from '../components/tilawa/AdvancedPlayer';

// أصوات محلية - تعمل بدون نت باستخدام Web Speech API
const LOCAL_VOICES = {
  local: { name: "صوت محلي (يعمل بدون نت)", description: "قراءة محلية باستخدام المتصفح" }
};

const SURAHS = [
  { number: 1, name: 'الفاتحة', verses: 7 },
  { number: 2, name: 'البقرة', verses: 286 },
  { number: 3, name: 'آل عمران', verses: 200 },
  { number: 4, name: 'النساء', verses: 176 },
  { number: 5, name: 'المائدة', verses: 120 },
  { number: 6, name: 'الأنعام', verses: 165 },
  { number: 18, name: 'الكهف', verses: 110 },
  { number: 36, name: 'يس', verses: 83 },
  { number: 55, name: 'الرحمن', verses: 78 },
  { number: 67, name: 'الملك', verses: 30 },
  { number: 112, name: 'الإخلاص', verses: 4 },
  { number: 113, name: 'الفلق', verses: 5 },
  { number: 114, name: 'الناس', verses: 6 }
];

export default function TilawaPage() {
  const [selectedSurah, setSelectedSurah] = useState(1);
  
  const selectedSurahData = ALL_SURAHS.find(s => s.number === selectedSurah);
  
  // آيات مثالية - في التطبيق الحقيقي ستأتي من API
  const sampleVerses = selectedSurahData ? Array.from({ length: Math.min(selectedSurahData.verses, 10) }, (_, i) => ({
    number: i + 1,
    text: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ`
  })) : [];



  return (
    <div className="min-h-screen bg-white" dir="rtl">
      
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-4 font-arabic drop-shadow-2xl">
              ﴿ وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا ﴾
            </h1>
            <p className="text-lg text-gray-900 font-bold drop-shadow-lg">مشغل تلاوة متقدم • اختر القارئ وسرعة التلاوة</p>
          </div>

          {/* Surah Selection */}
          <Card className="bg-white/90 backdrop-blur-xl border-2 border-emerald-400/60 shadow-2xl mb-6 p-6">
            <label className="block text-gray-900 text-lg font-bold mb-3 text-center">
              📖 اختر السورة
            </label>
            <Select value={selectedSurah.toString()} onValueChange={(v) => setSelectedSurah(Number(v))}>
              <SelectTrigger className="h-12 text-lg bg-white border-2 border-emerald-300 text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-emerald-300">
                {ALL_SURAHS.map(surah => (
                  <SelectItem key={surah.number} value={surah.number.toString()} className="text-gray-900 text-lg">
                    {surah.name} - {surah.verses} آية
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Advanced Player */}
          <AdvancedPlayer surah={selectedSurah} verses={sampleVerses} />
        </div>
      </div>
    </div>
  );
}