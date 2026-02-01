import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Pause, Heart, Star, Music } from 'lucide-react';
import { toast } from 'sonner';

// مكتبة المبتهلين المصريين
const MUBTAHILEEN = [
  {
    id: 'naqshabandi',
    name: 'الشيخ سيد النقشبندي',
    title: 'سيد المبتهلين',
    country: '🇪🇬',
    era: '1920-1976',
    description: 'أسطورة الابتهالات والتواشيح',
    rating: 5,
    ibtihaalat: [
      { name: 'مولاي إني ببابك', url: 'https://archive.org/download/naqshabandi/mawlay.mp3' },
      { name: 'يا رب العالمين', url: 'https://archive.org/download/naqshabandi/ya_rab.mp3' },
      { name: 'أشرق المعنى', url: 'https://archive.org/download/naqshabandi/ashraqa.mp3' },
    ],
    featured: true
  },
  {
    id: 'touni',
    name: 'الشيخ محمد الطوني',
    title: 'أمير الابتهال',
    country: '🇪🇬',
    era: '1934-2003',
    description: 'صوت الصوفية المصرية',
    rating: 5,
    ibtihaalat: [
      { name: 'يا من عليه تاج النور', url: 'https://archive.org/download/touni/taj_nour.mp3' },
      { name: 'إلهي ليس لي إلاك', url: 'https://archive.org/download/touni/ilahi.mp3' },
    ],
    featured: true
  },
  {
    id: 'hegazy',
    name: 'الشيخ محمد عمران',
    title: 'صوت السماء',
    country: '🇪🇬',
    era: '1929-1995',
    description: 'من عظماء التواشيح',
    rating: 5,
    ibtihaalat: [
      { name: 'إلهي لست للفردوس أهلا', url: 'https://archive.org/download/omran/firdaws.mp3' },
      { name: 'يا رب صل على النبي', url: 'https://archive.org/download/omran/salli.mp3' },
    ]
  },
  {
    id: 'tablawi_ibtihaal',
    name: 'الشيخ محمد الطبلاوي',
    title: 'فارس القراءة',
    country: '🇪🇬',
    era: '1934-2020',
    description: 'القارئ والمبتهل',
    rating: 5,
    ibtihaalat: [
      { name: 'أنا المسكين', url: 'https://archive.org/download/tablawi/miskeen.mp3' },
    ]
  },
  {
    id: 'helbawy',
    name: 'الشيخ محمد الهلباوي',
    title: 'أمير المداحين',
    country: '🇪🇬',
    era: '1940-',
    description: 'من أعلام الإنشاد الديني',
    rating: 5,
    ibtihaalat: [
      { name: 'يا طير يا مروح', url: 'https://archive.org/download/helbawy/ya_tair.mp3' },
    ]
  },
  {
    id: 'yaseen_tohamy',
    name: 'الشيخ ياسين التهامي',
    title: 'شيخ العاشقين',
    country: '🇪🇬',
    era: '1948-',
    description: 'إمام الصوفية في العصر الحديث',
    rating: 5,
    ibtihaalat: [
      { name: 'أحبك حبين', url: 'https://archive.org/download/tohamy/ohibbuk.mp3' },
      { name: 'زدني بفرط الحب', url: 'https://archive.org/download/tohamy/zidni.mp3' },
    ],
    featured: true
  }
];

export default function MubtahileenLibrary() {
  const [selectedMubtahil, setSelectedMubtahil] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem('fav_ibtihaalat') || '[]');
  });
  const audioRef = useRef(null);

  const playIbtihaal = async (mubtahil, track) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      if (playingTrack?.url === track.url && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      audioRef.current.src = track.url;
      audioRef.current.onended = () => setIsPlaying(false);
      
      await audioRef.current.play();
      setSelectedMubtahil(mubtahil);
      setPlayingTrack(track);
      setIsPlaying(true);
      toast.success(`🎵 ${track.name} - ${mubtahil.name}`);
    } catch (error) {
      toast.error('تعذر تشغيل الابتهال');
    }
  };

  const toggleFavorite = (trackUrl) => {
    const newFavs = favorites.includes(trackUrl)
      ? favorites.filter(f => f !== trackUrl)
      : [...favorites, trackUrl];
    setFavorites(newFavs);
    localStorage.setItem('fav_ibtihaalat', JSON.stringify(newFavs));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🎵 خزانة المبتهلين</h2>
        <p className="text-emerald-300">كنوز الابتهالات والتواشيح المصرية</p>
      </div>

      {/* Featured Mubtahileen */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-amber-400 mb-4">⭐ الأعلام المميزون</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MUBTAHILEEN.filter(m => m.featured).map(mubtahil => (
            <Card 
              key={mubtahil.id}
              className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 border-amber-500/30 p-4 cursor-pointer hover:border-amber-400 transition-all"
              onClick={() => setSelectedMubtahil(mubtahil)}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{mubtahil.country}</div>
                <h4 className="text-white font-bold">{mubtahil.name}</h4>
                <Badge className="bg-amber-600/50 text-amber-200 mt-1">{mubtahil.title}</Badge>
                <p className="text-gray-400 text-xs mt-2">{mubtahil.era}</p>
                <div className="flex justify-center gap-1 mt-2">
                  {[...Array(mubtahil.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* All Mubtahileen */}
      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {MUBTAHILEEN.map(mubtahil => (
            <Card 
              key={mubtahil.id}
              className={`p-4 transition-all ${
                selectedMubtahil?.id === mubtahil.id
                  ? 'bg-emerald-900/60 border-emerald-500'
                  : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50'
              }`}
            >
              <div 
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => setSelectedMubtahil(selectedMubtahil?.id === mubtahil.id ? null : mubtahil)}
              >
                <div className="text-3xl">{mubtahil.country}</div>
                <div className="flex-1">
                  <h4 className="text-white font-bold">{mubtahil.name}</h4>
                  <p className="text-gray-400 text-sm">{mubtahil.title} • {mubtahil.era}</p>
                </div>
                <Badge variant="outline" className="text-emerald-400 border-emerald-500">
                  {mubtahil.ibtihaalat.length} ابتهال
                </Badge>
              </div>

              {/* Tracks */}
              {selectedMubtahil?.id === mubtahil.id && (
                <div className="mt-4 space-y-2 border-t border-slate-600/50 pt-4">
                  {mubtahil.ibtihaalat.map((track, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        playingTrack?.url === track.url && isPlaying
                          ? 'bg-emerald-800/50'
                          : 'hover:bg-slate-700/50'
                      }`}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white"
                        onClick={() => playIbtihaal(mubtahil, track)}
                      >
                        {playingTrack?.url === track.url && isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                      </Button>
                      <span className="text-white flex-1">{track.name}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleFavorite(track.url)}
                        className={favorites.includes(track.url) ? 'text-red-500' : 'text-gray-400'}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(track.url) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Now Playing */}
      {isPlaying && playingTrack && (
        <Card className="bg-gradient-to-r from-emerald-900/80 to-teal-900/80 border-emerald-500/50 p-4 fixed bottom-4 left-4 right-4 z-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center animate-pulse">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold">{playingTrack.name}</p>
              <p className="text-emerald-300 text-sm">{selectedMubtahil?.name}</p>
            </div>
            <Button
              size="icon"
              onClick={() => {
                audioRef.current?.pause();
                setIsPlaying(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <Pause className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}