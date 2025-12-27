import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, SkipBack, SkipForward, Download, Volume2, Gauge } from 'lucide-react';
import { toast } from 'sonner';
import FastCache from '../performance/FastCache';

const RECITERS = [
  { id: 'husary', name: 'محمود خليل الحصري', url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/' },
  { id: 'sudais', name: 'عبد الرحمن السديس', url: 'https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais/' },
  { id: 'minshawi', name: 'محمد صديق المنشاوي', url: 'https://cdn.islamic.network/quran/audio/128/ar.minshawi/' },
  { id: 'alafasy', name: 'مشاري راشد العفاسي', url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/' },
];

export default function AdvancedPlayer({ surah, verses = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [selectedReciter, setSelectedReciter] = useState('husary');
  const [playbackRate, setPlaybackRate] = useState([1]);
  const [volume, setVolume] = useState([80]);
  const [downloaded, setDownloaded] = useState(false);
  
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate[0];
      audioRef.current.volume = volume[0] / 100;
    }
  }, [playbackRate, volume]);

  const loadVerse = (verseIndex) => {
    if (!surah) return;
    
    const reciter = RECITERS.find(r => r.id === selectedReciter);
    const verseNum = verseIndex + 1;
    const audioUrl = `${reciter.url}${surah.toString().padStart(3, '0')}${verseNum.toString().padStart(3, '0')}.mp3`;
    
    // تحقق من الكاش
    const cached = FastCache.get(`audio_${surah}_${verseNum}_${selectedReciter}`);
    
    if (audioRef.current) {
      audioRef.current.src = cached || audioUrl;
      setCurrentVerse(verseIndex);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioRef.current.src) {
        audioRef.current.play();
      } else {
        loadVerse(0);
        setTimeout(() => audioRef.current.play(), 100);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentVerse < verses.length - 1) {
      loadVerse(currentVerse + 1);
      if (isPlaying) {
        setTimeout(() => audioRef.current.play(), 100);
      }
    }
  };

  const handlePrevious = () => {
    if (currentVerse > 0) {
      loadVerse(currentVerse - 1);
      if (isPlaying) {
        setTimeout(() => audioRef.current.play(), 100);
      }
    }
  };

  const handleDownload = async () => {
    if (!surah) return;
    
    toast.loading('جاري تحميل السورة...', { id: 'download' });
    
    const reciter = RECITERS.find(r => r.id === selectedReciter);
    let downloaded = 0;
    
    for (let i = 0; i < verses.length; i++) {
      try {
        const verseNum = i + 1;
        const audioUrl = `${reciter.url}${surah.toString().padStart(3, '0')}${verseNum.toString().padStart(3, '0')}.mp3`;
        
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = () => {
          FastCache.set(`audio_${surah}_${verseNum}_${selectedReciter}`, reader.result, 1000 * 60 * 60 * 24 * 7); // أسبوع
          downloaded++;
          
          if (downloaded === verses.length) {
            toast.success('تم تحميل السورة للاستماع بدون نت!', { id: 'download' });
            setDownloaded(true);
          }
        };
        
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Download error:', err);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentVerse < verses.length - 1) {
        handleNext();
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = () => {
      toast.error('خطأ في تشغيل الآية');
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentVerse, verses]);

  return (
    <Card className="bg-gradient-to-br from-emerald-900/95 via-green-900/90 to-emerald-900/95 backdrop-blur-xl border-2 border-emerald-400/60 shadow-2xl p-8">
      <audio ref={audioRef} />
      
      {/* اختيار القارئ */}
      <div className="mb-6">
        <label className="block text-white text-lg font-bold mb-3 text-center">
          🎤 اختر القارئ
        </label>
        <Select value={selectedReciter} onValueChange={setSelectedReciter}>
          <SelectTrigger className="h-12 text-lg bg-white/90 border-2 border-emerald-300 text-gray-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-emerald-300">
            {RECITERS.map(reciter => (
              <SelectItem key={reciter.id} value={reciter.id} className="text-gray-900 text-base">
                {reciter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* عرض الآية الحالية */}
      {verses.length > 0 && (
        <div className="bg-white/95 rounded-xl p-6 mb-6">
          <p className="text-center text-emerald-600 font-bold mb-2">
            الآية {currentVerse + 1} من {verses.length}
          </p>
          <p className="text-3xl font-arabic text-gray-900 leading-loose text-center">
            {verses[currentVerse]?.text || 'جاري التحميل...'}
          </p>
        </div>
      )}

      {/* أزرار التحكم */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <Button
          onClick={handlePrevious}
          disabled={currentVerse === 0}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          size="lg"
        >
          <SkipBack className="w-6 h-6" />
        </Button>

        <Button
          onClick={handlePlayPause}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500"
        >
          {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentVerse === verses.length - 1}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          size="lg"
        >
          <SkipForward className="w-6 h-6" />
        </Button>
      </div>

      {/* سرعة التشغيل */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-white" />
            <span className="text-white font-bold">السرعة</span>
          </div>
          <span className="text-emerald-300 font-bold">{playbackRate[0]}x</span>
        </div>
        <Slider
          value={playbackRate}
          onValueChange={setPlaybackRate}
          min={0.5}
          max={2}
          step={0.25}
          className="w-full"
        />
      </div>

      {/* مستوى الصوت */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-white" />
            <span className="text-white font-bold">الصوت</span>
          </div>
          <span className="text-emerald-300 font-bold">{volume[0]}%</span>
        </div>
        <Slider
          value={volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* زر التحميل */}
      <Button
        onClick={handleDownload}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
        disabled={downloaded}
      >
        <Download className="w-5 h-5 ml-2" />
        {downloaded ? 'تم التحميل ✓' : 'تحميل السورة للاستماع بدون نت'}
      </Button>
    </Card>
  );
}