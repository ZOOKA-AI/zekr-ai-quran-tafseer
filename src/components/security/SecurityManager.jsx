import CryptoJS from 'crypto-js';

/**
 * نظام حماية متقدم للتطبيق
 * يحمي من: XSS, SQL Injection, Spam, Rate Limiting
 */

const SECRET_KEY = 'QURAN_APP_2024_SECURE_KEY_ZAKA_AI';

class SecurityManager {
  constructor() {
    this.rateLimitMap = new Map();
    this.blockedIPs = new Set();
    this.initSecurity();
  }

  initSecurity() {
    // تنظيف كل ساعة
    setInterval(() => {
      this.cleanupRateLimit();
    }, 3600000);
  }

  // تشفير البيانات الحساسة
  encrypt(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  }

  // فك تشفير البيانات
  decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  // حماية من XSS
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // حماية من SQL Injection
  sanitizeSQL(input) {
    if (typeof input !== 'string') return input;
    
    const dangerous = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'EXEC', 'SCRIPT', '--', ';'];
    let cleaned = input;
    
    dangerous.forEach(word => {
      const regex = new RegExp(word, 'gi');
      cleaned = cleaned.replace(regex, '');
    });
    
    return cleaned;
  }

  // Rate Limiting - منع الإزعاج والسبام
  checkRateLimit(identifier, maxAttempts = 10, timeWindow = 60000) {
    const now = Date.now();
    const userKey = this.hashIdentifier(identifier);
    
    if (!this.rateLimitMap.has(userKey)) {
      this.rateLimitMap.set(userKey, []);
    }
    
    const attempts = this.rateLimitMap.get(userKey);
    const recentAttempts = attempts.filter(time => now - time < timeWindow);
    
    if (recentAttempts.length >= maxAttempts) {
      this.blockedIPs.add(userKey);
      return false; // ممنوع
    }
    
    recentAttempts.push(now);
    this.rateLimitMap.set(userKey, recentAttempts);
    return true; // مسموح
  }

  // تنظيف السجلات القديمة
  cleanupRateLimit() {
    const now = Date.now();
    const oneHour = 3600000;
    
    this.rateLimitMap.forEach((attempts, key) => {
      const recent = attempts.filter(time => now - time < oneHour);
      if (recent.length === 0) {
        this.rateLimitMap.delete(key);
      } else {
        this.rateLimitMap.set(key, recent);
      }
    });
  }

  // Hash للمعرف
  hashIdentifier(identifier) {
    return CryptoJS.SHA256(identifier + SECRET_KEY).toString();
  }

  // فحص هل المستخدم محظور
  isBlocked(identifier) {
    const hashed = this.hashIdentifier(identifier);
    return this.blockedIPs.has(hashed);
  }

  // إلغاء الحظر (للأدمن فقط)
  unblock(identifier) {
    const hashed = this.hashIdentifier(identifier);
    this.blockedIPs.delete(hashed);
  }

  // حماية من Bot Detection
  detectBot(userAgent) {
    const botPatterns = [
      /bot/i, /crawl/i, /spider/i, /scrape/i, 
      /curl/i, /wget/i, /python/i, /php/i
    ];
    
    return botPatterns.some(pattern => pattern.test(userAgent));
  }

  // توليد معرف فريد للمتصفح
  generateFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Browser Fingerprint', 2, 15);
    
    const fingerprint = canvas.toDataURL();
    const data = {
      fingerprint,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    return this.hashIdentifier(JSON.stringify(data));
  }

  // تحقق من صحة البيانات المدخلة
  validateInput(data, rules) {
    const errors = [];
    
    Object.keys(rules).forEach(field => {
      const value = data[field];
      const rule = rules[field];
      
      if (rule.required && (!value || value.trim() === '')) {
        errors.push(`${field} مطلوب`);
      }
      
      if (rule.minLength && value && value.length < rule.minLength) {
        errors.push(`${field} يجب أن يكون ${rule.minLength} أحرف على الأقل`);
      }
      
      if (rule.maxLength && value && value.length > rule.maxLength) {
        errors.push(`${field} يجب ألا يتجاوز ${rule.maxLength} حرف`);
      }
      
      if (rule.pattern && value && !rule.pattern.test(value)) {
        errors.push(`${field} غير صحيح`);
      }
    });
    
    return errors.length === 0 ? { valid: true } : { valid: false, errors };
  }

  // حماية التخزين المحلي
  secureLocalStorage = {
    setItem: (key, value) => {
      const encrypted = this.encrypt(value);
      if (encrypted) {
        localStorage.setItem(key, encrypted);
      }
    },
    
    getItem: (key) => {
      const encrypted = localStorage.getItem(key);
      if (encrypted) {
        return this.decrypt(encrypted);
      }
      return null;
    },
    
    removeItem: (key) => {
      localStorage.removeItem(key);
    }
  };

  // منع DevTools من التلاعب (حماية إضافية)
  preventDevTools() {
    // تعطيل النقر بالزر الأيمن في بيئة الإنتاج
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      
      // كشف فتح DevTools
      const devtools = /./;
      devtools.toString = () => {
        console.log('⚠️ DevTools Detected');
        return '';
      };
    }
  }

  // تسجيل محاولات مشبوهة
  logSuspiciousActivity(activity) {
    const log = {
      timestamp: new Date().toISOString(),
      activity,
      fingerprint: this.generateFingerprint(),
      userAgent: navigator.userAgent
    };
    
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(log);
    
    // الحفاظ على آخر 100 سجل فقط
    if (logs.length > 100) {
      logs.shift();
    }
    
    localStorage.setItem('security_logs', JSON.stringify(logs));
    console.warn('⚠️ Suspicious activity logged:', activity);
  }

  // فحص شامل قبل أي عملية
  checkSecurity(identifier, action) {
    // فحص البوتات
    if (this.detectBot(navigator.userAgent)) {
      this.logSuspiciousActivity(`Bot detected: ${action}`);
      return { allowed: false, reason: 'Bot detected' };
    }
    
    // فحص الحظر
    if (this.isBlocked(identifier)) {
      return { allowed: false, reason: 'Blocked user' };
    }
    
    // فحص معدل الطلبات
    if (!this.checkRateLimit(identifier)) {
      this.logSuspiciousActivity(`Rate limit exceeded: ${action}`);
      return { allowed: false, reason: 'Too many requests' };
    }
    
    return { allowed: true };
  }
}

// Singleton
const securityManager = new SecurityManager();

// تفعيل الحماية عند بدء التطبيق
if (typeof window !== 'undefined') {
  securityManager.preventDevTools();
}

export default securityManager;
export { SecurityManager };