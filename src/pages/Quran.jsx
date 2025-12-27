import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, MessageSquare, Share2, Copy, BookMarked, Mic, Award, Settings } from 'lucide-react';
import { toast } from 'sonner';
import SurahCard from '../components/quran/SurahCard';
import VoiceAssistant from '../components/assistant/VoiceAssistant';
import AdvancedSearch from '../components/advanced/AdvancedSearch';
import QuranSearch from '../components/search/QuranSearch';
import VerseOfTheDay from '../components/daily/VersOfTheDay';
import { trackSearch, trackNavigation } from '../components/system/ActionTracker';

import { ALL_SURAHS } from '../components/quran/QuranData';

const SURAHS = ALL_SURAHS;

export default function QuranPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const handleAdvancedSearch = (params) => {
    console.log('Advanced search:', params);
    setSearchQuery(params.query);
    toast.success('تم تطبيق البحث المتقدم');
    trackSearch(`بحث متقدم: ${params.query}`);
  };

  const handleShare = () => {
    const appUrl = window.location.origin;
    const shareText = '🕌 ذكر - القرآن الكريم والتفسير والفقه - مجاني بالكامل لوجه الله تعالى\n\nصدقة جارية - شارك الأجر معنا 🤲\n\n' + appUrl;
    
    if (navigator.share) {
      navigator.share({
        title: 'ذكر - القرآن الكريم والتفسير',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('تم نسخ الرابط! شاركه مع من تحب لتنال الأجر 🌟');
    }
    trackNavigation('مشاركة التطبيق');
  };

  const handleCopyLink = () => {
    const appUrl = window.location.origin;
    navigator.clipboard.writeText(appUrl);
    toast.success('تم نسخ رابط التطبيق! 📋');
  };

  const filteredSurahs = React.useMemo(() => {
    if (!searchQuery) return ALL_SURAHS;
    const q = searchQuery.toLowerCase();
    return ALL_SURAHS.filter(s => 
      s.name.includes(searchQuery) || 
      s.transliteration.toLowerCase().includes(q) ||
      s.number.toString() === searchQuery
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <div className="bg-emerald-600 text-white shadow-md">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            {/* وصف شامل للتطبيق */}
                <div className="mb-6">
                  <Card className="bg-white/95 rounded-2xl p-4 max-w-4xl mx-auto shadow-lg border-2 border-amber-300">
                <div className="text-center mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">🌟 زوكا المرزوق 🌟</h2>
                  <p className="text-lg font-bold text-emerald-600">تطبيق القرآن الكريم الذكي</p>
                </div>
                
                {/* الميزات الرئيسية */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                    <div className="text-2xl mb-1">🤖</div>
                    <h3 className="text-sm font-bold text-gray-900">معلم ذكي</h3>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 rounded-lg border border-emerald-200">
                    <div className="text-2xl mb-1">📖</div>
                    <h3 className="text-sm font-bold text-gray-900">تفسير</h3>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg border border-amber-200">
                    <div className="text-2xl mb-1">🎧</div>
                    <h3 className="text-sm font-bold text-gray-900">تلاوات</h3>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                    <div className="text-2xl mb-1">🎯</div>
                    <h3 className="text-sm font-bold text-gray-900">حفظ</h3>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-3 rounded-lg border border-pink-200">
                    <div className="text-2xl mb-1">🤲</div>
                    <h3 className="text-sm font-bold text-gray-900">أذكار</h3>
                  </div>
                  
                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-3 rounded-lg border border-cyan-200">
                    <div className="text-2xl mb-1">📻</div>
                    <h3 className="text-sm font-bold text-gray-900">راديو</h3>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 rounded-lg border border-indigo-200">
                    <div className="text-2xl mb-1">🏆</div>
                    <h3 className="text-sm font-bold text-gray-900">إنجازات</h3>
                  </div>
                  
                  <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-3 rounded-lg border border-rose-200">
                    <div className="text-2xl mb-1">📱</div>
                    <h3 className="text-sm font-bold text-gray-900">بدون نت</h3>
                  </div>
                </div>


              </Card>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-3 text-white drop-shadow-lg">
              القرآن الكريم
            </h1>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 max-w-2xl mx-auto shadow-lg">
              <p className="text-2xl text-gray-900 mb-2 font-arabic font-bold">
                ﴿ إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ ﴾
              </p>
              <p className="text-gray-800 text-lg font-bold">المصحف الإلكتروني 🕌</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Sadaqah Jariyah Banner */}
        <div className="mb-6">
          <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg border-2 border-emerald-400">
            <div className="p-6 text-center">
              <div className="text-4xl mb-3">🤲</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">صدقة جارية لوجه الله تعالى</h2>
              <p className="text-lg mb-1 font-bold text-white">على روح المرحومة</p>
              <p className="text-xl mb-3 font-bold text-amber-200 font-arabic">جزبية عبد الرحيم هارون علي</p>
              <div className="bg-white/10 rounded-lg p-3 mb-3">
                <p className="text-sm font-bold text-white mb-2 font-arabic">
                  اللهم اغفر لها وارحمها وعافها واعف عنها
                </p>
                <p className="text-amber-200 font-bold text-sm">اللهم آمين 🤲</p>
              </div>
              <p className="text-lg mb-4 font-bold text-white">
                هذا التطبيق مجاني بالكامل ولا نطلب أي تبرعات
              </p>
              <div className="bg-white rounded-xl p-4 max-w-2xl mx-auto shadow-lg">
                <p className="text-base font-bold text-gray-900 mb-3 font-arabic">
                  ﴿ إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ ﴾
                </p>
                <p className="text-gray-900 mb-4 text-base font-bold">
                  شارك التطبيق واربح الأجر
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button
                    onClick={handleShare}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold px-6 py-3 shadow-lg"
                  >
                    <Share2 className="w-5 h-5 ml-2" />
                    مشاركة
                  </Button>
                  <Button
                    onClick={handleCopyLink}
                    className="bg-amber-400 hover:bg-amber-500 text-emerald-900 font-bold px-6 py-3 shadow-lg"
                  >
                    <Copy className="w-5 h-5 ml-2" />
                    نسخ الرابط
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Verse of the Day */}
        <div className="mb-6">
          <VerseOfTheDay />
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className="h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-md active:scale-95"
          >
            <Search className="w-5 h-5 ml-1" />
            <span className="text-sm">بحث</span>
          </Button>

          <Link to={createPageUrl('Bookmarks')} className="w-full">
            <Button className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md active:scale-95">
              <BookMarked className="w-5 h-5 ml-1" />
              <span className="text-sm">المفضلة</span>
            </Button>
          </Link>

          <Link to={createPageUrl('Reciters')} className="w-full">
            <Button className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-md active:scale-95">
              <Mic className="w-5 h-5 ml-1" />
              <span className="text-sm">المقرئين</span>
            </Button>
          </Link>

          <Link to={createPageUrl('Settings')} className="w-full">
            <Button className="w-full h-14 bg-purple-500 hover:bg-purple-600 text-white font-bold shadow-md active:scale-95">
              <Settings className="w-5 h-5 ml-1" />
              <span className="text-sm">إعدادات</span>
            </Button>
          </Link>
        </div>

        {showAdvancedSearch && (
          <div className="mb-6">
            <QuranSearch />
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن سورة..."
              className="pr-12 h-12 text-base font-bold border-2 border-emerald-300 focus:border-emerald-500 rounded-lg shadow-md bg-white"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="bg-white rounded-lg p-4 shadow-md border border-emerald-200 text-center">
            <p className="text-3xl font-bold text-emerald-600 mb-1">114</p>
            <p className="text-gray-800 font-bold text-sm">سورة</p>
          </Card>
          <Card className="bg-white rounded-lg p-4 shadow-md border border-amber-200 text-center">
            <p className="text-3xl font-bold text-amber-600 mb-1">30</p>
            <p className="text-gray-800 font-bold text-sm">جزء</p>
          </Card>
          <Card className="bg-white rounded-lg p-4 shadow-md border border-blue-200 text-center">
            <p className="text-3xl font-bold text-blue-600 mb-1">6236</p>
            <p className="text-gray-800 font-bold text-sm">آية</p>
          </Card>
          <Card className="bg-white rounded-lg p-4 shadow-md border border-purple-200 text-center">
            <p className="text-3xl font-bold text-purple-600 mb-1">8</p>
            <p className="text-gray-800 font-bold text-sm">قراء</p>
          </Card>
        </div>

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map(surah => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-700 text-2xl font-bold">لم يتم العثور على نتائج</p>
          </div>
        )}
      </div>
    </div>
  );
}