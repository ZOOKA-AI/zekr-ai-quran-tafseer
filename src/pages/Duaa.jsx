import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Copy, Share2, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

const DUAS = [
  {
    category: 'أدعية قرآنية',
    items: [
      {
        title: 'دعاء الهداية',
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        translation: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار',
        reference: 'البقرة: 201'
      },
      {
        title: 'دعاء الثبات',
        arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ',
        translation: 'ربنا لا تزغ قلوبنا بعد إذ هديتنا وهب لنا من لدنك رحمة إنك أنت الوهاب',
        reference: 'آل عمران: 8'
      },
      {
        title: 'دعاء المغفرة',
        arabic: 'رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
        translation: 'ربنا اغفر لنا ذنوبنا وإسرافنا في أمرنا وثبت أقدامنا وانصرنا على القوم الكافرين',
        reference: 'آل عمران: 147'
      },
      {
        title: 'دعاء الرحمة',
        arabic: 'رَبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ',
        translation: 'رب اغفر وارحم وأنت خير الراحمين',
        reference: 'المؤمنون: 118'
      },
      {
        title: 'دعاء الصلاح',
        arabic: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ',
        translation: 'رب أوزعني أن أشكر نعمتك التي أنعمت علي وعلى والدي وأن أعمل صالحا ترضاه',
        reference: 'النمل: 19'
      }
    ]
  },
  {
    category: 'أدعية نبوية',
    items: [
      {
        title: 'دعاء الاستخارة',
        arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ',
        translation: 'اللهم إني أستخيرك بعلمك، وأستقدرك بقدرتك، وأسألك من فضلك العظيم',
        reference: 'رواه البخاري'
      },
      {
        title: 'دعاء الكرب',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
        translation: 'لا إله إلا الله العظيم الحليم، لا إله إلا الله رب العرش العظيم',
        reference: 'متفق عليه'
      },
      {
        title: 'دعاء الهم والحزن',
        arabic: 'اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ',
        translation: 'اللهم إني عبدك ابن عبدك ابن أمتك، ناصيتي بيدك، ماض في حكمك',
        reference: 'رواه أحمد'
      },
      {
        title: 'سيد الاستغفار',
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
        translation: 'اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك',
        reference: 'رواه البخاري'
      }
    ]
  },
  {
    category: 'أدعية الصباح والمساء',
    items: [
      {
        title: 'آية الكرسي',
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
        translation: 'الله لا إله إلا هو الحي القيوم',
        reference: 'البقرة: 255'
      },
      {
        title: 'أذكار الصباح',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        translation: 'أصبحنا وأصبح الملك لله، والحمد لله',
        reference: 'رواه مسلم'
      },
      {
        title: 'حسبي الله',
        arabic: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
        translation: 'حسبي الله لا إله إلا هو عليه توكلت',
        reference: 'التوبة: 129'
      }
    ]
  },
  {
    category: 'أدعية متنوعة',
    items: [
      {
        title: 'دعاء دخول المسجد',
        arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        translation: 'اللهم افتح لي أبواب رحمتك',
        reference: 'رواه مسلم'
      },
      {
        title: 'دعاء الخروج من المسجد',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
        translation: 'اللهم إني أسألك من فضلك',
        reference: 'رواه مسلم'
      },
      {
        title: 'دعاء السفر',
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
        translation: 'سبحان الذي سخر لنا هذا وما كنا له مقرنين',
        reference: 'الزخرف: 13'
      },
      {
        title: 'دعاء الطعام',
        arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا، وَقِنَا عَذَابَ النَّارِ، بِسْمِ اللَّهِ',
        translation: 'اللهم بارك لنا فيما رزقتنا، وقنا عذاب النار',
        reference: 'سنن الترمذي'
      }
    ]
  }
];

export default function DuaaPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ! 📋');
  };

  const handleShare = (dua) => {
    const shareText = `${dua.title}\n\n${dua.arabic}\n\n${dua.translation}\n\n${dua.reference}`;
    if (navigator.share) {
      navigator.share({ text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('تم نسخ الدعاء! شاركه مع من تحب 🤲');
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
      toast.success('يتم قراءة الدعاء 🎤');
    }
  };

  const filteredDuas = DUAS.map(category => ({
    ...category,
    items: category.items.filter(dua =>
      dua.title.includes(searchQuery) ||
      dua.arabic.includes(searchQuery) ||
      dua.translation.includes(searchQuery)
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">🤲</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4 font-arabic">الأدعية المأثورة</h1>
          <p className="text-xl text-gray-700 mb-6">ادْعُونِي أَسْتَجِبْ لَكُمْ</p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن دعاء..."
              className="pr-14 h-14 text-lg border-2 border-emerald-300 focus:border-emerald-500 rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Duas List */}
        {filteredDuas.map((category, idx) => (
          <div key={idx} className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-700 mb-6 text-center font-arabic">
              {category.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.items.map((dua, duaIdx) => (
                <Card key={duaIdx} className="bg-white border-2 border-emerald-200 hover:border-emerald-400 transition-all shadow-lg hover:shadow-xl">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-emerald-700 mb-4 font-arabic">
                      {dua.title}
                    </h3>
                    <div className="bg-emerald-50 rounded-xl p-6 mb-4 border border-emerald-200">
                      <p className="text-3xl text-gray-900 font-arabic leading-loose text-center">
                        {dua.arabic}
                      </p>
                    </div>
                    <p className="text-gray-700 text-lg mb-3 font-arabic leading-relaxed">
                      {dua.translation}
                    </p>
                    <p className="text-emerald-600 text-sm font-bold mb-4">
                      📖 {dua.reference}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCopy(dua.arabic)}
                        variant="outline"
                        className="flex-1 border-emerald-300 hover:bg-emerald-50"
                      >
                        <Copy className="w-4 h-4 ml-2" />
                        نسخ
                      </Button>
                      <Button
                        onClick={() => handleSpeak(dua.arabic)}
                        variant="outline"
                        className="flex-1 border-emerald-300 hover:bg-emerald-50"
                      >
                        <Volume2 className="w-4 h-4 ml-2" />
                        استماع
                      </Button>
                      <Button
                        onClick={() => handleShare(dua)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Share2 className="w-4 h-4 ml-2" />
                        مشاركة
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {filteredDuas.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-2xl">لم يتم العثور على نتائج</p>
          </div>
        )}
      </div>
    </div>
  );
}