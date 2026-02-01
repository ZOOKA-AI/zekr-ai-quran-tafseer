import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, SkipBack, SkipForward, Download, Volume2, Gauge } from 'lucide-react';
import { toast } from 'sonner';
import FastCache from '../performance/FastCache';

const RECITERS = [
  { id: 'husary', name: 'محمود خليل الحصري', url: 'https://cdn.islamic.network/quran/audio/{quality}/ar.alafasy/' },
  { id: 'sudais', name: 'عبد الرحمن السديس', url: 'https://cdn.islamic.network/quran/audio/{quality}/ar.abdurrahmaansudais/' },
  { id: 'minshawi', name: 'محمد صديق المنشاوي', url: 'https://cdn.islamic.network/quran/audio/{quality}/ar.minshawi/' },
  { id: 'alafasy', name: 'مشاري راشد العفاسي', url: 'https://cdn.islamic.network/quran/audio/{quality}/ar.alafasy/' },
];

const QUALITY_OPTIONS = [
  { id: '64', name: 'جودة منخفضة (64kbps)', size: '~500KB' },
  { id: '128', name: 'جودة متوسطة (128kbps)', size: '~1MB' },
  { id: '192', name: 'جودة عالية (192kbps)', size: '~1.5MB' },
];

export default function AdvancedPlayer({ surah, verses = [] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [selectedReciter, setSelectedReciter] = useState('husary');
  const [playbackRate, setPlaybackRate] = useState([1]);
  const [volume, setVolume] = useState([80]);
  const [downloaded, setDownloaded] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('128');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  
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
    const baseUrl = reciter.url.replace('{quality}', selectedQuality);
    const audioUrl = `${baseUrl}${surah.toString().padStart(3, '0')}${verseNum.toString().padStart(3, '0')}.mp3`;
    
    // تحقق من الكاش
    const cached = FastCache.get(`audio_${surah}_${verseNum}_${selectedReciter}_${selectedQuality}`);
    
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
    if (!surah || isDownloading) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    toast.loading('جاري تحميل السورة...', { id: 'download' });
    
    const reciter = RECITERS.find(r => r.id === selectedReciter);
    const baseUrl = reciter.url.replace('{quality}', selectedQuality);
    let downloadedCount = 0;
    
    for (let i = 0; i < verses.length; i++) {
      try {
        const verseNum = i + 1;
        const audioUrl = `${baseUrl}${surah.toString().padStart(3, '0')}${verseNum.toString().padStart(3, '0')}.mp3`;
        
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = () => {
          FastCache.set(`audio_${surah}_${verseNum}_${selectedReciter}_${selectedQuality}`, reader.result, 1000 * 60 * 60 * 24 * 30); // شهر
          downloadedCount++;
          
          const progress = Math.round((downloadedCount / verses.length) * 100);
          setDownloadProgress(progress);
          
          if (downloadedCount === verses.length) {
            toast.success('✅ تم تحميل السورة بنجاح!', { id: 'download' });
            setDownloaded(true);
            setIsDownloading(false);
            
            // حفظ حالة التحميل
            const downloadedSurahs = JSON.parse(localStorage.getItem('downloadedSurahs') || '[]');
            downloadedSurahs.push({ surah, reciter: selectedReciter, quality: selectedQuality });
            localStorage.setItem('downloadedSurahs', JSON.stringify(downloadedSurahs));
          }
        };
        
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Download error:', err);
        toast.error('خطأ في التحميل', { id: 'download' });
        setIsDownloading(false);
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
        <div className="bg-gradient-to-br from-white via-emerald-50 to-white rounded-2xl p-8 mb-6 shadow-xl border-2 border-emerald-300">
          <div className="text-center mb-4">
            <div className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-full font-bold shadow-lg">
              الآية {currentVerse + 1} من {verses.length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-inner">
            <p className="text-4xl font-arabic text-gray-900 leading-loose text-center mb-4">
              {verses[currentVerse]?.text || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
            </p>
            {isPlaying && (
              <div className="flex justify-center">
                <div className="flex gap-2">
                  <div className="w-2 h-8 bg-emerald-500 rounded animate-pulse" style={{animationDelay: '0ms'}} />
                  <div className="w-2 h-8 bg-emerald-500 rounded animate-pulse" style={{animationDelay: '100ms'}} />
                  <div className="w-2 h-8 bg-emerald-500 rounded animate-pulse" style={{animationDelay: '200ms'}} />
                  <div className="w-2 h-8 bg-emerald-500 rounded animate-pulse" style={{animationDelay: '300ms'}} />
                </div>
              </div>
            )}
          </div>
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

      {/* خيارات الجودة */}
      <div className="mb-6">
        <label className="block text-white font-bold mb-3 text-center">
          📊 جودة التحميل
        </label>
        <Select value={selectedQuality} onValueChange={setSelectedQuality}>
          <SelectTrigger className="bg-white/90 border-2 border-emerald-300 text-gray-900">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {QUALITY_OPTIONS.map(quality => (
              <SelectItem key={quality.id} value={quality.id} className="text-gray-900">
                {quality.name} - {quality.size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* زر التحميل */}
      <div className="space-y-3">
        <Button
          onClick={handleDownload}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white h-14 text-lg"
          disabled={downloaded || isDownloading}
        >
          <Download className="w-6 h-6 ml-2" />
          {isDownloading ? `جاري التحميل... ${downloadProgress}%` : downloaded ? 'تم التحميل ✓' : 'تحميل السورة للاستماع بدون نت'}
        </Button>
        
        {isDownloading && (
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-green-500 h-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        )}
        
        {downloaded && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-center">
            <p className="text-green-700 font-bold">✅ السورة محفوظة - يمكنك الاستماع بدون إنترنت</p>
          </div>
        )}
      </div>
    </Card>
  );
}