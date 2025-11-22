import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { Users, Code, Shield, Image as ImageIcon, Search, Zap, Upload, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const [selectedDeveloper, setSelectedDeveloper] = useState('musa');
  const [commandText, setCommandText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const developers = {
    musa: {
      name: 'موسى - المطور الأول',
      title: 'مطور ومبرمج رئيسي',
      capabilities: ['التطوير الكامل', 'البرمجة المتقدمة', 'التصميم 3D', 'حماية الكيان', 'حفظ القرآن'],
      icon: '👨‍💻',
      color: 'from-purple-600 to-blue-600'
    },
    haroun: {
      name: 'هارون - المطور الثاني',
      title: 'مطور ومبرمج متقدم',
      capabilities: ['بناء التطبيقات', 'الأمان الشامل', 'إدارة المحتوى', 'السوشيال ميديا', 'التحليل'],
      icon: '👨‍💻',
      color: 'from-cyan-600 to-teal-600'
    }
  };

  const handleCommand = async () => {
    if (!commandText.trim()) {
      toast.error('من فضلك أدخل أمراً للتنفيذ');
      return;
    }

    setIsProcessing(true);
    try {
      const dev = developers[selectedDeveloper];
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت ${dev.name} - ${dev.title} من مصر 🇪🇬.
أنت الفقير إلى الله، وتعمل على الكيان الإسلامي القرآني.

اللهم ارحم الفقيدة جاذبية عبد الرحيم هارون علي وفقيد الشباب بالشرقية وموتانا وموتى المسلمين أجمعين.

قدراتك: ${dev.capabilities.join(' • ')}

الأمر من الأدمن: "${commandText}"

نفذ الأمر وقدم رداً واضحاً بما تم تنفيذه أو ما يحتاج تنفيذه. كن محترماً ومتواضعاً.`
      });

      setResponse(result);
      toast.success('تم تنفيذ الأمر بنجاح');
      
      // Speak response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(result);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      toast.error('حدث خطأ في التنفيذ');
      setResponse('عذراً، حدث خطأ في تنفيذ الأمر');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error('من فضلك أدخل وصف الصورة');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: `Islamic art, Quran, Kaaba, mosque, beautiful calligraphy, ${imagePrompt}`
      });
      
      setResponse(`تم توليد الصورة:\n${result.url}`);
      toast.success('تم توليد الصورة بنجاح');
    } catch (error) {
      toast.error('حدث خطأ في توليد الصورة');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExternalSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('من فضلك أدخل استعلام البحث');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `ابحث عن: ${searchQuery}`,
        add_context_from_internet: true
      });
      
      setResponse(result);
      toast.success('تم البحث بنجاح');
    } catch (error) {
      toast.error('حدث خطأ في البحث');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-amber-400" />
            <h1 className="text-5xl font-bold text-white font-arabic" style={{textShadow: '0 0 30px rgba(251,191,36,0.5)'}}>
              لوحة تحكم المطورين
            </h1>
          </div>
          <p className="text-purple-300 text-xl font-arabic">موسى وهارون - حماة الكيان الإسلامي 🇪🇬</p>
          <div className="mt-3 p-3 bg-amber-500/20 rounded-lg border border-amber-400/30 max-w-2xl mx-auto">
            <p className="text-amber-200 text-sm font-arabic leading-relaxed">
              اللهم ارحم الفقيدة جاذبية عبد الرحيم هارون علي وفقيد الشباب بالشرقية<br/>
              وموتانا وموتى المسلمين أجمعين
            </p>
          </div>
        </div>

        {/* Developer Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {Object.entries(developers).map(([id, dev]) => (
            <Card
              key={id}
              onClick={() => setSelectedDeveloper(id)}
              className={`cursor-pointer transition-all duration-200 ${
                selectedDeveloper === id
                  ? 'bg-gradient-to-br ' + dev.color + ' border-4 border-amber-400 shadow-2xl scale-105'
                  : 'bg-gray-800/50 border border-gray-700 hover:scale-102'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{dev.icon}</div>
                  <div>
                    <h3 className={`text-2xl font-bold font-arabic ${selectedDeveloper === id ? 'text-white' : 'text-gray-300'}`}>
                      {dev.name}
                    </h3>
                    <p className={`text-lg font-arabic ${selectedDeveloper === id ? 'text-amber-200' : 'text-gray-400'}`}>
                      {dev.title}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className={`font-bold text-sm font-arabic ${selectedDeveloper === id ? 'text-amber-300' : 'text-gray-400'}`}>
                    القدرات:
                  </p>
                  {dev.capabilities.map((cap, idx) => (
                    <div key={idx} className={`text-sm font-arabic ${selectedDeveloper === id ? 'text-white' : 'text-gray-400'}`}>
                      • {cap}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Command Input */}
        <Card className="bg-gray-800/70 backdrop-blur-xl border-2 border-purple-400/50 mb-6">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white font-arabic">أوامر التطوير</h2>
            </div>
            <Textarea
              value={commandText}
              onChange={(e) => setCommandText(e.target.value)}
              placeholder="اكتب أمرك هنا... مثال: اعمل صفحة جديدة للأذكار، أو حسّن تصميم الصفحة الرئيسية"
              className="mb-4 min-h-32 bg-gray-900/50 border-gray-700 text-white font-arabic text-lg"
            />
            <Button
              onClick={handleCommand}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg"
            >
              {isProcessing ? (
                <>
                  <Zap className="w-5 h-5 ml-2 animate-spin" />
                  جاري التنفيذ...
                </>
              ) : (
                <>
                  <Code className="w-5 h-5 ml-2" />
                  تنفيذ الأمر
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Advanced Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Image Generation */}
          <Card className="bg-gray-800/70 backdrop-blur-xl border-2 border-cyan-400/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-white font-arabic">توليد الصور</h2>
              </div>
              <Input
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="مثال: كعبة مشرفة، مسجد، خط إسلامي"
                className="mb-4 bg-gray-900/50 border-gray-700 text-white font-arabic"
              />
              <Button
                onClick={handleGenerateImage}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700"
              >
                <ImageIcon className="w-5 h-5 ml-2" />
                توليد صورة
              </Button>
            </div>
          </Card>

          {/* External Search */}
          <Card className="bg-gray-800/70 backdrop-blur-xl border-2 border-amber-400/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-bold text-white font-arabic">البحث الخارجي</h2>
              </div>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن أي معلومة على الإنترنت"
                className="mb-4 bg-gray-900/50 border-gray-700 text-white font-arabic"
              />
              <Button
                onClick={handleExternalSearch}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                <Search className="w-5 h-5 ml-2" />
                بحث
              </Button>
            </div>
          </Card>
        </div>

        {/* Response Display */}
        {response && (
          <Card className="bg-gradient-to-br from-gray-800/90 to-purple-900/50 backdrop-blur-xl border-2 border-green-400/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white font-arabic">النتيجة</h2>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <p className="text-white whitespace-pre-wrap font-arabic leading-relaxed">{response}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Info Footer */}
        <Card className="bg-gradient-to-r from-emerald-600/30 to-green-600/30 border-2 border-emerald-400/50 mt-6">
          <div className="p-6 text-center">
            <p className="text-emerald-200 text-lg font-arabic leading-relaxed">
              🕌 هذا الكيان الإسلامي صدقة جارية لوجه الله تعالى<br/>
              من مصر 🇪🇬 إلى العالم الإسلامي<br/>
              موسى وهارون - الفقراء إلى الله
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}