import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon, Check } from 'lucide-react';

const BACKGROUNDS = [
  {
    id: 'kaaba',
    name: 'الكعبة المشرفة',
    url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6920cdfd512838f4a35374d8/ad390f8ea_21da07e84f2006654e384d2924c664b1.jpg',
    brightness: 1.5
  },
  {
    id: 'geometric',
    name: 'زخارف إسلامية',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    brightness: 1
  },
  {
    id: 'night',
    name: 'الوضع الليلي',
    gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    brightness: 1
  },
  {
    id: 'sunrise',
    name: 'شروق الشمس',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    brightness: 1
  },
  {
    id: 'light',
    name: 'الوضع الفاتح',
    gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    brightness: 1
  }
];

export default function BackgroundSelector({ onBackgroundChange }) {
  const [selected, setSelected] = useState('kaaba');

  useEffect(() => {
    const saved = localStorage.getItem('app_background');
    if (saved) {
      setSelected(saved);
      applyBackground(BACKGROUNDS.find(b => b.id === saved));
    }
  }, []);

  const applyBackground = (bg) => {
    const body = document.body;
    if (bg.url) {
      body.style.backgroundImage = `url(${bg.url})`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundAttachment = 'fixed';
      body.style.filter = `brightness(${bg.brightness})`;
    } else if (bg.gradient) {
      body.style.backgroundImage = bg.gradient;
      body.style.backgroundAttachment = 'fixed';
      body.style.filter = `brightness(${bg.brightness})`;
    }
  };

  const handleSelect = (bg) => {
    setSelected(bg.id);
    localStorage.setItem('app_background', bg.id);
    applyBackground(bg);
    if (onBackgroundChange) {
      onBackgroundChange(bg);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <ImageIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">اختر الخلفية</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {BACKGROUNDS.map(bg => (
          <button
            key={bg.id}
            onClick={() => handleSelect(bg)}
            className={`relative h-24 rounded-xl overflow-hidden border-4 transition-all duration-200 ${
              selected === bg.id 
                ? 'border-emerald-500 shadow-lg scale-105' 
                : 'border-gray-300 hover:border-emerald-400'
            }`}
          >
            {bg.url ? (
              <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: bg.gradient }} />
            )}
            
            {selected === bg.id && (
              <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 px-2 text-center">
              {bg.name}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}