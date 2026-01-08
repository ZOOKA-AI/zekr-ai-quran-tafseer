import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, SkipBack, Volume2, Download, Repeat, Repeat1, Gauge, Save, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const RECITERS = [
  // المقرئون المصريون 🇪🇬
  { id: 'husary', name: '🇪🇬 محمود خليل الحصري', country: 'EG', url: 'https://server8.mp3quran.net/husary/', style: 'حدر' },
  { id: 'minshawi', name: '🇪🇬 محمد صديق المنشاوي', country: 'EG', url: 'https://server10.mp3quran.net/minsh/', style: 'تحقيق' },
  { id: 'abdulbasit', name: '🇪🇬 عبد الباسط عبد الصمد', country: 'EG', url: 'https://server7.mp3quran.net/basit/', style: 'ترتيل' },
  { id: 'mustafa', name: '🇪🇬 مصطفى إسماعيل', country: 'EG', url: 'https://server13.mp3quran.net/mustafa/', style: 'تحقيق' },
  
  // المقرئون السعوديون 🇸🇦
  { id: 'sudais', name: '🇸🇦 عبد الرحمن السديس', country: 'SA', url: 'https://server11.mp3quran.net/sds/', style: 'ترتيل', imam: 'الحرم المكي' },
  { id: 'shuraim', name: '🇸🇦 سعود الشريم', country: 'SA', url: 'https://server6.mp3quran.net/shur/', style: 'حدر', imam: 'الحرم المكي' },
  { id: 'afasy', name: '🇸🇦 مشاري راشد العفاسي', country: 'SA', url: 'https://server8.mp3quran.net/afs/', style: 'ترتيل' },
  { id: 'ghamadi', name: '🇸🇦 سعد الغامدي', country: 'SA', url: 'https://server7.mp3quran.net/s_gmd/', style: 'ترتيل' },
  { id: 'maher', name: '🇸🇦 ماهر المعيقلي', country: 'SA', url: 'https://server8.mp3quran.net/maher/', style: 'حدر', imam: 'الحرم المكي' },
  { id: 'hudhaify', name: '🇸🇦 علي الحذيفي', country: 'SA', url: 'https://server8.mp3quran.net/hud/', style: 'ترتيل', imam: 'الحرم النبوي' },
  { id: 'jibreen', name: '🇸🇦 عبد الله الجبرين', country: 'SA', url: 'https://server16.mp3quran.net/jbreen/', style: 'ترتيل' },
  { id: 'budair', name: '🇸🇦 عبد الله بصفر', country: 'SA', url: 'https://server11.mp3quran.net/bsfr/', style: 'ترتيل' },
  { id: 'alajmi', name: '🇸🇦 أحمد العجمي', country: 'SA', url: 'https://server10.mp3quran.net/ajm/', style: 'ترتيل' },
  { id: 'bukhatir', name: '🇾🇪 أبو بكر الشاطري', country: 'YE', url: 'https://server8.mp3quran.net/bkt/', style: 'تحقيق' },
  { id: 'ayub', name: '🇸🇦 محمد أيوب', country: 'SA', url: 'https://server8.mp3quran.net/ayb/', style: 'ترتيل', imam: 'الحرم النبوي' },
  { id: 'qatami', name: '🇰🇼 ناصر القطامي', country: 'KW', url: 'https://server6.mp3quran.net/qtm/', style: 'ترتيل' },
  { id: 'bandar', name: '🇸🇦 بندر بليلة', country: 'SA', url: 'https://server10.mp3quran.net/bandar/', style: 'ترتيل', imam: 'الحرم المكي' },
  { id: 'juhany', name: '🇸🇦 عبد الله الجهني', country: 'SA', url: 'https://server12.mp3quran.net/jhn/', style: 'ترتيل' }
];

const AudioPlayer = ({ surahNumber, onTimeUpdate, onPlayingChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0].id);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [repeatMode, setRepeatMode] = useState('none'); // none, one, all
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedSurahs, setDownloadedSurahs] = useState(() => {
    const saved = localStorage.getItem('downloaded_surahs');
    return saved ? JSON.parse(saved) : [];
  });
  const audioRef = useRef(null);

  const reciter = RECITERS.find(r => r.id === selectedReciter);
  const audioUrl = `${reciter.url}${String(surahNumber).padStart(3, '0')}.mp3`;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    const newState = !isPlaying;
    setIsPlaying(newState);
    if (onPlayingChange) onPlayingChange(newState);
  };

  const handleTimeUpdate = () => {
    const time = audioRef.current?.currentTime || 0;
    setCurrentTime(time);
    if (onTimeUpdate) onTimeUpdate(time);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration || 0);
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 'all') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      setIsPlaying(false);
    }
  };

  const toggleRepeatMode = () => {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return <Repeat1 className="w-5 h-5" />;
    return <Repeat className="w-5 h-5" />;
  };

  const getRepeatColor = () => {
    if (repeatMode === 'none') return 'text-gray-400';
    return 'text-emerald-600';
  };

  const handleSeek = (value) => {
    const time = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `surah_${surahNumber}_${reciter.name}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Save to downloaded list
      const newDownloaded = [...downloadedSurahs, { surah: surahNumber, reciter: selectedReciter }];
      setDownloadedSurahs(newDownloaded);
      localStorage.setItem('downloaded_surahs', JSON.stringify(newDownloaded));
      
      toast.success(`تم تحميل السورة ${surahNumber} - ${reciter.name} ✅`);
    } catch (error) {
      toast.error('فشل التحميل، حاول مرة أخرى');
    } finally {
      setIsDownloading(false);
    }
  };

  const isDownloaded = downloadedSurahs.some(d => d.surah === surahNumber && d.reciter === selectedReciter);

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 shadow-xl">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              🎵 المشغل الصوتي
            </h3>
            <Badge className="bg-emerald-100 text-emerald-700">
              {RECITERS.length} قارئ
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">اختر القارئ</label>
              <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                <SelectTrigger className="w-full h-12 border-2 border-emerald-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-96">
                  {RECITERS.map(reciter => (
                    <SelectItem key={reciter.id} value={reciter.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold">{reciter.name}</span>
                        {reciter.style && (
                          <Badge variant="outline" className="mr-2 text-xs">
                            {reciter.style}
                          </Badge>
                        )}
                        {reciter.imam && (
                          <Badge className="bg-amber-100 text-amber-700 mr-2 text-xs">
                            {reciter.imam}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {reciter && (
              <div className="flex gap-2 flex-wrap text-xs">
                {reciter.country && (
                  <Badge variant="outline" className="bg-blue-50">
                    {reciter.country === 'EG' ? 'مصر' : reciter.country === 'SA' ? 'السعودية' : reciter.country === 'YE' ? 'اليمن' : reciter.country === 'KW' ? 'الكويت' : reciter.country}
                  </Badge>
                )}
                {reciter.style && (
                  <Badge variant="outline" className="bg-purple-50">
                    أسلوب: {reciter.style}
                  </Badge>
                )}
                {reciter.imam && (
                  <Badge className="bg-amber-100 text-amber-700">
                    إمام {reciter.imam}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />

        {/* Progress Bar */}
        <div className="mb-6">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
              }
            }}
          >
            <SkipBack className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            className="rounded-full w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 mr-1" />}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
              }
            }}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center justify-center gap-3 mb-4 pb-4 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleRepeatMode}
            className={getRepeatColor()}
          >
            {getRepeatIcon()}
            <span className="mr-2">
              {repeatMode === 'none' && 'بدون تكرار'}
              {repeatMode === 'one' && 'تكرار السورة'}
              {repeatMode === 'all' && 'تكرار مستمر'}
            </span>
          </Button>

          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-gray-600" />
            <Select value={playbackRate.toString()} onValueChange={(v) => setPlaybackRate(parseFloat(v))}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">× 0.5 (أبطأ جداً)</SelectItem>
                <SelectItem value="0.75">× 0.75 (أبطأ)</SelectItem>
                <SelectItem value="1">× 1 (عادي)</SelectItem>
                <SelectItem value="1.25">× 1.25 (أسرع)</SelectItem>
                <SelectItem value="1.5">× 1.5 (أسرع جداً)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Volume Control & Download */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Volume2 className="w-5 h-5 text-gray-600" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={(v) => setVolume(v[0])}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-12">{volume}%</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 h-11 border-2 border-emerald-300 hover:bg-emerald-50"
              onClick={handleDownload}
              disabled={isDownloading || isDownloaded}
            >
              {isDownloading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent"></div>
                  <span>جاري التحميل...</span>
                </div>
              ) : isDownloaded ? (
                <>
                  <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                  <span className="text-green-600">تم التحميل</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 ml-2" />
                  <span>تحميل للاستماع بدون نت</span>
                </>
              )}
            </Button>
          </div>
          
          {isDownloaded && (
            <p className="text-xs text-green-600 text-center">
              ✅ يمكنك الاستماع لهذه السورة بدون اتصال بالإنترنت
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AudioPlayer;