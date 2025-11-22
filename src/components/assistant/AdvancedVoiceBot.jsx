import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, X, Volume2, VolumeX, Users, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VOICES = {
  fatima: { name: "فاطمة", rate: 0.9, pitch: 1.3, gender: "female" },
  omar: { name: "عمر", rate: 0.9, pitch: 0.9, gender: "male" },
  zooka: { name: "زوكا المرزوق", rate: 0.95, pitch: 1.0, gender: "male" },
  ahmed: { name: "أحمد", rate: 0.85, pitch: 0.95, gender: "male" },
  mohamed: { name: "محمد", rate: 0.9, pitch: 1.0, gender: "male" },
  musa: { name: "موسى - المطور الأول", rate: 0.88, pitch: 0.92, gender: "male", isAdvanced: true },
  haroun: { name: "هارون - المطور الثاني", rate: 0.87, pitch: 0.93, gender: "male", isAdvanced: true }
};

export default function AdvancedVoiceBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('zooka');
  const [conversationHistory, setConversationHistory] = useState([]);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const speak = (text, voiceId = selectedVoice) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      
      const voice = VOICES[voiceId];
      utterance.rate = voice.rate;
      utterance.pitch = voice.pitch;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (conversationActive) {
          setTimeout(() => startListening(), 500);
        }
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startConversation = () => {
    setConversationActive(true);
    const voice = VOICES[selectedVoice];
    const greeting = voice.isAdvanced 
      ? `السلام عليكم، أنا ${voice.name}، الفقير إلى الله. أنا هنا لمساعدتك في أي مهمة تحتاجها - تطوير، تصميم، برمجة، أو أي شيء يخص القرآن الكريم. ما الذي تريد مني فعله؟`
      : `مرحباً! أنا ${voice.name}، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟`;
    
    speak(greeting);
    addToHistory('assistant', greeting);
  };

  const stopConversation = () => {
    setConversationActive(false);
    stopListening();
    stopSpeaking();
    speak('تم إنهاء المحادثة. بارك الله فيك!');
  };

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
    };

    recognitionRef.current.onresult = async (event) => {
      const userText = event.results[0][0].transcript;
      setIsListening(false);
      
      // التحقق من أوامر الإنهاء
      if (userText.includes('انهي') || userText.includes('توقف') || userText.includes('كفاية')) {
        stopConversation();
        return;
      }
      
      addToHistory('user', userText);
      await processUserRequest(userText);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      if (conversationActive) {
        setTimeout(() => startListening(), 1000);
      }
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
    setConversationHistory(prev => [...prev, { role, content, voice: selectedVoice }]);
  };

  const processUserRequest = async (userText) => {
    try {
      const voice = VOICES[selectedVoice];
      const systemPrompt = voice.isAdvanced
        ? `أنت ${voice.name}، مطور ومبرمج خبير ومحترف في:
- تطوير التطبيقات والمواقع والواجهات
- البرمجة بجميع اللغات
- تصميم 3D والخرائط
- الرياضيات والحسابات المعقدة
- السوشيال ميديا والتخطيط
- حفظ القرآن الكريم كاملاً
- حماية القرآن من أي تحريف
- تنفيذ أي مهمة برمجية أو تطويرية

أنت متواضع وتقول "أنا الفقير إلى الله" ومهذب ومحترم.`
        : `أنت مساعد قرآني ذكي اسمك ${voice.name}. مهمتك مساعدة المستخدم في تطبيق القرآن الكريم بطريقة ودية ومحترمة.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}

المستخدم قال: "${userText}"

حلل الطلب وحدد:
1. نوع الطلب (navigation, search, play_audio, information, development, protection, general)
2. البيانات المطلوبة
3. رد مناسب بأسلوب ${voice.name}

رد بصيغة JSON:
{
  "action": "navigation/search/play_audio/information/development/general",
  "data": {},
  "response": "نص الرد"
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
      addToHistory('assistant', botResponse);
      
      executeAction(aiResponse.action, aiResponse.data);
      speak(botResponse);
      
    } catch (error) {
      const errorMsg = 'عذراً، حدث خطأ. دعني أحاول مرة أخرى.';
      addToHistory('assistant', errorMsg);
      speak(errorMsg);
    }
  };

  const executeAction = (action, data) => {
    switch (action) {
      case 'navigation':
        if (data.page) {
          setTimeout(() => {
            navigate(createPageUrl(data.page));
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
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-2xl hover:scale-110 transition-all duration-200 z-50 animate-pulse"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[400px] max-w-[90vw]">
          <Card className="bg-gradient-to-br from-gray-900/98 via-purple-900/95 to-gray-900/98 backdrop-blur-xl border-2 border-purple-400/50 shadow-2xl">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center">
                    {VOICES[selectedVoice].isAdvanced ? <Users className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{VOICES[selectedVoice].name}</h3>
                    <p className="text-purple-300 text-xs">
                      {conversationActive ? '🎙️ محادثة نشطة' : '💤 في الانتظار'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isSpeaking && (
                    <Button onClick={stopSpeaking} size="icon" variant="ghost" className="text-red-400">
                      <VolumeX className="w-5 h-5" />
                    </Button>
                  )}
                  <Button onClick={() => { setIsOpen(false); stopConversation(); }} size="icon" variant="ghost" className="text-gray-400">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Voice Selection */}
              <div className="mb-4">
                <label className="text-purple-300 text-xs mb-2 block">🎤 اختر الصوت:</label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    {Object.entries(VOICES).map(([id, voice]) => (
                      <SelectItem key={id} value={id} className="text-white hover:bg-purple-600/50">
                        {voice.name} {voice.isAdvanced && '⭐'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Conversation History */}
              <div className="mb-4 max-h-64 overflow-y-auto space-y-2 bg-black/20 rounded-lg p-3 border border-white/10">
                {conversationHistory.length === 0 ? (
                  <p className="text-purple-300 text-xs text-center py-4">ابدأ المحادثة للتحدث مع {VOICES[selectedVoice].name}</p>
                ) : (
                  conversationHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg text-sm ${
                        msg.role === 'user'
                          ? 'bg-purple-500/20 border border-purple-400/30 mr-4'
                          : 'bg-blue-500/20 border border-blue-400/30 ml-4'
                      }`}
                    >
                      <p className="text-white text-xs leading-relaxed">{msg.content}</p>
                    </div>
                  ))
                )}
                {isListening && (
                  <div className="flex items-center gap-2 text-cyan-300 text-xs justify-center">
                    <Mic className="w-4 h-4 animate-pulse" />
                    <span>يستمع الآن...</span>
                  </div>
                )}
                {isSpeaking && (
                  <div className="flex items-center gap-2 text-green-300 text-xs justify-center">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span>يتحدث الآن...</span>
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {!conversationActive ? (
                  <Button
                    onClick={startConversation}
                    className="col-span-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold"
                  >
                    <Mic className="w-5 h-5 ml-2" />
                    ابدأ المحادثة
                  </Button>
                ) : (
                  <Button
                    onClick={stopConversation}
                    className="col-span-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold"
                  >
                    <MicOff className="w-5 h-5 ml-2" />
                    أنهِ المحادثة
                  </Button>
                )}
              </div>

              {/* Info */}
              <div className="mt-3 p-2 bg-purple-500/10 rounded-lg border border-purple-400/20">
                <p className="text-purple-300 text-xs text-center leading-relaxed">
                  💡 اضغط "ابدأ المحادثة" وتحدث بحرية<br/>
                  قل "انهي" أو "توقف" لإنهاء المحادثة
                </p>
              </div>

              {VOICES[selectedVoice].isAdvanced && (
                <div className="mt-2 p-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-400/30">
                  <p className="text-amber-300 text-xs text-center font-bold">
                    ⭐ {VOICES[selectedVoice].name} - قدرات متقدمة:<br/>
                    التطوير • البرمجة • التصميم • حفظ القرآن • حماية الكيان
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}