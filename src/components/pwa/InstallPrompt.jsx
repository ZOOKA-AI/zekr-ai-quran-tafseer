import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const dismissed = localStorage.getItem('pwa_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-br from-emerald-500 to-green-500 text-white p-4 shadow-2xl border-2 border-amber-400 z-50 animate-in slide-in-from-bottom">
      <button
        onClick={handleDismiss}
        className="absolute top-2 left-2 p-1 hover:bg-white/20 rounded"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="text-center mb-3">
        <div className="text-5xl mb-2">📱</div>
        <h3 className="text-xl font-bold mb-1">ثبّت التطبيق</h3>
        <p className="text-sm opacity-90">استخدم ذكر بدون متصفح - مثل التطبيقات العادية!</p>
      </div>
      
      <Button
        onClick={handleInstall}
        className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-bold"
      >
        <Download className="w-5 h-5 ml-2" />
        تثبيت التطبيق الآن
      </Button>
    </Card>
  );
}