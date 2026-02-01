import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Menu, Download, Wifi, WifiOff, Music, BookOpen, Users, BarChart3, Settings, Home, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { offlineStorage } from '@/components/utils/offlineStorage';

const MAIN_SECTIONS = [
  { name: 'الرئيسية', icon: Home, path: 'Home', color: 'emerald' },
  { name: 'القرآن الكريم', icon: BookOpen, path: 'Quran', color: 'emerald' },
  { name: 'التلاوة المتقدمة', icon: Music, path: 'Tilawa', color: 'blue' },
  { name: 'المقرئين', icon: Users, path: 'Reciters', color: 'purple' },
  { name: 'الإحصائيات', icon: BarChart3, path: 'Stats', color: 'orange' },
  { name: 'الإذاعة', icon: Radio, path: 'Radio', color: 'red' },
];

const RAMADAN_SECTION = [
  { name: 'رمضان 2026', icon: '🌙', path: 'RamadanHub', color: 'amber' },
];

const COMMUNITY_SECTION = [
  { name: 'المنتدى', icon: Users, path: 'Forums', color: 'cyan' },
  { name: 'المجتمع', icon: Users, path: 'Community', color: 'teal' },
];

export default function Sidebar() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadedQaris, setDownloadedQaris] = useState(
    JSON.parse(localStorage.getItem('downloaded_qaris') || '[]')
  );

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStorageInfo = () => {
    const size = offlineStorage.getStorageSize();
    const downloaded = downloadedQaris.length;
    return { size, downloaded };
  };

  const { size, downloaded } = getStorageInfo();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50 md:hidden bg-emerald-600 text-white hover:bg-emerald-700">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 bg-gradient-to-b from-gray-50 to-gray-100 border-l-2 border-emerald-300 overflow-y-auto">
        <div className="space-y-6 pt-8">
          {/* Online Status */}
          <div className="px-4">
            <Card className={`flex items-center gap-2 p-3 ${isOnline ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-700">متصل بالإنترنت</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-bold text-red-700">وضع بدون إنترنت</span>
                </>
              )}
            </Card>
          </div>

          {/* Storage Info */}
          <div className="px-4">
            <Card className="bg-blue-50 border-blue-300 p-3">
              <p className="text-xs font-bold text-gray-700 mb-2">💾 المساحة المستخدمة</p>
              <p className="text-sm text-blue-700 font-bold">{size}</p>
              <p className="text-xs text-gray-600">✅ {downloaded} مقرئ محمل</p>
            </Card>
          </div>

          {/* Main Sections */}
          <div className="px-2 space-y-2">
            <p className="text-xs font-bold text-gray-500 px-2">القائمة الرئيسية</p>
            {MAIN_SECTIONS.map((section) => (
              <Link key={section.path} to={createPageUrl(section.path)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-right hover:bg-emerald-100">
                  <section.icon className="w-4 h-4" />
                  <span className="text-sm">{section.name}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Ramadan */}
          <div className="px-2 space-y-2">
            <p className="text-xs font-bold text-gray-500 px-2">🌙 رمضان</p>
            {RAMADAN_SECTION.map((section) => (
              <Link key={section.path} to={createPageUrl(section.path)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-right hover:bg-amber-100">
                  <span>{section.icon}</span>
                  <span className="text-sm">{section.name}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Community */}
          <div className="px-2 space-y-2">
            <p className="text-xs font-bold text-gray-500 px-2">👥 المجتمع</p>
            {COMMUNITY_SECTION.map((section) => (
              <Link key={section.path} to={createPageUrl(section.path)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-right hover:bg-cyan-100">
                  <section.icon className="w-4 h-4" />
                  <span className="text-sm">{section.name}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Download Library */}
          <div className="px-2 space-y-2 border-t-2 border-gray-300 pt-4">
            <p className="text-xs font-bold text-gray-500 px-2 flex items-center gap-2">
              <Download className="w-4 h-4" /> مكتبة التنزيلات
            </p>
            <Link to={createPageUrl('OfflineDownloads')}>
              <Button variant="outline" className="w-full justify-start gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                <Download className="w-4 h-4" />
                <span className="text-sm">إدارة التنزيلات</span>
              </Button>
            </Link>
          </div>

          {/* Settings */}
          <div className="px-2 border-t-2 border-gray-300 pt-4">
            <Link to={createPageUrl('Settings')}>
              <Button variant="outline" className="w-full justify-start gap-3 border-gray-300 text-gray-700 hover:bg-gray-100">
                <Settings className="w-4 h-4" />
                <span className="text-sm">الإعدادات</span>
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}