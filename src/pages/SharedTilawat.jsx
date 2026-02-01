import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Play, User } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SharedTilawatPage() {
  const [sharedTilawat, setSharedTilawat] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('sharedTilawat');
    if (saved) setSharedTilawat(JSON.parse(saved));
  }, []);

  const handleLike = (index) => {
    const updated = [...sharedTilawat];
    updated[index].likes_count = (updated[index].likes_count || 0) + 1;
    setSharedTilawat(updated);
    localStorage.setItem('sharedTilawat', JSON.stringify(updated));
    toast.success('❤️ تم الإعجاب');
  };

  const handleListen = (tilawa, index) => {
    const updated = [...sharedTilawat];
    updated[index].listens_count = (updated[index].listens_count || 0) + 1;
    setSharedTilawat(updated);
    localStorage.setItem('sharedTilawat', JSON.stringify(updated));
    
    toast.success('🎧 جاري التشغيل...');
    navigate(createPageUrl('Tilawa'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">🎧</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">التلاوات المشاركة</h1>
          <p className="text-xl text-gray-700">استمع لتلاوات شاركها المستخدمون</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sharedTilawat.map((tilawa, index) => (
            <Card key={index} className="p-6 bg-white hover:shadow-2xl transition-all border-2 border-gray-200 hover:border-blue-400">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                  {tilawa.surah_number}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">سورة رقم {tilawa.surah_number}</h3>
                  <p className="text-sm text-gray-600">{tilawa.reciter_name}</p>
                </div>
              </div>

              {tilawa.note && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                  <p className="text-gray-700 text-sm italic">"{tilawa.note}"</p>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="font-bold">{tilawa.shared_by}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Badge variant="outline" className="bg-red-50 border-red-200">
                  <Heart className="w-3 h-3 ml-1 text-red-500" />
                  {tilawa.likes_count || 0}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 border-blue-200">
                  <Play className="w-3 h-3 ml-1 text-blue-500" />
                  {tilawa.listens_count || 0}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleListen(tilawa, index)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Play className="w-4 h-4 ml-2" />
                  استماع
                </Button>
                <Button
                  onClick={() => handleLike(index)}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {sharedTilawat.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-xl">لا توجد تلاوات مشاركة حالياً</p>
            <p className="text-gray-500">شارك تلاوتك المفضلة مع المجتمع!</p>
          </div>
        )}
      </div>
    </div>
  );
}