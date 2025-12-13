import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function CompleteCodeReference() {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (code, sectionName) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(sectionName);
    toast.success(`تم نسخ ${sectionName}`);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const CodeSection = ({ title, code, filename }) => (
    <div className="bg-white rounded-xl p-5 border-2 border-emerald-400 mb-6">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-2xl font-bold text-emerald-900">{title}</h3>
          {filename && <p className="text-sm text-gray-600">📄 {filename}</p>}
        </div>
        <Button
          onClick={() => copyToClipboard(code, title)}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {copiedSection === title ? (
            <><Check className="w-4 h-4 ml-2" /> تم النسخ</>
          ) : (
            <><Copy className="w-4 h-4 ml-2" /> نسخ</>
          )}
        </Button>
      </div>
      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed">
        {code}
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white shadow-2xl border-4 border-emerald-500">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
            <h1 className="text-5xl font-bold mb-4">💻 الكود الكامل - نسخ ولصق</h1>
            <p className="text-2xl">جميع الأكواد الرئيسية جاهزة للاستخدام المباشر</p>
          </div>

          <ScrollArea className="h-[70vh]">
            <div className="p-8">

              {/* SmartChatBot */}
              <CodeSection
                title="1️⃣ المساعد الذكي الجديد (SmartChatBot)"
                filename="components/assistant/SmartChatBot.jsx"
                code={`import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Mic, MicOff, X, Volume2, VolumeX, Minimize2, Maximize2, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// نقطة مركزية للتكامل مع API خارجي
const AI_CONFIG = {
  useExternalAPI: false,
  externalAPIUrl: "https://api.zaka.ai/chat",
  apiKey: null,
};

// دالة مركزية لاستدعاء الذكاء الاصطناعي
async function callAI({ userId, language, conversationHistory, appContext, userMessage }) {
  if (AI_CONFIG.useExternalAPI && AI_CONFIG.externalAPIUrl) {
    try {
      const response = await fetch(AI_CONFIG.externalAPIUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(AI_CONFIG.apiKey && { 'Authorization': \`Bearer \${AI_CONFIG.apiKey}\` })
        },
        body: JSON.stringify({
          userId,
          language,
          conversationHistory,
          appContext,
          message: userMessage
        })
      });
      return await response.json();
    } catch (error) {
      console.error('External API error:', error);
    }
  }

  const historyContext = conversationHistory
    .slice(-6)
    .map(m => \`\${m.role === 'user' ? 'المستخدم' : 'المساعد'}: \${m.content}\`)
    .join('\\n');

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: \`أنت "زوكا المرزوق" - مساعد قرآني ذكي

السياق: \${JSON.stringify(appContext)}
المحادثة: \${historyContext}
السؤال: "\${userMessage}"

رد بصيغة JSON:
{
  "replyText": "نص الرد",
  "actions": [{"type": "open_surah", "params": {"surah": 1}}]
}\`,
    response_json_schema: {
      type: "object",
      properties: {
        replyText: { type: "string" },
        actions: { type: "array", items: { type: "object" } }
      }
    }
  });
  return result;
}

export default function SmartChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'السلام عليكم! أنا زوكا المرزوق. كيف أساعدك؟',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const executeAction = (action) => {
    const { type, params } = action;
    switch (type) {
      case 'open_surah':
        navigate(createPageUrl(\`SurahView?surah=\${params.surah}\`));
        break;
      case 'play_recitation':
        navigate(createPageUrl(\`Tilawa?surah=\${params.surah}\`));
        break;
      case 'open_azkar':
        navigate(createPageUrl('Adhkar'));
        break;
      case 'open_duas':
        navigate(createPageUrl('Duaa'));
        break;
      default:
        break;
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMessage = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    setIsLoading(true);

    try {
      const response = await callAI({
        userId: 'current_user',
        language: 'ar',
        conversationHistory: messages,
        appContext: { currentPage: window.location.pathname },
        userMessage
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.replyText,
        timestamp: new Date(),
        actions: response.actions
      }]);

      if (response.actions?.length > 0) {
        response.actions.forEach(action => {
          if (action.type !== 'none') {
            setTimeout(() => executeAction(action), 500);
          }
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'عذراً، حدث خطأ',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('المتصفح لا يدعم التعرف على الصوت');
      return;
    }
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'ar-SA';
    recognitionRef.current.onresult = (event) => {
      setInputText(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognitionRef.current.start();
    setIsListening(true);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 shadow-2xl hover:scale-110 transition-all z-50"
      >
        <Bot className="w-8 h-8 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[420px] max-w-[95vw] z-50">
      <Card className="bg-slate-900/98 backdrop-blur-xl border-2 border-emerald-500/30">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">زوكا المرزوق</h3>
              <p className="text-emerald-100 text-xs">مساعدك القرآني</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsMinimized(!isMinimized)} size="icon" variant="ghost" className="text-white">
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button onClick={() => setIsOpen(false)} size="icon" variant="ghost" className="text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <ScrollArea className="h-[350px] p-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={\`flex \${msg.role === 'user' ? 'justify-start' : 'justify-end'} mb-4\`}>
                  <div className={\`max-w-[85%] p-3 rounded-2xl \${
                    msg.role === 'user'
                      ? 'bg-emerald-600/20 border border-emerald-500/30'
                      : 'bg-slate-700/50 border border-slate-600/30'
                  }\`}>
                    <p className="text-white text-sm">{msg.content}</p>
                    {msg.role === 'assistant' && (
                      <Button
                        onClick={() => isSpeaking ? window.speechSynthesis.cancel() : speakText(msg.content)}
                        size="sm"
                        variant="ghost"
                        className="text-emerald-400 h-6 px-2 mt-2"
                      >
                        {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-end">
                  <div className="bg-slate-700/50 p-3 rounded-2xl flex gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t border-slate-700/50">
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 bg-slate-800/50 border-slate-600/50 text-white"
                  disabled={isLoading}
                />
                <Button onClick={startListening} size="icon" variant="outline" className={isListening ? 'bg-red-500/20' : ''}>
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button onClick={sendMessage} size="icon" disabled={!inputText.trim() || isLoading} className="bg-emerald-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}`}
              />

              {/* Entities */}
              <CodeSection
                title="2️⃣ كيانات قاعدة البيانات (Entities)"
                filename="entities/MemorizationPlan.json"
                code={`{
  "name": "MemorizationPlan",
  "type": "object",
  "properties": {
    "target_type": {
      "type": "string",
      "enum": ["juz", "surah", "pages", "verses"],
      "description": "نوع الهدف"
    },
    "target_value": {
      "type": "string",
      "description": "قيمة الهدف"
    },
    "level": {
      "type": "string",
      "enum": ["beginner", "intermediate", "advanced"],
      "default": "beginner"
    },
    "daily_load": {
      "type": "number",
      "default": 5
    },
    "status": {
      "type": "string",
      "enum": ["active", "paused", "completed"],
      "default": "active"
    },
    "total_verses": {
      "type": "number",
      "default": 0
    },
    "completed_verses": {
      "type": "number",
      "default": 0
    }
  },
  "required": ["target_type", "level", "daily_load"]
}`}
              />

              {/* استخدام Base44 */}
              <CodeSection
                title="3️⃣ استخدام Base44 API"
                code={`import { base44 } from '@/api/base44Client';

// ============================================
// 1. إدارة البيانات (Entities)
// ============================================

// قراءة جميع السجلات
const plans = await base44.entities.MemorizationPlan.list();

// قراءة مع فلتر وترتيب
const activePlans = await base44.entities.MemorizationPlan.filter(
  { status: 'active' },
  '-created_date',  // ترتيب تنازلي
  10                // عدد النتائج
);

// إنشاء سجل جديد
await base44.entities.MemorizationPlan.create({
  target_type: 'juz',
  target_value: '1',
  level: 'beginner',
  daily_load: 5,
  total_verses: 148
});

// تحديث سجل
await base44.entities.MemorizationPlan.update(planId, {
  completed_verses: 50
});

// حذف سجل
await base44.entities.MemorizationPlan.delete(planId);

// الحصول على Schema
const schema = await base44.entities.MemorizationPlan.schema();

// ============================================
// 2. المصادقة (Authentication)
// ============================================

// الحصول على المستخدم الحالي
const user = await base44.auth.me();
console.log(user.email, user.role);

// تحديث بيانات المستخدم
await base44.auth.updateMe({
  stats: { verses_read: 100 }
});

// تسجيل الخروج
base44.auth.logout();

// إعادة توجيه للتسجيل
base44.auth.redirectToLogin();

// التحقق من تسجيل الدخول
const isAuthenticated = await base44.auth.isAuthenticated();

// ============================================
// 3. الذكاء الاصطناعي (LLM)
// ============================================

// استدعاء بسيط
const response = await base44.integrations.Core.InvokeLLM({
  prompt: "ما معنى سورة الفاتحة؟"
});
console.log(response); // نص الرد

// مع بحث من الإنترنت
const response2 = await base44.integrations.Core.InvokeLLM({
  prompt: "أعطني أحدث أخبار الإسلام",
  add_context_from_internet: true
});

// مع JSON Schema
const response3 = await base44.integrations.Core.InvokeLLM({
  prompt: "أعطني قائمة بأشهر 5 قراء",
  response_json_schema: {
    type: "object",
    properties: {
      reciters: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            country: { type: "string" }
          }
        }
      }
    }
  }
});
console.log(response3.reciters);

// مع ملفات
const { file_url } = await base44.integrations.Core.UploadFile({ 
  file: fileObject 
});
const analysis = await base44.integrations.Core.InvokeLLM({
  prompt: "حلل هذه الصورة من المصحف",
  file_urls: [file_url]
});

// ============================================
// 4. إرسال بريد إلكتروني
// ============================================
await base44.integrations.Core.SendEmail({
  to: "user@example.com",
  subject: "تذكير بالحفظ",
  body: "حان وقت حفظك اليومي",
  from_name: "تطبيق القرآن"
});

// ============================================
// 5. توليد صورة بالذكاء الاصطناعي
// ============================================
const imageResult = await base44.integrations.Core.GenerateImage({
  prompt: "مسجد جميل في الشروق"
});
console.log(imageResult.url);`}
              />

              {/* React Query */}
              <CodeSection
                title="4️⃣ React Query للبيانات"
                code={`import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

function MyComponent() {
  const queryClient = useQueryClient();

  // قراءة البيانات
  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['memorization-plans'],
    queryFn: () => base44.entities.MemorizationPlan.list(),
    initialData: []
  });

  // إنشاء سجل
  const createPlan = useMutation({
    mutationFn: (planData) => base44.entities.MemorizationPlan.create(planData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memorization-plans'] });
      toast.success('تم إنشاء الخطة');
    },
    onError: (error) => {
      toast.error('حدث خطأ');
    }
  });

  // تحديث سجل
  const updatePlan = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MemorizationPlan.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memorization-plans'] });
    }
  });

  // حذف سجل
  const deletePlan = useMutation({
    mutationFn: (id) => base44.entities.MemorizationPlan.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memorization-plans'] });
    }
  });

  // استخدام
  const handleCreate = () => {
    createPlan.mutate({
      target_type: 'juz',
      level: 'beginner',
      daily_load: 5
    });
  };

  const handleUpdate = (planId) => {
    updatePlan.mutate({
      id: planId,
      data: { completed_verses: 50 }
    });
  };

  return (
    <div>
      {isLoading && <p>جاري التحميل...</p>}
      {plans.map(plan => (
        <div key={plan.id}>
          <p>{plan.target_type}</p>
          <button onClick={() => handleUpdate(plan.id)}>تحديث</button>
        </div>
      ))}
      <button onClick={handleCreate}>إنشاء خطة</button>
    </div>
  );
}`}
              />

              {/* LocalStorage */}
              <CodeSection
                title="5️⃣ التخزين المحلي (LocalStorage)"
                code={`// ملف: components/utils/offlineStorage.js

class OfflineStorage {
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Save error:', error);
    }
  }

  load(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Load error:', error);
      return null;
    }
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

  // دوال مخصصة
  saveUserStats(stats) {
    this.save('user_stats', stats);
  }

  loadUserStats() {
    return this.load('user_stats') || {
      verses_read: 0,
      surahs_completed: 0,
      minutes_spent: 0,
      streak: 0
    };
  }

  saveBookmarks(bookmarks) {
    this.save('bookmarks', bookmarks);
  }

  loadBookmarks() {
    return this.load('bookmarks') || [];
  }
}

export const offlineStorage = new OfflineStorage();

// الاستخدام
import { offlineStorage } from '@/components/utils/offlineStorage';

// حفظ
offlineStorage.saveUserStats({ verses_read: 100 });

// قراءة
const stats = offlineStorage.loadUserStats();
console.log(stats.verses_read);`}
              />

              {/* Voice Recognition */}
              <CodeSection
                title="6️⃣ التعرف على الصوت"
                code={`function VoiceComponent() {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('المتصفح لا يدعم التعرف على الصوت');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // الإعدادات
    recognitionRef.current.lang = 'ar-SA';           // اللغة العربية
    recognitionRef.current.continuous = false;       // توقف بعد جملة واحدة
    recognitionRef.current.interimResults = false;   // نتائج نهائية فقط

    // عند البدء
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      toast.info('🎤 تحدث الآن...');
    };

    // عند الحصول على نتيجة
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('قلت:', transcript);
      setIsListening(false);
      
      // معالجة الأمر
      processVoiceCommand(transcript);
    };

    // عند الخطأ
    recognitionRef.current.onerror = (event) => {
      console.error('خطأ:', event.error);
      setIsListening(false);
      toast.error('خطأ في التسجيل');
    };

    // عند الانتهاء
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    // بدء التسجيل
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const processVoiceCommand = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('سورة البقرة')) {
      navigate(createPageUrl('SurahView?surah=2'));
    } else if (lowerText.includes('شغل')) {
      navigate(createPageUrl('Tilawa'));
    }
  };

  return (
    <Button onClick={isListening ? stopListening : startListening}>
      {isListening ? <MicOff /> : <Mic />}
    </Button>
  );
}`}
              />

              {/* Text to Speech */}
              <CodeSection
                title="7️⃣ تحويل النص لصوت"
                code={`function TextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // إيقاف أي كلام سابق
      window.speechSynthesis.cancel();

      // إنشاء النطق
      const utterance = new SpeechSynthesisUtterance(text);
      
      // الإعدادات
      utterance.lang = 'ar-SA';    // اللغة العربية
      utterance.rate = 0.9;        // السرعة (0.1 - 10)
      utterance.pitch = 1.0;       // النبرة (0 - 2)
      utterance.volume = 1.0;      // الصوت (0 - 1)

      // الأحداث
      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('بدأ الكلام');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('انتهى الكلام');
      };

      utterance.onerror = (event) => {
        console.error('خطأ:', event.error);
        setIsSpeaking(false);
      };

      // بدء الكلام
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('المتصفح لا يدعم قراءة النصوص');
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div>
      <Button onClick={() => speakText('بسم الله الرحمن الرحيم')}>
        {isSpeaking ? <VolumeX /> : <Volume2 />}
      </Button>
    </div>
  );
}`}
              />

              {/* Audio Player */}
              <CodeSection
                title="8️⃣ مشغل الصوت (Audio)"
                code={`function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const audioRef = useRef(null);

  const handlePlayPause = async () => {
    try {
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        toast.info('⏸️ تم الإيقاف');
        return;
      }

      // إنشاء Audio جديد
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      const url = 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3';
      
      toast.loading('🎧 جاري التحميل...', { id: 'loading' });
      
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.preload = "auto";
      
      audio.onloadeddata = () => {
        toast.dismiss('loading');
        toast.success('🎧 بدأ التشغيل');
      };

      audio.onended = () => {
        setIsPlaying(false);
        toast.success('✅ انتهى');
      };

      audio.onerror = () => {
        toast.dismiss('loading');
        setIsPlaying(false);
        toast.error('❌ خطأ في التشغيل');
      };

      audio.src = url;
      audio.volume = volume[0] / 100;
      audioRef.current = audio;

      await audio.play();
      setIsPlaying(true);

    } catch (err) {
      console.error('Play error:', err);
      toast.error('❌ خطأ');
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <Button onClick={handlePlayPause}>
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <Slider
        value={volume}
        onValueChange={setVolume}
        max={100}
      />
    </div>
  );
}`}
              />

              {/* Camera */}
              <CodeSection
                title="9️⃣ استخدام الكاميرا"
                code={`function CameraComponent() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',  // الكاميرا الخلفية
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsCameraOpen(true);
      toast.success('📷 تم فتح الكاميرا');
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('❌ تعذر فتح الكاميرا');
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const captureImage = async () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      
      // رفع الصورة
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setCapturedImage(file_url);
      
      // تحليل الصورة
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: "حلل هذه الصورة من المصحف",
        file_urls: [file_url]
      });
      
      toast.success('تم التقاط الصورة');
      closeCamera();
    }, 'image/jpeg', 0.95);
  };

  return (
    <div>
      {!isCameraOpen ? (
        <Button onClick={openCamera}>
          <Camera /> فتح الكاميرا
        </Button>
      ) : (
        <div>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="w-full rounded-lg"
          />
          <Button onClick={captureImage}>التقاط</Button>
          <Button onClick={closeCamera}>إغلاق</Button>
        </div>
      )}
      
      {capturedImage && (
        <img src={capturedImage} alt="captured" />
      )}
    </div>
  );
}`}
              />

              {/* Navigation */}
              <CodeSection
                title="🔟 التنقل بين الصفحات"
                code={`import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

function NavigationExample() {
  const navigate = useNavigate();

  // التنقل البرمجي
  const goToPage = () => {
    navigate(createPageUrl('Quran'));
  };

  const goToSurah = (surahNumber) => {
    navigate(createPageUrl(\`SurahView?surah=\${surahNumber}\`));
  };

  const goToTilawa = (surahNumber, reciter) => {
    navigate(createPageUrl(\`Tilawa?surah=\${surahNumber}&reciter=\${reciter}\`));
  };

  // التنقل باستخدام Link
  return (
    <div>
      {/* طريقة 1: Button */}
      <Button onClick={goToPage}>
        اذهب للقرآن
      </Button>

      {/* طريقة 2: Link */}
      <Link to={createPageUrl('Quran')}>
        <Button>القرآن الكريم</Button>
      </Link>

      {/* طريقة 3: مع Query Parameters */}
      <Link to={createPageUrl('SurahView?surah=2&ayah=255')}>
        <Button>آية الكرسي</Button>
      </Link>

      {/* طريقة 4: الرجوع للخلف */}
      <Button onClick={() => navigate(-1)}>
        رجوع
      </Button>
    </div>
  );
}

// قراءة Query Parameters
function ReadParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const surahNumber = urlParams.get('surah');
  const ayahNumber = urlParams.get('ayah');
  
  return <div>السورة: {surahNumber}, الآية: {ayahNumber}</div>;
}`}
              />

              {/* Complete Page Example */}
              <CodeSection
                title="1️⃣1️⃣ مثال صفحة كاملة"
                code={`import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ExamplePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // قراءة البيانات
  const { data: items, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: () => base44.entities.MyEntity.list(),
    initialData: []
  });

  // إنشاء سجل
  const createItem = useMutation({
    mutationFn: (itemData) => base44.entities.MyEntity.create(itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('تم الإنشاء');
    }
  });

  // حذف سجل
  const deleteItem = useMutation({
    mutationFn: (id) => base44.entities.MyEntity.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('تم الحذف');
    }
  });

  // فلترة البيانات
  const filteredItems = items.filter(item =>
    item.name.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            عنوان الصفحة
          </h1>
          <p className="text-gray-600">وصف الصفحة</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث..."
            className="max-w-md"
          />
        </div>

        {/* Create Button */}
        <Button
          onClick={() => createItem.mutate({ name: 'جديد' })}
          className="mb-6"
        >
          إضافة جديد
        </Button>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-8">
            <p>جاري التحميل...</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="p-6">
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <Button
                onClick={() => deleteItem.mutate(item.id)}
                variant="destructive"
                size="sm"
              >
                حذف
              </Button>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-xl">لا توجد نتائج</p>
          </div>
        )}
      </div>
    </div>
  );
}`}
              />

            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}