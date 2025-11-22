import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Compass, Clock, MapPin, Navigation } from 'lucide-react';

export default function Dashboard() {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [deviceHeading, setDeviceHeading] = useState(0);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          calculateQibla(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Device orientation for compass
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const handleOrientation = (event) => {
    const heading = event.alpha || 0;
    setDeviceHeading(heading);
  };

  const calculateQibla = (lat, lon) => {
    // Kaaba coordinates
    const kaabaLat = 21.4225;
    const kaabaLon = 39.8262;

    const φ1 = (lat * Math.PI) / 180;
    const φ2 = (kaabaLat * Math.PI) / 180;
    const Δλ = ((kaabaLon - lon) * Math.PI) / 180;

    const y = Math.sin(Δλ);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
    let θ = Math.atan2(y, x);
    θ = (θ * 180) / Math.PI;
    const bearing = (θ + 360) % 360;

    setQiblaDirection(bearing);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 font-arabic">
            لوحة التحكم
          </h1>
          <p className="text-gray-600 text-lg">أدوات مساعدة للعبادة</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Qibla Compass */}
          <Card className="bg-white shadow-2xl border-4 border-emerald-200">
            <div className="p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Compass className="w-8 h-8 text-emerald-600" />
                <h2 className="text-3xl font-bold text-emerald-700 font-arabic">بوصلة القبلة</h2>
              </div>

              <div className="relative w-80 h-80 mx-auto">
                {/* Compass Circle */}
                <div className="absolute inset-0 rounded-full border-8 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 shadow-2xl"></div>
                
                {/* Compass Markings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* N, S, E, W markers */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-emerald-700 font-bold text-xl">ش</div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-emerald-700 font-bold text-xl">ج</div>
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-emerald-700 font-bold text-xl">ش</div>
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 text-emerald-700 font-bold text-xl">غ</div>
                  </div>
                </div>

                {/* Qibla Direction Arrow */}
                {qiblaDirection !== null && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
                    style={{ 
                      transform: `rotate(${qiblaDirection - deviceHeading}deg)` 
                    }}
                  >
                    <div className="w-2 h-32 bg-gradient-to-t from-emerald-600 to-amber-500 rounded-full shadow-xl">
                      <div className="w-6 h-6 bg-amber-500 rounded-full -mt-3 -mr-2 shadow-lg"></div>
                    </div>
                  </div>
                )}

                {/* Center Kaaba Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg shadow-2xl flex items-center justify-center border-4 border-amber-400">
                    <Navigation className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {qiblaDirection !== null ? (
                <div className="mt-6 text-center">
                  <p className="text-emerald-700 font-bold text-2xl mb-2 font-arabic">
                    {Math.round(qiblaDirection)}°
                  </p>
                  <p className="text-gray-600 text-lg font-arabic">اتجاه القبلة</p>
                  {userLocation && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 text-emerald-600">
                        <MapPin className="w-5 h-5" />
                        <span className="font-bold">
                          {userLocation.latitude.toFixed(2)}°, {userLocation.longitude.toFixed(2)}°
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 text-center">
                  <p className="text-gray-500 font-arabic">جاري تحديد موقعك...</p>
                </div>
              )}
            </div>
          </Card>

          {/* World Clock */}
          <Card className="bg-white shadow-2xl border-4 border-blue-200">
            <div className="p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-blue-700 font-arabic">الساعة العالمية</h2>
              </div>

              {/* Current Time Display */}
              <div className="text-center mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 shadow-2xl border-4 border-amber-400">
                  <p className="text-white text-6xl font-bold mb-3 font-mono">
                    {formatTime(currentTime)}
                  </p>
                  <p className="text-blue-100 text-xl font-arabic">
                    {formatDate(currentTime)}
                  </p>
                </div>
              </div>

              {/* Major Cities Times */}
              <div className="space-y-3">
                {[
                  { city: 'مكة المكرمة', timezone: 'Asia/Riyadh', flag: '🕋' },
                  { city: 'المدينة المنورة', timezone: 'Asia/Riyadh', flag: '🕌' },
                  { city: 'القاهرة', timezone: 'Africa/Cairo', flag: '🇪🇬' },
                  { city: 'القدس', timezone: 'Asia/Jerusalem', flag: '🇵🇸' },
                  { city: 'دبي', timezone: 'Asia/Dubai', flag: '🇦🇪' }
                ].map((location) => (
                  <div 
                    key={location.city}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{location.flag}</span>
                      <span className="font-bold text-blue-700 text-lg font-arabic">{location.city}</span>
                    </div>
                    <span className="text-blue-600 font-mono text-xl font-bold">
                      {new Date().toLocaleTimeString('ar-EG', {
                        timeZone: location.timezone,
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 shadow-xl border-4 border-amber-400">
            <div className="text-center">
              <div className="text-5xl mb-3">🕌</div>
              <h3 className="text-2xl font-bold mb-2 font-arabic">الصلاة</h3>
              <p className="text-emerald-100 font-arabic">استخدم بوصلة القبلة لتحديد الاتجاه الصحيح</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 shadow-xl border-4 border-amber-400">
            <div className="text-center">
              <div className="text-5xl mb-3">⏰</div>
              <h3 className="text-2xl font-bold mb-2 font-arabic">المواقيت</h3>
              <p className="text-blue-100 font-arabic">تابع الوقت في المدن الإسلامية المقدسة</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 shadow-xl border-4 border-amber-400">
            <div className="text-center">
              <div className="text-5xl mb-3">🤲</div>
              <h3 className="text-2xl font-bold mb-2 font-arabic">العبادة</h3>
              <p className="text-purple-100 font-arabic">أدوات مساعدة لتحسين عبادتك</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}