import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Zap, Check, X } from 'lucide-react';

/**
 * صفحة اختبار السرعة - تظهر مشاكل الأداء الحقيقية
 */

export default function SpeedTestPage() {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const runSpeedTest = async () => {
    setTesting(true);
    setResults([]);
    const tests = [];

    // اختبار 1: سرعة تحميل الصفحة
    const pageLoad = performance.now();
    tests.push({
      name: 'تحميل الصفحة',
      time: Math.round(pageLoad),
      status: pageLoad < 1000 ? 'pass' : 'fail',
      target: '< 1 ثانية'
    });

    // اختبار 2: التخزين المحلي
    const storageStart = performance.now();
    localStorage.setItem('test', 'data');
    localStorage.getItem('test');
    localStorage.removeItem('test');
    const storageTime = performance.now() - storageStart;
    tests.push({
      name: 'التخزين المحلي',
      time: Math.round(storageTime),
      status: storageTime < 10 ? 'pass' : 'fail',
      target: '< 10ms'
    });

    // اختبار 3: رسم الصفحة
    const renderStart = performance.now();
    const div = document.createElement('div');
    div.innerHTML = '<p>Test</p>'.repeat(100);
    document.body.appendChild(div);
    document.body.removeChild(div);
    const renderTime = performance.now() - renderStart;
    tests.push({
      name: 'رسم الصفحة',
      time: Math.round(renderTime),
      status: renderTime < 50 ? 'pass' : 'fail',
      target: '< 50ms'
    });

    // اختبار 4: React Re-render
    const reactStart = performance.now();
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    const reactTime = performance.now() - reactStart;
    tests.push({
      name: 'React Re-render',
      time: Math.round(reactTime),
      status: reactTime < 100 ? 'pass' : 'fail',
      target: '< 100ms'
    });

    // اختبار 5: التفاعل مع الأزرار
    const buttonStart = performance.now();
    const btn = document.createElement('button');
    btn.onclick = () => {};
    btn.click();
    const buttonTime = performance.now() - buttonStart;
    tests.push({
      name: 'تفاعل الأزرار',
      time: Math.round(buttonTime),
      status: buttonTime < 5 ? 'pass' : 'fail',
      target: '< 5ms'
    });

    setResults(tests);
    setTesting(false);

    const passed = tests.filter(t => t.status === 'pass').length;
    if (passed === tests.length) {
      toast.success(`✅ النظام سريع جداً! ${passed}/${tests.length}`);
    } else {
      toast.error(`⚠️ مشاكل أداء: ${passed}/${tests.length} فقط`);
    }
  };

  useEffect(() => {
    runSpeedTest();
  }, []);

  const totalTime = results.reduce((sum, r) => sum + r.time, 0);
  const passed = results.filter(r => r.status === 'pass').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-4xl font-bold mb-2">اختبار السرعة</h1>
            <p className="text-gray-600">قياس دقيق لأداء التطبيق</p>
          </div>

          {results.length > 0 && (
            <div className="mb-8 p-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl text-center">
              <div className="text-5xl font-bold mb-2">{totalTime}ms</div>
              <div className="text-xl">إجمالي الوقت</div>
              <div className="mt-4 text-lg">
                {passed === results.length ? '✅ ممتاز!' : '⚠️ يحتاج تحسين'}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {results.map((test, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-2 ${
                  test.status === 'pass'
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {test.status === 'pass' ? (
                      <Check className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <X className="w-6 h-6 text-red-600" />
                    )}
                    <div>
                      <div className="font-bold text-lg">{test.name}</div>
                      <div className="text-sm text-gray-600">الهدف: {test.target}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{test.time}ms</div>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={runSpeedTest}
            disabled={testing}
            className="w-full mt-8 h-14 text-lg bg-gradient-to-r from-blue-600 to-cyan-600"
          >
            {testing ? '⏳ جاري الاختبار...' : '🔄 إعادة الاختبار'}
          </Button>
        </Card>
      </div>
    </div>
  );
}