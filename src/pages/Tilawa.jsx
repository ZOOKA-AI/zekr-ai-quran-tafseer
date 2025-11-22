import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

const RECITERS = {
  husary: { name: "محمود خليل الحصري", baseUrl: "https://server13.mp3quran.net/husary/" },
  abdulbasit: { name: "عبد الباسط عبد الصمد", baseUrl: "https://server7.mp3quran.net/basit/" },
  minshawi: { name: "محمد صديق المنشاوي", baseUrl: "https://server10.mp3quran.net/minshawi/" },
  mishary: { name: "مشاري راشد العفاسي", baseUrl: "https://server8.mp3quran.net/afs/" },
  sudais: { name: "عبد الرحمن السديس", baseUrl: "https://server11.mp3quran.net/sds/" },
  khalid: { name: "خالد الجليل", baseUrl: "https://server8.mp3quran.net/khalid_al_jalil/" },
  tablawi: { name: "محمد محمود الطبلاوي", baseUrl: "https://server8.mp3quran.net/tablawi/" },
  islam: { name: "إسلام صبحي", baseUrl: "https://server11.mp3quran.net/islam_sobhi/" }
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
  const [selectedReciter, setSelectedReciter] = useState("husary");
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    audioRef.current.volume = volume[0] / 100;
  }, [volume]);

  const handlePlayPause = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      toast.info('تم إيقاف التلاوة مؤقتاً');
    } else {
      const reciter = RECITERS[selectedReciter];
      const surahStr = selectedSurah.toString().padStart(3, "0");
      const url = `${reciter.baseUrl}${surahStr}.mp3`;
      
      audioRef.current.src = url;
      audioRef.current.volume = volume[0] / 100;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          const surah = SURAHS.find(s => s.number === selectedSurah);
          toast.success(`🎧 بدأت تلاوة سورة ${surah?.name || selectedSurah}`);
        })
        .catch(err => {
          toast.error('خطأ في تشغيل التلاوة');
          console.error(err);
        });

      audioRef.current.onended = () => {
        setIsPlaying(false);
        toast.success('انتهت التلاوة');
      };
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 relative overflow-hidden" dir="rtl">
      <style jsx>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6), 0 0 80px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 60px rgba(16, 185, 129, 0.9), 0 0 120px rgba(16, 185, 129, 0.6); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes barcode-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .glow-button { animation: glow 2s ease-in-out infinite; }
        .pulse-ring { animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .barcode-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(to right, 
            transparent 0%,
            rgba(16, 185, 129, 0.1) 10%,
            rgba(16, 185, 129, 0.3) 20%,
            transparent 25%,
            rgba(16, 185, 129, 0.2) 30%,
            transparent 35%,
            rgba(16, 185, 129, 0.4) 40%,
            transparent 45%,
            rgba(16, 185, 129, 0.1) 50%,
            transparent 55%,
            rgba(16, 185, 129, 0.3) 60%,
            transparent 65%,
            rgba(16, 185, 129, 0.2) 70%,
            transparent 75%,
            rgba(16, 185, 129, 0.1) 80%,
            transparent 90%
          );
          background-size: 200% 100%;
          animation: barcode-slide 3s linear infinite;
          border-top: 2px solid rgba(16, 185, 129, 0.5);
        }
        .spotlight {
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(ellipse at center, rgba(251, 191, 36, 0.3) 0%, transparent 70%);
          pointer-events: none;
        }
      `}</style>

      {/* Spotlight Effect */}
      <div className="spotlight"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl font-arabic">
              🎧 استمع للقرآن الكريم
            </h1>
            <p className="text-2xl text-emerald-300">اختر القارئ والسورة واستمع بخشوع</p>
          </div>

          {/* Main Control Card */}
          <Card className="bg-white/5 backdrop-blur-xl border-2 border-emerald-400/50 shadow-2xl">
            <div className="p-8">
              {/* Reciter Selection */}
              <div className="mb-6">
                <label className="block text-emerald-300 text-lg font-bold mb-3 text-center">
                  🎤 اختر القارئ
                </label>
                <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                  <SelectTrigger className="h-14 text-xl bg-white/10 border-2 border-emerald-400/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-emerald-400">
                    {Object.entries(RECITERS).map(([id, reciter]) => (
                      <SelectItem key={id} value={id} className="text-white text-lg hover:bg-emerald-600">
                        {reciter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Surah Selection */}
              <div className="mb-8">
                <label className="block text-emerald-300 text-lg font-bold mb-3 text-center">
                  📖 اختر السورة
                </label>
                <Select value={selectedSurah.toString()} onValueChange={(v) => setSelectedSurah(Number(v))}>
                  <SelectTrigger className="h-14 text-xl bg-white/10 border-2 border-emerald-400/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-emerald-400">
                    {SURAHS.map(surah => (
                      <SelectItem key={surah.number} value={surah.number.toString()} className="text-white text-lg hover:bg-emerald-600">
                        {surah.name} - {surah.verses} آية
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Big Play Button */}
              <div className="relative flex justify-center mb-8">
                {isPlaying && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full bg-emerald-500/30 pulse-ring"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center" style={{animationDelay: '0.5s'}}>
                      <div className="w-48 h-48 rounded-full bg-emerald-500/30 pulse-ring"></div>
                    </div>
                  </>
                )}
                <Button
                  onClick={handlePlayPause}
                  className={`relative w-40 h-40 rounded-full text-white font-bold text-2xl shadow-2xl transition-all duration-300 hover:scale-110 ${
                    isPlaying 
                      ? 'bg-gradient-to-br from-red-500 to-red-700 glow-button' 
                      : 'bg-gradient-to-br from-emerald-500 to-emerald-700 glow-button'
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-20 h-20" />
                  ) : (
                    <Play className="w-20 h-20 mr-2" />
                  )}
                </Button>
              </div>

              {/* Volume Control */}
              <div className="bg-white/5 rounded-2xl p-6 border border-emerald-400/30">
                <div className="flex items-center gap-4 mb-3">
                  <button 
                    onClick={toggleMute}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                  </button>
                  <div className="flex-1">
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                  <span className="text-emerald-300 font-bold text-xl w-12 text-center">
                    {volume[0]}%
                  </span>
                </div>
                <p className="text-center text-emerald-300/70 text-sm">
                  🔊 مستوى الصوت
                </p>
              </div>
            </div>
          </Card>

          {/* Status Display */}
          {isPlaying && (
            <div className="mt-6 text-center">
              <div className="inline-block bg-emerald-500/20 backdrop-blur-sm border-2 border-emerald-400/50 rounded-2xl px-8 py-4">
                <p className="text-emerald-300 text-xl font-bold">
                  🎵 جاري التشغيل...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animated Barcode at Bottom */}
      <div className="barcode-line"></div>
    </div>
  );
}