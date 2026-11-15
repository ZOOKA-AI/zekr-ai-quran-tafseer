import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Cpu, Loader2, ShieldCheck, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TAFSIR_SOURCES, getTafsir, selectPassages } from '@/lib/localTafsir';
import { checkSupport, explainFromPassage, getLoadedModelId, loadModel } from '@/lib/localModel';

// مفتاح الميزة: التبسيط الآلي مخفي افتراضياً. أظهره فقط بتعيين
// VITE_ENABLE_LOCAL_SIMPLIFY=true (راجع docs/LOCAL_TAFSIR.md).
const SIMPLIFY_ENABLED = import.meta.env.VITE_ENABLE_LOCAL_SIMPLIFY === 'true';

/**
 * «اسأل عن آية»
 * 1) يعرض نص التفسير من مصدر مسمّى (بلا أي نموذج، ويعمل دون اتصال بعد أول فتح).
 * 2) اختيارياً: نموذج صغير يعمل على جهاز المستخدم يبسّط ذلك النص ويجيب منه فقط.
 * لا يُرسل السؤال إلى أي خادم.
 */
export default function AskAboutVerse({ surah, ayah, verseText }) {
  const [slug, setSlug] = useState(TAFSIR_SOURCES[0].slug);
  const [question, setQuestion] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [support, setSupport] = useState(null); // null = جارٍ الفحص
  const [modelId, setModelId] = useState(getLoadedModelId());
  const [load, setLoad] = useState(null); // { progress, text }
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const source = TAFSIR_SOURCES.find((s) => s.slug === slug);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['local-tafsir', slug, surah, ayah],
    queryFn: () => getTafsir(slug, surah, ayah),
    enabled: Number(surah) >= 1 && Number(ayah) >= 1,
    staleTime: Infinity,
    retry: 1,
  });

  useEffect(() => {
    let alive = true;
    checkSupport().then((s) => alive && setSupport(s));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setAnswer('');
    setError('');
    setExpanded(false);
  }, [slug, surah, ayah]);

  const text = data?.text || '';
  const shown = expanded || text.length <= 900 ? text : `${text.slice(0, 900)}…`;

  const handleExplain = async () => {
    if (!text || busy) return;
    setBusy(true);
    setError('');
    setAnswer('');
    try {
      if (!getLoadedModelId()) {
        setLoad({ progress: 0, text: '' });
        const { modelId: id } = await loadModel(setLoad);
        setModelId(id);
        setLoad(null);
      }
      await explainFromPassage(
        {
          verseText,
          sourceName: source.name,
          passage: selectPassages(text, question),
          question: question.trim(),
        },
        setAnswer
      );
    } catch (err) {
      console.error('local model error:', err);
      setLoad(null);
      setError('تعذّر تشغيل النموذج على هذا الجهاز. نص التفسير أعلاه متاح كما هو.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="bg-white/90 border-2 border-amber-200 shadow-lg mb-6" dir="rtl">
      <CardHeader>
        <CardTitle className="text-2xl text-amber-700 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          {SIMPLIFY_ENABLED ? 'اسأل عن الآية' : 'تفسير الآية من مصدره'}
        </CardTitle>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          {SIMPLIFY_ENABLED
            ? 'النص من كتاب تفسير مسمّى، والتبسيط يعمل على جهازك. سؤالك لا يُرسل إلى أي خادم.'
            : 'النص منقول كما هو من كتاب تفسير مسمّى، دون أي معالجة آلية ودون إرسال شيء إلى أي خادم.'}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2 text-amber-700">مصدر التفسير</label>
          <Select value={slug} onValueChange={setSlug}>
            <SelectTrigger className="bg-white h-11 border-amber-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {TAFSIR_SOURCES.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name} — {s.author}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          {isLoading ? (
            <p className="text-gray-600">جاري تحميل التفسير...</p>
          ) : isError ? (
            <p className="text-gray-700 flex items-center gap-2">
              <WifiOff className="w-4 h-4 shrink-0" />
              تعذّر تحميل التفسير. الآيات التي فتحتها من قبل تبقى متاحة دون اتصال.
            </p>
          ) : text ? (
            <>
              <p className="text-xs text-amber-800 font-bold mb-2">
                المصدر: {source.name}
                {data.fromAyah !== Number(ayah) ? ` (ضمن تفسير الآية ${data.fromAyah})` : ''}
              </p>
              <p className="font-arabic text-lg leading-loose text-gray-900 whitespace-pre-line">{shown}</p>
              {text.length > 900 && (
                <Button variant="link" className="px-0 text-amber-700" onClick={() => setExpanded((v) => !v)}>
                  {expanded ? 'عرض أقل' : 'عرض النص كاملاً'}
                </Button>
              )}
            </>
          ) : (
            <p className="text-gray-600">لا يوجد نص لهذه الآية في هذا المصدر.</p>
          )}
        </div>

        {SIMPLIFY_ENABLED && text && support?.ok && (
          <div className="space-y-3">
            <label className="block text-sm font-bold text-amber-700">سؤالك عن الآية (اختياري)</label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="مثال: ما المقصود بالصراط المستقيم؟"
              className="h-11 border-amber-300"
              maxLength={200}
            />
            <Button onClick={handleExplain} disabled={busy} className="w-full bg-amber-600 hover:bg-amber-700 h-11">
              {busy ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Cpu className="w-4 h-4 ml-2" />}
              {modelId ? 'بسّط وأجب من نص التفسير' : 'نزّل النموذج الصغير وبسّط النص'}
            </Button>
            {!modelId && !load && (
              <p className="text-xs text-gray-600">
                أول استخدام ينزّل نموذج Qwen2.5-1.5B المفتوح إلى متصفحك مرة واحدة (نحو 1 غيغابايت). يُفضّل
                الاتصال بشبكة Wi-Fi.
              </p>
            )}
            {load && (
              <div>
                <Progress value={Math.round((load.progress || 0) * 100)} />
                <p className="text-xs text-gray-600 mt-1" dir="ltr">
                  {Math.round((load.progress || 0) * 100)}%
                </p>
              </div>
            )}
          </div>
        )}

        {SIMPLIFY_ENABLED && text && support && !support.ok && (
          <p className="text-sm text-gray-600">
            التبسيط الآلي يحتاج متصفحاً يدعم WebGPU. نص التفسير أعلاه متاح كاملاً على جهازك.
          </p>
        )}

        {error && <p className="text-sm text-red-700">{error}</p>}

        {answer && (
          <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
            <p className="font-arabic text-lg leading-loose text-gray-900 whitespace-pre-line">{answer}</p>
            <p className="text-xs text-gray-600 mt-3 border-t border-emerald-200 pt-2">
              تبسيط آلي لنص {source.name} بنموذج صغير يعمل على جهازك{modelId ? ` (${modelId})` : ''}. قد يخطئ؛
              المرجع هو نص التفسير أعلاه، وفي الأحكام يُرجع إلى أهل العلم.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
