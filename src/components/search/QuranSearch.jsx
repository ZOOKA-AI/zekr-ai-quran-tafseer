import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, BookOpen, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { ALL_SURAHS } from '../quran/QuranData';

// قاعدة بيانات آيات مثالية (في التطبيق الحقيقي ستكون من API)
const SAMPLE_VERSES = [
  { surah: 1, verse: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful' },
  { surah: 1, verse: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: 'All praise is due to Allah, Lord of the worlds' },
  { surah: 2, verse: 255, text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer' },
  { surah: 112, verse: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', translation: 'Say, He is Allah, [who is] One' },
  { surah: 112, verse: 2, text: 'اللَّهُ الصَّمَدُ', translation: 'Allah, the Eternal Refuge' },
  { surah: 55, verse: 13, text: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ', translation: 'So which of the favors of your Lord would you deny?' },
  { surah: 18, verse: 10, text: 'رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً', translation: 'Our Lord, grant us from Yourself mercy' },
];

const TAFSIR_OPTIONS = [
  { id: 'all', name: 'جميع التفاسير' },
  { id: 'saadi', name: 'تفسير السعدي' },
  { id: 'kathir', name: 'تفسير ابن كثير' },
  { id: 'tabari', name: 'تفسير الطبري' },
];

const RECITER_OPTIONS = [
  { id: 'all', name: 'جميع القراء' },
  { id: 'husary', name: 'محمود خليل الحصري' },
  { id: 'sudais', name: 'عبد الرحمن السديس' },
  { id: 'minshawi', name: 'محمد صديق المنشاوي' },
  { id: 'alafasy', name: 'مشاري راشد العفاسي' },
];

export default function QuranSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTafsir, setSelectedTafsir] = useState('all');
  const [selectedReciter, setSelectedReciter] = useState('all');
  const [searchType, setSearchType] = useState('word'); // word or verse
  const [showFilters, setShowFilters] = useState(false);

  // البحث في الآيات
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.trim().toLowerCase();
    
    return SAMPLE_VERSES.filter(verse => {
      // البحث بالكلمة أو الآية
      const matchesText = verse.text.includes(searchQuery) || 
                         verse.text.toLowerCase().includes(query) ||
                         verse.translation.toLowerCase().includes(query);
      
      return matchesText;
    }).map(verse => {
      const surahData = ALL_SURAHS.find(s => s.number === verse.surah);
      return {
        ...verse,
        surahName: surahData?.name || '',
        surahTransliteration: surahData?.transliteration || ''
      };
    });
  }, [searchQuery]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('الرجاء إدخال كلمة أو آية للبحث');
      return;
    }
    toast.success(`تم العثور على ${searchResults.length} نتيجة`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedTafsir('all');
    setSelectedReciter('all');
  };

  return (
    <div className="space-y-6">
      {/* شريط البحث الرئيسي */}
      <Card className="bg-white/95 backdrop-blur-sm border-2 border-emerald-400 shadow-xl p-6">
        <div className="space-y-4">
          {/* حقل البحث */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="ابحث بكلمة أو آية من القرآن الكريم..."
                className="pr-12 h-14 text-lg border-2 border-emerald-300 focus:border-emerald-600"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <Button
              onClick={handleSearch}
              className="bg-emerald-600 hover:bg-emerald-700 h-14 px-8 text-lg"
            >
              <Search className="w-5 h-5 ml-2" />
              بحث
            </Button>
          </div>

          {/* نوع البحث */}
          <div className="flex gap-3 items-center justify-between flex-wrap">
            <div className="flex gap-2">
              <Button
                onClick={() => setSearchType('word')}
                variant={searchType === 'word' ? 'default' : 'outline'}
                className={searchType === 'word' ? 'bg-emerald-600' : ''}
              >
                بحث بالكلمة
              </Button>
              <Button
                onClick={() => setSearchType('verse')}
                variant={searchType === 'verse' ? 'default' : 'outline'}
                className={searchType === 'verse' ? 'bg-emerald-600' : ''}
              >
                بحث بالآية الكاملة
              </Button>
            </div>
            
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-emerald-400"
            >
              <Filter className="w-4 h-4 ml-2" />
              {showFilters ? 'إخفاء الفلاتر' : 'فلاتر متقدمة'}
            </Button>
          </div>

          {/* الفلاتر المتقدمة */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div>
                <label className="block text-gray-900 font-bold mb-2">التفسير</label>
                <Select value={selectedTafsir} onValueChange={setSelectedTafsir}>
                  <SelectTrigger className="bg-white border-emerald-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TAFSIR_OPTIONS.map(tafsir => (
                      <SelectItem key={tafsir.id} value={tafsir.id}>
                        {tafsir.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2">القارئ</label>
                <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                  <SelectTrigger className="bg-white border-emerald-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RECITER_OPTIONS.map(reciter => (
                      <SelectItem key={reciter.id} value={reciter.id}>
                        {reciter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* نتائج البحث */}
      {searchQuery && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">
              نتائج البحث ({searchResults.length})
            </h3>
            {searchResults.length > 0 && (
              <p className="text-gray-600">
                البحث عن: <span className="font-bold text-emerald-600">{searchQuery}</span>
              </p>
            )}
          </div>

          {searchResults.length === 0 ? (
            <Card className="p-12 text-center bg-gray-50">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">لم يتم العثور على نتائج</p>
              <p className="text-gray-500 mt-2">حاول البحث بكلمات مختلفة</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {searchResults.map((result, idx) => (
                <Card key={idx} className="p-6 hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-emerald-400">
                  <Link to={createPageUrl(`SurahView?surah=${result.surah}&ayah=${result.verse}`)}>
                    <div className="space-y-3">
                      {/* معلومات السورة */}
                      <div className="flex items-center gap-3 text-emerald-600">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-bold text-lg">
                          {result.surahName} - الآية {result.verse}
                        </span>
                      </div>

                      {/* نص الآية */}
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-6 border-r-4 border-emerald-500">
                        <p className="text-3xl font-arabic text-gray-900 leading-loose text-right mb-3">
                          {result.text}
                        </p>
                        <p className="text-gray-600 text-base border-t pt-3 border-emerald-200">
                          {result.translation}
                        </p>
                      </div>

                      {/* معلومات إضافية */}
                      <div className="flex gap-4 text-sm text-gray-500">
                        {selectedTafsir !== 'all' && (
                          <span>📖 {TAFSIR_OPTIONS.find(t => t.id === selectedTafsir)?.name}</span>
                        )}
                        {selectedReciter !== 'all' && (
                          <span>🎤 {RECITER_OPTIONS.find(r => r.id === selectedReciter)?.name}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* تلميحات البحث */}
      {!searchQuery && (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3">💡 نصائح البحث</h4>
          <ul className="space-y-2 text-gray-700">
            <li>• يمكنك البحث بأي كلمة من القرآن الكريم</li>
            <li>• استخدم الفلاتر للبحث في تفسير معين أو قارئ محدد</li>
            <li>• البحث يدعم اللغة العربية والإنجليزية</li>
            <li>• اضغط على أي نتيجة للانتقال مباشرة للآية</li>
          </ul>
        </Card>
      )}
    </div>
  );
}