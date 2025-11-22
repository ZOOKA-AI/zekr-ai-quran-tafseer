import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import VoiceController from '../components/tilawa/VoiceController';
import QuranVerse from '../components/quran/QuranVerse';
import CameraReader from '../components/camera/CameraReader';

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

  const handleVoiceCommand = ({ reciter, surah, action }) => {
    if (reciter) {
      setSelectedReciter(reciter);
    }
    if (surah) {
      setSelectedSurah(surah);
    }
    if (action === 'play') {
      if (!isPlaying) {
        setTimeout(() => handlePlayPause(), 300);
      }
    } else if (action === 'pause') {
      if (isPlaying) {
        handlePlayPause();
      }
    } else if (action === 'volumeUp') {
      const newVolume = Math.min(100, volume[0] + 20);
      setVolume([newVolume]);
    } else if (action === 'volumeDown') {
      const newVolume = Math.max(0, volume[0] - 20);
      setVolume([newVolume]);
    } else if (action === 'mute') {
      toggleMute();
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
          backgroundPosition: 'center',
          filter: 'brightness(1.2) contrast(1.1)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      
      <style jsx>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(236, 72, 153, 0.4); }
          50% { box-shadow: 0 0 50px rgba(147, 51, 234, 0.8), 0 0 90px rgba(236, 72, 153, 0.6); }
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
            rgba(147, 51, 234, 0.15) 10%,
            rgba(236, 72, 153, 0.2) 20%,
            transparent 25%,
            rgba(59, 130, 246, 0.15) 30%,
            transparent 35%,
            rgba(16, 185, 129, 0.2) 40%,
            transparent 45%,
            rgba(251, 146, 60, 0.15) 50%,
            transparent 55%,
            rgba(147, 51, 234, 0.2) 60%,
            transparent 65%,
            rgba(236, 72, 153, 0.15) 70%,
            transparent 75%,
            rgba(59, 130, 246, 0.2) 80%,
            transparent 90%
          );
          background-size: 200% 100%;
          animation: barcode-slide 3s linear infinite;
          border-top: 2px solid rgba(147, 51, 234, 0.4);
        }
      `}</style>



      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {/* Decorative 3D Crystal Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-400/25 to-pink-600/25 backdrop-blur-sm border border-white/10 shadow-xl animate-float" style={{transform: 'perspective(1000px) rotateY(20deg)', animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-600/30 backdrop-blur-sm border border-white/15 shadow-xl animate-float" style={{transform: 'perspective(1000px) rotateY(-20deg)', animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400/25 to-teal-600/25 backdrop-blur-sm border border-white/10 shadow-xl animate-float" style={{transform: 'perspective(1000px) rotateX(20deg)', animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-10 w-28 h-28 rounded-full bg-gradient-to-br from-orange-400/25 to-red-600/25 backdrop-blur-sm border border-white/15 shadow-xl animate-float" style={{transform: 'perspective(1000px) rotateY(30deg)', animationDelay: '1.5s'}}></div>
        
        <div className="max-w-2xl w-full">
          {/* Quran Verse */}
          <div className="mb-6">
            <QuranVerse />
          </div>

          {/* Camera & Voice Controller */}
          <div className="mb-6 flex gap-4 items-center justify-center flex-wrap">
            <CameraReader />
          </div>

          {/* Voice Controller */}
          <div className="mb-6">
            <VoiceController onCommand={handleVoiceCommand} />
          </div>

          {/* Main Control Card */}
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
            <div className="p-6">
              {/* Reciter Selection */}
              <div className="mb-4">
                <label className="block text-white text-base font-semibold mb-2 text-center">
                  🎤 اختر القارئ
                </label>
                <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                  <SelectTrigger className="h-12 text-lg bg-white/5 border border-white/30 text-white hover:bg-white/10 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-amber-400">
                    {Object.entries(RECITERS).map(([id, reciter]) => (
                      <SelectItem key={id} value={id} className="text-white text-lg hover:bg-amber-600">
                        {reciter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Surah Selection */}
              <div className="mb-6">
                <label className="block text-white text-base font-semibold mb-2 text-center">
                  📖 اختر السورة
                </label>
                <Select value={selectedSurah.toString()} onValueChange={(v) => setSelectedSurah(Number(v))}>
                  <SelectTrigger className="h-12 text-lg bg-white/5 border border-white/30 text-white hover:bg-white/10 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-amber-400">
                    {SURAHS.map(surah => (
                      <SelectItem key={surah.number} value={surah.number.toString()} className="text-white text-lg hover:bg-amber-600">
                        {surah.name} - {surah.verses} آية
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Big Play Button */}
              <div className="relative flex justify-center mb-6">
                {isPlaying && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-36 h-36 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 pulse-ring"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center" style={{animationDelay: '0.5s'}}>
                      <div className="w-36 h-36 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 pulse-ring"></div>
                    </div>
                  </>
                )}
                <Button
                  onClick={handlePlayPause}
                  className={`relative w-32 h-32 rounded-full text-white font-bold text-xl shadow-xl transition-all duration-200 hover:scale-105 ${
                    isPlaying 
                      ? 'bg-gradient-to-br from-red-500 to-red-700 glow-button' 
                      : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 glow-button'
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-16 h-16" />
                  ) : (
                    <Play className="w-16 h-16 mr-2" />
                  )}
                </Button>
              </div>

              {/* Volume Control */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <button 
                    onClick={toggleMute}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
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
                  <span className="text-white font-semibold text-base w-12 text-center">
                    {volume[0]}%
                  </span>
                </div>
                <p className="text-center text-white/60 text-xs">
                  🔊 مستوى الصوت
                </p>
              </div>
            </div>
          </Card>

          {/* Status Display */}
          {isPlaying && (
            <div className="mt-4 text-center">
              <div className="inline-block bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-3">
                <p className="text-white text-lg font-semibold">
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