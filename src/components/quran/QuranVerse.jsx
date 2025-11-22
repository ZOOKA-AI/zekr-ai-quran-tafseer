import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const QURAN_VERSES = [
  { text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "باسم الله الرحمن الرحيم" },
  { text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "الحمد لله رب العالمين" },
  { text: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ", translation: "وما خلقت الجن والإنس إلا ليعبدون" },
  { text: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", translation: "فاذكروني أذكركم واشكروا لي ولا تكفرون" },
  { text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "إن مع العسر يسرا" },
  { text: "وَقُل رَّبِّ زِدْنِي عِلْمًا", translation: "وقل رب زدني علما" },
  { text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً", translation: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة" },
  { text: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ", translation: "ولا تيأسوا من روح الله" },
  { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا", translation: "فإن مع العسر يسرا إن مع العسر يسرا" },
  { text: "وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ", translation: "والله يحب المحسنين" }
];

export default function QuranVerse() {
  const [currentVerse, setCurrentVerse] = useState(0);

  const changeVerse = () => {
    setCurrentVerse((prev) => (prev + 1) % QURAN_VERSES.length);
  };

  useEffect(() => {
    const interval = setInterval(changeVerse, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-orange-50/80 backdrop-blur-sm border border-white/40 shadow-lg">
      <div className="p-6 text-center">
        <p 
          className="text-3xl md:text-4xl font-arabic leading-loose mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent font-bold"
          style={{
            fontFamily: "'Amiri', serif",
            textShadow: '0 2px 10px rgba(147, 51, 234, 0.3)',
            letterSpacing: '2px'
          }}
        >
          {QURAN_VERSES[currentVerse].text}
        </p>
        <p className="text-gray-600 text-sm mb-4">{QURAN_VERSES[currentVerse].translation}</p>
        <Button
          onClick={changeVerse}
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white border-none hover:from-purple-600 hover:via-pink-600 hover:to-orange-600"
        >
          <RefreshCw className="w-4 h-4 ml-2" />
          آية أخرى
        </Button>
      </div>
    </Card>
  );
}