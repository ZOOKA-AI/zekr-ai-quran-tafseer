import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ALL_SURAHS } from '@/components/quran/QuranData';

export default function Tafsir() {
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [active, setActive] = useState('kathir');

  const { data: verse, isLoading } = useQuery({
    queryKey: ['tafsir', surah, ayah],
    queryFn: async () => {
      const rows = await base44.entities.Verse.filter({ surah_number: surah, verse_number: ayah });
      return rows?.[0] || null;
    },
  });

  const currentSurah = ALL_SURAHS.find((s) => s.number === Number(surah));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 font-arabic">التفسير الميسر</h1>
          <p className="text-gray-700">ابن كثير • الطبري • السعدي</p>
        </div>

        {/* Controls */}
        <Card className="bg-white/90 border-2 border-emerald-200 shadow-lg mb-8">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-emerald-700">اختر السورة</label>
              <Select value={String(surah)} onValueChange={(v) => setSurah(Number(v))}>
                <SelectTrigger className="bg-white h-11 border-emerald-300">
                  <SelectValue placeholder="السورة" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-80">
                  {ALL_SURAHS.map((s) => (
                    <SelectItem key={s.number} value={String(s.number)}>
                      {s.number}. {s.name} — {s.verses_count} آية
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-emerald-700">رقم الآية</label>
              <Input
                type="number"
                min={1}
                value={ayah}
                onChange={(e) => setAyah(Number(e.target.value || 1))}
                className="h-11 border-emerald-300"
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-11">عرض التفسير</Button>
            </div>
          </CardContent>
        </Card>

        {/* Verse */}
        <Card className="bg-white/90 border-2 border-emerald-200 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-700">
              {currentSurah ? `﴿ ${currentSurah.arabic_name} ﴾ • آية ${ayah}` : 'الآية'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-600">جاري التحميل...</p>
            ) : verse ? (
              <p className="text-3xl text-gray-900 font-arabic leading-loose text-center">{verse.arabic_text}</p>
            ) : (
              <p className="text-gray-600">لا توجد بيانات لهذه الآية حالياً.</p>
            )}
          </CardContent>
        </Card>

        {/* Tafsir Tabs */}
        <Tabs value={active} onValueChange={setActive} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 h-12">
            <TabsTrigger value="kathir" className="text-base">ابن كثير</TabsTrigger>
            <TabsTrigger value="tabari" className="text-base">الطبري</TabsTrigger>
            <TabsTrigger value="saadi" className="text-base">السعدي</TabsTrigger>
          </TabsList>

          <TabsContent value="kathir">
            <Card className="bg-white/90 border-2 border-emerald-200 shadow">
              <CardContent className="p-6">
                {verse?.tafsir_kathir ? (
                  <div className="prose prose-slate max-w-none font-arabic leading-relaxed text-xl">{verse.tafsir_kathir}</div>
                ) : (
                  <p className="text-gray-600">تفسير ابن كثير غير متوفر لهذه الآية.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tabari">
            <Card className="bg-white/90 border-2 border-emerald-200 shadow">
              <CardContent className="p-6">
                {verse?.tafsir_tabari ? (
                  <div className="prose prose-slate max-w-none font-arabic leading-relaxed text-xl">{verse.tafsir_tabari}</div>
                ) : (
                  <p className="text-gray-600">تفسير الطبري غير متوفر لهذه الآية.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saadi">
            <Card className="bg-white/90 border-2 border-emerald-200 shadow">
              <CardContent className="p-6">
                {verse?.tafsir_saadi ? (
                  <div className="prose prose-slate max-w-none font-arabic leading-relaxed text-xl">{verse.tafsir_saadi}</div>
                ) : (
                  <p className="text-gray-600">تفسير السعدي غير متوفر لهذه الآية.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}