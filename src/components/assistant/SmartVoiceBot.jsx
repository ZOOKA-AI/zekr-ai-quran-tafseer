import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, X, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SmartVoiceBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('المتصفح لا يدعم التعرف على الصوت');
      speak('عذراً، المتصفح لا يدعم التعرف على الصوت');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'ar-SA';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      toast.success('🎤 أنا أستمع إليك... تكلم بحرية');
    };

    recognitionRef.current.onresult = async (event) => {
      const userText = event.results[0][0].transcript;
      setTranscript(userText);
      setIsListening(false);
      
      addToHistory('user', userText);
      await processUserRequest(userText);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      toast.error('حدث خطأ في التسجيل');
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

  const addToHistory = (role, content) => {
    setConversationHistory(prev => [...prev, { role, content }]);
  };

  const processUserRequest = async (userText) => {
    try {
      // استخدام الذكاء الاصطناعي لفهم طلب المستخدم
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت مساعد قرآني ذكي ومحترف اسمك "ZOOKA المرزوق". مهمتك مساعدة المستخدم في تطبيق القرآن الكريم.

المستخدم قال: "${userText}"

حلل طلب المستخدم وحدد:
1. نوع الطلب (navigation, search, play_audio, information, general)
2. المعلومات المطلوبة (اسم السورة، رقم الآية، اسم القارئ، إلخ)
3. رد مناسب وودي بالعربية

أمثلة:
- "روح صفحة التلاوة" → navigation: Tilawa
- "شغل سورة الفاتحة" → play_audio: surah=1
- "ابحث عن آية الكرسي" → search: آية الكرسي
- "مين أحسن قارئ؟" → information: reciters

رد بصيغة JSON:
{
  "action": "navigation/search/play_audio/information/general",
  "data": {"page": "Tilawa", "surah": 1, "reciter": "husary", "query": "..."},
  "response": "نص الرد باللغة العربية بأسلوب ودي ومحترم"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            action: { type: "string" },
            data: { type: "object" },
            response: { type: "string" }
          }
        }
      });

      const botResponse = aiResponse.response;
      setResponse(botResponse);
      addToHistory('assistant', botResponse);
      
      // تنفيذ الإجراء
      executeAction(aiResponse.action, aiResponse.data);
      
      // التحدث بالرد
      speak(botResponse);
      
    } catch (error) {
      const errorMsg = 'عذراً، حدث خطأ في معالجة طلبك';
      setResponse(errorMsg);
      speak(errorMsg);
    }
  };

  const executeAction = (action, data) => {
    switch (action) {
      case 'navigation':
        if (data.page) {
          setTimeout(() => {
            navigate(createPageUrl(data.page));
            toast.success(`تم الانتقال إلى ${data.page}`);
          }, 1000);
        }
        break;
      case 'search':
        if (data.query) {
          setTimeout(() => {
            navigate(createPageUrl(`Quran?search=${encodeURIComponent(data.query)}`));
          }, 1000);
        }
        break;
      case 'play_audio':
        if (data.surah) {
          setTimeout(() => {
            navigate(createPageUrl(`Tilawa?surah=${data.surah}&reciter=${data.reciter || 'husary'}`));
          }, 1000);
        }
        break;
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => {
            setIsOpen(true);
            speak('مرحباً! أنا ZOOKA المرزوق، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟');
          }}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-2xl hover:scale-110 transition-all duration-200 z-50 animate-pulse"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </Button>
      )}

      {/* Bot Dialog */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[90vw]">
          <Card className="bg-gradient-to-br from-gray-900/98 via-purple-900/95 to-gray-900/98 backdrop-blur-xl border-2 border-purple-400/50 shadow-2xl">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">ZOOKA المرزوق</h3>
                    <p className="text-purple-300 text-xs">مساعدك الذكي 🤖</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isSpeaking && (
                    <Button
                      onClick={stopSpeaking}
                      size="icon"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300"
                    >
                      <VolumeX className="w-5 h-5" />
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      stopSpeaking();
                      stopListening();
                    }}
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Conversation History */}
              <div className="mb-4 max-h-64 overflow-y-auto space-y-3">
                {conversationHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-purple-500/20 border border-purple-400/30 mr-8'
                        : 'bg-blue-500/20 border border-blue-400/30 ml-8'
                    }`}
                  >
                    <p className="text-white text-sm leading-relaxed">{msg.content}</p>
                  </div>
                ))}
                {isSpeaking && (
                  <div className="flex items-center gap-2 text-cyan-300 text-sm">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span>يتحدث الآن...</span>
                  </div>
                )}
              </div>

              {/* Microphone Button */}
              <div className="flex justify-center mb-3">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  className={`w-16 h-16 rounded-full transition-all duration-200 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110'
                      : 'bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 hover:scale-105'
                  }`}
                  disabled={isSpeaking}
                >
                  {isListening ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Button
                  onClick={() => {
                    const msg = 'روح صفحة التلاوة';
                    setTranscript(msg);
                    addToHistory('user', msg);
                    processUserRequest(msg);
                  }}
                  variant="outline"
                  className="text-purple-300 border-purple-400/30 hover:bg-purple-500/20"
                >
                  صفحة التلاوة
                </Button>
                <Button
                  onClick={() => {
                    const msg = 'شغل سورة الفاتحة';
                    setTranscript(msg);
                    addToHistory('user', msg);
                    processUserRequest(msg);
                  }}
                  variant="outline"
                  className="text-blue-300 border-blue-400/30 hover:bg-blue-500/20"
                >
                  شغل الفاتحة
                </Button>
                <Button
                  onClick={() => {
                    const msg = 'روح صفحة المقرئين';
                    setTranscript(msg);
                    addToHistory('user', msg);
                    processUserRequest(msg);
                  }}
                  variant="outline"
                  className="text-cyan-300 border-cyan-400/30 hover:bg-cyan-500/20"
                >
                  المقرئين
                </Button>
                <Button
                  onClick={() => {
                    const msg = 'ما هي فضائل سورة البقرة؟';
                    setTranscript(msg);
                    addToHistory('user', msg);
                    processUserRequest(msg);
                  }}
                  variant="outline"
                  className="text-pink-300 border-pink-400/30 hover:bg-pink-500/20"
                >
                  معلومات
                </Button>
              </div>

              <p className="text-center text-purple-300/70 text-xs mt-3">
                💡 اضغط على الميكروفون وتكلم بحرية
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}