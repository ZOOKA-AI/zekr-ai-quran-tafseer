import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

// قاعدة بيانات تفاسير مثالية
const TAFSIR_DATABASE = {
  saadi: {
    name: 'تفسير السعدي',
    description: 'تيسير الكريم الرحمن في تفسير كلام المنان',
    color: 'emerald',
    samples: {
      '1:1': 'بسم الله: أي أبتدئ بكل اسم لله تعالى، لأن لفظ "اسم" مفرد مضاف، فيعم جميع الأسماء الحسنى',
      '2:255': 'هذه آية الكرسي، وهي أعظم آية في القرآن، تضمنت من أصول الأسماء والصفات ما لم تتضمنه آية أخرى'
    }
  },
  kathir: {
    name: 'تفسير ابن كثير',
    description: 'تفسير القرآن العظيم',
    color: 'blue',
    samples: {
      '1:1': 'بسم الله الرحمن الرحيم: افتتح تعالى كتابه العزيز بالبسملة، وهي من القرآن في أول كل سورة',
      '2:255': 'هذه آية الكرسي ولها شأن عظيم، وقد صح الحديث بأنها أعظم آية في القرآن الكريم'
    }
  },
  tabari: {
    name: 'تفسير الطبري',
    description: 'جامع البيان في تأويل القرآن',
    color: 'purple',
    samples: {
      '1:1': 'القول في تأويل البسملة: اختلف أهل التأويل في تأويلها، فمنهم من قال: معناه أبدأ بكل اسم لله',
      '2:255': 'يقول تعالى ذكره: الله الذي له عبادة الخلق، لا إله غيره ولا رب سواه'
    }
  }
};

export default function TafsirViewer({ surah, verse, arabicText }) {
  const [expandedTafsir, setExpandedTafsir] = useState('saadi');
  const [showAll, setShowAll] = useState(false);

  const getTafsir = (tafsirId) => {
    const key = `${surah}:${verse}`;
    return TAFSIR_DATABASE[tafsirId].samples[key] || 'التفسير غير متوفر حالياً لهذه الآية';
  };

  return (
    <Card className="bg-white shadow-xl border-2 border-emerald-300 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6" />
          <div>
            <h3 className="text-xl font-bold">التفاسير</h3>
            <p className="text-emerald-100 text-sm">سورة {surah} - آية {verse}</p>
          </div>
        </div>
      </div>

      {/* نص الآية */}
      <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-b-2 border-emerald-200">
        <p className="text-3xl font-arabic text-gray-900 leading-loose text-center">
          {arabicText}
        </p>
      </div>

      {/* التفاسير */}
      <div className="p-6">
        <Tabs value={expandedTafsir} onValueChange={setExpandedTafsir}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="saadi" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              السعدي
            </TabsTrigger>
            <TabsTrigger value="kathir" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              ابن كثير
            </TabsTrigger>
            <TabsTrigger value="tabari" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              الطبري
            </TabsTrigger>
          </TabsList>

          {Object.entries(TAFSIR_DATABASE).map(([id, tafsir]) => (
            <TabsContent key={id} value={id}>
              <div className={`bg-${tafsir.color}-50 border-2 border-${tafsir.color}-300 rounded-xl p-6`}>
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{tafsir.name}</h4>
                  <p className="text-gray-600 text-sm">{tafsir.description}</p>
                </div>

                <div className="bg-white rounded-lg p-4 border-r-4 border-emerald-500">
                  <p className={`text-gray-800 leading-relaxed text-lg ${!showAll ? 'line-clamp-4' : ''}`}>
                    {getTafsir(id)}
                  </p>
                  
                  {!showAll && getTafsir(id).length > 200 && (
                    <Button
                      onClick={() => setShowAll(true)}
                      variant="ghost"
                      className="mt-3 text-emerald-600"
                    >
                      <ChevronDown className="w-4 h-4 ml-2" />
                      عرض المزيد
                    </Button>
                  )}
                  
                  {showAll && (
                    <Button
                      onClick={() => setShowAll(false)}
                      variant="ghost"
                      className="mt-3 text-emerald-600"
                    >
                      <ChevronUp className="w-4 h-4 ml-2" />
                      عرض أقل
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Card>
  );
}