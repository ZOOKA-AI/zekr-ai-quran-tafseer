/**
 * مكتبة الأصوات المحلية - تعمل بدون إنترنت 100%
 * تستخدم Web Speech API للقراءة المحلية
 */

class LocalAudioLibrary {
  constructor() {
    this.audioCache = new Map();
    this.currentAudio = null;
    this.isPlaying = false;
  }

  // قراءة النص بصوت محلي (بدون نت)
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject('المتصفح لا يدعم القراءة الصوتية');
        return;
      }

      // إيقاف أي صوت حالي
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'ar-SA';
      utterance.rate = options.rate || 0.8;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      utterance.onend = () => {
        this.isPlaying = false;
        resolve();
      };

      utterance.onerror = (error) => {
        this.isPlaying = false;
        reject(error);
      };

      this.isPlaying = true;
      window.speechSynthesis.speak(utterance);
    });
  }

  // إيقاف الصوت
  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.isPlaying = false;
  }

  // تحميل ملف صوتي محلي (من التخزين)
  async loadLocalAudio(audioId) {
    const cached = localStorage.getItem(`audio_${audioId}`);
    if (cached) {
      return cached;
    }
    return null;
  }

  // حفظ ملف صوتي محلياً
  saveLocalAudio(audioId, audioData) {
    try {
      localStorage.setItem(`audio_${audioId}`, audioData);
      return true;
    } catch (error) {
      console.error('فشل حفظ الصوت:', error);
      return false;
    }
  }

  // قراءة آية بصوت محلي
  async reciteVerse(verseText, options = {}) {
    try {
      // تنظيف النص من الرموز
      const cleanText = verseText
        .replace(/[۝۩]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      // إضافة البسملة إذا لزم الأمر
      let fullText = cleanText;
      if (options.includeBismillah) {
        fullText = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ. ' + cleanText;
      }

      await this.speak(fullText, {
        lang: 'ar-SA',
        rate: 0.7, // سرعة أبطأ للقرآن
        pitch: 1.1, // نبرة أعلى قليلاً
        volume: 1
      });

      return true;
    } catch (error) {
      console.error('خطأ في القراءة:', error);
      return false;
    }
  }

  // قراءة سورة كاملة
  async reciteSurah(verses, options = {}) {
    const onProgress = options.onProgress || (() => {});
    
    for (let i = 0; i < verses.length; i++) {
      if (!this.isPlaying) break;

      await this.reciteVerse(verses[i].text, {
        includeBismillah: i === 0 && options.includeBismillah
      });

      onProgress(i + 1, verses.length);

      // توقف قصير بين الآيات
      if (i < verses.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  // الحصول على الأصوات المتاحة محلياً
  getAvailableVoices() {
    if (!('speechSynthesis' in window)) {
      return [];
    }

    const voices = window.speechSynthesis.getVoices();
    const arabicVoices = voices.filter(voice => 
      voice.lang.startsWith('ar')
    );

    return arabicVoices.length > 0 ? arabicVoices : voices.slice(0, 5);
  }

  // تحديد الصوت المستخدم
  setVoice(voiceIndex) {
    const voices = this.getAvailableVoices();
    if (voiceIndex >= 0 && voiceIndex < voices.length) {
      this.selectedVoice = voices[voiceIndex];
      return true;
    }
    return false;
  }
}

// تصدير نسخة واحدة
const localAudioLibrary = new LocalAudioLibrary();
export default localAudioLibrary;