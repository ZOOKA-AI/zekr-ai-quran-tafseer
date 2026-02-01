import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { QARI_SYSTEM } from '@/components/audio/QarisDatabase';
import { motion } from 'framer-motion';

export default function OfflineDownloads() {
  const [allQaris, setAllQaris] = useState([]);
  const [downloadedQaris, setDownloadedQaris] = useState([]);
  const [downloading, setDownloading] = useState({});
  const [selectedSurahs, setSelectedSurahs] = useState({});

  useEffect(() => {
    const qaris = QARI_SYSTEM.api.getAllQaris();
    setAllQaris(qaris);
    
    const saved = JSON.parse(localStorage.getItem('downloaded_qaris') || '[]');
    setDownloadedQaris(saved);
  }, []);

  const testAudioUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      return response.ok || response.type === 'opaque';
    } catch {
      return false;
    }
  };

  const downloadSurah = async (qariId, surahNumber) => {
    const qari = allQaris.find(q => q.id === qariId);
    if (!qari) return;

    const key = `${qariId}_${surahNumber}`;
    setDownloading(prev => ({ ...prev, [key]: true }));

    try {
      const surahStr = surahNumber.toString().padStart(3, '0');
      const url = qari.audio_base + surahStr + '001.mp3'; // اختبار الآية الأولى
      
      const isValid = await testAudioUrl(url);
      if (!isValid) {
        throw new Error('رابط الصوت غير صالح');
      }

      const response = await fetch(url);
      const blob = await response.blob();
      
      // حفظ في IndexedDB للملفات الكبيرة
      const db = await openIndexedDB();
      const transaction = db.transaction(['audios'], 'readwrite');
      const store = transaction.objectStore('audios');
      
      store.put({
        key,
        qariName: qari.name,
        qariId: qari.id,
        surahNumber,
        blob,
        timestamp: Date.now()
      });

      // تحديث قائمة التنزيلات
      const newDownloaded = [...downloadedQaris, { qariId, surahNumber }];
      setDownloadedQaris(newDownloaded);
      localStorage.setItem('downloaded_qaris', JSON.stringify(newDownloaded));
      
      toast.success(`✅ تم تنزيل ${qari.name} - السورة ${surahNumber}`);
    } catch (error) {
      toast.error(`❌ خطأ في التنزيل: ${error.message}`);
    } finally {
      setDownloading(prev => ({ ...prev, [key]: false }));
    }
  };

  const deleteDownload = async (qariId, surahNumber) => {
    try {
      const db = await openIndexedDB();
      const transaction = db.transaction(['audios'], 'readwrite');
      const store = transaction.objectStore('audios');
      store.delete(`${qariId}_${surahNumber}`);

      setDownloadedQaris(prev => 
        prev.filter(d => !(d.qariId === qariId && d.surahNumber === surahNumber))
      );
      toast.success('تم حذف التنزيل');
    } catch (error) {
      toast.error('خطأ في الحذف');
    }
  };

  const openIndexedDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('QuranAudios', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e) => {
        e.target.result.createObjectStore('audios', { keyPath: 'key' });
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">📥 مكتبة التنزيلات</h1>
          <p className="text-gray-600">حمل سور القرآن من مقرئيك المفضلين واستمع بدون إنترنت</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-blue-100 border-blue-300 p-4">
            <p className="text-xs text-gray-600">إجمالي المقرئين</p>
            <p className="text-2xl font-bold text-blue-700">{allQaris.length}</p>
          </Card>
          <Card className="bg-green-100 border-green-300 p-4">
            <p className="text-xs text-gray-600">المنزلة</p>
            <p className="text-2xl font-bold text-green-700">{downloadedQaris.length}</p>
          </Card>
          <Card className="bg-amber-100 border-amber-300 p-4">
            <p className="text-xs text-gray-600">المقرئين المتاحين</p>
            <p className="text-2xl font-bold text-amber-700">{allQaris.filter(q => q.audio_base).length}</p>
          </Card>
        </div>

        {/* Qaris Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allQaris.map((qari) => (
            <motion.div
              key={qari.id}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-white border-2 border-emerald-300 p-4 hover:shadow-lg transition">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{qari.name}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded">{qari.country}</span>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">{qari.style}</span>
                  </div>
                  <p className="text-xs text-gray-600">⭐ {qari.rating}/5</p>
                </div>

                {/* Download Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={() => downloadSurah(qari.id, 1)}
                    disabled={downloading[`${qari.id}_1`]}
                    className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {downloading[`${qari.id}_1`] ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    حمل سورة (اختبار)
                  </Button>

                  {downloadedQaris.some(d => d.qariId === qari.id) && (
                    <div className="flex items-center gap-2 text-green-700 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>محمل</span>
                    </div>
                  )}
                </div>

                {!qari.audio_base && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>غير متاح حالياً</span>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Downloaded List */}
        {downloadedQaris.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 الملفات المحملة</h2>
            <Card className="bg-white border-2 border-green-300 p-4">
              <div className="space-y-2">
                {downloadedQaris.map((download) => {
                  const qari = allQaris.find(q => q.id === download.qariId);
                  return (
                    <div key={`${download.qariId}_${download.surahNumber}`} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-bold text-gray-900">
                        {qari?.name} - السورة {download.surahNumber}
                      </span>
                      <Button
                        onClick={() => deleteDownload(download.qariId, download.surahNumber)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}