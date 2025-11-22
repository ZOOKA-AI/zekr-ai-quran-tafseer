import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
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
      toast.success('🎤 أنا أستمع... تحدث الآن');
    };

    recognitionRef.current.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
      setIsProcessing(true);

      try {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `أنت مساعد قرآني ذكي. أجب على هذا السؤال بشكل واضح ومختصر:\n\n${text}`,
          add_context_from_internet: false
        });

        setResponse(result);
        
        // قراءة الرد بالصوت
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(result);
          utterance.lang = 'ar-SA';
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }
      } catch (error) {
        toast.error('حدث خطأ في معالجة السؤال');
      } finally {
        setIsProcessing(false);
      }
    };

    recognitionRef.current.onerror = (event) => {
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

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 shadow-lg">
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-purple-800 mb-2">المساعد الصوتي 🎤</h3>
          <p className="text-gray-600">اضغط على الميكروفون واسأل أي سؤال عن القرآن</p>
        </div>

        <div className="flex justify-center mb-6">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`w-24 h-24 rounded-full transition-all duration-200 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110'
                : 'bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:scale-105'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-12 h-12 animate-spin text-white" />
            ) : isListening ? (
              <MicOff className="w-12 h-12 text-white" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </Button>
        </div>

        {transcript && (
          <div className="mb-4 p-4 bg-white rounded-lg border-2 border-purple-200">
            <p className="text-sm text-gray-500 mb-1">سؤالك:</p>
            <p className="text-gray-800 font-semibold">{transcript}</p>
          </div>
        )}

        {response && (
          <div className="p-4 bg-white rounded-lg border-2 border-emerald-200">
            <p className="text-sm text-gray-500 mb-1">الجواب:</p>
            <p className="text-gray-800 leading-relaxed">{response}</p>
          </div>
        )}

        {isProcessing && (
          <div className="text-center text-purple-600 font-semibold">
            جاري البحث عن الإجابة...
          </div>
        )}
      </div>
    </Card>
  );
}