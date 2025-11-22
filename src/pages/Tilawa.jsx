import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Volume2, VolumeX, Volume1 } from 'lucide-react';
import { toast } from 'sonner';

const RECITERS = {
  khalid_al_jaleel: { name: "خالد الجليل", baseUrl: "https://server8.mp3quran.net/khalid_al_jalil/hafs/" },
  islam_sobhi: { name: "إسلام صبحي", baseUrl: "https://server11.mp3quran.net/islam_sobhi/hafs/" },
  tablawi: { name: "محمد محمود الطبلاوي", baseUrl: "https://server8.mp3quran.net/tablawi/hafs/" },
  husary: { name: "محمود خليل الحصري", baseUrl: "https://server13.mp3quran.net/husary/hafs/" },
  minshawi: { name: "محمد صديق المنشاوي", baseUrl: "https://server10.mp3quran.net/minshawi/hafs/" },
  abdulbasit: { name: "عبد الباسط عبد الصمد", baseUrl: "https://server7.mp3quran.net/basit/hafs/" },
  sudais: { name: "عبد الرحمن السديس", baseUrl: "https://server11.mp3quran.net/sds/hafs/" },
  mishary_alafasy: { name: "مشاري راشد العفاسي", baseUrl: "https://server8.mp3quran.net/afs/hafs/" }
};

const ISTIATHA_URL = "https://server8.mp3quran.net/afs/hafs/001000.mp3";
const BASMALA_URL = "https://server8.mp3quran.net/afs/hafs/001001.mp3";

export default function TilawaPage() {
  const [selectedReciter, setSelectedReciter] = useState("husary");
  const [surahNumber, setSurahNumber] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentSurahName, setCurrentSurahName] = useState('الفاتحة');
  
  const playerRef = useRef(null);
  const playlistRef = useRef([]);
  const indexRef = useRef(0);
  const stoppedByUserRef = useRef(false);

  const SURAHS_INFO = {
    1: { name: 'الفاتحة', verses: 7 },
    2: { name: 'البقرة', verses: 286 },
    18: { name: 'الكهف', verses: 110 },
    36: { name: 'يس', verses: 83 },
    55: { name: 'الرحمن', verses: 78 },
    67: { name: 'الملك', verses: 30 },
    112: { name: 'الإخلاص', verses: 4 },
    113: { name: 'الفلق', verses: 5 },
    114: { name: 'الناس', verses: 6 }
  };

  const playNext = () => {
    if (stoppedByUserRef.current) return;
    if (indexRef.current >= playlistRef.current.length) {
      setIsPlaying(false);
      toast.success('✅ انتهت التلاوة بحمد الله');
      return;
    }

    const url = playlistRef.current[indexRef.current];
    
    if (!playerRef.current) {
      playerRef.current = new Audio();
      playerRef.current.volume = volume / 100;
    }
    
    playerRef.current.src = url;
    playerRef.current.volume = volume / 100;
    playerRef.current.play()
      .catch(err => {
        console.error('خطأ في التشغيل:', err);
        toast.error('حدث خطأ في تشغيل الآية');
      });
    
    playerRef.current.onended = () => {
      indexRef.current++;
      playNext();
    };
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.volume = newVolume / 100;
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      // إيقاف مؤقت
      if (playerRef.current) {
        playerRef.current.pause();
      }
      setIsPlaying(false);
      toast.info('⏸️ تم إيقاف التلاوة مؤقتاً');
    } else if (playerRef.current && playerRef.current.src) {
      // استكمال التشغيل
      playerRef.current.play();
      setIsPlaying(true);
      toast.success('▶️ استكمال التلاوة');
    } else {
      // تشغيل جديد
      const reciter = RECITERS[selectedReciter];
      if (!reciter) {
        toast.error("القارئ غير موجود");
        return;
      }

      const s = Number(surahNumber);
      const surahInfo = SURAHS_INFO[s];
      
      if (!surahInfo) {
        toast.error("اختر سورة من القائمة");
        return;
      }

      setCurrentSurahName(surahInfo.name);
      playlistRef.current = [];
      indexRef.current = 0;
      stoppedByUserRef.current = false;

      // إضافة الاستعاذة
      playlistRef.current.push(ISTIATHA_URL);
      
      // إضافة البسملة إذا لم تكن سورة التوبة
      if (s !== 9) {
        playlistRef.current.push(BASMALA_URL);
      }

      // بناء قائمة التشغيل للسورة كاملة
      for (let a = 1; a <= surahInfo.verses; a++) {
        const surahStr = s.toString().padStart(3, "0");
        const ayahStr = a.toString().padStart(3, "0");
        const url = `${reciter.baseUrl}${surahStr}${ayahStr}.mp3`;
        playlistRef.current.push(url);
      }

      setIsPlaying(true);
      toast.success(`🎧 بدء تلاوة سورة ${surahInfo.name}`);
      playNext();
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return VolumeX;
    if (volume < 50) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 relative overflow-hidden" dir="rtl">
      <style jsx>{`
        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.6), 
                        0 0 80px rgba(16, 185, 129, 0.4),
                        0 0 120px rgba(16, 185, 129, 0.2);
          }
          50% { 
            box-shadow: 0 0 60px rgba(16, 185, 129, 0.8), 
                        0 0 100px rgba(16, 185, 129, 0.6),
                        0 0 150px rgba(16, 185, 129, 0.4);
          }
        }
        @keyframes barcode {
          0% { height: 20%; }
          50% { height: 80%; }
          100% { height: 20%; }
        }
        .glow-button {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        .barcode-line {
          animation: barcode 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* Background Animated Lines (Barcode Effect) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-2 opacity-20">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="barcode-line bg-emerald-400 w-1"
            style={{
              animationDelay: `${i * 0.1}s`,
              height: '40%'
            }}
          />
        ))}
      </div>

      {/* Spotlight Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 min-h-screen flex flex-col justify-center">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl font-arabic">تلاوة القرآن الكريم</h1>
          <p className="text-2xl text-emerald-300">🎧 استمع لكتاب الله بصوت أشهر القراء</p>
        </div>

        {/* Main Stage Card */}
        <Card className="bg-slate-800/40 backdrop-blur-xl border-2 border-emerald-500/30 shadow-2xl overflow-hidden">
          <div className="p-12">
            
            {/* Current Surah Display */}
            {isPlaying && (
              <div className="text-center mb-8 p-6 bg-emerald-500/20 rounded-2xl border-2 border-emerald-400/50">
                <p className="text-emerald-300 text-sm mb-2">جاري التلاوة</p>
                <p className="text-4xl font-bold text-white font-arabic">{currentSurahName}</p>
              </div>
            )}

            {/* Central Play Button - Massive and Glowing */}
            <div className="flex justify-center mb-12">
              <button
                onClick={handlePlayPause}
                className={`w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 
                  hover:from-emerald-400 hover:to-emerald-600 
                  flex items-center justify-center transition-all duration-300 transform hover:scale-110
                  ${isPlaying ? 'glow-button' : 'shadow-2xl'}`}
              >
                {isPlaying ? (
                  <Pause className="w-24 h-24 text-white drop-shadow-2xl" />
                ) : (
                  <Play className="w-24 h-24 text-white drop-shadow-2xl mr-3" />
                )}
              </button>
            </div>

            {/* Volume Control */}
            <div className="mb-8 bg-slate-700/50 rounded-2xl p-6 border border-emerald-500/30">
              <div className="flex items-center gap-4 mb-4">
                <VolumeIcon className="w-8 h-8 text-emerald-400" />
                <span className="text-white text-xl font-bold">مستوى الصوت: {volume}%</span>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleVolumeChange(Math.max(0, volume - 10))}
                  className="flex-1 h-14 bg-slate-600 hover:bg-slate-500 text-white text-xl"
                >
                  خفض 🔉
                </Button>
                <Button
                  onClick={() => handleVolumeChange(Math.min(100, volume + 10))}
                  className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-white text-xl"
                >
                  رفع 🔊
                </Button>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full mt-4 h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to left, #10b981 ${volume}%, #475569 ${volume}%)`
                }}
              />
            </div>

            {/* Reciter Selection */}
            <div className="mb-6">
              <label className="block text-emerald-300 text-lg font-bold mb-3">
                🎙️ اختر القارئ:
              </label>
              <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                <SelectTrigger className="h-16 text-xl border-2 border-emerald-500/50 bg-slate-700/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-emerald-500/50">
                  {Object.entries(RECITERS).map(([id, reciter]) => (
                    <SelectItem key={id} value={id} className="text-white text-lg hover:bg-emerald-600">
                      {reciter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Surahs Selection */}
            <div>
              <label className="block text-emerald-300 text-lg font-bold mb-3">
                📖 اختر السورة:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(SURAHS_INFO).map(([num, info]) => (
                  <Button
                    key={num}
                    variant="outline"
                    onClick={() => {
                      setSurahNumber(Number(num));
                      setCurrentSurahName(info.name);
                      toast.success(`✅ تم اختيار سورة ${info.name}`);
                    }}
                    className={`h-14 text-lg transition-all duration-200
                      ${Number(num) === surahNumber 
                        ? 'bg-emerald-600 text-white border-emerald-400 hover:bg-emerald-500' 
                        : 'bg-slate-700/50 text-white border-emerald-500/30 hover:bg-slate-600'}`}
                  >
                    {info.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Info Footer */}
        <div className="mt-8 text-center">
          <p className="text-emerald-300/70 text-sm">
            ✨ يتم تشغيل السورة كاملة مع الاستعاذة والبسملة تلقائياً
          </p>
        </div>
      </div>
    </div>
  );
}