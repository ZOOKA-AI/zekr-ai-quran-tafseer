import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, SkipBack, SkipForward, Download, Volume2, Gauge, Heart, Clock, BookOpen, StickyNote, Eye, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import FastCache from '../performance/FastCache';
import { FavoritesManager } from '../favorites/FavoritesManager';
import ShareTilawaButton from '../social/ShareTilawaButton';
import SmartReaderSettings from './SmartReaderSettings';

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
  
  // ميزات جديدة
  const [startVerse, setStartVerse] = useState(1);
  const [endVerse, setEndVerse] = useState(verses.length);
  const [showTimer, setShowTimer] = useState(false);
  const [timerDuration, setTimerDuration] = useState(15);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [verseNotes, setVerseNotes] = useState({});
  const [currentNote, setCurrentNote] = useState('');
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTafsir, setShowTafsir] = useState(false);
  const [repeatCount, setRepeatCount] = useState(1);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  const [showSmartSettings, setShowSmartSettings] = useState(false);
  const [smartSettings, setSmartSettings] = useState({
    playback_speed: 1,
    recitation_style: 'ترتيل',
    ayah_by_ayah_mode: false,
    repeat_count: 1,
    auto_scroll: true,
    pause_between_ayahs: 0
  });
  const [ayahRepeat, setAyahRepeat] = useState(0);
  
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = smartSettings.playback_speed;
      audioRef.current.volume = volume[0] / 100;
    }
  }, [smartSettings.playback_speed, volume]);

  useEffect(() => {
    const key = `playback_settings_${selectedReciter}_${surah}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setSmartSettings(JSON.parse(saved));
    }
  }, [selectedReciter, surah]);

  // مؤقت التلاوة
  useEffect(() => {
    if (showTimer && timeRemaining > 0 && isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handlePlayPause();
            toast.info('⏰ انتهى وقت التلاوة');
            setShowTimer(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [showTimer, timeRemaining, isPlaying]);

  // حفظ الملاحظات
  useEffect(() => {
    const saved = localStorage.getItem('verse_notes');
    if (saved) {
      setVerseNotes(JSON.parse(saved));
    }
  }, []);

  const saveNote = () => {
    if (!currentNote.trim()) return;
    const key = `${surah}_${currentVerse + 1}`;
    const updated = { ...verseNotes, [key]: currentNote };
    setVerseNotes(updated);
    localStorage.setItem('verse_notes', JSON.stringify(updated));
    toast.success('💾 تم حفظ الملاحظة');
    setCurrentNote('');
  };

  const startTimer = () => {
    setTimeRemaining(timerDuration * 60);
    setShowTimer(true);
    toast.success(`⏰ تم ضبط المؤقت على ${timerDuration} دقيقة`);
  };

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
    const maxVerse = Math.min(endVerse - 1, verses.length - 1);
    if (currentVerse < maxVerse) {
      loadVerse(currentVerse + 1);
      if (isPlaying) {
        setTimeout(() => audioRef.current.play(), 100);
      }
    } else if (currentRepeat < repeatCount - 1) {
      setCurrentRepeat(currentRepeat + 1);
      loadVerse(startVerse - 1);
      if (isPlaying) {
        setTimeout(() => audioRef.current.play(), 100);
      }
    } else {
      setIsPlaying(false);
      setCurrentRepeat(0);
    }
  };

  const handlePrevious = () => {
    const minVerse = startVerse - 1;
    if (currentVerse > minVerse) {
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

    const handleEnded = async () => {
      if (smartSettings.ayah_by_ayah_mode) {
        if (ayahRepeat < smartSettings.repeat_count - 1) {
          setAyahRepeat(prev => prev + 1);
          if (smartSettings.pause_between_ayahs > 0) {
            await new Promise(resolve => setTimeout(resolve, smartSettings.pause_between_ayahs * 1000));
          }
          audio.play().catch(console.error);
          return;
        } else {
          setAyahRepeat(0);
          audio.pause();
          setIsPlaying(false);
          toast.success(`تمت الآية ${currentVerse + 1} - اضغط تشغيل للآية التالية`);
          return;
        }
      }
      
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
  }, [currentVerse, verses, smartSettings, ayahRepeat]);

  const noteKey = `${surah}_${currentVerse + 1}`;
  const currentVerseNote = verseNotes[noteKey] || '';

  return (
    <div className="space-y-6">
      {/* القارئ الذكي */}
      <div>
        <Button
          onClick={() => setShowSmartSettings(!showSmartSettings)}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white h-14 text-lg shadow-xl"
        >
          <Settings2 className="w-6 h-6 ml-2" />
          {showSmartSettings ? 'إخفاء القارئ الذكي ⬆️' : 'فتح القارئ الذكي ⬇️'}
        </Button>
      </div>

      {showSmartSettings && (
        <SmartReaderSettings
          settings={smartSettings}
          onSettingsChange={setSmartSettings}
          reciterId={selectedReciter}
          surahNumber={surah}
        />
      )}

      {/* معلومات الوضع الحالي */}
      {smartSettings.ayah_by_ayah_mode && (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎯</span>
            <div>
              <h3 className="text-xl font-bold text-indigo-900">وضع آية بآية نشط</h3>
              <p className="text-sm text-indigo-700">التعلم والحفظ المركز</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3 border border-indigo-200">
              <p className="text-gray-600">التكرار الحالي</p>
              <p className="text-2xl font-bold text-indigo-900">{ayahRepeat + 1} / {smartSettings.repeat_count}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-indigo-200">
              <p className="text-gray-600">السرعة</p>
              <p className="text-2xl font-bold text-indigo-900">{smartSettings.playback_speed}x</p>
            </div>
          </div>
          {smartSettings.pause_between_ayahs > 0 && (
            <div className="mt-3 bg-white rounded-lg p-3 border border-indigo-200 text-center">
              <p className="text-sm text-gray-600">التوقف بين التكرار: <span className="font-bold text-indigo-900">{smartSettings.pause_between_ayahs}ث</span></p>
            </div>
          )}
        </Card>
      )}

    <Card className="bg-gradient-to-br from-emerald-900/95 via-green-900/90 to-emerald-900/95 backdrop-blur-xl border-2 border-emerald-400/60 shadow-2xl p-8">
      <audio ref={audioRef} />
      
      {/* المؤقت */}
      {showTimer && timeRemaining > 0 && (
        <div className="bg-amber-500 text-white rounded-lg p-4 mb-6 text-center">
          <Clock className="w-6 h-6 inline-block ml-2" />
          <span className="text-2xl font-bold">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </span>
          <p className="text-sm mt-1">الوقت المتبقي</p>
        </div>
      )}

      {/* اختيار نطاق الآيات */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-white text-sm font-bold mb-2">من آية</label>
          <Input
            type="number"
            min="1"
            max={verses.length}
            value={startVerse}
            onChange={(e) => setStartVerse(Number(e.target.value))}
            className="bg-white/90 border-emerald-300 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-white text-sm font-bold mb-2">إلى آية</label>
          <Input
            type="number"
            min={startVerse}
            max={verses.length}
            value={endVerse}
            onChange={(e) => setEndVerse(Number(e.target.value))}
            className="bg-white/90 border-emerald-300 text-gray-900"
          />
        </div>
      </div>

      {/* المؤقت والتكرار */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-white text-sm font-bold mb-2">مؤقت (دقائق)</label>
          <div className="flex gap-2">
            <Input
              type="number"
              min="1"
              max="120"
              value={timerDuration}
              onChange={(e) => setTimerDuration(Number(e.target.value))}
              className="bg-white/90 border-emerald-300 text-gray-900"
            />
            <Button onClick={startTimer} className="bg-amber-500 hover:bg-amber-600">
              <Clock className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-white text-sm font-bold mb-2">عدد التكرار</label>
          <Input
            type="number"
            min="1"
            max="10"
            value={repeatCount}
            onChange={(e) => setRepeatCount(Number(e.target.value))}
            className="bg-white/90 border-emerald-300 text-gray-900"
          />
        </div>
      </div>
      
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button
                onClick={() => setShowTranslation(!showTranslation)}
                variant={showTranslation ? 'default' : 'outline'}
                size="sm"
                className={showTranslation ? 'bg-emerald-600' : ''}
              >
                <Eye className="w-4 h-4 ml-1" />
                ترجمة
              </Button>
              <Button
                onClick={() => setShowTafsir(!showTafsir)}
                variant={showTafsir ? 'default' : 'outline'}
                size="sm"
                className={showTafsir ? 'bg-blue-600' : ''}
              >
                <BookOpen className="w-4 h-4 ml-1" />
                تفسير
              </Button>
            </div>
            <div className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-full font-bold shadow-lg">
              الآية {currentVerse + 1} من {verses.length}
            </div>
            <Button
              onClick={() => {
                FavoritesManager.saveVerse({
                  surah,
                  verse: currentVerse + 1,
                  text: verses[currentVerse]?.text,
                  note: currentVerseNote
                });
              }}
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600"
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-inner space-y-4">
            <p className="text-4xl font-arabic text-gray-900 leading-loose text-center">
              {verses[currentVerse]?.text || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
            </p>
            
            {showTranslation && (
              <div className="border-t pt-4 border-emerald-200">
                <p className="text-gray-600 text-center leading-relaxed">
                  {verses[currentVerse]?.translation || 'In the name of Allah, the Entirely Merciful, the Especially Merciful'}
                </p>
              </div>
            )}
            
            {showTafsir && (
              <div className="bg-blue-50 rounded-lg p-4 border-r-4 border-blue-500">
                <h4 className="text-blue-800 font-bold mb-2">📖 تفسير مختصر</h4>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {verses[currentVerse]?.tafsir || 'افتتح الله تعالى كتابه العزيز بالبسملة، فهي مفتاح كل خير وبركة.'}
                </p>
              </div>
            )}
            
            {currentVerseNote && (
              <div className="bg-amber-50 rounded-lg p-4 border-r-4 border-amber-500">
                <div className="flex items-start gap-2">
                  <StickyNote className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed text-sm">{currentVerseNote}</p>
                </div>
              </div>
            )}
            
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

          {/* إضافة ملاحظة */}
          <div className="mt-4">
            <div className="flex gap-2">
              <Textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="أضف ملاحظة على هذه الآية..."
                className="flex-1 bg-white border-emerald-300"
                rows={2}
              />
              <Button
                onClick={saveNote}
                className="bg-amber-500 hover:bg-amber-600"
                disabled={!currentNote.trim()}
              >
                <StickyNote className="w-4 h-4" />
              </Button>
            </div>
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

      {/* زر التحميل والمشاركة */}
      <div className="space-y-3">
        <Button
          onClick={handleDownload}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white h-14 text-lg"
          disabled={downloaded || isDownloading}
        >
          <Download className="w-6 h-6 ml-2" />
          {isDownloading ? `جاري التحميل... ${downloadProgress}%` : downloaded ? 'تم التحميل ✓' : 'تحميل السورة للاستماع بدون نت'}
        </Button>
        
        <ShareTilawaButton 
          surahNumber={surah} 
          reciterName={RECITERS.find(r => r.id === selectedReciter)?.name || 'القارئ'}
          surahName={`سورة رقم ${surah}`}
        />
        
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
    </div>
  );
}