import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('✅ عاد الاتصال بالإنترنت');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.info('📱 وضع بدون اتصال - بعض الميزات محدودة');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-pulse">
      <WifiOff className="w-5 h-5" />
      <span className="font-bold">وضع بدون اتصال</span>
    </div>
  );
}