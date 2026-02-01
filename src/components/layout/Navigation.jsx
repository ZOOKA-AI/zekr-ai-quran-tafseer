import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, BookMarked, Home, Volume2, Users, Clock, Sparkles, Mic, MessageSquare, User, Menu, X } from 'lucide-react';

const mainNavItems = [
  { name: 'الرئيسية', path: 'Home', icon: Home },
  { name: 'القرآن', path: 'Quran', icon: BookOpen },
  { name: 'التلاوة', path: 'Tilawa', icon: Volume2 },
  { name: 'الحفظ', path: 'MemorizationPlan', icon: BookMarked },
];

const moreNavItems = [
  { name: '💖 المفضلة', path: 'Favorites', icon: BookMarked },
  { name: '💬 المجتمع', path: 'Community', icon: Users },
  { name: '📥 التحميلات', path: 'OfflineDownloads', icon: Volume2 },
  { name: 'الأطفال', path: 'Kids', icon: Users },
  { name: 'الإحصائيات', path: 'Stats', icon: Clock },
  { name: 'الإنجازات', path: 'Achievements', icon: Sparkles },
  { name: 'الراديو', path: 'Radio', icon: Volume2 },
  { name: 'المقرئين', path: 'Reciters', icon: Mic },
  { name: 'الأدعية', path: 'Duaa', icon: Sparkles },
  { name: 'الأذكار', path: 'Adhkar', icon: BookOpen },
  { name: 'الخطوط', path: 'Calligraphy', icon: Sparkles },
  { name: 'المساعد', path: 'Assistant', icon: MessageSquare },
  { name: 'الإعدادات', path: 'Settings', icon: User },
  { name: '📱 تثبيت التطبيق', path: 'PWAInfo', icon: User },
];

const devNavItems = [
  { name: '✅ قائمة التنفيذ', path: 'ImplementationChecklist', icon: BookMarked },
  { name: '📊 مخطط المشروع', path: 'ProjectChart', icon: Clock },
  { name: '📚 دليل المشروع', path: 'ProjectDocumentation', icon: BookMarked },
  { name: '💻 الكود الكامل', path: 'CompleteCodeReference', icon: BookMarked },
];

export default function Navigation({ currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const allNavItems = [...mainNavItems, ...moreNavItems, ...devNavItems];

  return (
    <nav className="bg-emerald-600 border-b border-emerald-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-center h-12 gap-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPageName === item.path;
            return (
              <Link key={item.path} to={createPageUrl(item.path)}>
                <button
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-emerald-700 font-bold'
                      : 'text-white hover:bg-emerald-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-bold">{item.name}</span>
                </button>
              </Link>
            );
          })}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-12">
            <div className="flex gap-0.5 flex-1">
              {mainNavItems.slice(0, 3).map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.path;
                return (
                  <Link key={item.path} to={createPageUrl(item.path)} className="flex-1">
                    <button
                      className={`w-full flex flex-col items-center gap-0.5 py-1.5 rounded transition-all ${
                        isActive
                          ? 'bg-white text-emerald-700'
                          : 'text-white active:bg-emerald-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[10px] font-bold">{item.name}</span>
                    </button>
                  </Link>
                );
              })}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mr-1 p-1.5 rounded bg-emerald-600 text-white active:bg-emerald-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* القائمة المنسدلة */}
          {mobileMenuOpen && (
            <div className="absolute top-12 left-0 right-0 bg-white shadow-lg border-b-2 border-emerald-500 max-h-[80vh] overflow-y-auto">
              <div className="p-2 space-y-1">
                {allNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      to={createPageUrl(item.path)}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <button
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded transition-all text-right ${
                          isActive
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-900 active:bg-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-bold">{item.name}</span>
                      </button>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}