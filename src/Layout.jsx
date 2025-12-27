import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, BookMarked, Home, User, Clock, MessageSquare, Mic, Sparkles, Bell, Volume2, Users, Menu, X } from 'lucide-react';
import { Toaster } from 'sonner';
import InstallPrompt from '@/components/pwa/InstallPrompt';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    document.title = 'ذكر - القرآن الكريم والتفسير';
    
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = '#059669';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'تطبيق القرآن الكريم الشامل مع التفسير والفقه - صدقة جارية';
  }, []);

  const mainNavItems = [
    { name: 'الرئيسية', path: 'Home', icon: Home },
    { name: 'القرآن', path: 'Quran', icon: BookOpen },
    { name: 'التلاوة', path: 'Tilawa', icon: Volume2 },
    { name: 'الحفظ', path: 'MemorizationPlan', icon: BookMarked },
  ];

  const moreNavItems = [
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

  const allNavItems = [...mainNavItems, ...moreNavItems, ...devNavItems];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Toaster position="top-center" richColors />
      <div className="relative">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800&display=swap');

        * {
          font-family: 'Cairo', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .font-arabic {
          font-family: 'Amiri', serif;
          line-height: 2.5;
        }

        :root {
          --emerald-50: #ecfdf5;
          --emerald-600: #059669;
          --emerald-700: #047857;
          --emerald-800: #065f46;
          --amber-300: #fcd34d;
        }

        /* تسريع الأزرار والتنقل */
        button, a {
          transition: all 0.15s ease !important;
          -webkit-tap-highlight-color: transparent;
        }

        button:active, a:active {
          transform: scale(0.97);
        }

        /* تحسين الأداء */
        * {
          will-change: auto;
        }

        img {
          content-visibility: auto;
        }

        /* إزالة التأخير في اللمس */
        * {
          touch-action: manipulation;
        }
      `}</style>

      {/* Navigation */}
      <nav className="bg-emerald-600 border-b border-emerald-700 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop - الرئيسية فقط */}
          <div className="hidden md:flex items-center justify-center h-16 gap-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.path;
              return (
                <Link key={item.path} to={createPageUrl(item.path)}>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-emerald-700 font-bold'
                        : 'text-white hover:bg-emerald-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-bold">{item.name}</span>
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Mobile - أزرار كبيرة + قائمة */}
          <div className="md:hidden">
            <div className="flex items-center justify-between h-14">
              {/* الأزرار الرئيسية */}
              <div className="flex gap-1 flex-1">
                {mainNavItems.slice(0, 3).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.path;
                  return (
                    <Link key={item.path} to={createPageUrl(item.path)} className="flex-1">
                      <button
                        className={`w-full flex flex-col items-center gap-1 py-2 rounded-lg transition-all ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-900 shadow-md'
                            : 'text-gray-700 active:bg-white/20'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-xs font-bold">{item.name}</span>
                      </button>
                    </Link>
                  );
                })}
              </div>

              {/* زر القائمة */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mr-2 p-2 rounded-lg bg-emerald-600 text-white active:bg-emerald-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* القائمة المنسدلة للموبايل */}
            {mobileMenuOpen && (
              <div className="absolute top-14 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border-b-4 border-emerald-500 max-h-[80vh] overflow-y-auto">
                <div className="p-4 space-y-2">
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
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-right ${
                            isActive
                              ? 'bg-emerald-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-900 active:bg-gray-200'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-bold text-base">{item.name}</span>
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

      {/* Main Content */}
      <main>{children}</main>

      {/* PWA Install Prompt */}
      <InstallPrompt />

      {/* Footer */}
      <footer className="relative mt-8 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
          <div className="text-center">
            <p className="text-lg mb-2 font-arabic text-white">﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾</p>
            <p className="text-amber-200 mb-3 text-sm">اللهم اجعلنا من أهل القرآن وخاصته</p>

            <div className="text-xs text-amber-200 mb-2">
              🤲 صدقة جارية • جزبية عبد الرحيم هارون علي
            </div>
            <div className="text-xs text-white mb-2">
              مجاني بالكامل • zaka.ai
            </div>
            <div className="text-xs text-amber-300">
              © 2024 القرآن الكريم
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}