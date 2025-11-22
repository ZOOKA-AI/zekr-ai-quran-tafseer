import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function QiblaCompass() {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [currentHeading, setCurrentHeading] = useState(0);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateQibla = (lat, lng) => {
    // إحداثيات الكعبة المشرفة
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;

    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const kaabaLatRad = (kaabaLat * Math.PI) / 180;
    const kaabaLngRad = (kaabaLng * Math.PI) / 180;

    const dLng = kaabaLngRad - lngRad;

    const y = Math.sin(dLng) * Math.cos(kaabaLatRad);
    const x = Math.cos(latRad) * Math.sin(kaabaLatRad) - Math.sin(latRad) * Math.cos(kaabaLatRad) * Math.cos(dLng);

    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180) / Math.PI;
    bearing = (bearing + 360) % 360;

    return bearing;
  };

  const getLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          
          const qibla = calculateQibla(lat, lng);
          setQiblaDirection(qibla);
          setIsLoading(false);
          toast.success('تم تحديد اتجاه القبلة بنجاح! 🕋');
        },
        (error) => {
          setIsLoading(false);
          toast.error('لم نتمكن من تحديد موقعك');
        }
      );
    } else {
      setIsLoading(false);
      toast.error('المتصفح لا يدعم تحديد الموقع');
    }
  };

  useEffect(() => {
    if ('DeviceOrientationEvent' in window) {
      const handleOrientation = (event) => {
        const heading = event.alpha || 0;
        setCurrentHeading(heading);
      };
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  const relativeQibla = qiblaDirection !== null ? (qiblaDirection - currentHeading + 360) % 360 : 0;

  return (
    <Card className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm border-2 border-emerald-400/50 shadow-xl">
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
          🧭 بوصلة القبلة
        </h3>

        {!location ? (
          <div>
            <p className="text-emerald-200 mb-4">اضغط لتحديد اتجاه القبلة من موقعك</p>
            <Button
              onClick={getLocation}
              disabled={isLoading}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  جاري التحديد...
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5 ml-2" />
                  حدد اتجاه القبلة
                </>
              )}
            </Button>
          </div>
        ) : (
          <div>
            <div className="relative w-64 h-64 mx-auto mb-4">
              {/* Compass Circle */}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-400/50 bg-gradient-to-br from-gray-800 to-gray-900">
                {/* Compass Markings */}
                <div className="absolute inset-0">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-bold">N</div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white font-bold">S</div>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white font-bold">W</div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-bold">E</div>
                </div>

                {/* Qibla Direction Arrow */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
                  style={{ transform: `rotate(${relativeQibla}deg)` }}
                >
                  <div className="text-6xl">🕋</div>
                </div>

                {/* Center Dot */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-emerald-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>

            <div className="bg-emerald-500/20 rounded-lg p-4 border border-emerald-400/30">
              <p className="text-emerald-200 text-lg font-bold mb-2">
                اتجاه القبلة: {Math.round(qiblaDirection)}°
              </p>
              <p className="text-emerald-300 text-sm">
                📍 موقعك: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            </div>

            <Button
              onClick={getLocation}
              variant="outline"
              className="mt-4 border-emerald-400 text-emerald-300 hover:bg-emerald-500/20"
            >
              🔄 إعادة التحديد
            </Button>
          </div>
        )}

        <p className="text-emerald-300 text-xs mt-4">
          ✨ وَجِّهْ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ ✨
        </p>
      </div>
    </Card>
  );
}