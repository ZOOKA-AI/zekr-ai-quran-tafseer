import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Bell } from 'lucide-react';
import { toast } from 'sonner';

// مؤذنين مشهورين مع روابط صوت حقيقية
const MUEZZINS = [
  {
    id: 'suraiji',
    name: 'الشيخ عبد المجيد السريجي',
    country: '🇪🇬',
    style: 'مصري كلاسيكي',
    description: 'صوت المآذن المصرية الأصيل',
    audioUrl: 'https://download.quranicaudio.com/adhan/abdulmajeed-suraiji.mp3',
    featured: true
  },
  {
    id: 'menshawi_adhan',
    name: 'الشيخ محمد صديق المنشاوي',
    country: '🇪🇬',
    style: 'مصري',
    description: 'الأذان بالصوت الملائكي',
    audioUrl: 'https://download.quranicaudio.com/adhan/minshawi.mp3'
  },
  {
    id: 'ali_ahmed_mulla',
    name: 'الشيخ علي أحمد ملا',
    country: '🇸🇦',
    style: 'حرم مكي',
    description: 'مؤذن الحرم المكي الشريف',
    audioUrl: 'https://download.quranicaudio.com/adhan/ali-ahmed-mulla.mp3'
  },
  {
    id: 'madinah_adhan',
    name: 'أذان المسجد النبوي',
    country: '🇸🇦',
    style: 'حرم نبوي',
    description: 'من المسجد النبوي الشريف',
    audioUrl: 'https://download.quranicaudio.com/adhan/madinah.mp3'
  },
  {
    id: 'makkah_adhan',
    name: 'أذان الحرم المكي',
    country: '🕋',
    style: 'حرم مكي',
    description: 'من المسجد الحرام',
    audioUrl: 'https://download.quranicaudio.com/adhan/makkah.mp3'
  }
];

export default function AdhanPlayer({ compact = false }) {
  const [selectedMuezzin, setSelectedMuezzin] = useState(MUEZZINS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // تحميل المؤذن المفضل من التخزين
    const saved = localStorage.getItem('preferred_muezzin');
    if (saved) {
      const found = MUEZZINS.find(m => m.id === saved);
      if (found) setSelectedMuezzin(found);
    }
  }, []);

  const playAdhan = async (muezzin) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      if (selectedMuezzin?.id === muezzin.id && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      audioRef.current.src = muezzin.audioUrl;
      audioRef.current.volume = volume[0] / 100;
      audioRef.current.onended = () => setIsPlaying(false);
      
      await audioRef.current.play();
      setSelectedMuezzin(muezzin);
      setIsPlaying(true);
      localStorage.setItem('preferred_muezzin', muezzin.id);
      toast.success(`🕌 ${muezzin.name}`);
    } catch (error) {
      toast.error('تعذر تشغيل الأذان');
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0] / 100;
    }
  };

  if (compact) {
    return (
      <Card className="bg-gradient-to-r from-emerald-900/80 to-teal-900/80 border-emerald-500/30 p-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => playAdhan(selectedMuezzin)}
            className="bg-amber-600 hover:bg-amber-700"
            size="icon"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          </Button>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">{selectedMuezzin.name}</p>
            <p className="text-emerald-300 text-xs">{selectedMuezzin.description}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🕌 المؤذن</h2>
        <p className="text-emerald-300">استمع للأذان بأصوات أشهر المؤذنين</p>
      </div>

      {/* Featured Muezzin - Sheikh Suraiji */}
      {MUEZZINS.filter(m => m.featured).map(muezzin => (
        <Card 
          key={muezzin.id}
          className="bg-gradient-to-br from-amber-900/60 to-orange-900/60 border-2 border-amber-500/50 p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{muezzin.country}</div>
            <div className="flex-1">
              <Badge className="bg-amber-600 text-white mb-2">⭐ مميز</Badge>
              <h3 className="text-xl font-bold text-white">{muezzin.name}</h3>
              <p className="text-amber-200 text-sm">{muezzin.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => playAdhan(muezzin)}
              className="bg-amber-600 hover:bg-amber-700 gap-2"
            >
              {isPlaying && selectedMuezzin?.id === muezzin.id ? (
                <><Pause className="w-5 h-5" /> إيقاف</>
              ) : (
                <><Play className="w-5 h-5" /> استمع للأذان</>
              )}
            </Button>
            
            {isPlaying && selectedMuezzin?.id === muezzin.id && (
              <div className="flex-1 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsMuted(!isMuted);
                    if (audioRef.current) audioRef.current.muted = !isMuted;
                  }}
                  className="text-white"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Slider
                  value={volume}
                  onValueChange={handleVolumeChange}
                  max={100}
                  className="flex-1"
                />
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* Other Muezzins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MUEZZINS.filter(m => !m.featured).map(muezzin => (
          <Card 
            key={muezzin.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedMuezzin?.id === muezzin.id && isPlaying
                ? 'bg-emerald-800/60 border-emerald-400'
                : 'bg-slate-800/60 border-slate-600/50 hover:bg-slate-700/60'
            }`}
            onClick={() => playAdhan(muezzin)}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{muezzin.country}</div>
              <div className="flex-1">
                <h4 className="text-white font-bold">{muezzin.name}</h4>
                <p className="text-gray-400 text-xs">{muezzin.style}</p>
              </div>
              <Button size="icon" variant="ghost" className="text-white">
                {isPlaying && selectedMuezzin?.id === muezzin.id ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}