import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function OrphanBot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'السلام عليكم! أنا مساعدك الذكي لخدمة الأيتام 🤖\n\nكيف يمكنني مساعدتك اليوم؟\n\n- تسجيل يتيم جديد\n- تقديم تبرع\n- طلب مساعدة\n- استفسار عام' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت مساعد ذكي لخدمة أيتام الأمة الإسلامية 🤖

مهمتك:
1. مساعدة المستخدمين في تسجيل الأيتام
2. إرشادهم لكيفية التبرع
3. استقبال طلبات المساعدة
4. الإجابة على الاستفسارات

كن لطيفاً، محترماً، وداعماً. استخدم لغة عربية واضحة.

المستخدم يقول: "${userMessage}"

رد بشكل مفيد وواضح:`,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);

      // قراءة الرد صوتياً
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      toast.error('عذراً، حدث خطأ في الاتصال');
      setMessages(prev => [...prev, { role: 'assistant', content: 'عذراً، حدث خطأ. حاول مرة أخرى.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-2xl h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Bot className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">المساعد الذكي</h3>
          <p className="text-sm text-gray-600">متاح 24/7 للمساعدة</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[500px]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-emerald-500' : 'bg-purple-500'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>
            <div className={`flex-1 p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-emerald-100 text-gray-900' : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-gray-600 text-sm">يكتب...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="اكتب رسالتك..."
          className="flex-1 h-12"
          disabled={loading}
        />
        <Button
          onClick={handleSend}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-12 px-6"
          disabled={loading}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}