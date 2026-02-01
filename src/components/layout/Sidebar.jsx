import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Menu, Download, Wifi, WifiOff, Music, BookOpen, Users, BarChart3, Settings, Home, Radio,
  Heart, Award, MessageSquare, Mic, Moon, Sun, Clock, Sparkles, BookMarked, X, ChevronDown, ChevronUp,
  Bell, Volume2, Palette
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { offlineStorage } from '@/components/utils/offlineStorage';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = {
  main: {
    title: '📖 القائمة الرئيسية',
    items: [
      { name: 'الرئيسية', icon: Home, path: 'Home', color: 'emerald', emoji: '🏠' },
      { name: 'القرآن الكريم', icon: BookOpen, path: 'Quran', color: 'emerald', emoji: '📖' },
      { name: 'التلاوة المتقدمة', icon: Music, path: 'Tilawa', color: 'blue', emoji: '🎧' },
      { name: 'المقرئين', icon: Mic, path: 'Reciters', color: 'purple', emoji: '🎤' },
      { name: 'خطة الحفظ', icon: BookMarked, path: 'MemorizationPlan', color: 'amber', emoji: '📚' },
    ]
  },
  audio: {
    title: '🎵 الصوتيات',
    items: [
      { name: 'الراديو والمبتهلين', icon: Radio, path: 'Radio', color: 'purple', emoji: '📻' },
      { name: 'المؤذن', icon: Bell, path: 'Radio', color: 'amber', emoji: '🕌' },
    ]
  },
  worship: {
    title: '🤲 العبادات',
    items: [
      { name: 'الأدعية', icon: Sparkles, path: 'Duaa', color: 'purple', emoji: '🤲' },
      { name: 'الأذكار', icon: Sun, path: 'Adhkar', color: 'amber', emoji: '📿' },
      { name: 'أوقات الصلاة', icon: Clock, path: 'PrayerTimes', color: 'green', emoji: '🕌' },
    ]
  },
  ramadan: {
    title: '🌙 رمضان',
    items: [
      { name: 'مركز رمضان', icon: Moon, path: 'RamadanHub', color: 'purple', emoji: '🌙' },
    ]
  },
  community: {
    title: '👥 المجتمع',
    items: [
      { name: 'المنتدى', icon: MessageSquare, path: 'Forums', color: 'cyan', emoji: '💬' },
      { name: 'المجتمع', icon: Users, path: 'Community', color: 'teal', emoji: '👥' },
      { name: 'تلاوات مشتركة', icon: Music, path: 'SharedTilawat', color: 'blue', emoji: '🎵' },
    ]
  },
  kids: {
    title: '👶 الأطفال',
    items: [
      { name: 'ركن الأطفال', icon: Users, path: 'Kids', color: 'pink', emoji: '🧒' },
    ]
  },
  charity: {
    title: '💖 الصدقات',
    items: [
      { name: 'خدمة الأيتام', icon: Heart, path: 'OrphansService', color: 'rose', emoji: '💖' },
    ]
  },
  stats: {
    title: '📊 الإحصائيات',
    items: [
      { name: 'إحصائياتي', icon: BarChart3, path: 'Stats', color: 'orange', emoji: '📊' },
      { name: 'الإنجازات', icon: Award, path: 'Achievements', color: 'amber', emoji: '🏆' },
    ]
  },
  media: {
    title: '📻 الوسائط',
    items: [
      { name: 'الخط العربي', icon: Sparkles, path: 'Calligraphy', color: 'indigo', emoji: '✍️' },
    ]
  },
  offline: {
    title: '📥 بدون إنترنت',
    items: [
      { name: 'إدارة التنزيلات', icon: Download, path: 'OfflineDownloads', color: 'green', emoji: '📥' },
      { name: 'المفضلة', icon: BookMarked, path: 'Favorites', color: 'pink', emoji: '💖' },
      { name: 'الإشارات المرجعية', icon: BookMarked, path: 'Bookmarks', color: 'blue', emoji: '🔖' },
    ]
  },
  settings: {
    title: '⚙️ الإعدادات',
    items: [
      { name: 'الإعدادات', icon: Settings, path: 'Settings', color: 'gray', emoji: '⚙️' },
      { name: 'المساعد الذكي', icon: MessageSquare, path: 'Assistant', color: 'purple', emoji: '🤖' },
      { name: 'معلومات التطبيق', icon: Sparkles, path: 'PWAInfo', color: 'blue', emoji: '📱' },
    ]
  }
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [expandedSections, setExpandedSections] = useState(['main', 'worship']);
  const [storageInfo, setStorageInfo] = useState({ size: '0 KB', downloaded: 0 });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load storage info
    const size = offlineStorage.getStorageSize();
    const downloaded = JSON.parse(localStorage.getItem('downloaded_qaris') || '[]').length;
    setStorageInfo({ size, downloaded });
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(s => s !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-800 text-white relative overflow-hidden">
        {/* Stars decoration */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.6
              }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">🕌 ذِكْر</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm opacity-90">القرآن الكريم • التفسير • الابتهالات</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="p-3 border-b">
        <Card className={`flex items-center gap-2 p-2 ${isOnline ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-green-700">متصل بالإنترنت</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-red-700">وضع بدون إنترنت</span>
            </>
          )}
        </Card>
      </div>

      {/* Storage Info */}
      <div className="px-3 py-2 border-b bg-blue-50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">💾 المساحة:</span>
          <span className="font-bold text-blue-700">{storageInfo.size}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-gray-600">✅ محمل:</span>
          <Badge variant="outline" className="text-xs">{storageInfo.downloaded} مقرئ</Badge>
        </div>
      </div>

      {/* Navigation Sections */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {Object.entries(SECTIONS).map(([key, section]) => (
            <div key={key} className="mb-1">
              <button
                onClick={() => toggleSection(key)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-bold text-gray-700">{section.title}</span>
                {expandedSections.includes(key) ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSections.includes(key) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-0.5 pr-2">
                      {section.items.map((item) => (
                        <Link 
                          key={item.path} 
                          to={createPageUrl(item.path)}
                          onClick={() => setIsOpen(false)}
                        >
                          <Button 
                            variant="ghost" 
                            className={`w-full justify-start gap-2 text-right h-9 hover:bg-${item.color}-50 hover:text-${item.color}-700`}
                          >
                            <span className="text-base">{item.emoji}</span>
                            <span className="text-sm">{item.name}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50">
        <p className="text-xs text-center text-gray-500">
          صدقة جارية لوجه الله تعالى 🤲
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="fixed left-4 top-4 z-50 md:hidden bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-80 p-0 bg-white">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - Hidden for now, can be enabled */}
      {/* 
      <div className="hidden lg:block fixed right-0 top-0 h-full w-64 bg-white border-l shadow-lg z-40">
        <SidebarContent />
      </div>
      */}
    </>
  );
}