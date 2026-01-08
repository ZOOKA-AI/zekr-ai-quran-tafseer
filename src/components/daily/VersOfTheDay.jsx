import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Volume2, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import localAudioLibrary from '../audio/LocalAudioLibrary';

const VERSES_COLLECTION = [
  {
    text: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
    translation: "وما خلقت الجن والإنس إلا ليعبدون",
    tafsir: "بيان الغاية من خلق الإنسان: العبادة والتوحيد",
    reference: "الذاريات: 56",
    topic: "الغاية من الخلق"
  },
  {
    text: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    translation: "فاذكروني أذكركم واشكروا لي ولا تكفرون",
    tafsir: "أمر بذكر الله وشكره، ووعد بذكر الله لمن يذكره",
    reference: "البقرة: 152",
    topic: "الذكر والشكر"
  },
  {
    text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "إن الله مع الصابرين",
    tafsir: "بشارة عظيمة للصابرين بمعية الله ونصره",
    reference: "البقرة: 153",
    topic: "الصبر"
  },
  {
    text: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
    translation: "ولا تيأسوا من روح الله إنه لا ييأس من روح الله إلا القوم الكافرون",
    tafsir: "نهي عن اليأس من رحمة الله، وبيان أن اليأس من صفات الكافرين",
    reference: "يوسف: 87",
    topic: "الأمل والرجاء"
  },
  {
    text: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",
    translation: "وإذا سألك عبادي عني فإني قريب",
    tafsir: "قرب الله من عباده واستجابته لدعائهم",
    reference: "البقرة: 186",
    topic: "الدعاء"
  }
];

export default function VerseOfTheDay() {
  const [verse, setVerse] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    loadDailyVerse();
  }, []);

  const loadDailyVerse = () => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('verse_date');
    
    if (savedDate === today) {
      const saved = localStorage.getItem('daily_verse');
      if (saved) {
        setVerse(JSON.parse(saved));
        return;
      }
    }
    
    // اختيار آية جديدة
    const randomVerse = VERSES_COLLECTION[Math.floor(Math.random() * VERSES_COLLECTION.length)];
    setVerse(randomVerse);
    localStorage.setItem('daily_verse', JSON.stringify(randomVerse));
    localStorage.setItem('verse_date', today);
  };

  const handleSpeak = async () => {
    if (!verse) return;
    
    if (isSpeaking) {
      localAudioLibrary.stop();
      setIsSpeaking(false);
      return;
    }
    
    setIsSpeaking(true);
    await localAudioLibrary.speak(verse.text, { rate: 0.7 });
    setIsSpeaking(false);
  };

  const handleCopy = () => {
    if (!verse) return;
    const text = `${verse.text}\n\n${verse.tafsir}\n\n(${verse.reference})`;
    navigator.clipboard.writeText(text);
    toast.success('تم نسخ الآية!');
  };

  const handleShare = async () => {
    if (!verse) return;
    const text = `🌟 آية اليوم من تطبيق ذكر 🌟\n\n${verse.text}\n\n📖 ${verse.tafsir}\n\n(${verse.reference})`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'ذكر - آية اليوم', text });
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(text);
          toast.success('تم نسخ الآية للمشاركة!');
        }
      }
    } else {
      navigator.clipboard.writeText(text);
      toast.success('تم نسخ الآية للمشاركة!');
    }
  };

  if (!verse) return null;

  return (
    <Card className="bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 p-8 rounded-2xl shadow-2xl border-4 border-amber-400">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-8 h-8 text-white" />
        <h3 className="text-2xl font-bold text-white">آية اليوم</h3>
      </div>
      
      <div className="bg-white/95 rounded-xl p-6 mb-4">
        <p className="text-3xl font-arabic text-gray-900 leading-loose mb-4 text-center">
          {verse.text}
        </p>
        
        <div className="bg-emerald-50 rounded-lg p-4 mb-3">
          <p className="text-gray-800 text-lg mb-2">
            <span className="font-bold text-emerald-700">التفسير:</span> {verse.tafsir}
          </p>
          <p className="text-emerald-600 font-bold">
            📍 {verse.reference}
          </p>
        </div>
        
        <div className="flex gap-2 justify-center flex-wrap">
          <Button
            onClick={handleSpeak}
            className="bg-white hover:bg-gray-50 text-emerald-700 border border-emerald-300"
          >
            <Volume2 className="w-4 h-4 ml-1" />
            {isSpeaking ? 'إيقاف' : 'استمع'}
          </Button>
          
          <Button
            onClick={handleCopy}
            className="bg-white hover:bg-gray-50 text-amber-700 border border-amber-300"
          >
            <Copy className="w-4 h-4 ml-1" />
            نسخ
          </Button>
          
          <Button
            onClick={handleShare}
            className="bg-white hover:bg-gray-50 text-blue-700 border border-blue-300"
          >
            <Share2 className="w-4 h-4 ml-1" />
            مشاركة
          </Button>
        </div>
      </div>
      
      <div className="text-center">
        <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold">
          🏷️ {verse.topic}
        </span>
      </div>
    </Card>
  );
}