import React from 'react';

// خلفيات روحانية إسلامية
export const SPIRITUAL_BACKGROUNDS = [
  {
    id: 'kaaba_night',
    name: 'الكعبة ليلاً',
    gradient: 'from-slate-900 via-emerald-950 to-slate-900',
    pattern: 'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
    overlay: 'bg-gradient-to-b from-black/30 via-transparent to-black/50'
  },
  {
    id: 'madinah_dawn',
    name: 'فجر المدينة',
    gradient: 'from-amber-950 via-rose-950 to-purple-950',
    pattern: 'radial-gradient(circle at 30% 20%, rgba(251, 191, 36, 0.08) 0%, transparent 40%)',
    overlay: 'bg-gradient-to-b from-amber-900/20 via-transparent to-purple-900/30'
  },
  {
    id: 'desert_stars',
    name: 'نجوم الصحراء',
    gradient: 'from-indigo-950 via-slate-900 to-indigo-950',
    pattern: 'radial-gradient(circle at 70% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
    overlay: 'bg-gradient-to-t from-indigo-950/50 via-transparent to-slate-900/30'
  },
  {
    id: 'quran_light',
    name: 'نور القرآن',
    gradient: 'from-emerald-950 via-teal-950 to-cyan-950',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.12) 0%, transparent 60%)',
    overlay: 'bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20'
  },
  {
    id: 'ramadan_moon',
    name: 'هلال رمضان',
    gradient: 'from-violet-950 via-purple-950 to-indigo-950',
    pattern: 'radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.15) 0%, transparent 40%)',
    overlay: 'bg-gradient-to-b from-violet-900/30 via-transparent to-indigo-950/40'
  },
  {
    id: 'peaceful_green',
    name: 'السكينة الخضراء',
    gradient: 'from-green-950 via-emerald-950 to-teal-950',
    pattern: 'linear-gradient(45deg, rgba(16, 185, 129, 0.05) 25%, transparent 25%)',
    overlay: 'bg-gradient-to-br from-green-900/10 via-transparent to-teal-900/20'
  }
];

export default function SpiritualBackground({ backgroundId = 'kaaba_night', children }) {
  const bg = SPIRITUAL_BACKGROUNDS.find(b => b.id === backgroundId) || SPIRITUAL_BACKGROUNDS[0];
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${bg.gradient} relative overflow-hidden`}>
      {/* Islamic Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ 
          backgroundImage: bg.pattern,
          backgroundSize: '100% 100%'
        }}
      />
      
      {/* Stars Effect for night themes */}
      {['kaaba_night', 'desert_stars', 'ramadan_moon'].includes(backgroundId) && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          ))}
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 ${bg.overlay}`} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}