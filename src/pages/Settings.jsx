import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings as SettingsIcon, Moon, Sun, Volume2, Bell, Palette, 
  Globe, BookOpen, Clock, Download, Trash2, RefreshCw, Shield,
  Smartphone, Wifi, Database, Zap, Eye, Type, Music
} from 'lucide-react';
import { toast } from 'sonner';
import { SPIRITUAL_BACKGROUNDS } from '@/components/layout/SpiritualBackground';
import AdhanPlayer from '@/components/adhan/AdhanPlayer';

// Default settings
const DEFAULT_SETTINGS = {
  theme: 'dark',
  background: 'kaaba_night',
  fontSize: 18,
  fontFamily: 'amiri',
  language: 'ar',
  notifications: {
    prayerTimes: true,
    dailyVerse: true,
    adhkar: true,
    sound: true
  },
  audio: {
    defaultReciter: 'husary',
    autoPlay: false,
    volume: 80,
    repeatVerse: 1
  },
  display: {
    showTranslation: true,
    showTafsir: false,
    showTransliteration: false,
    nightMode: false,
    autoNightMode: true
  },
  privacy: {
    saveHistory: true,
    analytics: true
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('app_settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  const [storageInfo, setStorageInfo] = useState({ used: 0, total: 0 });

  useEffect(() => {
    // Calculate storage
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length * 2; // UTF-16
      }
    }
    setStorageInfo({
      used: (totalSize / 1024 / 1024).toFixed(2),
      total: 5 // MB approximate limit
    });
  }, []);

  const updateSetting = (path, value) => {
    const newSettings = { ...settings };
    const keys = path.split('.');
    let current = newSettings;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
    localStorage.setItem('app_settings', JSON.stringify(newSettings));
    toast.success('تم حفظ الإعدادات');
  };

  const clearCache = () => {
    if (confirm('هل تريد مسح جميع البيانات المؤقتة؟')) {
      localStorage.removeItem('quran_cache');
      localStorage.removeItem('audio_cache');
      toast.success('تم مسح الذاكرة المؤقتة');
    }
  };

  const resetSettings = () => {
    if (confirm('هل تريد إعادة جميع الإعدادات للوضع الافتراضي؟')) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('app_settings', JSON.stringify(DEFAULT_SETTINGS));
      toast.success('تم إعادة الإعدادات');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4 md:p-8`} dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-600/30 rounded-full mb-4">
            <SettingsIcon className="w-12 h-12 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">الإعدادات</h1>
          <p className="text-purple-300">خصص تجربتك الروحانية</p>
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="w-full bg-slate-800/50 border border-slate-700 p-1 flex flex-wrap justify-center gap-1">
            <TabsTrigger value="appearance" className="data-[state=active]:bg-purple-600">
              <Palette className="w-4 h-4 ml-2" /> المظهر
            </TabsTrigger>
            <TabsTrigger value="audio" className="data-[state=active]:bg-purple-600">
              <Volume2 className="w-4 h-4 ml-2" /> الصوت
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-600">
              <Bell className="w-4 h-4 ml-2" /> الإشعارات
            </TabsTrigger>
            <TabsTrigger value="adhan" className="data-[state=active]:bg-purple-600">
              <Music className="w-4 h-4 ml-2" /> المؤذن
            </TabsTrigger>
            <TabsTrigger value="storage" className="data-[state=active]:bg-purple-600">
              <Database className="w-4 h-4 ml-2" /> التخزين
            </TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-400" />
                المظهر والخلفيات
              </h3>

              {/* Background Selection */}
              <div className="mb-8">
                <label className="text-gray-300 block mb-4">الخلفية الروحانية</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {SPIRITUAL_BACKGROUNDS.map(bg => (
                    <div
                      key={bg.id}
                      onClick={() => updateSetting('background', bg.id)}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                        settings.background === bg.id 
                          ? 'border-purple-500 scale-105' 
                          : 'border-transparent hover:border-purple-500/50'
                      }`}
                    >
                      <div className={`h-24 bg-gradient-to-br ${bg.gradient} relative`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-sm font-bold bg-black/30 px-3 py-1 rounded-full">
                            {bg.name}
                          </span>
                        </div>
                        {settings.background === bg.id && (
                          <Badge className="absolute top-2 left-2 bg-purple-600">✓</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="mb-6">
                <label className="text-gray-300 block mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  حجم الخط: {settings.fontSize}px
                </label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([v]) => updateSetting('fontSize', v)}
                  min={14}
                  max={32}
                  step={2}
                  className="w-full"
                />
                <p className="text-2xl text-white mt-4 font-arabic text-center" style={{ fontSize: settings.fontSize }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>

              {/* Night Mode */}
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-bold">الوضع الليلي التلقائي</p>
                    <p className="text-gray-400 text-sm">تفعيل تلقائياً بعد المغرب</p>
                  </div>
                </div>
                <Switch
                  checked={settings.display.autoNightMode}
                  onCheckedChange={(v) => updateSetting('display.autoNightMode', v)}
                />
              </div>
            </Card>
          </TabsContent>

          {/* Audio Tab */}
          <TabsContent value="audio">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-400" />
                إعدادات الصوت
              </h3>

              {/* Volume */}
              <div className="mb-6">
                <label className="text-gray-300 block mb-3">
                  مستوى الصوت: {settings.audio.volume}%
                </label>
                <Slider
                  value={[settings.audio.volume]}
                  onValueChange={([v]) => updateSetting('audio.volume', v)}
                  max={100}
                  className="w-full"
                />
              </div>

              {/* Auto Play */}
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-white font-bold">التشغيل التلقائي</p>
                    <p className="text-gray-400 text-sm">تشغيل الآية عند الانتقال إليها</p>
                  </div>
                </div>
                <Switch
                  checked={settings.audio.autoPlay}
                  onCheckedChange={(v) => updateSetting('audio.autoPlay', v)}
                />
              </div>

              {/* Repeat */}
              <div className="mb-6">
                <label className="text-gray-300 block mb-3">
                  تكرار الآية: {settings.audio.repeatVerse} مرة
                </label>
                <Slider
                  value={[settings.audio.repeatVerse]}
                  onValueChange={([v]) => updateSetting('audio.repeatVerse', v)}
                  min={1}
                  max={10}
                  className="w-full"
                />
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                الإشعارات والتنبيهات
              </h3>

              <div className="space-y-4">
                {[
                  { key: 'prayerTimes', icon: Clock, title: 'أوقات الصلاة', desc: 'تنبيه قبل كل صلاة' },
                  { key: 'dailyVerse', icon: BookOpen, title: 'آية اليوم', desc: 'آية قرآنية يومية' },
                  { key: 'adhkar', icon: Sun, title: 'أذكار الصباح والمساء', desc: 'تذكير بالأذكار' },
                  { key: 'sound', icon: Volume2, title: 'صوت الإشعارات', desc: 'تشغيل صوت مع الإشعارات' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-white font-bold">{item.title}</p>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications[item.key]}
                      onCheckedChange={(v) => updateSetting(`notifications.${item.key}`, v)}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Adhan Tab */}
          <TabsContent value="adhan">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <AdhanPlayer />
            </Card>
          </TabsContent>

          {/* Storage Tab */}
          <TabsContent value="storage">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                التخزين والبيانات
              </h3>

              {/* Storage Usage */}
              <div className="mb-6 p-4 bg-slate-700/50 rounded-xl">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">المساحة المستخدمة</span>
                  <span className="text-white font-bold">{storageInfo.used} MB / {storageInfo.total} MB</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full"
                    style={{ width: `${(storageInfo.used / storageInfo.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={clearCache}
                  variant="outline"
                  className="w-full justify-start gap-3 border-slate-600 text-white hover:bg-slate-700"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                  مسح الذاكرة المؤقتة
                </Button>

                <Button
                  onClick={resetSettings}
                  variant="outline"
                  className="w-full justify-start gap-3 border-slate-600 text-white hover:bg-slate-700"
                >
                  <RefreshCw className="w-5 h-5 text-amber-400" />
                  إعادة الإعدادات الافتراضية
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* App Info */}
        <Card className="mt-8 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-emerald-500/30 p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">تطبيق ذِكْر</h3>
          <p className="text-emerald-300 mb-2">منصة قرآنية شاملة</p>
          <p className="text-gray-400 text-sm">الإصدار 3.0.0</p>
          <p className="text-amber-400 font-bold mt-4">
            🤲 صدقة جارية على روح جزبية عبد الرحيم هارون علي
          </p>
        </Card>
      </div>
    </div>
  );
}