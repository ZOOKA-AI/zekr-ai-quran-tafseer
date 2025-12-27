import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import securityManager from './SecurityManager';
import antiSpam from './AntiSpam';

/**
 * نموذج آمن محمي ضد السبام والتلاعب
 * استخدمه بدلاً من النماذج العادية في الإجراءات الحساسة
 */

export default function SecureForm({ 
  formId, 
  onSubmit, 
  children,
  requireCaptcha = false,
  minSubmitInterval = 3000,
  className = ''
}) {
  const [captcha, setCaptcha] = useState(null);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [honeypotId, setHoneypotId] = useState('');
  const [honeypotValue, setHoneypotValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // إنشاء honeypot
    const hpId = antiSpam.createHoneypot(formId);
    setHoneypotId(hpId);

    // إنشاء captcha إذا مطلوب
    if (requireCaptcha) {
      const newCaptcha = antiSpam.generateCaptcha();
      setCaptcha(newCaptcha);
    }
  }, [formId, requireCaptcha]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // فحص الأمان
    const fingerprint = securityManager.generateFingerprint();
    const securityCheck = securityManager.checkSecurity(fingerprint, `submit_${formId}`);
    
    if (!securityCheck.allowed) {
      toast.error(`⛔ ${securityCheck.reason === 'Too many requests' ? 'طلبات كثيرة - انتظر قليلاً' : 'تم حظرك مؤقتاً'}`);
      return;
    }

    // فحص السبام
    if (!antiSpam.checkSubmission(formId, minSubmitInterval)) {
      return;
    }

    // فحص الهونيبوت
    if (!antiSpam.checkHoneypot(honeypotId, honeypotValue)) {
      return;
    }

    // فحص الكابتشا
    if (requireCaptcha && captcha) {
      if (!antiSpam.verifyCaptcha(captchaAnswer, captcha.answer)) {
        toast.error('❌ الإجابة غير صحيحة');
        setCaptchaAnswer('');
        const newCaptcha = antiSpam.generateCaptcha();
        setCaptcha(newCaptcha);
        return;
      }
    }

    // تنظيف البيانات
    const formData = new FormData(e.target);
    const cleanedData = {};
    
    for (let [key, value] of formData.entries()) {
      if (key !== honeypotId) { // تجاهل الهونيبوت
        cleanedData[key] = securityManager.sanitizeInput(value);
      }
    }

    setIsSubmitting(true);

    try {
      await onSubmit(cleanedData);
      
      // إعادة تعيين الكابتشا
      if (requireCaptcha) {
        setCaptchaAnswer('');
        const newCaptcha = antiSpam.generateCaptcha();
        setCaptcha(newCaptcha);
      }
    } catch (error) {
      toast.error('❌ حدث خطأ - حاول مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* Honeypot - حقل خفي */}
      <input
        type="text"
        name={honeypotId}
        value={honeypotValue}
        onChange={(e) => setHoneypotValue(e.target.value)}
        style={{ 
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0
        }}
        tabIndex="-1"
        autoComplete="off"
      />

      {children}

      {/* CAPTCHA */}
      {requireCaptcha && captcha && (
        <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
          <label className="block text-gray-900 font-bold mb-2">
            🤖 أثبت أنك لست روبوت: {captcha.question}
          </label>
          <Input
            type="number"
            value={captchaAnswer}
            onChange={(e) => setCaptchaAnswer(e.target.value)}
            required
            className="text-center text-xl font-bold"
            placeholder="الجواب..."
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6"
      >
        {isSubmitting ? '⏳ جاري الإرسال...' : '✅ إرسال'}
      </Button>
    </form>
  );
}