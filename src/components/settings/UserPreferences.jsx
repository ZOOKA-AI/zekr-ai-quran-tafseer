import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Type, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_PREFERENCES = {
  fontSize: 16,
  darkMode: false,
  notifications: true,
  autoPlay: false,
  showTafsir: true,
  language: 'ar'
};

export default function UserPreferences() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    const saved = localStorage.getItem('user_preferences');
    if (saved) {
      setPrefs(JSON.parse(saved));
    }
  };

  const savePreferences = (newPrefs) => {
    setPrefs(newPrefs);
    localStorage.setItem('user_preferences', JSON.stringify(newPrefs));
    applyPreferences(newPrefs);
    toast.success('تم حفظ الإعدادات!');
  };

  const applyPreferences = (preferences) => {
    // تطبيق حجم الخط
    document.documentElement.style.setProperty('--base-font-size', `${preferences.fontSize}px`);
    
    // تطبيق الوضع الليلي
    if (preferences.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleFontSizeChange = (value) => {
    savePreferences({ ...prefs, fontSize: value[0] });
  };

  const handleToggle = (key) => {
    savePreferences({ ...prefs, [key]: !prefs[key] });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">الإعدادات</h3>
      </div>

      <div className="space-y-6">
        {/* حجم الخط */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-gray-700" />
              <span className="font-bold text-gray-900">حجم الخط</span>
            </div>
            <span className="text-emerald-600 font-bold">{prefs.fontSize}px</span>
          </div>
          <Slider
            value={[prefs.fontSize]}
            onValueChange={handleFontSizeChange}
            min={12}
            max={24}
            step={1}
            className="w-full"
          />
        </div>

        {/* الوضع الليلي */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {prefs.darkMode ? <Moon className="w-5 h-5 text-gray-700" /> : <Sun className="w-5 h-5 text-gray-700" />}
            <span className="font-bold text-gray-900">الوضع الليلي</span>
          </div>
          <Switch
            checked={prefs.darkMode}
            onCheckedChange={() => handleToggle('darkMode')}
          />
        </div>

        {/* الإشعارات */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="font-bold text-gray-900">تفعيل الإشعارات</span>
          </div>
          <Switch
            checked={prefs.notifications}
            onCheckedChange={() => handleToggle('notifications')}
          />
        </div>

        {/* عرض التفسير تلقائياً */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">إظهار التفسير</span>
          </div>
          <Switch
            checked={prefs.showTafsir}
            onCheckedChange={() => handleToggle('showTafsir')}
          />
        </div>

        {/* تشغيل تلقائي */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">تشغيل تلقائي</span>
          </div>
          <Switch
            checked={prefs.autoPlay}
            onCheckedChange={() => handleToggle('autoPlay')}
          />
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <Button
          onClick={() => {
            savePreferences(DEFAULT_PREFERENCES);
            toast.info('تم استعادة الإعدادات الافتراضية');
          }}
          variant="outline"
          className="w-full"
        >
          استعادة الإعدادات الافتراضية
        </Button>
      </div>
    </Card>
  );
}