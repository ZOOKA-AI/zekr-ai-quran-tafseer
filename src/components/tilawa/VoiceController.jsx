import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function VoiceController({ onCommand }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

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
      toast.success('🎤 أنا أستمع... قل ما تريد');
    };

    recognitionRef.current.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
      
      processCommand(text);
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

  const processCommand = (text) => {
    const lowerText = text.toLowerCase();
    
    // استخراج اسم القارئ
    const reciters = {
      'الحصري': 'husary',
      'حصري': 'husary',
      'عبد الباسط': 'abdulbasit',
      'عبدالباسط': 'abdulbasit',
      'باسط': 'abdulbasit',
      'المنشاوي': 'minshawi',
      'منشاوي': 'minshawi',
      'مشاري': 'mishary',
      'العفاسي': 'mishary',
      'السديس': 'sudais',
      'سديس': 'sudais',
      'خالد الجليل': 'khalid',
      'الجليل': 'khalid',
      'الطبلاوي': 'tablawi',
      'طبلاوي': 'tablawi',
      'إسلام صبحي': 'islam',
      'اسلام صبحي': 'islam'
    };

    // استخراج اسم السورة
    const surahs = {
      'الفاتحة': 1, 'فاتحة': 1,
      'البقرة': 2, 'بقرة': 2,
      'آل عمران': 3, 'عمران': 3,
      'النساء': 4, 'نساء': 4,
      'المائدة': 5, 'مائدة': 5,
      'الأنعام': 6, 'انعام': 6,
      'الكهف': 18, 'كهف': 18,
      'يس': 36, 'ياسين': 36,
      'الرحمن': 55, 'رحمن': 55,
      'الملك': 67, 'ملك': 67,
      'الإخلاص': 112, 'اخلاص': 112,
      'الفلق': 113, 'فلق': 113,
      'الناس': 114, 'ناس': 114
    };

    let reciter = null;
    let surah = null;
    let action = null;

    // البحث عن القارئ
    for (const [key, value] of Object.entries(reciters)) {
      if (lowerText.includes(key.toLowerCase())) {
        reciter = value;
        break;
      }
    }

    // البحث عن السورة
    for (const [key, value] of Object.entries(surahs)) {
      if (lowerText.includes(key.toLowerCase())) {
        surah = value;
        break;
      }
    }

    // البحث عن الأوامر
    if (lowerText.includes('شغل') || lowerText.includes('ابدأ') || lowerText.includes('العب')) {
      action = 'play';
    } else if (lowerText.includes('وقف') || lowerText.includes('اوقف') || lowerText.includes('توقف')) {
      action = 'pause';
    } else if (lowerText.includes('عالي') || lowerText.includes('ارفع') || lowerText.includes('زود')) {
      action = 'volumeUp';
    } else if (lowerText.includes('واطي') || lowerText.includes('خفض') || lowerText.includes('قلل')) {
      action = 'volumeDown';
    } else if (lowerText.includes('اسكت') || lowerText.includes('كتم')) {
      action = 'mute';
    }

    // تنفيذ الأمر
    if (reciter || surah || action) {
      onCommand({ reciter, surah, action });
      
      let message = '✅ تم: ';
      if (reciter) message += `القارئ: ${Object.keys(reciters).find(k => reciters[k] === reciter)} `;
      if (surah) message += `السورة: ${Object.keys(surahs).find(k => surahs[k] === surah)} `;
      if (action === 'play') message += 'تشغيل ';
      if (action === 'pause') message += 'إيقاف ';
      if (action === 'volumeUp') message += 'رفع الصوت ';
      if (action === 'volumeDown') message += 'خفض الصوت ';
      if (action === 'mute') message += 'كتم الصوت ';
      
      toast.success(message);
      speak(message);
    } else {
      toast.error('لم أفهم الأمر، حاول مرة أخرى');
      speak('لم أفهم الأمر، حاول مرة أخرى');
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
      <div className="p-4">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent" />
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">المساعد الصوتي الذكي</h3>
            <Sparkles className="w-5 h-5 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent" />
          </div>
          <p className="text-purple-300 text-xs">قل: "شغل الفاتحة بصوت الحصري" أو "ارفع الصوت" أو "وقف"</p>
        </div>

        <div className="flex justify-center mb-3">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`w-16 h-16 rounded-full transition-all duration-200 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110'
                : 'bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </Button>
        </div>

        {transcript && (
          <div className="p-2 bg-white/10 rounded-lg border border-white/20">
            <p className="text-xs text-purple-300 mb-1">سمعت:</p>
            <p className="text-white font-semibold text-sm">{transcript}</p>
          </div>
        )}

        <div className="mt-3 text-center text-xs text-purple-300/70">
          💡 أمثلة: "شغل يس بصوت المنشاوي" • "ارفع الصوت" • "وقف"
        </div>
      </div>
    </Card>
  );
}