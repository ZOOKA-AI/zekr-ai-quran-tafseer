import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Share2, Volume2, Sun, Moon, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const MORNING_ADHKAR = [
  {
    text: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    count: 1,
    benefit: 'من قرأها حين يصبح أجير من الجن حتى يمسي'
  },
  {
    text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ: قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    count: 3,
    benefit: 'من قرأها ثلاث مرات كفته من كل شيء'
  },
  {
    text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ: قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    count: 3,
    benefit: 'تعوذ من شر ما خلق'
  },
  {
    text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ: قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ',
    count: 3,
    benefit: 'حماية من وسوسة الشيطان'
  },
  {
    text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ',
    count: 1,
    benefit: 'فضل عظيم في بداية اليوم'
  },
  {
    text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    count: 1,
    benefit: 'التوكل على الله في اليوم'
  },
  {
    text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    count: 1,
    benefit: 'سيد الاستغفار - من قالها موقناً بها فمات من يومه دخل الجنة'
  },
  {
    text: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    count: 4,
    benefit: 'أعتق الله بها ربع العبد من النار'
  },
  {
    text: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
    count: 1,
    benefit: 'أدى شكر يومه'
  },
  {
    text: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    count: 7,
    benefit: 'كفاه الله ما أهمه'
  },
  {
    text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',
    count: 3,
    benefit: 'طلب العافية من الله'
  },
  {
    text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ',
    count: 3,
    benefit: 'الاستعاذة من الكفر والفقر'
  },
  {
    text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    count: 100,
    benefit: 'حطت خطاياه وإن كانت مثل زبد البحر'
  }
];

const EVENING_ADHKAR = [
  {
    text: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ: اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
    count: 1,
    benefit: 'من قرأها حين يمسي أجير من الجن حتى يصبح'
  },
  {
    text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    count: 1,
    benefit: 'فضل عظيم في بداية المساء'
  },
  {
    text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    count: 1,
    benefit: 'التوكل على الله في المساء'
  }
];

const SLEEP_ADHKAR = [
  {
    text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    count: 1,
    benefit: 'ذكر عند النوم'
  },
  {
    text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    count: 3,
    benefit: 'الاستعاذة من عذاب القبر'
  },
  {
    text: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
    count: 1,
    benefit: 'ذكر عند النوم'
  }
];

export default function AdhkarPage() {
  const [completedAdhkar, setCompletedAdhkar] = useState(() => {
    try {
      const saved = localStorage.getItem('adhkar_completed');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('✅ تم النسخ!');
    } catch (err) {
      toast.error('❌ تعذر النسخ');
    }
  };

  const handleSpeak = (text) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.7;
        utterance.pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
        toast.success('🔊 يتم قراءة الذكر...');
      } else {
        toast.error('المتصفح لا يدعم القراءة الصوتية');
      }
    } catch (err) {
      toast.error('❌ خطأ في القراءة');
    }
  };

  const toggleComplete = (index, type) => {
    const key = `${type}-${index}`;
    const newCompleted = new Set(completedAdhkar);
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
      toast.info('↩️ تم الإلغاء');
    } else {
      newCompleted.add(key);
      toast.success('✅ تم!');
    }
    setCompletedAdhkar(newCompleted);
    // حفظ محلياً
    localStorage.setItem('adhkar_completed', JSON.stringify([...newCompleted]));
  };

  const renderAdhkarList = (adhkarList, type, icon) => (
    <div className="space-y-4">
      {adhkarList.map((dhikr, idx) => {
        const key = `${type}-${idx}`;
        const isCompleted = completedAdhkar.has(key);
        
        return (
          <Card 
            key={idx} 
            className={`border-2 transition-all ${
              isCompleted 
                ? 'bg-emerald-50 border-emerald-400' 
                : 'bg-white border-emerald-200 hover:border-emerald-400'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{icon}</div>
                  <span className="text-amber-600 font-bold text-lg">
                    {dhikr.count > 1 ? `× ${dhikr.count}` : 'مرة واحدة'}
                  </span>
                </div>
                <Button
                  onClick={() => toggleComplete(idx, type)}
                  variant={isCompleted ? 'default' : 'outline'}
                  className={isCompleted ? 'bg-emerald-600' : ''}
                >
                  <CheckCircle className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-6 mb-4 border border-emerald-200">
                <p className="text-2xl text-gray-900 font-arabic leading-loose">
                  {dhikr.text}
                </p>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-200">
                <p className="text-amber-800 text-sm font-bold">
                  💡 الفائدة: {dhikr.benefit}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleCopy(dhikr.text)}
                  variant="outline"
                  className="flex-1 border-emerald-300 hover:bg-emerald-50"
                >
                  <Copy className="w-4 h-4 ml-2" />
                  نسخ
                </Button>
                <Button
                  onClick={() => handleSpeak(dhikr.text)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Volume2 className="w-4 h-4 ml-2" />
                  استماع
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">📿</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4 font-arabic">الأذكار اليومية</h1>
          <p className="text-xl text-gray-700">فَاذْكُرُونِي أَذْكُرْكُمْ</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="morning" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-16">
            <TabsTrigger value="morning" className="text-lg">
              <Sun className="w-5 h-5 ml-2" />
              أذكار الصباح
            </TabsTrigger>
            <TabsTrigger value="evening" className="text-lg">
              <Moon className="w-5 h-5 ml-2" />
              أذكار المساء
            </TabsTrigger>
            <TabsTrigger value="sleep" className="text-lg">
              <Moon className="w-5 h-5 ml-2" />
              أذكار النوم
            </TabsTrigger>
          </TabsList>

          <TabsContent value="morning">
            {renderAdhkarList(MORNING_ADHKAR, 'morning', '☀️')}
          </TabsContent>

          <TabsContent value="evening">
            {renderAdhkarList(EVENING_ADHKAR, 'evening', '🌙')}
          </TabsContent>

          <TabsContent value="sleep">
            {renderAdhkarList(SLEEP_ADHKAR, 'sleep', '😴')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}