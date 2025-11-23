import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, MessageSquare, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import SurahCard from '../components/quran/SurahCard';
import VoiceAssistant from '../components/assistant/VoiceAssistant';
import AdvancedSearch from '../components/advanced/AdvancedSearch';

const SURAHS = [
  { number: 1, name: 'الفاتحة', arabic_name: 'ٱلْفَاتِحَة', transliteration: 'Al-Fatihah', verses_count: 7, revelation_place: 'Makkah', juz_start: 1 },
  { number: 2, name: 'البقرة', arabic_name: 'ٱلْبَقَرَة', transliteration: 'Al-Baqarah', verses_count: 286, revelation_place: 'Madinah', juz_start: 1 },
  { number: 3, name: 'آل عمران', arabic_name: 'آل عِمْرَان', transliteration: 'Ali \'Imran', verses_count: 200, revelation_place: 'Madinah', juz_start: 3 },
  { number: 4, name: 'النساء', arabic_name: 'ٱلنِّسَاء', transliteration: 'An-Nisa', verses_count: 176, revelation_place: 'Madinah', juz_start: 4 },
  { number: 5, name: 'المائدة', arabic_name: 'ٱلْمَائِدَة', transliteration: 'Al-Ma\'idah', verses_count: 120, revelation_place: 'Madinah', juz_start: 6 },
  { number: 6, name: 'الأنعام', arabic_name: 'ٱلْأَنْعَام', transliteration: 'Al-An\'am', verses_count: 165, revelation_place: 'Makkah', juz_start: 7 },
  { number: 7, name: 'الأعراف', arabic_name: 'ٱلْأَعْرَاف', transliteration: 'Al-A\'raf', verses_count: 206, revelation_place: 'Makkah', juz_start: 8 },
  { number: 8, name: 'الأنفال', arabic_name: 'ٱلْأَنْفَال', transliteration: 'Al-Anfal', verses_count: 75, revelation_place: 'Madinah', juz_start: 9 },
  { number: 9, name: 'التوبة', arabic_name: 'ٱلتَّوْبَة', transliteration: 'At-Tawbah', verses_count: 129, revelation_place: 'Madinah', juz_start: 10 },
  { number: 10, name: 'يونس', arabic_name: 'يُونُس', transliteration: 'Yunus', verses_count: 109, revelation_place: 'Makkah', juz_start: 11 },
  { number: 11, name: 'هود', arabic_name: 'هُود', transliteration: 'Hud', verses_count: 123, revelation_place: 'Makkah', juz_start: 11 },
  { number: 12, name: 'يوسف', arabic_name: 'يُوسُف', transliteration: 'Yusuf', verses_count: 111, revelation_place: 'Makkah', juz_start: 12 },
  { number: 18, name: 'الكهف', arabic_name: 'ٱلْكَهْف', transliteration: 'Al-Kahf', verses_count: 110, revelation_place: 'Makkah', juz_start: 15 },
  { number: 36, name: 'يس', arabic_name: 'يٓس', transliteration: 'Ya-Sin', verses_count: 83, revelation_place: 'Makkah', juz_start: 22 },
  { number: 67, name: 'الملك', arabic_name: 'ٱلْمُلْك', transliteration: 'Al-Mulk', verses_count: 30, revelation_place: 'Makkah', juz_start: 29 },
  { number: 112, name: 'الإخلاص', arabic_name: 'ٱلْإِخْلَاص', transliteration: 'Al-Ikhlas', verses_count: 4, revelation_place: 'Makkah', juz_start: 30 },
  { number: 113, name: 'الفلق', arabic_name: 'ٱلْفَلَق', transliteration: 'Al-Falaq', verses_count: 5, revelation_place: 'Makkah', juz_start: 30 },
  { number: 114, name: 'الناس', arabic_name: 'ٱلنَّاس', transliteration: 'An-Nas', verses_count: 6, revelation_place: 'Makkah', juz_start: 30 }
];

export default function QuranPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const handleAdvancedSearch = (params) => {
    console.log('Advanced search:', params);
    setSearchQuery(params.query);
    toast.success('تم تطبيق البحث المتقدم');
  };

  const handleShare = () => {
    const appUrl = window.location.origin;
    const shareText = '🕌 تطبيق القرآن الكريم - مجاني بالكامل لوجه الله تعالى\n\nصدقة جارية - شارك الأجر معنا 🤲\n\n' + appUrl;
    
    if (navigator.share) {
      navigator.share({
        title: 'تطبيق القرآن الكريم',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('تم نسخ الرابط! شاركه مع من تحب لتنال الأجر 🌟');
    }
  };

  const handleCopyLink = () => {
    const appUrl = window.location.origin;
    navigator.clipboard.writeText(appUrl);
    toast.success('تم نسخ رابط التطبيق! 📋');
  };

  const filteredSurahs = SURAHS.filter(surah => 
    surah.name.includes(searchQuery) || 
    surah.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.number.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <style jsx>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.7), 0 0 60px rgba(16, 185, 129, 0.5); }
        }
        .glow-green { animation: glow 2s ease-in-out infinite; }
      `}</style>
      
      {/* Header with Kaaba Image */}
      <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-white shadow-2xl overflow-hidden">
        {/* Kaaba Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6920cdfd512838f4a35374d8/ad390f8ea_21da07e84f2006654e384d2924c664b1.jpg)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/80 via-green-600/70 to-emerald-700/80" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            {/* وصف شامل للتطبيق */}
            <div className="mb-8">
              <Card className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-5xl mx-auto shadow-2xl border-4 border-amber-400">
                <div className="text-center mb-6">
                  <div className="inline-block p-5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-3xl shadow-2xl">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-2">🌟 زوكا المرزوق 🌟</h2>
                  <p className="text-2xl font-bold text-emerald-600">تطبيق القرآن الكريم الذكي بتقنية AI</p>
                </div>
                
                {/* الميزات الرئيسية */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-300">
                    <div className="text-3xl mb-2">🤖</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">معلم ذكي للأطفال</h3>
                    <p className="text-sm text-gray-700">زوكا المرزوق - معلم أزهري متخصص يعلم الأطفال القرآن والشريعة بطريقة ممتعة، يحكي قصص، يمزح ويحفز الأطفال على الحفظ!</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border-2 border-emerald-300">
                    <div className="text-3xl mb-2">📖</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">قراءة وتفسير</h3>
                    <p className="text-sm text-gray-700">القرآن الكامل مع تفاسير السعدي وابن كثير والطبري، ترجمات متعددة، وأسباب النزول</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border-2 border-amber-300">
                    <div className="text-3xl mb-2">🎧</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">تلاوات مباركة</h3>
                    <p className="text-sm text-gray-700">استمع لأشهر القراء (الحصري، عبد الباسط، المنشاوي، مشاري، السديس) مع التحكم الصوتي الذكي</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-300">
                    <div className="text-3xl mb-2">🎯</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">خطة حفظ ذكية</h3>
                    <p className="text-sm text-gray-700">برامج حفظ مخصصة للمبتدئين والمتقدمين مع متابعة يومية وتحفيز مستمر</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border-2 border-pink-300">
                    <div className="text-3xl mb-2">🤲</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">أدعية وأذكار</h3>
                    <p className="text-sm text-gray-700">أذكار الصباح والمساء، أدعية قرآنية ونبوية مع خاصية الاستماع الصوتي</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl border-2 border-cyan-300">
                    <div className="text-3xl mb-2">📻</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">إذاعات قرآنية</h3>
                    <p className="text-sm text-gray-700">بث مباشر لإذاعات القرآن الكريم من مكة والمدينة وكل الدول العربية</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border-2 border-indigo-300">
                    <div className="text-3xl mb-2">🏆</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">إنجازات وتحفيز</h3>
                    <p className="text-sm text-gray-700">نظام نقاط وشارات تحفيزية، متابعة التقدم اليومي، وإحصائيات تفصيلية</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-xl border-2 border-rose-300">
                    <div className="text-3xl mb-2">📱</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">يعمل بدون نت!</h3>
                    <p className="text-sm text-gray-700">تخزين محلي ذكي - كل البيانات محفوظة، يعمل 100% بدون إنترنت مع مزامنة تلقائية</p>
                  </div>
                </div>

                {/* منهج الأزهر الشريف */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl p-6 mb-6">
                  <h3 className="text-2xl font-bold mb-3 text-center">📚 منهج الأزهر الشريف الكامل 📚</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-4xl mb-2">📖</p>
                      <p className="font-bold text-lg">تعليم القرآن</p>
                      <p className="text-sm">التجويد والترتيل</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-4xl mb-2">🕌</p>
                      <p className="font-bold text-lg">أصول الدين</p>
                      <p className="text-sm">العقيدة والتوحيد</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-4xl mb-2">⚖️</p>
                      <p className="font-bold text-lg">الفقه والشريعة</p>
                      <p className="text-sm">أحكام العبادات</p>
                    </div>
                  </div>
                </div>

                {/* التحديث الذاتي بالذكاء الاصطناعي */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-3">🚀</div>
                  <h3 className="text-2xl font-bold mb-2">تحديث تلقائي بالذكاء الاصطناعي</h3>
                  <p className="text-lg">التطبيق يحدث نفسه تلقائياً ويتطور باستمرار لخدمتك بأفضل طريقة!</p>
                  <div className="flex justify-center gap-4 mt-4 flex-wrap">
                    <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold">✅ تحديث ذاتي</span>
                    <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold">🤖 ذكاء اصطناعي</span>
                    <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold">📈 تطوير مستمر</span>
                  </div>
                </div>
              </Card>
            </div>
            <h1 className="text-7xl font-bold mb-4 text-gray-900 font-arabic drop-shadow-xl">
              القرآن الكريم
            </h1>
            <div className="bg-white rounded-2xl p-6 max-w-3xl mx-auto shadow-2xl border-4 border-amber-400">
              <p className="text-3xl text-gray-900 mb-3 font-arabic font-bold leading-loose">
                ﴿ إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ ﴾
              </p>
              <p className="text-gray-800 text-xl font-bold">المصحف الإلكتروني الشامل 🕌</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Sadaqah Jariyah Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-white shadow-2xl border-4 border-amber-400 glow-green">
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🤲</div>
              <h2 className="text-4xl font-bold mb-3 drop-shadow-lg">صدقة جارية لوجه الله تعالى</h2>
              <p className="text-2xl mb-2 font-bold text-white">على روح المرحومة</p>
              <p className="text-3xl mb-4 font-bold text-amber-200 font-arabic">جزبية عبد الرحيم هارون علي</p>
              <div className="bg-white/10 rounded-xl p-4 mb-4 backdrop-blur-sm">
                <p className="text-lg font-bold text-white mb-3 font-arabic leading-relaxed">
                  اللهم اغفر لها وارحمها وعافها واعف عنها، وأكرم نزلها ووسع مدخلها، واغسلها بالماء والثلج والبَرَد، ونقها من الخطايا كما ينقى الثوب الأبيض من الدنس، وأبدلها داراً خيراً من دارها، وأهلاً خيراً من أهلها، وزوجاً خيراً من زوجها، وأدخلها الجنة وأعذها من عذاب القبر ومن عذاب النار
                </p>
                <p className="text-amber-200 font-bold text-lg">اللهم آمين يا رب العالمين 🤲</p>
              </div>
              <p className="text-2xl mb-6 font-bold text-white">
                هذا التطبيق مجاني بالكامل ولا نطلب أي تبرعات
              </p>
              <div className="bg-white rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl">
                <p className="text-xl font-bold text-gray-900 leading-relaxed mb-6 font-arabic">
                  ﴿ إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ وَأَنفَقُوا مِمَّا رَزَقْنَاهُمْ سِرًّا وَعَلَانِيَةً يَرْجُونَ تِجَارَةً لَّن تَبُورَ ﴾
                </p>
                <p className="text-gray-900 mb-6 text-lg font-bold">
                  شارك في الأجر: انشر التطبيق مع أهلك وأصدقائك
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl p-6 shadow-lg border-2 border-emerald-300">
                    <div className="text-5xl mb-3">📖</div>
                    <div className="font-bold text-xl text-gray-900">قراءة القرآن</div>
                    <div className="text-gray-800 font-semibold">كل حرف بحسنة</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl p-6 shadow-lg border-2 border-emerald-300">
                    <div className="text-5xl mb-3">🎤</div>
                    <div className="font-bold text-xl text-gray-900">استماع للمقرئين</div>
                    <div className="text-gray-800 font-semibold">تدبر وخشوع</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl p-6 shadow-lg border-2 border-emerald-300">
                    <div className="text-5xl mb-3">🤝</div>
                    <div className="font-bold text-xl text-gray-900">انشر الخير</div>
                    <div className="text-gray-800 font-semibold">صدقة جارية لك</div>
                  </div>
                </div>
                <div className="mt-8 flex gap-4 justify-center flex-wrap">
                  <Button
                    onClick={handleShare}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold px-8 py-4 text-xl shadow-xl border-2 border-amber-400"
                  >
                    <Share2 className="w-6 h-6 ml-2" />
                    شارك التطبيق واربح الأجر
                  </Button>
                  <Button
                    onClick={handleCopyLink}
                    className="bg-amber-400 hover:bg-amber-500 text-emerald-900 font-bold px-8 py-4 text-xl shadow-xl border-2 border-emerald-500"
                  >
                    <Copy className="w-6 h-6 ml-2" />
                    نسخ الرابط
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Voice Assistant */}
        <div className="mb-8">
          <VoiceAssistant />
        </div>

        {/* Advanced Search Toggle */}
        <div className="mb-8 text-center">
          <Button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            variant="outline"
            className="border-2 border-emerald-400 hover:bg-emerald-50"
          >
            <Search className="w-5 h-5 ml-2" />
            {showAdvancedSearch ? 'إخفاء' : 'إظهار'} البحث المتقدم
          </Button>
        </div>

        {/* Advanced Search */}
        {showAdvancedSearch && (
          <div className="mb-8">
            <AdvancedSearch onSearch={handleAdvancedSearch} />
          </div>
        )}

        {/* Smart Assistant Banner */}
        <div className="mb-8">
          <Link to={createPageUrl('Assistant')}>
            <Card className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 shadow-2xl hover:shadow-3xl transition-all duration-200 transform hover:scale-[1.02] cursor-pointer border-4 border-purple-400">
              <div className="p-8">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="bg-white rounded-2xl p-5 shadow-xl">
                      <MessageSquare className="w-12 h-12 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">💬 المساعد الذكي الكامل</h3>
                      <p className="text-xl text-purple-100 font-semibold">اسأل أسئلة معقدة واحصل على إجابات تفصيلية</p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <Button className="bg-white text-purple-600 hover:bg-purple-50 font-bold px-8 py-4 text-xl shadow-xl transition-all duration-200">
                      جرب الآن
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن سورة بالاسم أو الرقم..."
              className="pr-16 h-16 text-xl font-bold border-4 border-emerald-400 focus:border-emerald-600 rounded-2xl shadow-2xl bg-white"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-emerald-300 text-center hover:scale-105 transition-transform duration-200">
            <p className="text-6xl font-bold text-emerald-600 mb-3">114</p>
            <p className="text-gray-800 font-bold text-xl">سورة</p>
          </Card>
          <Card className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-amber-300 text-center hover:scale-105 transition-transform duration-200">
            <p className="text-6xl font-bold text-amber-600 mb-3">30</p>
            <p className="text-gray-800 font-bold text-xl">جزء</p>
          </Card>
          <Card className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-blue-300 text-center hover:scale-105 transition-transform duration-200">
            <p className="text-6xl font-bold text-blue-600 mb-3">6236</p>
            <p className="text-gray-800 font-bold text-xl">آية</p>
          </Card>
          <Card className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-purple-300 text-center hover:scale-105 transition-transform duration-200">
            <p className="text-6xl font-bold text-purple-600 mb-3">8</p>
            <p className="text-gray-800 font-bold text-xl">قراء</p>
          </Card>
        </div>

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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