import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function AdvancedSearch({ onSearch }) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [juz, setJuz] = useState('all');

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error('الرجاء إدخال نص البحث');
      return;
    }
    onSearch({ query, searchType, juz });
    toast.success('🔍 جاري البحث...');
  };

  return (
    <Card className="p-6 border-4 border-emerald-200">
      <div className="flex items-center gap-3 mb-4">
        <Search className="w-6 h-6 text-emerald-600" />
        <h3 className="text-2xl font-bold text-gray-900">بحث متقدم</h3>
      </div>

      <div className="space-y-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث بالكلمة أو الموضوع..."
          className="h-12 text-lg border-2 border-emerald-300"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="h-12 border-2 border-emerald-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل النتائج</SelectItem>
              <SelectItem value="arabic">النص العربي</SelectItem>
              <SelectItem value="translation">الترجمة</SelectItem>
              <SelectItem value="tafsir">التفسير</SelectItem>
            </SelectContent>
          </Select>

          <Select value={juz} onValueChange={setJuz}>
            <SelectTrigger className="h-12 border-2 border-emerald-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأجزاء</SelectItem>
              {[...Array(30)].map((_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  الجزء {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSearch}
          className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-lg"
        >
          <Search className="w-5 h-5 ml-2" />
          بحث
        </Button>
      </div>
    </Card>
  );
}