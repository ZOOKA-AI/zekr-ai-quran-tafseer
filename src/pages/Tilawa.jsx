import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import VoiceController from '../components/tilawa/VoiceController';
import CameraScanner from '../components/tilawa/CameraScanner';
import { trackListen } from '../components/system/ActionTracker';

const RECITERS = {
  husary: { name: "محمود خليل الحصري", baseUrl: "https://server13.mp3quran.net/husary/", description: "أول من سجل القرآن مرتلاً" },
  abdulbasit: { name: "عبد الباسط عبد الصمد", baseUrl: "https://server7.mp3quran.net/basit/", description: "أشهر قراء العالم الإسلامي" },
  minshawi: { name: "محمد صديق المنشاوي", baseUrl: "https://server10.mp3quran.net/minshawi/", description: "صاحب الصوت الشجي" },
  mishary: { name: "مشاري راشد العفاسي", baseUrl: "https://server8.mp3quran.net/afs/", description: "القارئ الكويتي الشهير" },
  sudais: { name: "عبد الرحمن السديس", baseUrl: "https://server11.mp3quran.net/sds/", description: "إمام الحرم المكي" },
  shatri: { name: "أبو بكر الشاطري", baseUrl: "https://server11.mp3quran.net/shatri/", description: "القارئ اليمني المتميز" },
  ajmy: { name: "أحمد العجمي", baseUrl: "https://server10.mp3quran.net/ajm/", description: "صوت مؤثر وخاشع" },
  ghamdi: { name: "سعد الغامدي", baseUrl: "https://server7.mp3quran.net/s_gmd/", description: "من أشهر القراء السعوديين" },
  tablawi: { name: "محمد محمود الطبلاوي", baseUrl: "https://server8.mp3quran.net/tablawi/", description: "القارئ المصري العظيم" },
  jbreen: { name: "محمد جبريل", baseUrl: "https://server11.mp3quran.net/jbreen/", description: "صاحب الأداء القوي" },
  islam_sobhi: { name: "إسلام صبحي", baseUrl: "https://server11.mp3quran.net/islam_sobhi/", description: "القارئ الشاب المتميز" },
  abdulrahman_mosad: { name: "عبدالرحمن مسعد", baseUrl: "https://server10.mp3quran.net/abdulrahman_mosad/", description: "صوت رائع ومبدع" }
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

  const handlePlayPause = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.volume = volume[0] / 100;
        audioRef.current.crossOrigin = "anonymous";
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        toast.info('⏸️ تم إيقاف التلاوة مؤقتاً');
      } else {
        const reciter = RECITERS[selectedReciter];
        const surahStr = selectedSurah.toString().padStart(3, "0");
        const url = `${reciter.baseUrl}${surahStr}.mp3`;
        
        toast.info('🔄 جاري تحميل التلاوة...');
        
        audioRef.current.src = url;
        audioRef.current.volume = volume[0] / 100;
        audioRef.current.crossOrigin = "anonymous";
        
        // إزالة المستمعين القدامى
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        
        // إضافة المستمعين الجدد
        audioRef.current.onended = () => {
          setIsPlaying(false);
          toast.success('✅ انتهت التلاوة');
        };

        audioRef.current.onerror = (err) => {
          console.error('Audio error:', err);
          setIsPlaying(false);
          toast.error('❌ خطأ في تشغيل التلاوة - جرب قارئ آخر');
        };

        audioRef.current.oncanplay = () => {
          const surah = SURAHS.find(s => s.number === selectedSurah);
          toast.success(`🎧 بدأت تلاوة سورة ${surah?.name || selectedSurah}`);
          
          // تسجيل الاستماع
          const reciterName = RECITERS[selectedReciter].name;
          trackListen(`استماع لسورة ${surah?.name} - القارئ ${reciterName}`);
        };
        
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.error('Play error:', err);
              setIsPlaying(false);
              toast.error('❌ حدث خطأ - اضغط مرة أخرى');
            });
        } else {
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.error('Play error:', err);
      setIsPlaying(false);
      toast.error('❌ حدث خطأ - جرب مرة أخرى');
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
          {/* Title with Quranic Verses Rotation */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-4 font-arabic drop-shadow-2xl">
              ﴿ وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا ﴾
            </h1>
            <p className="text-lg text-gray-900 font-bold drop-shadow-lg">استمع بخشوع • تدبر بقلبك • اقرأ بتمعن</p>
          </div>

          {/* Voice Controller & Camera Scanner */}
          <div className="mb-8 grid grid-cols-1 gap-4">
            <VoiceController onCommand={handleVoiceCommand} />
            <div className="text-center">
              <CameraScanner />
            </div>
          </div>

          {/* Main Control Card */}
          <Card className="bg-gradient-to-br from-gray-900/95 via-purple-900/90 to-gray-900/95 backdrop-blur-xl border-2 border-purple-400/60 shadow-2xl">
            <div className="p-8">
              {/* Reciter Selection */}
              <div className="mb-6">
                <label className="block text-white text-lg font-bold mb-3 text-center">
                  🎤 اختر القارئ
                </label>
                <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                  <SelectTrigger className="h-12 text-lg bg-white/90 border-2 border-purple-300 text-gray-900 hover:bg-white transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-purple-300">
                    {Object.entries(RECITERS).map(([id, reciter]) => (
                      <SelectItem key={id} value={id} className="text-gray-900 text-base hover:bg-purple-100">
                        <div>
                          <div className="font-bold">{reciter.name}</div>
                          <div className="text-xs text-gray-600">{reciter.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Surah Selection */}
              <div className="mb-8">
                <label className="block text-white text-lg font-bold mb-3 text-center">
                  📖 اختر السورة
                </label>
                <Select value={selectedSurah.toString()} onValueChange={(v) => setSelectedSurah(Number(v))}>
                  <SelectTrigger className="h-12 text-lg bg-white/90 border-2 border-purple-300 text-gray-900 hover:bg-white transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-purple-300">
                    {SURAHS.map(surah => (
                      <SelectItem key={surah.number} value={surah.number.toString()} className="text-gray-900 text-lg hover:bg-purple-100">
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
                      <div className="w-48 h-48 rounded-full bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30 pulse-ring"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center" style={{animationDelay: '0.5s'}}>
                      <div className="w-48 h-48 rounded-full bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30 pulse-ring"></div>
                    </div>
                  </>
                )}
                <Button
                  onClick={handlePlayPause}
                  className={`relative w-32 h-32 rounded-full text-white font-bold text-xl shadow-2xl transition-all duration-200 hover:scale-105 ${
                    isPlaying 
                      ? 'bg-gradient-to-br from-red-500 to-pink-600' 
                      : 'bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500'
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
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-4 mb-2">
                  <Button 
                    onClick={toggleMute}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-purple-300 hover:bg-white/10 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </Button>
                  <div className="flex-1">
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                  <span className="text-white font-bold text-lg w-12 text-center">
                   {volume[0]}%
                  </span>
                  </div>
                  <p className="text-center text-white font-semibold text-sm">
                  🔊 مستوى الصوت
                  </p>
              </div>
            </div>
          </Card>

          {/* Status Display */}
          {isPlaying && (
            <div className="mt-6 text-center">
              <div className="inline-block bg-white/90 backdrop-blur-sm border border-gray-300 rounded-2xl px-6 py-3">
                <p className="text-gray-900 text-lg font-bold">
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