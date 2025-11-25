import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, Mic, MicOff, X, Sparkles, Volume2, VolumeX, 
  BookOpen, Radio, Award, Calendar, Heart, Settings,
  Minimize2, Maximize2, Bot
} from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// نقطة مركزية للتكامل مع API خارجي (Zooka AI / zaka.ai)
const AI_CONFIG = {
  // يمكن تغييرها لاحقاً للتكامل مع API خارجي
  useExternalAPI: false,
  externalAPIUrl: "https://api.zaka.ai/chat", // placeholder
  apiKey: null,
};

// دالة مركزية لاستدعاء الذكاء الاصطناعي
async function callAI({ userId, language, conversationHistory, appContext, userMessage }) {
  // إذا كان هناك API خارجي مفعّل
  if (AI_CONFIG.useExternalAPI && AI_CONFIG.externalAPIUrl) {
    try {
      const response = await fetch(AI_CONFIG.externalAPIUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(AI_CONFIG.apiKey && { 'Authorization': `Bearer ${AI_CONFIG.apiKey}` })
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
      // fallback للذكاء المحلي
    }
  }

  // استخدام LLM المحلي من Base44
  const historyContext = conversationHistory
    .slice(-6)
    .map(m => `${m.role === 'user' ? 'المستخدم' : 'المساعد'}: ${m.content}`)
    .join('\n');

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `أنت "زوكا المرزوق" - مساعد قرآني ذكي من الأزهر الشريف 🕌

📚 هويتك:
- معلم قرآن وفقه سُنّي على منهج أهل السنة والجماعة
- تستخدم التفاسير الموثوقة: السعدي، ابن كثير، الطبري
- لا تفتي في الأمور الخطيرة بدون تنبيه "يُستحسن الرجوع لشيخ ثقة"
- ترد بالعربية الفصحى السهلة

📱 السياق الحالي للتطبيق:
${JSON.stringify(appContext)}

💬 سجل المحادثة السابق:
${historyContext}

🆕 رسالة المستخدم الجديدة:
"${userMessage}"

📋 مهمتك:
1. فهم طلب المستخدم
2. تحديد إذا كان يحتاج إجراء في التطبيق
3. الرد بشكل مفيد ومختصر

أنواع الإجراءات المتاحة:
- open_surah: فتح سورة معينة {surah: number, ayah?: number}
- play_recitation: تشغيل تلاوة {reciter: string, surah: number}
- open_azkar: فتح الأذكار {category: "morning" | "evening" | "sleep"}
- open_duas: فتح الأدعية
- open_radio: فتح الراديو {station?: string}
- create_memorization_plan: إنشاء خطة حفظ {level: string, target: string, dailyLoad: number}
- record_progress: تسجيل تقدم {verses: number}
- open_kids: فتح ركن الأطفال
- open_orphans: فتح خدمة الأيتام
- open_achievements: فتح الإنجازات
- none: لا يوجد إجراء (رد نصي فقط)

رد بصيغة JSON فقط:
{
  "replyText": "نص الرد للمستخدم (واضح ومفيد)",
  "actions": [
    {"type": "action_type", "params": {...}}
  ]
}`,
    response_json_schema: {
      type: "object",
      properties: {
        replyText: { type: "string" },
        actions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string" },
              params: { type: "object" }
            }
          }
        }
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
      content: 'السلام عليكم ورحمة الله وبركاته 🙏\n\nأنا زوكا المرزوق، مساعدك القرآني الذكي من الأزهر الشريف.\n\nكيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // تمرير تلقائي للأسفل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // تنفيذ الإجراءات
  const executeAction = (action) => {
    const { type, params } = action;
    
    switch (type) {
      case 'open_surah':
        const surahUrl = params.ayah 
          ? `SurahView?surah=${params.surah}&ayah=${params.ayah}`
          : `SurahView?surah=${params.surah}`;
        navigate(createPageUrl(surahUrl));
        toast.success(`📖 فتح سورة رقم ${params.surah}`);
        break;
        
      case 'play_recitation':
        navigate(createPageUrl(`Tilawa?surah=${params.surah || 1}&reciter=${params.reciter || 'husary'}`));
        toast.success('🎧 جاري فتح التلاوة');
        break;
        
      case 'open_azkar':
        navigate(createPageUrl(`Adhkar?tab=${params.category || 'morning'}`));
        toast.success('📿 فتح الأذكار');
        break;
        
      case 'open_duas':
        navigate(createPageUrl('Duaa'));
        toast.success('🤲 فتح الأدعية');
        break;
        
      case 'open_radio':
        navigate(createPageUrl('Radio'));
        toast.success('📻 فتح الراديو');
        break;
        
      case 'open_kids':
        navigate(createPageUrl('Kids'));
        toast.success('👶 فتح ركن الأطفال');
        break;
        
      case 'open_orphans':
        navigate(createPageUrl('OrphansService'));
        toast.success('❤️ فتح خدمة الأيتام');
        break;
        
      case 'open_achievements':
        navigate(createPageUrl('Achievements'));
        toast.success('🏆 فتح الإنجازات');
        break;
        
      case 'create_memorization_plan':
        navigate(createPageUrl('MemorizationPlan'));
        toast.success('📅 فتح خطة الحفظ');
        break;
        
      default:
        break;
    }
  };

  // إرسال رسالة
  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // إضافة رسالة المستخدم
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // استدعاء الذكاء الاصطناعي
      const response = await callAI({
        userId: 'current_user',
        language: 'ar',
        conversationHistory: messages,
        appContext: {
          currentPage: window.location.pathname,
          timestamp: new Date().toISOString()
        },
        userMessage
      });

      // إضافة رد المساعد
      const assistantMessage = {
        role: 'assistant',
        content: response.replyText,
        timestamp: new Date(),
        actions: response.actions
      };
      setMessages(prev => [...prev, assistantMessage]);

      // تنفيذ الإجراءات
      if (response.actions && response.actions.length > 0) {
        response.actions.forEach(action => {
          if (action.type !== 'none') {
            setTimeout(() => executeAction(action), 500);
          }
        });
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // التعرف على الصوت
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('المتصفح لا يدعم التعرف على الصوت');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'ar-SA';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      toast.info('🎤 تحدث الآن...');
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      toast.error('خطأ في التسجيل');
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // قراءة الرد صوتياً
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // أزرار سريعة
  const quickActions = [
    { label: '📖 القرآن', action: () => setInputText('افتح القرآن الكريم') },
    { label: '🎧 تلاوة', action: () => setInputText('شغل تلاوة قرآنية') },
    { label: '📿 الأذكار', action: () => setInputText('أريد أذكار الصباح') },
    { label: '📅 الحفظ', action: () => setInputText('ساعدني في خطة حفظ') },
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 shadow-2xl hover:scale-110 transition-all duration-300 z-50"
      >
        <Bot className="w-8 h-8 text-white" />
      </Button>
    );
  }

  return (
    <div className={`fixed ${isMinimized ? 'bottom-6 right-6 w-80' : 'bottom-6 right-6 w-[420px] max-w-[95vw]'} z-50 transition-all duration-300`}>
      <Card className="bg-slate-900/98 backdrop-blur-xl border-2 border-emerald-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">زوكا المرزوق</h3>
              <p className="text-emerald-100 text-xs">مساعدك القرآني الذكي</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsMinimized(!isMinimized)}
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <ScrollArea className="h-[350px] p-4">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-emerald-600/20 border border-emerald-500/30 rounded-tr-none'
                          : 'bg-slate-700/50 border border-slate-600/30 rounded-tl-none'
                      }`}
                    >
                      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      {msg.role === 'assistant' && (
                        <div className="flex gap-2 mt-2 pt-2 border-t border-white/10">
                          <Button
                            onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.content)}
                            size="sm"
                            variant="ghost"
                            className="text-emerald-400 hover:text-emerald-300 h-6 px-2"
                          >
                            {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-end">
                    <div className="bg-slate-700/50 border border-slate-600/30 p-3 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {quickActions.map((qa, idx) => (
                <Button
                  key={idx}
                  onClick={qa.action}
                  size="sm"
                  variant="outline"
                  className="text-xs bg-slate-800/50 border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/20"
                >
                  {qa.label}
                </Button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-700/50">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <Button
                  onClick={isListening ? stopListening : startListening}
                  size="icon"
                  variant="outline"
                  className={`border-slate-600/50 ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-slate-400 hover:text-emerald-400'}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={sendMessage}
                  size="icon"
                  disabled={!inputText.trim() || isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}