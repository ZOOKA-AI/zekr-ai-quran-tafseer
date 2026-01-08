import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const SurahCard = ({ surah }) => {
  return (
    <Link to={createPageUrl(`SurahView?surah=${surah.number}`)}>
      <Card className="bg-white hover:bg-gray-50 transition-all border border-emerald-200 hover:border-emerald-400">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-base">{surah.number}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {surah.name || ''}
                </h3>
                <p className="text-xs text-gray-600">{surah.transliteration || ''}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-arabic text-emerald-700">{surah.arabic_name}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-emerald-200 text-emerald-700 text-xs py-0">
                <BookOpen className="w-3 h-3 mr-1" />
                {surah.verses_count || surah.verses || 0}
              </Badge>
              <Badge variant="outline" className="border-amber-200 text-amber-700 text-xs py-0">
                <MapPin className="w-3 h-3 mr-1" />
                {surah.revelation_place === 'Makkah' ? 'مكية' : 'مدنية'}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">ج{surah.juz_start || 1}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default SurahCard;