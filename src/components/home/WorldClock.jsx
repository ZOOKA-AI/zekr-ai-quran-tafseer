import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, MapPin } from 'lucide-react';

export default function WorldClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState({ city: 'جاري التحديد...', country: '', timezone: '' });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // تحديد الموقع والمنطقة الزمنية
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            // استخدام API لتحديد المدينة
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`);
            const data = await response.json();
            
            const city = data.address.city || data.address.town || data.address.village || 'غير معروف';
            const country = data.address.country || 'غير معروف';
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            setLocation({ city, country, timezone });
          } catch (error) {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setLocation({ city: 'موقعك الحالي', country: '', timezone });
          }
        },
        () => {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          setLocation({ city: 'موقعك الحالي', country: '', timezone });
        }
      );
    } else {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setLocation({ city: 'موقعك الحالي', country: '', timezone });
    }

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getHijriDate = () => {
    try {
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(currentTime);
    } catch {
      return 'التقويم الهجري';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border-2 border-blue-400/50 shadow-xl">
      <div className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-blue-300" />
          <h3 className="text-2xl font-bold text-white">الساعة العالمية</h3>
        </div>

        {/* الوقت الرقمي */}
        <div className="mb-6">
          <div className="text-5xl md:text-6xl font-bold text-white mb-2 font-mono">
            {formatTime(currentTime)}
          </div>
          <div className="text-blue-200 text-lg">
            {formatDate(currentTime)}
          </div>
          <div className="text-purple-300 text-sm mt-2">
            {getHijriDate()}
          </div>
        </div>

        {/* الموقع */}
        <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-400/30">
          <div className="flex items-center justify-center gap-2 text-blue-200">
            <MapPin className="w-4 h-4" />
            <span className="font-bold">{location.city}</span>
            {location.country && <span>• {location.country}</span>}
          </div>
          <div className="text-purple-300 text-xs mt-1">
            {location.timezone}
          </div>
        </div>

        {/* ساعة أنالوج */}
        <div className="relative w-48 h-48 mx-auto mt-6">
          <div className="absolute inset-0 rounded-full border-4 border-blue-400/50 bg-gradient-to-br from-gray-800 to-gray-900">
            {/* علامات الساعة */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3 bg-blue-300 top-2 left-1/2 origin-bottom"
                style={{
                  transform: `translateX(-50%) rotate(${i * 30}deg) translateY(90px)`
                }}
              />
            ))}

            {/* عقرب الساعات */}
            <div
              className="absolute w-1.5 h-16 bg-white rounded-full top-1/2 left-1/2 origin-bottom"
              style={{
                transform: `translateX(-50%) translateY(-100%) rotate(${(currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5}deg)`
              }}
            />

            {/* عقرب الدقائق */}
            <div
              className="absolute w-1 h-20 bg-blue-300 rounded-full top-1/2 left-1/2 origin-bottom"
              style={{
                transform: `translateX(-50%) translateY(-100%) rotate(${currentTime.getMinutes() * 6}deg)`
              }}
            />

            {/* عقرب الثواني */}
            <div
              className="absolute w-0.5 h-24 bg-red-400 rounded-full top-1/2 left-1/2 origin-bottom"
              style={{
                transform: `translateX(-50%) translateY(-100%) rotate(${currentTime.getSeconds() * 6}deg)`
              }}
            />

            {/* النقطة المركزية */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}