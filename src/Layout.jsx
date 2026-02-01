import React from 'react';
import { Toaster } from 'sonner';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import Navigation from '@/components/layout/Navigation';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

export default function Layout({ children, currentPageName }) {
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

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Toaster position="top-center" richColors />

      <Sidebar />
      <Navigation currentPageName={currentPageName} />

      <main>{children}</main>

      <InstallPrompt />

      <Footer />
    </div>
  );
}