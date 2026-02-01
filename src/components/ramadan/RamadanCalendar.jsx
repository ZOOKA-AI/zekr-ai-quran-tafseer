import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const RAMADAN_DUAS = {
  sahar: 'اللهم بنية الصيام أصوم غدا من شهر رمضان',
  iftar: 'اللهم إني لك صمت وبك آمنت وعليك توكلت وعلى رزقك أفطرت، فاغفر لي ما قدمت وما أخرت',
  night: 'سبحان الله وبحمده، سبحان الله العظيم'
};

export default function RamadanCalendar() {
  const [day, setDay] = useState(1);
  const [hijriDay, setHijriDay] = useState('');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentDua, setCurrentDua] = useState('sahar');

  useEffect(() => {
    fetchDayInfo(day);
  }, [day]);

  const fetchDayInfo = async (dayNum) => {
    try {
      const currentDate = new Date();
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + dayNum - 1);
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${targetDate.getDate()}-${targetDate.getMonth() + 1}-${targetDate.getFullYear()}?latitude=24.7136&longitude=46.6753&method=4`
      );
      const data = await response.json();
      if (data.code === 200) {
        setPrayerTimes(data.data.timings);
        setHijriDay(`${data.data.hijri.day} رمضان`);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
  };

  const nextDay = () => {
    if (day < 30) setDay(day + 1);
  };

  const prevDay = () => {
    if (day > 1) setDay(day - 1);
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={prevDay}
            disabled={day === 1}
            className="bg-white/20 hover:bg-white/30"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2">اليوم {day}</h2>
            <p className="text-lg opacity-90">{hijriDay}</p>
          </div>
          
          <Button
            onClick={nextDay}
            disabled={day === 30}
            className="bg-white/20 hover:bg-white/30"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      {/* Prayer Times */}
      {prayerTimes && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3"
        >
          {[
            { name: 'الفجر', time: prayerTimes.Fajr, color: 'from-blue-500 to-cyan-500' },
            { name: 'الظهر', time: prayerTimes.Dhuhr, color: 'from-yellow-500 to-orange-500' },
            { name: 'العصر', time: prayerTimes.Asr, color: 'from-orange-500 to-red-500' },
            { name: 'المغرب', time: prayerTimes.Maghrib, color: 'from-purple-500 to-pink-500' },
            { name: 'العشاء', time: prayerTimes.Isha, color: 'from-indigo-600 to-purple-700' }
          ].map((prayer, idx) => (
            <Card key={idx} className={`bg-gradient-to-br ${prayer.color} text-white p-4 shadow-lg`}>
              <p className="text-sm opacity-90 mb-1">{prayer.name}</p>
              <p className="text-2xl font-bold text-center">{prayer.time}</p>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Daily Duas */}
      <Card className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 border-2 border-emerald-300">
        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => setCurrentDua('sahar')}
            className={currentDua === 'sahar' ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-emerald-300 text-gray-900'}
          >
            دعاء السحور
          </Button>
          <Button
            onClick={() => setCurrentDua('iftar')}
            className={currentDua === 'iftar' ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-emerald-300 text-gray-900'}
          >
            دعاء الإفطار
          </Button>
          <Button
            onClick={() => setCurrentDua('night')}
            className={currentDua === 'night' ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-emerald-300 text-gray-900'}
          >
            التسبيح
          </Button>
        </div>

        <motion.div
          key={currentDua}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl p-4 border-2 border-emerald-200"
        >
          <div className="flex gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
            <p className="text-center text-gray-800 text-lg leading-loose font-semibold">
              {RAMADAN_DUAS[currentDua]}
            </p>
          </div>
        </motion.div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 border-2 border-amber-300">
          <p className="text-gray-700 text-sm mb-1">أيام متبقية</p>
          <p className="text-3xl font-bold text-orange-600">{30 - day}</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 border-2 border-purple-300">
          <p className="text-gray-700 text-sm mb-1">نسبة الإنجاز</p>
          <p className="text-3xl font-bold text-purple-600">{Math.round((day / 30) * 100)}%</p>
        </Card>
      </div>
    </div>
  );
}