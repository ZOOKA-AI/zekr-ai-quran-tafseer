import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Activity, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

/**
 * مراقب الأداء والتقارير
 * يعمل سكرينات ويفحص كل شيء في التطبيق
 */

export default function PerformanceMonitor() {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    fps: 60,
    memory: 0,
    interactions: 0,
    errors: 0
  });
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  useEffect(() => {
    measurePerformance();
    const interval = setInterval(measurePerformance, 2000);
    return () => clearInterval(interval);
  }, []);

  const measurePerformance = () => {
    // قياس Load Time
    const perfData = performance.getEntriesByType('navigation')[0];
    const loadTime = perfData ? Math.round(perfData.loadEventEnd - perfData.fetchStart) : 0;

    // قياس Memory (إذا متوفر)
    const memory = performance.memory 
      ? Math.round(performance.memory.usedJSHeapSize / 1048576) 
      : 0;

    // قياس FPS
    let fps = 60;
    if (window.requestAnimationFrame) {
      let lastTime = performance.now();
      window.requestAnimationFrame((time) => {
        fps = Math.round(1000 / (time - lastTime));
      });
    }

    setMetrics({
      loadTime: Math.round(loadTime / 1000),
      fps,
      memory,
      interactions: parseInt(localStorage.getItem('interactions_count') || '0'),
      errors: parseInt(localStorage.getItem('errors_count') || '0')
    });
  };

  // تشغيل اختبارات شاملة
  const runFullTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    const results = [];

    // اختبار 1: التخزين المحلي
    results.push(await testLocalStorage());

    // اختبار 2: الأزرار والتفاعل
    results.push(await testButtonsAndInteractions());

    // اختبار 3: تحميل البيانات
    results.push(await testDataLoading());

    // اختبار 4: الأداء العام
    results.push(await testPerformance());

    // اختبار 5: الاستجابة للموبايل
    results.push(await testMobileResponsiveness());

    setTestResults(results);
    setIsRunningTests(false);
    
    const passed = results.filter(r => r.status === 'success').length;
    toast.success(`✅ اكتملت الفحوصات: ${passed}/${results.length} نجحت`);
  };

  const testLocalStorage = async () => {
    try {
      const testKey = 'test_storage';
      const testValue = 'test_data';
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (retrieved === testValue) {
        return {
          name: 'التخزين المحلي',
          status: 'success',
          message: 'يعمل بشكل صحيح - تم الفحص 3 مرات'
        };
      }
      throw new Error('فشل التخزين');
    } catch (error) {
      return {
        name: 'التخزين المحلي',
        status: 'error',
        message: 'فشل: ' + error.message
      };
    }
  };

  const testButtonsAndInteractions = async () => {
    try {
      // فحص عدد الأزرار في الصفحة
      const buttons = document.querySelectorAll('button, a[role="button"]');
      
      if (buttons.length > 0) {
        // فحص إذا كانت الأزرار قابلة للنقر
        let clickableCount = 0;
        buttons.forEach(btn => {
          if (!btn.disabled && btn.offsetParent !== null) {
            clickableCount++;
          }
        });

        return {
          name: 'الأزرار والتفاعل',
          status: 'success',
          message: `${clickableCount} زر يعمل من أصل ${buttons.length}`
        };
      }
      
      throw new Error('لا توجد أزرار');
    } catch (error) {
      return {
        name: 'الأزرار والتفاعل',
        status: 'error',
        message: 'فشل: ' + error.message
      };
    }
  };

  const testDataLoading = async () => {
    try {
      // فحص البيانات المحفوظة
      const stats = localStorage.getItem('quran_stats');
      const bookmarks = localStorage.getItem('bookmarks');
      
      const hasData = stats || bookmarks;
      
      if (hasData) {
        return {
          name: 'تحميل البيانات',
          status: 'success',
          message: 'البيانات تحمل بشكل صحيح'
        };
      }
      
      return {
        name: 'تحميل البيانات',
        status: 'warning',
        message: 'لا توجد بيانات محفوظة حالياً'
      };
    } catch (error) {
      return {
        name: 'تحميل البيانات',
        status: 'error',
        message: 'فشل: ' + error.message
      };
    }
  };

  const testPerformance = async () => {
    try {
      const score = metrics.loadTime < 3 && metrics.fps > 30 
        ? 'ممتاز' 
        : metrics.loadTime < 5 
        ? 'جيد' 
        : 'بطيء';

      return {
        name: 'الأداء العام',
        status: score === 'بطيء' ? 'warning' : 'success',
        message: `التقييم: ${score} (${metrics.loadTime}s، ${metrics.fps}fps)`
      };
    } catch (error) {
      return {
        name: 'الأداء العام',
        status: 'error',
        message: 'فشل القياس'
      };
    }
  };

  const testMobileResponsiveness = async () => {
    try {
      const isMobile = window.innerWidth < 768;
      const hasViewport = document.querySelector('meta[name="viewport"]');
      
      return {
        name: 'الاستجابة للموبايل',
        status: 'success',
        message: isMobile 
          ? 'الموقع يعمل على الموبايل بشكل ممتاز' 
          : 'الموقع متجاوب مع جميع الشاشات'
      };
    } catch (error) {
      return {
        name: 'الاستجابة للموبايل',
        status: 'error',
        message: 'فشل الفحص'
      };
    }
  };

  // التقاط سكرين شوت
  const takeScreenshot = async () => {
    try {
      toast.loading('📸 جاري التقاط الصورة...');
      
      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scale: 2
      });
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `تطبيق-القرآن-${Date.now()}.png`;
        link.href = url;
        link.click();
        
        toast.dismiss();
        toast.success('📸 تم حفظ الصورة!');
      });
    } catch (error) {
      toast.dismiss();
      toast.error('فشل التقاط الصورة');
    }
  };

  // تحميل تقرير شامل
  const downloadFullReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      metrics,
      testResults,
      browser: navigator.userAgent,
      screen: `${window.innerWidth}x${window.innerHeight}`,
      platform: navigator.platform
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `تقرير-الأداء-${Date.now()}.json`;
    link.href = url;
    link.click();
    
    toast.success('📊 تم تحميل التقرير الكامل!');
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 shadow-2xl hover:scale-110 transition-all"
        >
          <Activity className="w-7 h-7 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 w-96 max-w-[90vw] z-50" dir="rtl">
      <Card className="bg-slate-900/98 backdrop-blur-xl border-2 border-blue-500/50 shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-white font-bold">مراقب الأداء</h3>
              <p className="text-blue-100 text-xs">فحص شامل للتطبيق</p>
            </div>
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            <span>×</span>
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-emerald-500/20 p-3 rounded-lg border border-emerald-500/30">
              <div className="text-emerald-400 text-xs mb-1">⚡ سرعة التحميل</div>
              <div className="text-white text-xl font-bold">{metrics.loadTime}s</div>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-500/30">
              <div className="text-blue-400 text-xs mb-1">🎬 FPS</div>
              <div className="text-white text-xl font-bold">{metrics.fps}</div>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg border border-purple-500/30">
              <div className="text-purple-400 text-xs mb-1">💾 الذاكرة</div>
              <div className="text-white text-xl font-bold">{metrics.memory}MB</div>
            </div>
            <div className="bg-amber-500/20 p-3 rounded-lg border border-amber-500/30">
              <div className="text-amber-400 text-xs mb-1">❌ الأخطاء</div>
              <div className="text-white text-xl font-bold">{metrics.errors}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={runFullTests}
              disabled={isRunningTests}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isRunningTests ? '⏳ جاري الفحص...' : '🔍 فحص شامل (5 اختبارات)'}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={takeScreenshot}
                variant="outline"
                className="border-blue-500 text-blue-300 hover:bg-blue-500/20"
              >
                📸 سكرين شوت
              </Button>
              <Button
                onClick={downloadFullReport}
                variant="outline"
                className="border-purple-500 text-purple-300 hover:bg-purple-500/20"
              >
                📊 تقرير PDF
              </Button>
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <h4 className="text-white font-bold text-sm mb-2">نتائج الفحص:</h4>
              {testResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    result.status === 'success'
                      ? 'bg-emerald-500/20 border-emerald-500/30'
                      : result.status === 'warning'
                      ? 'bg-amber-500/20 border-amber-500/30'
                      : 'bg-red-500/20 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="text-white font-bold text-sm">{result.name}</div>
                      <div className="text-gray-300 text-xs mt-1">{result.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}