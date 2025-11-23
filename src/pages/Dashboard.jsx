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
    <div className="min-h-screen relative overflow-hidden p-6" dir="rtl">
      {/* City Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1920)',
          filter: 'brightness(0.4) contrast(0.9)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-blue-900/20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header - Icons Only */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">⚙️</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Qibla Compass */}
          <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <Compass className="w-16 h-16 text-white drop-shadow-2xl" />
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
                  <p className="text-white font-bold text-4xl mb-2 font-mono drop-shadow-2xl">
                    {Math.round(qiblaDirection)}°
                  </p>
                  {userLocation && (
                    <div className="mt-3 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-white drop-shadow-2xl" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 text-center">
                  <div className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full mx-auto drop-shadow-2xl"></div>
                </div>
              )}
            </div>
          </div>

          {/* World Clock */}
          <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <Clock className="w-16 h-16 text-white drop-shadow-2xl" />
              </div>

              {/* Current Time Display */}
              <div className="text-center mb-8">
                <p className="text-white text-7xl font-bold mb-4 font-mono drop-shadow-2xl">
                  {formatTime(currentTime)}
                </p>
                <p className="text-white text-2xl font-arabic drop-shadow-2xl">
                  {formatDate(currentTime)}
                </p>
              </div>

              {/* Major Cities Times */}
              <div className="space-y-4">
                {[
                  { timezone: 'Asia/Riyadh', flag: '🕋' },
                  { timezone: 'Asia/Riyadh', flag: '🕌' },
                  { timezone: 'Africa/Cairo', flag: '🇪🇬' },
                  { timezone: 'Asia/Jerusalem', flag: '🇵🇸' },
                  { timezone: 'Asia/Dubai', flag: '🇦🇪' }
                ].map((location, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-4 hover:scale-105 transition-all"
                  >
                    <span className="text-5xl drop-shadow-2xl">{location.flag}</span>
                    <span className="text-white font-mono text-3xl font-bold drop-shadow-2xl">
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
          </div>
        </div>

        {/* Info Cards - Icons Only */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-8 hover:scale-110 transition-transform">
            <div className="text-8xl drop-shadow-2xl">🕌</div>
          </div>

          <div className="text-center p-8 hover:scale-110 transition-transform">
            <div className="text-8xl drop-shadow-2xl">⏰</div>
          </div>

          <div className="text-center p-8 hover:scale-110 transition-transform">
            <div className="text-8xl drop-shadow-2xl">🤲</div>
          </div>
        </div>
      </div>
    </div>
  );
}