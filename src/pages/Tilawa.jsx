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
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Kaaba Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6920cdfd512838f4a35374d8/ad390f8ea_21da07e84f2006654e384d2924c664b1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(1.6) contrast(1.3) saturate(1.2)'
        }}
      />
      <div className="absolute inset-0 bg-black/5" />
      
      <style jsx>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.5), 0 0 60px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.7), 0 0 80px rgba(59, 130, 246, 0.5); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes barcode-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(-20px) rotateY(180deg); }
        }
        .glow-button { animation: glow 2s ease-in-out infinite; }
        .pulse-ring { animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .barcode-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(to right, 
            transparent 0%,
            rgba(147, 51, 234, 0.1) 10%,
            rgba(59, 130, 246, 0.2) 20%,
            transparent 25%,
            rgba(6, 182, 212, 0.15) 30%,
            transparent 35%,
            rgba(147, 51, 234, 0.25) 40%,
            transparent 45%,
            rgba(59, 130, 246, 0.1) 50%,
            transparent 55%,
            rgba(6, 182, 212, 0.2) 60%,
            transparent 65%,
            rgba(147, 51, 234, 0.15) 70%,
            transparent 75%,
            rgba(59, 130, 246, 0.1) 80%,
            transparent 90%
          );
          background-size: 200% 100%;
          animation: barcode-slide 3s linear infinite;
          border-top: 2px solid rgba(147, 51, 234, 0.4);
        }
      `}</style>



      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {/* Decorative 3D Crystal Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-600/30 backdrop-blur-sm border-2 border-white/20 shadow-2xl animate-float" style={{transform: 'perspective(1000px) rotateY(20deg)', animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/40 to-orange-600/40 backdrop-blur-sm border-2 border-white/30 shadow-2xl animate-float" style={{transform: 'perspective(1000px) rotateY(-20deg)', animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-600/30 backdrop-blur-sm border-2 border-white/20 shadow-2xl animate-float" style={{transform: 'perspective(1000px) rotateX(20deg)', animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-10 w-28 h-28 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-600/30 backdrop-blur-sm border-2 border-white/25 shadow-2xl animate-float" style={{transform: 'perspective(1000px) rotateY(30deg)', animationDelay: '1.5s'}}></div>
        
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

      {/* Animated Barcode at Bottom */}
      <div className="barcode-line"></div>
    </div>
  );
}