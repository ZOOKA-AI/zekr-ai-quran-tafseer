import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { offlineStorage } from '../utils/offlineStorage';

export default function AutoUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [showUpdate, setShowUpdate] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    const lastUpdate = offlineStorage.load('last_auto_update');
    const now = Date.now();
    
    // التحديث كل 24 ساعة
    if (lastUpdate && (now - lastUpdate) < 24 * 60 * 60 * 1000) {
      return;
    }

    setShowUpdate(true);
    performAutoUpdate();
  };

  const performAutoUpdate = async () => {
    setIsUpdating(true);
    setUpdateStatus('🔍 جاري البحث عن تحديثات...');
    
    try {
      // 1. تحديث مواقيت الصلاة
      setUpdateStatus('🕌 تحديث مواقيت الصلاة...');
      await updatePrayerTimes();

      // 2. تحديث محتوى إسلامي جديد
      setUpdateStatus('📚 جلب محتوى إسلامي جديد...');
      await fetchNewIslamicContent();

      // 3. تحديث أدعية وأذكار
      setUpdateStatus('🤲 تحديث الأدعية والأذكار...');
      await updateDuasAndAdhkar();

      // 4. تحديث معلومات القراء
      setUpdateStatus('🎤 تحديث معلومات المقرئين...');
      await updateRecitersInfo();

      // 5. تحديث قصص القرآن
      setUpdateStatus('📖 تحديث قصص القرآن...');
      await updateQuranStories();

      offlineStorage.save('last_auto_update', Date.now());
      setLastUpdateTime(new Date());
      
      setUpdateStatus('✅ تم التحديث بنجاح!');
      toast.success('🎉 التطبيق تم تحديثه تلقائياً!');
      
      setTimeout(() => {
        setShowUpdate(false);
        setIsUpdating(false);
      }, 3000);

    } catch (error) {
      console.error('Auto-update error:', error);
      setUpdateStatus('❌ حدث خطأ في التحديث');
      toast.error('سنحاول مرة أخرى لاحقاً');
      setTimeout(() => setShowUpdate(false), 2000);
    }
  };

  const updatePrayerTimes = async () => {
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `ابحث عن أحدث مواقيت الصلاة في أهم المدن العربية اليوم ${new Date().toISOString().split('T')[0]}. 
        
        أعطني النتيجة بصيغة JSON:`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            cities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  city: { type: "string" },
                  country: { type: "string" },
                  fajr: { type: "string" },
                  dhuhr: { type: "string" },
                  asr: { type: "string" },
                  maghrib: { type: "string" },
                  isha: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      offlineStorage.save('updated_prayer_times', response);
    } catch (error) {
      console.log('Prayer times update skipped');
    }
  };

  const fetchNewIslamicContent = async () => {
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `ابحث عن أحدث المقالات والمحتوى الإسلامي المفيد (أحاديث، فوائد، نصائح إسلامية).
        
        أعطني 5 محتويات جديدة بصيغة JSON:`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            content: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  text: { type: "string" },
                  category: { type: "string" },
                  source: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      offlineStorage.save('new_islamic_content', response);
    } catch (error) {
      console.log('Islamic content update skipped');
    }
  };

  const updateDuasAndAdhkar = async () => {
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `ابحث عن أدعية وأذكار إسلامية صحيحة جديدة مع فوائدها.
        
        أعطني 10 أدعية/أذكار بصيغة JSON:`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            duas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  arabic_text: { type: "string" },
                  translation: { type: "string" },
                  benefit: { type: "string" },
                  reference: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      offlineStorage.save('updated_duas', response);
    } catch (error) {
      console.log('Duas update skipped');
    }
  };

  const updateRecitersInfo = async () => {
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `ابحث عن أحدث معلومات عن مشاهير قراء القرآن الكريم (السيرة، الإنجازات).
        
        أعطني معلومات عن 10 قراء بصيغة JSON:`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            reciters: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  bio: { type: "string" },
                  country: { type: "string" },
                  style: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      offlineStorage.save('updated_reciters', response);
    } catch (error) {
      console.log('Reciters update skipped');
    }
  };

  const updateQuranStories = async () => {
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `ابحث عن قصص القرآن الكريم المشهورة بأسلوب مبسط للأطفال.
        
        أعطني 5 قصص بصيغة JSON:`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            stories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  story: { type: "string" },
                  lesson: { type: "string" },
                  surah: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      offlineStorage.save('updated_stories', response);
    } catch (error) {
      console.log('Stories update skipped');
    }
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
      <Card className="bg-gradient-to-br from-purple-900/98 via-indigo-900/98 to-purple-900/98 backdrop-blur-xl border-2 border-purple-400/50 shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {isUpdating ? (
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-400" />
              )}
              <div>
                <h3 className="text-white font-bold text-lg">تحديث تلقائي ذكي 🤖</h3>
                <p className="text-purple-300 text-sm">بتقنية الذكاء الاصطناعي</p>
              </div>
            </div>
            <Button
              onClick={() => setShowUpdate(false)}
              size="icon"
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <p className="text-white text-center font-semibold">
              {updateStatus}
            </p>
          </div>

          {isUpdating && (
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          )}

          <div className="text-center mt-4">
            <p className="text-purple-200 text-xs">
              🚀 التطبيق يحدث نفسه من الإنترنت
            </p>
            {lastUpdateTime && (
              <p className="text-purple-300 text-xs mt-1">
                آخر تحديث: {lastUpdateTime.toLocaleTimeString('ar-SA')}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}