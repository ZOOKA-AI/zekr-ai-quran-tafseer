import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings2, Save, RefreshCw, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function SmartReaderSettings({ 
  settings, 
  onSettingsChange, 
  reciterId, 
  surahNumber 
}) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const saveSettings = () => {
    const key = `playback_settings_${reciterId}_${surahNumber || 'default'}`;
    localStorage.setItem(key, JSON.stringify(settings));
    toast.success('تم حفظ الإعدادات ✓');
  };

  const loadSettings = () => {
    const key = `playback_settings_${reciterId}_${surahNumber || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      onSettingsChange(JSON.parse(saved));
      toast.success('تم تحميل الإعدادات المحفوظة');
    } else {
      toast.error('لا توجد إعدادات محفوظة');
    }
  };

  const resetSettings = () => {
    const defaultSettings = {
      playback_speed: 1,
      recitation_style: 'ترتيل',
      ayah_by_ayah_mode: false,
      repeat_count: 1,
      auto_scroll: true,
      pause_between_ayahs: 0
    };
    onSettingsChange(defaultSettings);
    toast.success('تم إعادة تعيين الإعدادات');
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings2 className="w-6 h-6 text-purple-600" />
          <h3 className="text-2xl font-bold text-gray-900">القارئ الذكي</h3>
          <Badge className="bg-purple-600 text-white">
            <Zap className="w-3 h-3 ml-1" />
            ذكي
          </Badge>
        </div>
        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="outline"
          size="sm"
        >
          {showAdvanced ? 'إخفاء' : 'إعدادات متقدمة'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* سرعة التشغيل */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-bold">سرعة التشغيل</Label>
            <Badge variant="outline" className="text-lg font-bold">
              {settings.playback_speed}x
            </Badge>
          </div>
          <Slider
            value={[settings.playback_speed]}
            onValueChange={([value]) => onSettingsChange({ ...settings, playback_speed: value })}
            min={0.5}
            max={2}
            step={0.25}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>بطيء (0.5x)</span>
            <span>عادي (1x)</span>
            <span>سريع (2x)</span>
          </div>
        </div>

        {/* نمط التلاوة */}
        <div className="space-y-2">
          <Label className="text-lg font-bold">نمط التلاوة</Label>
          <Select
            value={settings.recitation_style}
            onValueChange={(value) => onSettingsChange({ ...settings, recitation_style: value })}
          >
            <SelectTrigger className="text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ترتيل">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📖</span>
                  <div>
                    <p className="font-bold">ترتيل</p>
                    <p className="text-xs text-gray-600">قراءة هادئة متأنية</p>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="حدر">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <div>
                    <p className="font-bold">حدر</p>
                    <p className="text-xs text-gray-600">قراءة سريعة</p>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="تدوير">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎵</span>
                  <div>
                    <p className="font-bold">تدوير</p>
                    <p className="text-xs text-gray-600">قراءة متوسطة</p>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* وضع آية بآية */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-indigo-200">
          <div>
            <Label className="text-lg font-bold flex items-center gap-2">
              <span>🎯</span>
              وضع آية بآية
            </Label>
            <p className="text-sm text-gray-600 mt-1">للحفظ والتعلم المركز</p>
          </div>
          <Switch
            checked={settings.ayah_by_ayah_mode}
            onCheckedChange={(checked) => onSettingsChange({ ...settings, ayah_by_ayah_mode: checked })}
          />
        </div>

        {/* إعدادات متقدمة */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-white rounded-lg border-2 border-gray-200">
            <h4 className="font-bold text-gray-900 mb-3">إعدادات متقدمة</h4>

            {/* عدد مرات التكرار */}
            <div className="space-y-2">
              <Label>عدد مرات التكرار</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 5, 7, 10].map(count => (
                  <Button
                    key={count}
                    onClick={() => onSettingsChange({ ...settings, repeat_count: count })}
                    variant={settings.repeat_count === count ? 'default' : 'outline'}
                    size="sm"
                  >
                    {count}x
                  </Button>
                ))}
              </div>
            </div>

            {/* التوقف بين الآيات */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>التوقف بين الآيات</Label>
                <Badge variant="outline">{settings.pause_between_ayahs}ث</Badge>
              </div>
              <Slider
                value={[settings.pause_between_ayahs]}
                onValueChange={([value]) => onSettingsChange({ ...settings, pause_between_ayahs: value })}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* التمرير التلقائي */}
            <div className="flex items-center justify-between">
              <Label>التمرير التلقائي</Label>
              <Switch
                checked={settings.auto_scroll}
                onCheckedChange={(checked) => onSettingsChange({ ...settings, auto_scroll: checked })}
              />
            </div>
          </div>
        )}

        {/* أزرار الحفظ */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={saveSettings}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 ml-2" />
            حفظ الإعدادات
          </Button>
          <Button
            onClick={loadSettings}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            تحميل
          </Button>
          <Button
            onClick={resetSettings}
            variant="outline"
          >
            إعادة تعيين
          </Button>
        </div>
      </div>
    </Card>
  );
}