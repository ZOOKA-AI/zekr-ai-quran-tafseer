import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Zap, Wifi } from 'lucide-react';

export default function PWAInfo() {
  const addManifest = () => {
    const manifest = {
      name: "ذكر - القرآن الكريم والتفسير",
      short_name: "ذكر",
      description: "تطبيق القرآن الكريم الشامل مع التفسير والفقه",
      start_url: "/",
      display: "standalone",
      background_color: "#10b981",
      theme_color: "#059669",
      orientation: "portrait",
      icons: [
        {
          src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%2310b981' width='100' height='100'/><text y='70' x='50' text-anchor='middle' font-size='60' fill='white'>📖</text></svg>",
          sizes: "512x512",
          type: "image/svg+xml"
        }
      ]
    };

    const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = url;
    document.head.appendChild(link);
  };

  React.useEffect(() => {
    addManifest();

    const meta1 = document.createElement('meta');
    meta1.name = 'mobile-web-app-capable';
    meta1.content = 'yes';
    document.head.appendChild(meta1);

    const meta2 = document.createElement('meta');
    meta2.name = 'apple-mobile-web-app-capable';
    meta2.content = 'yes';
    document.head.appendChild(meta2);

    const meta3 = document.createElement('meta');
    meta3.name = 'apple-mobile-web-app-status-bar-style';
    meta3.content = 'black-translucent';
    document.head.appendChild(meta3);

    const meta4 = document.createElement('meta');
    meta4.name = 'apple-mobile-web-app-title';
    meta4.content = 'ذكر';
    document.head.appendChild(meta4);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">📱</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">ثبّت تطبيق ذكر</h1>
          <p className="text-2xl text-emerald-600 font-bold">استخدمه مثل التطبيقات العادية</p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card className="bg-white p-8 shadow-xl border-2 border-emerald-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">سريع جداً</h3>
                <p className="text-gray-700">يفتح فوراً بدون انتظار</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white p-8 shadow-xl border-2 border-blue-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Wifi className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">يعمل بدون نت</h3>
                <p className="text-gray-700">بعد التحميل الأول</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white p-8 shadow-xl border-2 border-purple-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">أيقونة على الشاشة</h3>
                <p className="text-gray-700">افتحه بنقرة واحدة</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">طريقة التثبيت</h2>
          
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-white text-emerald-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">1</span>
                أندرويد - Chrome
              </h3>
              <ul className="space-y-2 mr-12">
                <li>• اضغط على القائمة (⋮) في أعلى المتصفح</li>
                <li>• اختر "إضافة إلى الشاشة الرئيسية"</li>
                <li>• اضغط "إضافة" أو "تثبيت"</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-white text-emerald-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">2</span>
                آيفون - Safari
              </h3>
              <ul className="space-y-2 mr-12">
                <li>• اضغط على زر المشاركة (□↑)</li>
                <li>• مرر للأسفل واختر "Add to Home Screen"</li>
                <li>• اضغط "Add"</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-white text-emerald-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">3</span>
                الكمبيوتر - Chrome
              </h3>
              <ul className="space-y-2 mr-12">
                <li>• اضغط على أيقونة التثبيت في شريط العنوان</li>
                <li>• أو اضغط القائمة واختر "تثبيت ذكر"</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}