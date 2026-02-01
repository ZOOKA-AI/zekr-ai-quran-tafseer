import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Radio as RadioIcon, Play, Pause, Volume2, VolumeX, Music, Mic, Bell } from 'lucide-react';
import { toast } from 'sonner';
import SpiritualBackground from '@/components/layout/SpiritualBackground';
import AdhanPlayer from '@/components/adhan/AdhanPlayer';
import MubtahileenLibrary from '@/components/ibtihaal/MubtahileenLibrary';

// محطات الراديو المحدثة
const RADIO_STATIONS = [
  {
    id: 'quran_egypt',
    name: 'إذاعة القرآن الكريم - مصر',
    url: 'https://n0a.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABfVqHTbMAGYyZ0h4o1yjKfQ',
    country: '🇪🇬',
    category: 'quran',
    description: 'القرآن الكريم 24/7',
    featured: true
  },
  {
    id: 'quran_saudi',
    name: 'إذاعة القرآن - السعودية',
    url: 'https://stream.radiojar.com/4wqre23fytzuv',
    country: '🇸🇦',
    category: 'quran',
    description: 'من المملكة العربية السعودية'
  },
  {
    id: 'makkah_live',
    name: 'بث مباشر - الحرم المكي',
    url: 'https://qurango.net/radio/tarateel',
    country: '🕋',
    category: 'haram',
    description: 'صوت الحرم المكي الشريف',
    featured: true
  },
  {
    id: 'madinah_live',
    name: 'بث مباشر - المسجد النبوي',
    url: 'https://qurango.net/radio/tarateel',
    country: '🕌',
    category: 'haram',
    description: 'صوت المسجد النبوي الشريف'
  },
  {
    id: 'tafseer',
    name: 'راديو التفسير',
    url: 'https://qurango.net/radio/tafseer',
    country: '📖',
    category: 'tafseer',
    description: 'شروحات وتفسير القرآن'
  },
  {
    id: 'nidaa',
    name: 'إذاعة نداء الإسلام',
    url: 'https://qurango.net/radio/nidaaislam',
    country: '🌙',
    category: 'lectures',
    description: 'محاضرات وخطب دينية'
  },
  {
    id: 'tilawa',
    name: 'راديو التلاوات',
    url: 'https://qurango.net/radio/tilawa',
    country: '🎧',
    category: 'quran',
    description: 'تلاوات خاشعة متنوعة'
  },
  {
    id: 'azhari',
    name: 'صوت الأزهر الشريف',
    url: 'https://stream.radiojar.com/cqw3bxv8hruv',
    country: '🇪🇬',
    category: 'lectures',
    description: 'من الأزهر الشريف'
  }
];

export default function RadioPage() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('radio');
  const audioRef = useRef(null);

  const handlePlayPause = async (station) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      if (selectedStation?.id === station.id && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        toast.info('⏸️ تم إيقاف البث');
      } else {
        audioRef.current.src = station.url;
        audioRef.current.volume = volume[0] / 100;
        await audioRef.current.play();
        setSelectedStation(station);
        setIsPlaying(true);
        toast.success(`📻 ${station.name}`);
      }
    } catch (err) {
      toast.error('تعذر التشغيل - تحقق من الاتصال');
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0] / 100;
    }
  };

  return (
    <SpiritualBackground backgroundId="ramadan_moon">
      <div className="min-h-screen p-4 md:p-8" dir="rtl">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <RadioIcon className="w-12 h-12 text-amber-400 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                الراديو الإسلامي
              </h1>
            </div>
            <p className="text-purple-300 text-lg">استمع للقرآن والابتهالات والأذان</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full bg-slate-800/50 border border-slate-700 p-1 flex justify-center gap-1">
              <TabsTrigger value="radio" className="data-[state=active]:bg-purple-600 gap-2">
                <RadioIcon className="w-4 h-4" /> الإذاعات
              </TabsTrigger>
              <TabsTrigger value="adhan" className="data-[state=active]:bg-purple-600 gap-2">
                <Bell className="w-4 h-4" /> المؤذن
              </TabsTrigger>
              <TabsTrigger value="ibtihaal" className="data-[state=active]:bg-purple-600 gap-2">
                <Music className="w-4 h-4" /> المبتهلين
              </TabsTrigger>
            </TabsList>

            {/* Radio Stations Tab */}
            <TabsContent value="radio">
              {/* Now Playing */}
              {selectedStation && isPlaying && (
                <Card className="bg-gradient-to-br from-emerald-900/80 to-teal-900/80 border-2 border-emerald-500/50 p-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl animate-pulse">{selectedStation.country}</div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white">{selectedStation.name}</h2>
                      <p className="text-emerald-300">{selectedStation.description}</p>
                    </div>
                    <Button
                      onClick={() => handlePlayPause(selectedStation)}
                      className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700"
                    >
                      <Pause className="w-8 h-8" />
                    </Button>
                  </div>
                  
                  {/* Volume Control */}
                  <div className="mt-4 flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setIsMuted(!isMuted);
                        if (audioRef.current) audioRef.current.muted = !isMuted;
                      }}
                      className="text-white"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <Slider
                      value={volume}
                      onValueChange={handleVolumeChange}
                      max={100}
                      className="flex-1"
                    />
                    <span className="text-white w-12 text-center">{volume[0]}%</span>
                  </div>
                </Card>
              )}

              {/* Featured Stations */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-amber-400 mb-4">⭐ المحطات المميزة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {RADIO_STATIONS.filter(s => s.featured).map(station => (
                    <Card
                      key={station.id}
                      onClick={() => handlePlayPause(station)}
                      className={`cursor-pointer p-6 transition-all ${
                        selectedStation?.id === station.id && isPlaying
                          ? 'bg-emerald-800/60 border-emerald-400 scale-105'
                          : 'bg-slate-800/60 border-slate-600/50 hover:bg-slate-700/60 hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{station.country}</div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white">{station.name}</h4>
                          <p className="text-gray-400">{station.description}</p>
                        </div>
                        <Button
                          size="icon"
                          className={selectedStation?.id === station.id && isPlaying
                            ? 'bg-red-600'
                            : 'bg-emerald-600'
                          }
                        >
                          {selectedStation?.id === station.id && isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* All Stations */}
              <h3 className="text-xl font-bold text-white mb-4">📻 جميع المحطات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {RADIO_STATIONS.map(station => (
                  <Card
                    key={station.id}
                    onClick={() => handlePlayPause(station)}
                    className={`cursor-pointer p-4 transition-all ${
                      selectedStation?.id === station.id && isPlaying
                        ? 'bg-emerald-800/60 border-emerald-400'
                        : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{station.country}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-sm">{station.name}</h4>
                        <p className="text-gray-400 text-xs">{station.description}</p>
                      </div>
                      {selectedStation?.id === station.id && isPlaying ? (
                        <Badge className="bg-emerald-600">يعمل</Badge>
                      ) : (
                        <Play className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Adhan Tab */}
            <TabsContent value="adhan">
              <AdhanPlayer />
            </TabsContent>

            {/* Ibtihaal Tab */}
            <TabsContent value="ibtihaal">
              <MubtahileenLibrary />
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <Card className="mt-8 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-amber-500/30 p-6 text-center">
            <p className="text-amber-200">
              🤲 اللهم اجعلنا من أهل القرآن وخاصته
            </p>
          </Card>
        </div>
      </div>
    </SpiritualBackground>
  );
}