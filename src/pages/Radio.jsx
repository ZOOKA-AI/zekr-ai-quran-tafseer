import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radio as RadioIcon, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const RADIO_STATIONS = [
  {
    name: 'إذاعة القرآن الكريم - مصر',
    url: 'https://n0a.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABfVqHTbMAGYyZ0h4o1yjKfQ',
    country: '🇪🇬',
    description: 'القرآن الكريم 24/7'
  },
  {
    name: 'إذاعة القرآن الكريم - السعودية',
    url: 'https://qurango.net/radio/tarateel',
    country: '🇸🇦',
    description: 'إذاعة القرآن الكريم من المملكة'
  },
  {
    name: 'راديو الحرم - مكة المكرمة',
    url: 'https://qurango.net/radio/tarateel',
    country: '🕋',
    description: 'البث المباشر من الحرم المكي'
  },
  {
    name: 'راديو المسجد النبوي',
    url: 'https://qurango.net/radio/tarateel',
    country: '🕌',
    description: 'البث المباشر من المسجد النبوي'
  },
  {
    name: 'إذاعة نداء الإسلام',
    url: 'https://qurango.net/radio/nidaaislam',
    country: '🌙',
    description: 'محاضرات وخطب دينية'
  },
  {
    name: 'راديو التفسير',
    url: 'https://qurango.net/radio/tafseer',
    country: '📖',
    description: 'تفسير القرآن الكريم'
  }
];

export default function RadioPage() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const handlePlayPause = async (station) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      if (selectedStation?.url === station.url && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        toast.info('⏸️ تم إيقاف البث');
      } else {
        audioRef.current.src = station.url;
        audioRef.current.volume = volume[0] / 100;
        await audioRef.current.play();
        setSelectedStation(station);
        setIsPlaying(true);
        toast.success(`📻 جاري بث ${station.name}`);
      }
    } catch (err) {
      console.error('Play error:', err);
      toast.error('❌ تعذر التشغيل - تحقق من الاتصال بالإنترنت');
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0] / 100;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1920)',
          filter: 'brightness(0.3)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-cyan-900/80" />

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <RadioIcon className="w-12 h-12 text-amber-400 animate-pulse" />
              <h1 className="text-6xl font-bold text-gray-900 font-arabic drop-shadow-xl">
                الراديو الإسلامي
              </h1>
            </div>
            <p className="text-gray-900 text-xl font-arabic font-bold drop-shadow-lg">استمع للقرآن الكريم والمحاضرات الدينية</p>
          </div>

          {/* Current Playing */}
          {selectedStation && (
            <Card className="bg-gradient-to-br from-gray-900/90 to-purple-900/70 backdrop-blur-2xl border-2 border-amber-400/50 shadow-2xl mb-8">
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{selectedStation.country}</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 font-arabic">{selectedStation.name}</h2>
                  <p className="text-gray-800 font-arabic font-semibold">{selectedStation.description}</p>
                </div>

                <div className="flex items-center justify-center gap-6 mb-6">
                  <Button
                    onClick={() => handlePlayPause(selectedStation)}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                  >
                    {isPlaying ? (
                      <Pause className="w-12 h-12 text-white" />
                    ) : (
                      <Play className="w-12 h-12 text-white mr-2" />
                    )}
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={toggleMute}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>
                    <div className="flex-1">
                      <Slider
                        value={volume}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="cursor-pointer"
                      />
                    </div>
                    <span className="text-gray-900 font-bold text-lg w-12 text-center">
                      {volume[0]}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Stations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RADIO_STATIONS.map((station, idx) => (
              <Card
                key={idx}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedStation?.url === station.url && isPlaying
                    ? 'bg-gradient-to-br from-emerald-600 to-green-600 border-4 border-amber-400 shadow-2xl'
                    : 'bg-gray-800/70 backdrop-blur-xl border-2 border-purple-400/30 hover:border-purple-400/60'
                }`}
                onClick={() => handlePlayPause(station)}
              >
                <div className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">{station.country}</div>
                    <h3 className={`text-xl font-bold mb-2 font-arabic ${
                      selectedStation?.url === station.url && isPlaying ? 'text-white' : 'text-gray-200'
                    }`}>
                      {station.name}
                    </h3>
                    <p className={`text-sm font-arabic ${
                      selectedStation?.url === station.url && isPlaying ? 'text-amber-200' : 'text-gray-400'
                    }`}>
                      {station.description}
                    </p>
                  </div>

                  <Button
                    className={`w-full ${
                      selectedStation?.url === station.url && isPlaying
                        ? 'bg-white text-emerald-600 hover:bg-gray-100'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                    }`}
                  >
                    {selectedStation?.url === station.url && isPlaying ? (
                      <>
                        <Pause className="w-5 h-5 ml-2" />
                        إيقاف
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 ml-2" />
                        تشغيل
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Footer Info */}
          <Card className="bg-gradient-to-r from-amber-600/30 to-orange-600/30 border-2 border-amber-400/50 mt-8">
            <div className="p-6 text-center">
              <p className="text-amber-200 text-lg font-arabic leading-relaxed">
                📻 استمع للقرآن الكريم والمحاضرات الدينية من أفضل الإذاعات الإسلامية<br/>
                اللهم اجعلنا من أهل القرآن وخاصته
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}