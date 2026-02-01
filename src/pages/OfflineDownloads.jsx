import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Trash2, CheckCircle, HardDrive, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { ALL_SURAHS } from '../components/quran/QuranData';
import FastCache from '../components/performance/FastCache';

const QUALITY_OPTIONS = [
  { id: '64', name: 'منخفضة (64kbps)', size: '~500KB/آية', color: 'green' },
  { id: '128', name: 'متوسطة (128kbps)', size: '~1MB/آية', color: 'blue' },
  { id: '192', name: 'عالية (192kbps)', size: '~1.5MB/آية', color: 'purple' },
];

const RECITERS = [
  { id: 'husary', name: 'محمود خليل الحصري' },
  { id: 'sudais', name: 'عبد الرحمن السديس' },
  { id: 'minshawi', name: 'محمد صديق المنشاوي' },
  { id: 'alafasy', name: 'مشاري راشد العفاسي' },
];

// أجزاء القرآن
const AJZAA = [
  { number: 30, name: 'جزء عم', from: 78, to: 114 },
  { number: 29, name: 'جزء تبارك', from: 67, to: 77 },
  { number: 28, name: 'جزء قد سمع', from: 58, to: 66 },
];

export default function OfflineDownloadsPage() {
  const [selectedReciter, setSelectedReciter] = useState('husary');
  const [selectedQuality, setSelectedQuality] = useState('128');
  const [downloadProgress, setDownloadProgress] = useState({});
  const [downloads, setDownloads] = useState([]);
  const [totalStorage, setTotalStorage] = useState(0);

  useEffect(() => {
    loadDownloads();
    calculateStorage();
  }, []);

  const loadDownloads = () => {
    const saved = JSON.parse(localStorage.getItem('quran_downloads') || '[]');
    setDownloads(saved);
  };

  const calculateStorage = () => {
    let total = 0;
    for (let key in localStorage) {
      if (key.startsWith('audio_')) {
        total += localStorage[key].length;
      }
    }
    setTotalStorage((total / (1024 * 1024)).toFixed(2));
  };

  const downloadSurah = async (surahNumber) => {
    const surah = ALL_SURAHS.find(s => s.number === surahNumber);
    if (!surah) return;

    const downloadId = `${surahNumber}_${selectedReciter}_${selectedQuality}`;
    
    setDownloadProgress(prev => ({ ...prev, [downloadId]: 0 }));
    toast.loading(`جاري تحميل ${surah.name}...`, { id: downloadId });

    const baseUrl = `https://cdn.islamic.network/quran/audio/${selectedQuality}/ar.${selectedReciter}/`;
    let completed = 0;

    for (let i = 1; i <= surah.verses; i++) {
      try {
        const audioUrl = `${baseUrl}${surahNumber.toString().padStart(3, '0')}${i.toString().padStart(3, '0')}.mp3`;
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onloadend = () => {
          FastCache.set(`audio_${surahNumber}_${i}_${selectedReciter}_${selectedQuality}`, reader.result, 1000 * 60 * 60 * 24 * 365);
          completed++;
          
          const progress = Math.round((completed / surah.verses) * 100);
          setDownloadProgress(prev => ({ ...prev, [downloadId]: progress }));
          
          if (completed === surah.verses) {
            const newDownload = {
              id: downloadId,
              type: 'surah',
              surah: surahNumber,
              surahName: surah.name,
              reciter: selectedReciter,
              reciterName: RECITERS.find(r => r.id === selectedReciter)?.name,
              quality: selectedQuality,
              verses: surah.verses,
              date: new Date().toISOString()
            };
            
            const updated = [...downloads, newDownload];
            setDownloads(updated);
            localStorage.setItem('quran_downloads', JSON.stringify(updated));
            
            toast.success(`✅ تم تحميل ${surah.name}`, { id: downloadId });
            setDownloadProgress(prev => {
              const copy = {...prev};
              delete copy[downloadId];
              return copy;
            });
            calculateStorage();
          }
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Download error:', err);
        toast.error('خطأ في التحميل', { id: downloadId });
        break;
      }
    }
  };

  const downloadJuz = async (juz) => {
    const downloadId = `juz${juz.number}_${selectedReciter}_${selectedQuality}`;
    
    toast.loading(`جاري تحميل ${juz.name}...`, { id: downloadId });

    for (let surahNum = juz.from; surahNum <= juz.to; surahNum++) {
      await downloadSurah(surahNum);
    }

    const newDownload = {
      id: downloadId,
      type: 'juz',
      juz: juz.number,
      juzName: juz.name,
      reciter: selectedReciter,
      reciterName: RECITERS.find(r => r.id === selectedReciter)?.name,
      quality: selectedQuality,
      from: juz.from,
      to: juz.to,
      date: new Date().toISOString()
    };
    
    const updated = [...downloads, newDownload];
    setDownloads(updated);
    localStorage.setItem('quran_downloads', JSON.stringify(updated));
    
    toast.success(`✅ تم تحميل ${juz.name}`, { id: downloadId });
  };

  const deleteDownload = (download) => {
    if (!confirm(`هل تريد حذف ${download.surahName || download.juzName}؟`)) return;

    if (download.type === 'surah') {
      for (let i = 1; i <= download.verses; i++) {
        localStorage.removeItem(`cache_audio_${download.surah}_${i}_${download.reciter}_${download.quality}`);
      }
    } else if (download.type === 'juz') {
      for (let surahNum = download.from; surahNum <= download.to; surahNum++) {
        const surah = ALL_SURAHS.find(s => s.number === surahNum);
        if (surah) {
          for (let i = 1; i <= surah.verses; i++) {
            localStorage.removeItem(`cache_audio_${surahNum}_${i}_${download.reciter}_${download.quality}`);
          }
        }
      }
    }

    const updated = downloads.filter(d => d.id !== download.id);
    setDownloads(updated);
    localStorage.setItem('quran_downloads', JSON.stringify(updated));
    calculateStorage();
    toast.success('تم الحذف');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">📥</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">التحميلات للاستماع بدون نت</h1>
          <p className="text-xl text-gray-700">حمّل السور والأجزاء للاستماع في أي وقت</p>
        </div>

        {/* Storage Info */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-2 border-blue-300">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <HardDrive className="w-8 h-8" />
              <div>
                <p className="text-2xl font-bold">{totalStorage} ميجابايت</p>
                <p className="text-blue-100">المساحة المستخدمة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <WifiOff className="w-8 h-8" />
              <div>
                <p className="text-2xl font-bold">{downloads.length}</p>
                <p className="text-blue-100">تحميل متوفر</p>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="download" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="download">تحميل جديد</TabsTrigger>
            <TabsTrigger value="manage">إدارة التحميلات</TabsTrigger>
          </TabsList>

          {/* Download Tab */}
          <TabsContent value="download">
            {/* Settings */}
            <Card className="p-6 mb-6">
              <h3 className="text-2xl font-bold mb-4">إعدادات التحميل</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2">القارئ</label>
                  <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RECITERS.map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block font-bold mb-2">الجودة</label>
                  <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUALITY_OPTIONS.map(q => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.name} - {q.size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Download Ajzaa */}
            <Card className="p-6 mb-6">
              <h3 className="text-2xl font-bold mb-4">تحميل أجزاء كاملة</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {AJZAA.map(juz => (
                  <Card key={juz.number} className="p-4 border-2 border-purple-300">
                    <h4 className="text-xl font-bold mb-2">{juz.name}</h4>
                    <p className="text-gray-600 mb-3">من سورة {juz.from} إلى {juz.to}</p>
                    <Button
                      onClick={() => downloadJuz(juz)}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Download className="w-4 h-4 ml-2" />
                      تحميل
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Download Surahs */}
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-4">تحميل سورة مفردة</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {ALL_SURAHS.map(surah => {
                  const downloadId = `${surah.number}_${selectedReciter}_${selectedQuality}`;
                  const progress = downloadProgress[downloadId];
                  const isDownloaded = downloads.some(d => d.type === 'surah' && d.surah === surah.number && d.reciter === selectedReciter && d.quality === selectedQuality);

                  return (
                    <Button
                      key={surah.number}
                      onClick={() => downloadSurah(surah.number)}
                      disabled={progress !== undefined || isDownloaded}
                      className={`h-auto py-3 flex flex-col ${isDownloaded ? 'bg-green-600' : 'bg-blue-600'}`}
                      variant={isDownloaded ? 'default' : 'default'}
                    >
                      {isDownloaded ? (
                        <CheckCircle className="w-5 h-5 mb-1" />
                      ) : progress !== undefined ? (
                        <span className="text-xs">{progress}%</span>
                      ) : (
                        <Download className="w-5 h-5 mb-1" />
                      )}
                      <span className="text-xs">{surah.name}</span>
                    </Button>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage">
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6">التحميلات المحفوظة</h3>
              
              {downloads.length === 0 ? (
                <div className="text-center py-12">
                  <WifiOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-xl">لا توجد تحميلات</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {downloads.map(download => (
                    <Card key={download.id} className="p-4 border-2 border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold">
                              {download.surahName || download.juzName}
                            </h4>
                            <p className="text-gray-600">
                              {download.reciterName} • {QUALITY_OPTIONS.find(q => q.id === download.quality)?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(download.date).toLocaleDateString('ar')}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => deleteDownload(download)}
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}