import React, { useState, useEffect } from 'react';
import { Heart, Star, Trash2, BookOpen, Volume2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// مدير المفضلات - يعمل بدون اتصال
export const FavoritesManager = {
  // حفظ آية للمفضلة
  saveVerse: (verse) => {
    const favorites = JSON.parse(localStorage.getItem('favorite_verses') || '[]');
    const exists = favorites.find(v => v.surah === verse.surah && v.verse === verse.verse);
    
    if (!exists) {
      favorites.push({
        ...verse,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('favorite_verses', JSON.stringify(favorites));
      toast.success('✅ تمت إضافة الآية للمفضلة');
      return true;
    } else {
      toast.info('الآية موجودة بالفعل في المفضلة');
      return false;
    }
  },

  // حذف آية من المفضلة
  removeVerse: (surah, verse) => {
    const favorites = JSON.parse(localStorage.getItem('favorite_verses') || '[]');
    const updated = favorites.filter(v => !(v.surah === surah && v.verse === verse));
    localStorage.setItem('favorite_verses', JSON.stringify(updated));
    toast.success('🗑️ تم حذف الآية من المفضلة');
  },

  // الحصول على جميع الآيات المفضلة
  getFavoriteVerses: () => {
    return JSON.parse(localStorage.getItem('favorite_verses') || '[]');
  },

  // حفظ قارئ للمفضلة
  saveReciter: (reciter) => {
    const favorites = JSON.parse(localStorage.getItem('favorite_reciters') || '[]');
    const exists = favorites.find(r => r.id === reciter.id);
    
    if (!exists) {
      favorites.push({
        ...reciter,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('favorite_reciters', JSON.stringify(favorites));
      toast.success('⭐ تمت إضافة القارئ للمفضلة');
      return true;
    } else {
      toast.info('القارئ موجود بالفعل في المفضلة');
      return false;
    }
  },

  // حذف قارئ من المفضلة
  removeReciter: (reciterId) => {
    const favorites = JSON.parse(localStorage.getItem('favorite_reciters') || '[]');
    const updated = favorites.filter(r => r.id !== reciterId);
    localStorage.setItem('favorite_reciters', JSON.stringify(updated));
    toast.success('🗑️ تم حذف القارئ من المفضلة');
  },

  // الحصول على القراء المفضلين
  getFavoriteReciters: () => {
    return JSON.parse(localStorage.getItem('favorite_reciters') || '[]');
  },

  // حفظ تلاوة (سورة + قارئ)
  saveTilawa: (surah, reciter) => {
    const favorites = JSON.parse(localStorage.getItem('favorite_tilawat') || '[]');
    const exists = favorites.find(t => t.surah === surah && t.reciter === reciter);
    
    if (!exists) {
      favorites.push({
        surah,
        reciter,
        savedAt: new Date().toISOString(),
        playCount: 1
      });
      localStorage.setItem('favorite_tilawat', JSON.stringify(favorites));
      toast.success('💾 تم حفظ التلاوة');
      return true;
    } else {
      // زيادة عدد مرات الاستماع
      const updated = favorites.map(t => {
        if (t.surah === surah && t.reciter === reciter) {
          return { ...t, playCount: (t.playCount || 0) + 1 };
        }
        return t;
      });
      localStorage.setItem('favorite_tilawat', JSON.stringify(updated));
      return false;
    }
  },

  // الحصول على التلاوات المفضلة
  getFavoriteTilawat: () => {
    return JSON.parse(localStorage.getItem('favorite_tilawat') || '[]');
  },

  // التحقق من وجود آية في المفضلة
  isVerseFavorite: (surah, verse) => {
    const favorites = JSON.parse(localStorage.getItem('favorite_verses') || '[]');
    return favorites.some(v => v.surah === surah && v.verse === verse);
  },

  // التحقق من وجود قارئ في المفضلة
  isReciterFavorite: (reciterId) => {
    const favorites = JSON.parse(localStorage.getItem('favorite_reciters') || '[]');
    return favorites.some(r => r.id === reciterId);
  }
};

// مكون زر القلب للمفضلة
export function FavoriteButton({ type, item, onToggle, className = '' }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (type === 'verse') {
      setIsFavorite(FavoritesManager.isVerseFavorite(item.surah, item.verse));
    } else if (type === 'reciter') {
      setIsFavorite(FavoritesManager.isReciterFavorite(item.id));
    }
  }, [type, item]);

  const handleToggle = () => {
    let success = false;
    
    if (type === 'verse') {
      if (isFavorite) {
        FavoritesManager.removeVerse(item.surah, item.verse);
        success = true;
      } else {
        success = FavoritesManager.saveVerse(item);
      }
    } else if (type === 'reciter') {
      if (isFavorite) {
        FavoritesManager.removeReciter(item.id);
        success = true;
      } else {
        success = FavoritesManager.saveReciter(item);
      }
    }

    if (success !== false) {
      setIsFavorite(!isFavorite);
      if (onToggle) onToggle(!isFavorite);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      variant="ghost"
      size="icon"
      className={`transition-all ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'} ${className}`}
    >
      {isFavorite ? (
        <Heart className="w-5 h-5 fill-current" />
      ) : (
        <Heart className="w-5 h-5" />
      )}
    </Button>
  );
}

// صفحة المفضلات
export function FavoritesPage() {
  const [activeTab, setActiveTab] = useState('verses');
  const [verses, setVerses] = useState([]);
  const [reciters, setReciters] = useState([]);
  const [tilawat, setTilawat] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    setVerses(FavoritesManager.getFavoriteVerses());
    setReciters(FavoritesManager.getFavoriteReciters());
    setTilawat(FavoritesManager.getFavoriteTilawat());
  };

  const handleRemoveVerse = (surah, verse) => {
    FavoritesManager.removeVerse(surah, verse);
    loadFavorites();
  };

  const handleRemoveReciter = (id) => {
    FavoritesManager.removeReciter(id);
    loadFavorites();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💖 المفضلة</h1>
          <p className="text-gray-600">الآيات والقراء والتلاوات المحفوظة</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          <Button
            onClick={() => setActiveTab('verses')}
            variant={activeTab === 'verses' ? 'default' : 'outline'}
            className={activeTab === 'verses' ? 'bg-emerald-600' : ''}
          >
            <BookOpen className="w-4 h-4 ml-2" />
            الآيات ({verses.length})
          </Button>
          <Button
            onClick={() => setActiveTab('reciters')}
            variant={activeTab === 'reciters' ? 'default' : 'outline'}
            className={activeTab === 'reciters' ? 'bg-emerald-600' : ''}
          >
            <User className="w-4 h-4 ml-2" />
            القراء ({reciters.length})
          </Button>
          <Button
            onClick={() => setActiveTab('tilawat')}
            variant={activeTab === 'tilawat' ? 'default' : 'outline'}
            className={activeTab === 'tilawat' ? 'bg-emerald-600' : ''}
          >
            <Volume2 className="w-4 h-4 ml-2" />
            التلاوات ({tilawat.length})
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'verses' && (
            verses.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>لا توجد آيات محفوظة</p>
              </div>
            ) : (
              verses.map((verse, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-md border-r-4 border-emerald-500">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-emerald-600">
                      السورة {verse.surah} - الآية {verse.verse}
                    </h3>
                    <Button
                      onClick={() => handleRemoveVerse(verse.surah, verse.verse)}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-2xl font-arabic text-gray-900 leading-loose mb-2">
                    {verse.text || 'نص الآية'}
                  </p>
                  {verse.note && (
                    <div className="mt-3 p-3 bg-amber-50 rounded border-r-4 border-amber-400">
                      <p className="text-sm text-gray-700">📝 {verse.note}</p>
                    </div>
                  )}
                </div>
              ))
            )
          )}

          {activeTab === 'reciters' && (
            reciters.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>لا توجد قراء محفوظين</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reciters.map((reciter) => (
                  <div key={reciter.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{reciter.name}</h3>
                      <Button
                        onClick={() => handleRemoveReciter(reciter.id)}
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">{reciter.description}</p>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'tilawat' && (
            tilawat.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Volume2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>لا توجد تلاوات محفوظة</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tilawat.map((tilawa, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      السورة {tilawa.surah}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">القارئ: {tilawa.reciter}</p>
                    <p className="text-xs text-gray-500">
                      عدد مرات الاستماع: {tilawa.playCount || 1}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoritesManager;