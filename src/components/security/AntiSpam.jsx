import { toast } from 'sonner';
import securityManager from './SecurityManager';

/**
 * نظام مكافحة السبام والتلاعب
 * يحمي النماذج والإجراءات الحساسة
 */

class AntiSpam {
  constructor() {
    this.submissionTimes = new Map();
    this.honeypots = new Set();
  }

  // فحص قبل إرسال أي نموذج
  checkSubmission(formId, minInterval = 3000) {
    const fingerprint = securityManager.generateFingerprint();
    const key = `${formId}_${fingerprint}`;
    const now = Date.now();
    
    const lastSubmit = this.submissionTimes.get(key);
    
    if (lastSubmit && (now - lastSubmit) < minInterval) {
      const remainingSeconds = Math.ceil((minInterval - (now - lastSubmit)) / 1000);
      toast.error(`⏳ انتظر ${remainingSeconds} ثانية قبل المحاولة مرة أخرى`);
      return false;
    }
    
    this.submissionTimes.set(key, now);
    return true;
  }

  // Honeypot Field - حقل خفي لاصطياد البوتات
  createHoneypot(formName) {
    const honeypotId = `honeypot_${formName}_${Date.now()}`;
    this.honeypots.add(honeypotId);
    return honeypotId;
  }

  // فحص إذا تم ملء الهونيبوت (بوت!)
  checkHoneypot(honeypotId, value) {
    if (!this.honeypots.has(honeypotId)) {
      return false; // معرف غير صحيح
    }
    
    // إذا تم ملء الحقل الخفي = بوت!
    if (value && value.trim() !== '') {
      securityManager.logSuspiciousActivity('Honeypot filled - Bot detected');
      toast.error('⛔ تم رصد نشاط مشبوه');
      return false;
    }
    
    return true;
  }

  // منع النسخ المتكرر (Copy Spam)
  preventCopySpam(text) {
    const fingerprint = securityManager.generateFingerprint();
    const key = `copy_${fingerprint}`;
    const now = Date.now();
    
    const copies = JSON.parse(localStorage.getItem(key) || '[]');
    const recentCopies = copies.filter(time => now - time < 60000); // آخر دقيقة
    
    if (recentCopies.length >= 20) {
      toast.warning('⚠️ عدد كبير من عمليات النسخ - خذ راحة');
      return false;
    }
    
    recentCopies.push(now);
    localStorage.setItem(key, JSON.stringify(recentCopies));
    return true;
  }

  // منع الضغط المتكرر على الأزرار
  preventButtonSpam(buttonId, cooldown = 1000) {
    const key = `button_${buttonId}`;
    const lastClick = this.submissionTimes.get(key);
    const now = Date.now();
    
    if (lastClick && (now - lastClick) < cooldown) {
      return false;
    }
    
    this.submissionTimes.set(key, now);
    return true;
  }

  // CAPTCHA بسيط (سؤال رياضي)
  generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;
    
    return {
      question: `كم يساوي ${num1} + ${num2}؟`,
      answer: answer.toString()
    };
  }

  verifyCaptcha(userAnswer, correctAnswer) {
    return userAnswer.toString().trim() === correctAnswer.toString().trim();
  }
}

const antiSpam = new AntiSpam();

export default antiSpam;
export { AntiSpam };