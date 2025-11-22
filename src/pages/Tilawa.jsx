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
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Kaaba Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6920cdfd512838f4a35374d8/ad390f8ea_21da07e84f2006654e384d2924c664b1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <style jsx>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.8), 0 0 80px rgba(251, 191, 36, 0.5); }
          50% { box-shadow: 0 0 60px rgba(251, 191, 36, 1), 0 0 120px rgba(251, 191, 36, 0.7); }
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
            rgba(251, 191, 36, 0.1) 10%,
            rgba(251, 191, 36, 0.3) 20%,
            transparent 25%,
            rgba(251, 191, 36, 0.2) 30%,
            transparent 35%,
            rgba(251, 191, 36, 0.4) 40%,
            transparent 45%,
            rgba(251, 191, 36, 0.1) 50%,
            transparent 55%,
            rgba(251, 191, 36, 0.3) 60%,
            transparent 65%,
            rgba(251, 191, 36, 0.2) 70%,
            transparent 75%,
            rgba(251, 191, 36, 0.1) 80%,
            transparent 90%
          );
          background-size: 200% 100%;
          animation: barcode-slide 3s linear infinite;
          border-top: 2px solid rgba(251, 191, 36, 0.6);
        }
      `}</style>



      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {/* Decorative 3D Crystal Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-600/30 backdrop-blur-sm border-2 border-white/20 shadow-2xl animate-float" style={{transform: 'perspective(1000px) rotateY(20deg)', animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/40 to-orange-600/40 backdrop-blur-sm border-2 border-white/30 shadow-2xl animate-float" style={{transform: 'perspective(1000px) rotateY(-20deg)', animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-600/30 backdrop-blur-sm border-2 border-white/20 shadow-2xl animate-float" style={{transform: 'perspective(1000px) rotateX(20deg)', animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-10 w-28 h-28 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-600/30 backdrop-blur-sm border-2 border-white/25 shadow-2xl animate-float" style={{transform: 'perspective(1000px) rotateY(30deg)', animationDelay: '1.5s'}}></div>
        
        <div className="max-w-2xl w-full relative" style={{transform: 'perspective(1500px) rotateX(2deg)'}}>
          {/* Title */}
          <div className="text-center mb-12 bg-black/80 backdrop-blur-xl border-2 border-amber-400/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden" style={{transform: 'translateZ(50px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(251, 191, 36, 0.3), inset 0 0 60px rgba(251, 191, 36, 0.1)'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-600/10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            <div className="relative z-10">
              <h1 className="text-6xl font-bold text-white mb-4 font-arabic" style={{textShadow: '0 0 30px rgba(251, 191, 36, 0.8), 0 4px 20px rgba(0,0,0,0.8)'}}>
                🎧 استمع للقرآن الكريم
              </h1>
              <p className="text-2xl text-amber-300" style={{textShadow: '0 0 20px rgba(251, 191, 36, 0.6)'}}>اختر القارئ والسورة واستمع بخشوع</p>
            </div>
          </div>

          {/* Main Control Card */}
          <Card className="bg-black/70 backdrop-blur-xl border-2 border-amber-400/60 shadow-2xl relative overflow-hidden" style={{transform: 'translateZ(30px)', boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(251, 191, 36, 0.3), inset 0 0 40px rgba(251, 191, 36, 0.05)'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-600/5"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl"></div>
            <div className="p-8 relative z-10">
              {/* Reciter Selection */}
              <div className="mb-6">
                <label className="block text-amber-300 text-lg font-bold mb-3 text-center">
                  🎤 اختر القارئ
                </label>
                <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                  <SelectTrigger className="h-14 text-xl bg-black/50 border-2 border-amber-400/60 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-amber-400">
                    {Object.entries(RECITERS).map(([id, reciter]) => (
                      <SelectItem key={id} value={id} className="text-white text-lg hover:bg-amber-600">
                        {reciter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Surah Selection */}
              <div className="mb-8">
                <label className="block text-amber-300 text-lg font-bold mb-3 text-center">
                  📖 اختر السورة
                </label>
                <Select value={selectedSurah.toString()} onValueChange={(v) => setSelectedSurah(Number(v))}>
                  <SelectTrigger className="h-14 text-xl bg-black/50 border-2 border-amber-400/60 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-amber-400">
                    {SURAHS.map(surah => (
                      <SelectItem key={surah.number} value={surah.number.toString()} className="text-white text-lg hover:bg-amber-600">
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
                      <div className="w-48 h-48 rounded-full bg-amber-500/30 pulse-ring"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center" style={{animationDelay: '0.5s'}}>
                      <div className="w-48 h-48 rounded-full bg-amber-500/30 pulse-ring"></div>
                    </div>
                  </>
                )}
                <Button
                  onClick={handlePlayPause}
                  className={`relative w-40 h-40 rounded-full text-white font-bold text-2xl shadow-2xl transition-all duration-300 hover:scale-110 ${
                    isPlaying 
                      ? 'bg-gradient-to-br from-red-500 to-red-700 glow-button' 
                      : 'bg-gradient-to-br from-amber-500 to-amber-700 glow-button'
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
              <div className="bg-black/50 rounded-2xl p-6 border border-amber-400/50">
                <div className="flex items-center gap-4 mb-3">
                  <button 
                    onClick={toggleMute}
                    className="text-amber-400 hover:text-amber-300 transition-colors"
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
                  <span className="text-amber-300 font-bold text-xl w-12 text-center">
                    {volume[0]}%
                  </span>
                </div>
                <p className="text-center text-amber-300/70 text-sm">
                  🔊 مستوى الصوت
                </p>
              </div>
            </div>
          </Card>

          {/* Status Display */}
          {isPlaying && (
            <div className="mt-6 text-center">
              <div className="inline-block bg-black/70 backdrop-blur-sm border-2 border-amber-400/60 rounded-2xl px-8 py-4 relative overflow-hidden" style={{transform: 'translateZ(20px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(251, 191, 36, 0.3), inset 0 0 30px rgba(251, 191, 36, 0.1)'}}>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-600/10"></div>
                <p className="text-amber-300 text-xl font-bold relative z-10" style={{textShadow: '0 0 20px rgba(251, 191, 36, 0.6)'}}>
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