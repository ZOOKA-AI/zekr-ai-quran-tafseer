import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wifi, WifiOff, Database, HardDrive, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { offlineStorage } from '@/components/utils/offlineStorage';

export default function SystemStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);
  const [storageSize, setStorageSize] = useState('0 KB');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // قياس حجم التخزين
    setStorageSize(offlineStorage.getStorageSize());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) {
    return (
      <Button
        onClick={() => setShowStatus(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-6 left-6 z-50 bg-white/90 backdrop-blur-sm shadow-lg"
      >
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-600 ml-2" />
        ) : (
          <WifiOff className="w-4 h-4 text-amber-600 ml-2" />
        )}
        حالة النظام
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-20 left-6 z-50 bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-emerald-200 p-4 w-80">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">حالة النظام</h3>
          <Button
            onClick={() => setShowStatus(false)}
            variant="ghost"
            size="sm"
          >
            ✕
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-bold">متصل بالإنترنت</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-amber-600" />
                <span className="text-amber-700 font-bold">بدون اتصال</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">التخزين المحلي: {storageSize}</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-gray-700">النظام يعمل بكفاءة</span>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
          <p className="text-sm text-emerald-800 font-bold text-center">
            ✅ النظام يعمل بدون إنترنت كامل
          </p>
        </div>
      </div>
    </Card>
  );
}