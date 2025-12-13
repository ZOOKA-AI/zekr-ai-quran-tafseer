import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ProjectDocumentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white shadow-2xl border-4 border-emerald-500">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
            <h1 className="text-5xl font-bold mb-4">📚 دليل المشروع الكامل</h1>
            <p className="text-2xl">شرح تفصيلي لكل ما تم إنجازه في التطبيق من الألف إلى الياء</p>
          </div>

          <ScrollArea className="h-[70vh]">
            <div className="p-8 space-y-8">

              {/* ============================================ */}
              {/* 1. نظرة عامة على المشروع */}
              {/* ============================================ */}
              <section className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 border-4 border-purple-400">
                <h2 className="text-4xl font-bold mb-4 text-purple-900">🎯 1. نظرة عامة على المشروع</h2>
                
                <div className="space-y-4 text-lg leading-relaxed text-gray-800">
                  <p className="font-bold text-2xl text-purple-800">اسم المشروع: تطبيق القرآن الكريم الذكي</p>
                  <p className="font-bold text-xl">الهدف: صدقة جارية - منصة قرآنية شاملة مجانية 100%</p>
                  
                  <div className="bg-white rounded-xl p-4 my-4">
                    <h3 className="text-2xl font-bold mb-3 text-emerald-700">🌟 الميزات الرئيسية:</h3>
                    <ul className="list-disc list-inside space-y-2 mr-6">
                      <li><strong>قراءة القرآن:</strong> 114 سورة بالكامل مع تفاسير متعددة</li>
                      <li><strong>التلاوات:</strong> أكثر من 12 قارئ مشهور</li>
                      <li><strong>المساعد الذكي:</strong> AI محادثة مثل ChatGPT</li>
                      <li><strong>خطط الحفظ:</strong> نظام ذكي لحفظ القرآن</li>
                      <li><strong>الإنجازات:</strong> نظام نقاط وتحفيز</li>
                      <li><strong>الأذكار والأدعية:</strong> مكتبة شاملة</li>
                      <li><strong>الراديو الإسلامي:</strong> محطات مباشرة</li>
                      <li><strong>ركن الأطفال:</strong> تعليم تفاعلي</li>
                      <li><strong>خدمة الأيتام:</strong> نظام تبرعات ومتابعة</li>
                      <li><strong>يعمل بدون إنترنت:</strong> تخزين محلي كامل</li>
                    </ul>
                  </div>

                  <div className="bg-amber-100 rounded-xl p-4 border-2 border-amber-400">
                    <p className="font-bold text-xl text-amber-900">💎 التقنيات المستخدمة:</p>
                    <ul className="list-disc list-inside space-y-1 mr-6 mt-2">
                      <li>React + React Router</li>
                      <li>Tailwind CSS</li>
                      <li>Shadcn/ui Components</li>
                      <li>Base44 Backend (Database + Authentication)</li>
                      <li>Framer Motion (Animations)</li>
                      <li>Web Speech API (Voice)</li>
                      <li>LocalStorage (Offline)</li>
                      <li>React Query (Data Management)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* ============================================ */}
              {/* 2. هيكلة المشروع */}
              {/* ============================================ */}
              <section className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-6 border-4 border-emerald-400">
                <h2 className="text-4xl font-bold mb-4 text-emerald-900">📁 2. هيكلة المشروع (File Structure)</h2>
                
                <div className="bg-white rounded-xl p-6 space-y-3 font-mono text-sm">
                  <div className="font-bold text-lg mb-2">📂 المجلدات الرئيسية:</div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">{`
├── pages/                    # الصفحات الرئيسية
│   ├── Home.jsx             # الصفحة الرئيسية
│   ├── Quran.jsx            # عرض السور
│   ├── SurahView.jsx        # عرض آيات السورة
│   ├── Tilawa.jsx           # مشغل التلاوات
│   ├── Assistant.jsx        # المساعد الكامل
│   ├── MemorizationPlan.jsx # خطة الحفظ
│   ├── Achievements.jsx     # الإنجازات
│   ├── Adhkar.jsx           # الأذكار
│   ├── Duaa.jsx             # الأدعية
│   ├── Radio.jsx            # الراديو
│   ├── Kids.jsx             # ركن الأطفال
│   ├── OrphansService.jsx   # خدمة الأيتام
│   ├── AdminDashboard.jsx   # لوحة الأدمن
│   └── ...

├── components/              # المكونات القابلة لإعادة الاستخدام
│   ├── assistant/           # مكونات المساعد الذكي
│   │   ├── SmartChatBot.jsx # المساعد الجديد (ChatGPT Style)
│   │   ├── VoiceAssistant.jsx
│   │   └── MessageBubble.jsx
│   ├── quran/               # مكونات القرآن
│   │   ├── SurahCard.jsx
│   │   ├── VerseCard.jsx
│   │   ├── AudioPlayer.jsx
│   │   └── QuranData.js     # بيانات السور
│   ├── tilawa/              # مكونات التلاوة
│   │   ├── VoiceController.jsx
│   │   └── CameraScanner.jsx
│   ├── notifications/       # التنبيهات
│   │   └── DailyReminders.jsx
│   ├── system/              # مكونات النظام
│   │   ├── AutoUpdate.jsx   # التحديث الذاتي
│   │   ├── ActionTracker.jsx
│   │   ├── SystemStatus.jsx
│   │   └── OfflineIndicator.jsx
│   ├── offline/
│   ├── orphans/
│   └── ui/                  # مكونات Shadcn

├── entities/                # قاعدة البيانات (JSON Schemas)
│   ├── Verse.json
│   ├── Bookmark.json
│   ├── MemorizationPlan.json
│   ├── MemorizationProgress.json
│   ├── Achievement.json
│   ├── Orphan.json
│   ├── Donation.json
│   ├── SystemLog.json
│   └── ...

├── Layout.jsx               # التصميم العام للتطبيق
└── globals.css              # الأنماط العامة
                  `}</pre>
                </div>
              </section>

              {/* ============================================ */}
              {/* 3. الصفحات (Pages) */}
              {/* ============================================ */}
              <section className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 border-4 border-blue-400">
                <h2 className="text-4xl font-bold mb-4 text-blue-900">🖼️ 3. الصفحات الرئيسية (Pages)</h2>
                
                <div className="space-y-6">
                  {[
                    {
                      title: 'Home.jsx - الصفحة الرئيسية',
                      content: `
<strong>الوظيفة:</strong>
- عرض مواقيت الصلاة (حسب موقع المستخدم)
- إحصائيات المستخدم (آيات مقروءة، سور مكتملة، streak)
- أزرار سريعة للانتقال لأقسام التطبيق

<strong>التقنيات:</strong>
- Geolocation API (تحديد الموقع)
- Fetch من API خارجي لمواقيت الصلاة
- LocalStorage لحفظ الإحصائيات
- React useEffect للتحديث التلقائي

<strong>الكود الرئيسي:</strong>
- fetchPrayerTimes(): جلب مواقيت الصلاة
- getNextPrayer(): حساب الصلاة القادمة
- عرض البيانات في Cards
                      `
                    },
                    {
                      title: 'Quran.jsx - عرض القرآن',
                      content: `
<strong>الوظيفة:</strong>
- عرض قائمة 114 سورة
- بحث بالاسم أو الرقم
- فلتر (مكية/مدنية)
- روابط لكل سورة

<strong>المميزات:</strong>
- بحث متقدم (AdvancedSearch)
- مساعد صوتي (VoiceAssistant)
- بانر صدقة جارية
- إحصائيات القرآن

<strong>البيانات:</strong>
- يستورد من QuranData.js (ALL_SURAHS)
- يحتوي على معلومات كل سورة
                      `
                    },
                    {
                      title: 'SurahView.jsx - عرض السورة',
                      content: `
<strong>الوظيفة:</strong>
- عرض آيات السورة المختارة
- قراءة النص العربي
- عرض التفسير (السعدي، ابن كثير، الطبري)
- الترجمات (إنجليزي، فرنسي، أوردو)
- إضافة Bookmarks
- سبب النزول
- الآيات المتشابهة

<strong>المميزات الخاصة:</strong>
- AudioPlayer متزامن مع الآيات
- تظليل الآية الحالية
- إمكانية البحث داخل السورة
- نسخ ومشاركة الآيات
                      `
                    },
                    {
                      title: 'Tilawa.jsx - مشغل التلاوات',
                      content: `
<strong>الوظيفة:</strong>
- تشغيل تلاوات القرآن لـ 12+ قارئ
- اختيار السورة والقارئ
- التحكم في الصوت
- Voice Commands (أوامر صوتية)
- Camera Scanner (مسح الكاميرا)

<strong>القراء المتاحون:</strong>
- محمود خليل الحصري
- عبد الباسط عبد الصمد
- محمد صديق المنشاوي
- مشاري العفاسي
- السديس، الشاطري، العجمي، الغامدي...

<strong>التقنية:</strong>
- HTML5 Audio API
- Web Speech Recognition (التعرف على الصوت)
- روابط CDN من islamic.network
- تتبع الاستماع (ActionTracker)
                      `
                    },
                    {
                      title: 'MemorizationPlan.jsx - خطة الحفظ',
                      content: `
<strong>الوظيفة:</strong>
- إنشاء خطط حفظ مخصصة
- 3 مستويات: مبتدئ، متوسط، متقدم
- جدول يومي للحفظ
- تتبع التقدم

<strong>البيانات المحفوظة:</strong>
- MemorizationPlan (الخطة)
- MemorizationProgress (التقدم اليومي)
- حفظ محلي + مزامنة مع السيرفر

<strong>الميزات:</strong>
- إضافة مهمة يومية جديدة
- تحديد السورة والصفحات
- تحديد اكتمال المهمة
                      `
                    },
                    {
                      title: 'Achievements.jsx - الإنجازات',
                      content: `
<strong>الوظيفة:</strong>
- عرض إنجازات المستخدم
- شارات (Bronze, Silver, Gold, Platinum, Diamond)
- نظام نقاط
- تحفيز المستخدم

<strong>أنواع الإنجازات:</strong>
- قراءة (Reading)
- حفظ (Memorization)
- Streak (الاستمرارية)
- استماع (Listening)
- أذكار (Azkar)

<strong>الكود:</strong>
- يستخدم Entity: Achievement
- React Query للبيانات
- Confetti عند الحصول على إنجاز جديد
                      `
                    },
                    {
                      title: 'Assistant.jsx - المساعد الكامل',
                      content: `
<strong>الوظيفة:</strong>
- مساعد AI كامل للإجابة على الأسئلة
- دردشة نصية + صوتية
- يمكنه تنفيذ إجراءات في التطبيق

<strong>الإمكانيات:</strong>
- الإجابة على أسئلة دينية
- فتح سور وآيات
- تشغيل تلاوات
- إنشاء خطط حفظ
- فتح أي قسم من التطبيق

<strong>التقنية:</strong>
- Base44 LLM Integration
- محادثة سياقية (Context-aware)
- منهج أهل السنة والجماعة
                      `
                    },
                    {
                      title: 'Adhkar.jsx - الأذكار',
                      content: `
<strong>الوظيفة:</strong>
- أذكار الصباح والمساء
- أذكار النوم والاستيقاظ
- أذكار الصلاة
- الرقية الشرعية

<strong>الميزات:</strong>
- عداد لكل ذكر
- استماع صوتي
- نسخ ومشاركة
- تصنيفات واضحة
                      `
                    },
                    {
                      title: 'Duaa.jsx - الأدعية',
                      content: `
<strong>الوظيفة:</strong>
- أدعية قرآنية
- أدعية نبوية
- أدعية متنوعة

<strong>المميزات:</strong>
- بحث في الأدعية
- نسخ ومشاركة
- استماع صوتي (TTS)
- مصادر موثوقة
                      `
                    },
                    {
                      title: 'Radio.jsx - الراديو الإسلامي',
                      content: `
<strong>الوظيفة:</strong>
- بث مباشر لإذاعات قرآنية
- إذاعات من مكة والمدينة
- إذاعات عربية متنوعة

<strong>التقنية:</strong>
- HTML5 Audio Streaming
- روابط م3u8 للبث المباشر
- تحكم في الصوت
                      `
                    },
                    {
                      title: 'Kids.jsx - ركن الأطفال',
                      content: `
<strong>الوظيفة:</strong>
- تعليم تفاعلي للأطفال
- شخصية زوكا المرزوق (AI للأطفال)
- قصص قرآنية
- ألعاب تعليمية

<strong>المميزات:</strong>
- نظام نقاط وتحفيز
- صوت ممتع ومشجع
- تعلم القرآن بطريقة مبسطة
                      `
                    },
                    {
                      title: 'OrphansService.jsx - خدمة الأيتام',
                      content: `
<strong>الوظيفة:</strong>
- تسجيل الأيتام
- إدارة التبرعات
- طلبات المساعدة
- متابعة التحويلات

<strong>الكيانات المستخدمة:</strong>
- Orphan
- Donation
- OrphanRequest
- AdminBankAccount

<strong>الأدمن:</strong>
- يمكن للأدمن الموافقة على الطلبات
- متابعة التبرعات
- إدارة بيانات الأيتام
                      `
                    }
                  ].map((page, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border-2 border-blue-300">
                      <h3 className="text-2xl font-bold mb-3 text-blue-800">{page.title}</h3>
                      <pre className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{page.content}</pre>
                    </div>
                  ))}
                </div>
              </section>

              {/* ============================================ */}
              {/* 4. المكونات الذكية */}
              {/* ============================================ */}
              <section className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-6 border-4 border-pink-400">
                <h2 className="text-4xl font-bold mb-4 text-pink-900">🧩 4. المكونات الذكية (Smart Components)</h2>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-5 border-2 border-pink-300">
                    <h3 className="text-2xl font-bold mb-3 text-pink-800">SmartChatBot.jsx - المساعد الجديد 🤖</h3>
                    <pre className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{`
<strong>الوظيفة الأساسية:</strong>
هذا هو المساعد الذكي الجديد المصمم مثل ChatGPT

<strong>المميزات:</strong>
1. محادثة نصية كاملة (Chat Interface)
2. حقل كتابة (Input Field) مع زر إرسال
3. يحتفظ بسياق المحادثة (Conversation History)
4. ينفذ إجراءات داخل التطبيق:
   - فتح سور وآيات
   - تشغيل تلاوات
   - فتح الأذكار والأدعية
   - إنشاء خطط حفظ
   - تسجيل التقدم
   - فتح أي صفحة

5. التعرف على الصوت (اختياري)
6. قراءة الردود صوتياً (Text-to-Speech)

<strong>البنية الأساسية:</strong>

const [messages, setMessages] = useState([...]);  // سجل المحادثة
const [inputText, setInputText] = useState('');   // النص المدخل
const [isLoading, setIsLoading] = useState(false); // حالة التحميل

<strong>دالة الإرسال الرئيسية:</strong>

async function sendMessage() {
  // 1. إضافة رسالة المستخدم
  const userMessage = { role: 'user', content: inputText };
  setMessages(prev => [...prev, userMessage]);

  // 2. استدعاء الذكاء الاصطناعي
  const response = await callAI({
    conversationHistory: messages,
    userMessage: inputText
  });

  // 3. إضافة رد المساعد
  const assistantMessage = { 
    role: 'assistant', 
    content: response.replyText,
    actions: response.actions 
  };
  setMessages(prev => [...prev, assistantMessage]);

  // 4. تنفيذ الإجراءات
  response.actions.forEach(action => executeAction(action));
}

<strong>دالة استدعاء AI:</strong>

async function callAI({ userId, language, conversationHistory, userMessage }) {
  // يمكن التكامل مع API خارجي (مثل zaka.ai) لاحقاً
  if (AI_CONFIG.useExternalAPI) {
    return await fetch(AI_CONFIG.externalAPIUrl, {...});
  }

  // أو استخدام Base44 LLM المحلي
  return await base44.integrations.Core.InvokeLLM({
    prompt: \`أنت زوكا المرزوق - مساعد قرآني...
    
    المستخدم: "\${userMessage}"
    
    رد بصيغة JSON:
    {
      "replyText": "نص الرد",
      "actions": [{"type": "open_surah", "params": {...}}]
    }\`,
    response_json_schema: {...}
  });
}

<strong>تنفيذ الإجراءات:</strong>

function executeAction(action) {
  switch (action.type) {
    case 'open_surah':
      navigate(\`SurahView?surah=\${action.params.surah}\`);
      break;
    case 'play_recitation':
      navigate(\`Tilawa?surah=\${action.params.surah}\`);
      break;
    case 'open_azkar':
      navigate(\`Adhkar?tab=\${action.params.category}\`);
      break;
    // ... المزيد من الإجراءات
  }
}

<strong>الواجهة (UI):</strong>
- زر عائم في الزاوية اليمنى السفلية
- عند الضغط يفتح نافذة Chat
- منطقة عرض الرسائل (ScrollArea)
- أزرار سريعة (Quick Actions)
- حقل إدخال + ميكروفون + إرسال

<strong>التخصيصات المتاحة:</strong>
- AI_CONFIG.useExternalAPI = true/false
- AI_CONFIG.externalAPIUrl = "رابط API الخارجي"
- AI_CONFIG.apiKey = "المفتاح"

<strong>الاستخدام:</strong>
// في Layout.jsx
import SmartChatBot from '@/components/assistant/SmartChatBot';
<SmartChatBot />
                    `}</pre>
                  </div>

                  <div className="bg-white rounded-xl p-5 border-2 border-pink-300">
                    <h3 className="text-2xl font-bold mb-3 text-pink-800">VoiceController.jsx - التحكم الصوتي</h3>
                    <pre className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{`
<strong>الوظيفة:</strong>
- التعرف على أوامر صوتية في صفحة التلاوة
- أوامر مثل: "شغل سورة البقرة"، "غير القارئ"

<strong>التقنية:</strong>
- Web Speech API
- SpeechRecognition
- معالجة النص للفهم
                    `}</pre>
                  </div>

                  <div className="bg-white rounded-xl p-5 border-2 border-pink-300">
                    <h3 className="text-2xl font-bold mb-3 text-pink-800">CameraScanner.jsx - ماسح الكاميرا</h3>
                    <pre className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{`
<strong>الوظيفة:</strong>
- مسح صفحة من المصحف بالكاميرا
- تحليل الصورة بالذكاء الاصطناعي
- استخراج السورة والآيات

<strong>التقنية:</strong>
- navigator.mediaDevices.getUserMedia (الكاميرا)
- base44.integrations.Core.UploadFile (رفع الصورة)
- base44.integrations.Core.InvokeLLM (تحليل OCR)
                    `}</pre>
                  </div>

                  <div className="bg-white rounded-xl p-5 border-2 border-pink-300">
                    <h3 className="text-2xl font-bold mb-3 text-pink-800">DailyReminders.jsx - التذكيرات اليومية</h3>
                    <pre className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{`
<strong>الوظيفة:</strong>
- تذكير بمواقيت الصلاة
- تذكير بالأذكار
- عرض إشعارات

<strong>التقنيات:</strong>
- setInterval للفحص المستمر
- Notification API (إشعارات المتصفح)
- مواقيت صلاة حسب الموقع
                    `}</pre>
                  </div>

                  <div className="bg-white rounded-xl p-5 border-2 border-pink-300">
                    <h3 className="text-2xl font-bold mb-3 text-pink-800">AutoUpdate.jsx - التحديث الذاتي</h3>
                    <pre className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{`
<strong>الوظيفة:</strong>
- تحديث المحتوى تلقائياً كل 24 ساعة
- جلب مواقيت صلاة جديدة
- جلب محتوى إسلامي جديد
- تحديث معلومات القراء

<strong>الكود:</strong>
- يستخدم base44 LLM مع add_context_from_internet
- يحفظ النتائج في LocalStorage
- يعمل في الخلفية
                    `}</pre>
                  </div>

                  <div className="bg-white rounded-xl p-5 border-2 border-pink-300">
                    <h3 className="text-2xl font-bold mb-3 text-pink-800">ActionTracker.jsx - تتبع الإجراءات</h3>
                    <pre className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{`
<strong>الوظيفة:</strong>
- تسجيل كل إجراء يقوم به المستخدم
- حفظ في Entity: SystemLog
- حفظ محلي أيضاً

<strong>الإجراءات المتتبعة:</strong>
- قراءة آيات
- الاستماع للتلاوات
- البحث
- التنقل
- الأذكار
- كل شيء!

<strong>الاستخدام:</strong>
import { trackRead, trackListen } from '@/components/system/ActionTracker';
trackRead('قراءة سورة البقرة');
                    `}</pre>
                  </div>
                </div>
              </section>

              {/* ============================================ */}
              {/* 5. قاعدة البيانات (Entities) */}
              {/* ============================================ */}
              <section className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 border-4 border-yellow-400">
                <h2 className="text-4xl font-bold mb-4 text-yellow-900">🗄️ 5. قاعدة البيانات (Entities)</h2>
                
                <div className="space-y-4">
                  <p className="text-lg text-gray-800">جميع الكيانات محفوظة في مجلد <code className="bg-yellow-200 px-2 py-1 rounded">entities/</code></p>
                  
                  <div className="bg-white rounded-xl p-5 border-2 border-yellow-300">
                    <h3 className="text-2xl font-bold mb-3">الكيانات الموجودة:</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        { name: 'User', desc: 'مستخدمي التطبيق (built-in)' },
                        { name: 'Verse', desc: 'آيات القرآن' },
                        { name: 'Bookmark', desc: 'المفضلة' },
                        { name: 'MemorizationPlan', desc: 'خطط الحفظ' },
                        { name: 'MemorizationProgress', desc: 'تقدم الحفظ اليومي' },
                        { name: 'Achievement', desc: 'الإنجازات' },
                        { name: 'Orphan', desc: 'الأيتام' },
                        { name: 'Donation', desc: 'التبرعات' },
                        { name: 'OrphanRequest', desc: 'طلبات الأيتام' },
                        { name: 'AdminBankAccount', desc: 'حسابات الأدمن' },
                        { name: 'SystemLog', desc: 'سجل الإجراءات' },
                        { name: 'IslamicContent', desc: 'محتوى إسلامي' }
                      ].map((entity, idx) => (
                        <div key={idx} className="bg-yellow-50 p-3 rounded-lg border border-yellow-300">
                          <p className="font-bold text-yellow-900">{entity.name}</p>
                          <p className="text-xs text-gray-600">{entity.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border-2 border-yellow-300">
                    <h3 className="text-2xl font-bold mb-3">كيفية استخدام Entities:</h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">{`
import { base44 } from '@/api/base44Client';

// قراءة البيانات
const achievements = await base44.entities.Achievement.list();
const filteredAchievements = await base44.entities.Achievement.filter(
  { category: 'reading' }, 
  '-created_date', 
  10
);

// إنشاء سجل جديد
await base44.entities.Achievement.create({
  title: "قارئ نشيط",
  category: "reading",
  points: 50,
  badge_type: "gold"
});

// تحديث سجل
await base44.entities.Achievement.update(achievementId, {
  points: 100
});

// حذف
await base44.entities.Achievement.delete(achievementId);

// الحصول على Schema
const schema = await base44.entities.Achievement.schema();
                    `}</pre>
                  </div>
                </div>
              </section>

              {/* ============================================ */}
              {/* 6. Layout & Navigation */}
              {/* ============================================ */}
              <section className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 border-4 border-indigo-400">
                <h2 className="text-4xl font-bold mb-4 text-indigo-900">🎨 6. التصميم العام (Layout)</h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 border-2 border-indigo-300">
                    <h3 className="text-2xl font-bold mb-3">Layout.jsx - التصميم الأساسي</h3>
                    <pre className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{`
<strong>الوظيفة:</strong>
- يحيط بكل الصفحات
- يحتوي على:
  * Header (القائمة العلوية)
  * Navigation Bar
  * Footer
  * المكونات الثابتة (AutoUpdate, DailyReminders, SmartChatBot)

<strong>المكونات المضمنة في Layout:</strong>
- SmartChatBot: المساعد الذكي العائم
- DailyReminders: التذكيرات
- AutoUpdate: التحديث الذاتي
- OfflineIndicator: مؤشر الإنترنت
- SystemStatus: حالة النظام
- ThemeToggle: تبديل الوضع الليلي

<strong>Navigation Items:</strong>
- الرئيسية، القرآن، الأطفال
- التلاوة، المقرئين، الراديو
- خطة الحفظ، الإنجازات، الأذكار، الأدعية
- الإحصائيات، خدمة الأيتام
- الأدمن (للأدمن فقط)

<strong>التحقق من الأدمن:</strong>
useEffect(() => {
  const user = await base44.auth.me();
  if (user.role === 'admin') {
    // عرض قائمة الأدمن
  }
}, []);
                    `}</pre>
                  </div>

                  <div className="bg-white rounded-xl p-5 border-2 border-indigo-300">
                    <h3 className="text-2xl font-bold mb-3">globals.css - الأنماط العامة</h3>
                    <pre className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{`
<strong>يحتوي على:</strong>
- استيراد خطوط Cairo (عربي) و Amiri (قرآني)
- متغيرات Tailwind
- أنماط الوضع الليلي
- أنماط Shadcn
                    `}</pre>
                  </div>
                </div>
              </section>

              {/* ============================================ */}
              {/* 7. الميزات الخاصة */}
              {/* ============================================ */}
              <section className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border-4 border-green-400">
                <h2 className="text-4xl font-bold mb-4 text-green-900">✨ 7. الميزات الخاصة</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      title: '🔄 العمل بدون إنترنت (Offline Mode)',
                      content: `
<strong>التقنية:</strong>
- LocalStorage
- offlineStorage.js (ملف مخصص)

<strong>البيانات المحفوظة محلياً:</strong>
- إحصائيات المستخدم
- Bookmarks
- خطط الحفظ
- الإنجازات
- سجل الإجراءات

<strong>المزامنة:</strong>
- عند الاتصال بالإنترنت، يتم رفع البيانات للسيرفر
- React Query تدير التخزين المؤقت
                      `
                    },
                    {
                      title: '🗣️ التعرف على الصوت (Speech Recognition)',
                      content: `
<strong>الاستخدامات:</strong>
- في SmartChatBot (الكتابة بالصوت)
- في VoiceController (أوامر صوتية)
- في Kids (تفاعل الأطفال)

<strong>الكود:</strong>
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'ar-SA';
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  // معالجة النص
};
                      `
                    },
                    {
                      title: '🔊 تحويل النص لصوت (Text-to-Speech)',
                      content: `
<strong>الاستخدامات:</strong>
- قراءة ردود المساعد
- قراءة الأدعية والأذكار
- قراءة الآيات

<strong>الكود:</strong>
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'ar-SA';
utterance.rate = 0.9; // السرعة
utterance.pitch = 1.2; // النبرة
window.speechSynthesis.speak(utterance);
                      `
                    },
                    {
                      title: '🎥 استخدام الكاميرا (Camera Access)',
                      content: `
<strong>في CameraScanner:</strong>
- فتح الكاميرا
- التقاط صورة
- تحليل الصورة بالذكاء الاصطناعي

<strong>الكود:</strong>
const stream = await navigator.mediaDevices.getUserMedia({ 
  video: { facingMode: 'environment' } 
});
videoRef.current.srcObject = stream;

// التقاط صورة
const canvas = document.createElement('canvas');
canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
const blob = await canvas.toBlob();
                      `
                    },
                    {
                      title: '🎯 تتبع الموقع (Geolocation)',
                      content: `
<strong>لحساب مواقيت الصلاة:</strong>
navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    // جلب مواقيت الصلاة من API
  }
);
                      `
                    },
                    {
                      title: '🎨 الرسوم المتحركة (Animations)',
                      content: `
<strong>باستخدام Framer Motion:</strong>
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  المحتوى
</motion.div>

<strong>CSS Animations:</strong>
@keyframes pulse { ... }
.animate-pulse { animation: pulse 2s infinite; }
                      `
                    }
                  ].map((feature, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border-2 border-green-300">
                      <h3 className="text-2xl font-bold mb-3 text-green-800">{feature.title}</h3>
                      <pre className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{feature.content}</pre>
                    </div>
                  ))}
                </div>
              </section>

              {/* ============================================ */}
              {/* 8. الذكاء الاصطناعي */}
              {/* ============================================ */}
              <section className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border-4 border-purple-400">
                <h2 className="text-4xl font-bold mb-4 text-purple-900">🤖 8. الذكاء الاصطناعي (AI Integration)</h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 border-2 border-purple-300">
                    <h3 className="text-2xl font-bold mb-3">استخدامات الذكاء الاصطناعي في التطبيق:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mr-6">
                      <li><strong>SmartChatBot:</strong> المحادثة الذكية والإجابة على الأسئلة</li>
                      <li><strong>AutoUpdate:</strong> جلب محتوى جديد من الإنترنت</li>
                      <li><strong>CameraScanner:</strong> تحليل صور المصحف (OCR)</li>
                      <li><strong>VoiceAssistant:</strong> فهم الأوامر الصوتية</li>
                      <li><strong>Kids Bot:</strong> تعليم الأطفال بطريقة ممتعة</li>
                      <li><strong>OrphanBot:</strong> مساعدة في خدمة الأيتام</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl p-5 border-2 border-purple-300">
                    <h3 className="text-2xl font-bold mb-3">كيفية استخدام Base44 LLM:</h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">{`
import { base44 } from '@/api/base44Client';

// استدعاء بسيط
const response = await base44.integrations.Core.InvokeLLM({
  prompt: "ما معنى سورة الفاتحة؟"
});
console.log(response); // نص الرد

// استدعاء مع بحث من الإنترنت
const response = await base44.integrations.Core.InvokeLLM({
  prompt: "أعطني أحدث أخبار الإسلام في العالم",
  add_context_from_internet: true
});

// استدعاء مع JSON Schema
const response = await base44.integrations.Core.InvokeLLM({
  prompt: "أعطني قائمة بأشهر 5 قراء قرآن",
  response_json_schema: {
    type: "object",
    properties: {
      reciters: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            country: { type: "string" }
          }
        }
      }
    }
  }
});
console.log(response.reciters); // array من الأسماء

// استدعاء مع ملفات
const { file_url } = await base44.integrations.Core.UploadFile({ file });
const response = await base44.integrations.Core.InvokeLLM({
  prompt: "اقرأ هذه الصورة من المصحف وأعطني السورة والآيات",
  file_urls: [file_url],
  response_json_schema: {
    type: "object",
    properties: {
      surah_name: { type: "string" },
      surah_number: { type: "number" },
      verses: { type: "array", items: { type: "string" } }
    }
  }
});
                    `}</pre>
                  </div>

                  <div className="bg-white rounded-xl p-5 border-2 border-purple-300">
                    <h3 className="text-2xl font-bold mb-3">التكامل مع API خارجي (zaka.ai):</h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">{`
// في SmartChatBot.jsx
const AI_CONFIG = {
  useExternalAPI: false,  // غيرها لـ true للتفعيل
  externalAPIUrl: "https://api.zaka.ai/chat",
  apiKey: "YOUR_API_KEY_HERE"
};

async function callAI({ userId, conversationHistory, userMessage }) {
  if (AI_CONFIG.useExternalAPI && AI_CONFIG.externalAPIUrl) {
    const response = await fetch(AI_CONFIG.externalAPIUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${AI_CONFIG.apiKey}\`
      },
      body: JSON.stringify({
        userId,
        conversationHistory,
        message: userMessage
      })
    });
    return await response.json();
  }
  
  // وإلا استخدم Base44 LLM المحلي
  return await base44.integrations.Core.InvokeLLM({...});
}
                    `}</pre>
                  </div>
                </div>
              </section>

              {/* ============================================ */}
              {/* 9. الأمان والصلاحيات */}
              {/* ============================================ */}
              <section className="bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl p-6 border-4 border-red-400">
                <h2 className="text-4xl font-bold mb-4 text-red-900">🔐 9. الأمان والصلاحيات</h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 border-2 border-red-300">
                    <h3 className="text-2xl font-bold mb-3">نظام المستخدمين:</h3>
                    <pre className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{`
<strong>كيان User (مدمج في Base44):</strong>
- id
- email
- full_name
- role (admin أو user)
- created_date

<strong>التحقق من المستخدم الحالي:</strong>
import { base44 } from '@/api/base44Client';

const user = await base44.auth.me();
console.log(user.email);
console.log(user.role);

<strong>تحديث بيانات المستخدم:</strong>
await base44.auth.updateMe({
  stats: { verses_read: 100 }
});

<strong>تسجيل الخروج:</strong>
base44.auth.logout();

<strong>إعادة التوجيه للتسجيل:</strong>
base44.auth.redirectToLogin();
                    `}</pre>
                  </div>

                  <div className="bg-white rounded-xl p-5 border-2 border-red-300">
                    <h3 className="text-2xl font-bold mb-3">صلاحيات الأدمن:</h3>
                    <pre className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{`
<strong>التحقق من الأدمن:</strong>
const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  const checkAdmin = async () => {
    const user = await base44.auth.me();
    setIsAdmin(user.role === 'admin');
  };
  checkAdmin();
}, []);

<strong>عرض محتوى خاص بالأدمن:</strong>
{isAdmin && (
  <Link to={createPageUrl('AdminDashboard')}>
    <Button>لوحة التحكم</Button>
  </Link>
)}

<strong>صلاحيات الأدمن:</strong>
- إدارة الأيتام
- مراجعة التبرعات
- إدارة الطلبات
- عرض الإحصائيات
- إدارة المحتوى
                    `}</pre>
                  </div>
                </div>
              </section>

              {/* ============================================ */}
              {/* 10. نصائح وأفضل الممارسات */}
              {/* ============================================ */}
              <section className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl p-6 border-4 border-cyan-400">
                <h2 className="text-4xl font-bold mb-4 text-cyan-900">💡 10. نصائح وأفضل الممارسات</h2>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 border-2 border-cyan-300">
                    <h3 className="text-2xl font-bold mb-3 text-cyan-800">عند إضافة ميزة جديدة:</h3>
                    <ul className="list-decimal list-inside space-y-2 text-gray-700 mr-6">
                      <li>حدد هل تحتاج Entity جديد؟ → أنشئ JSON Schema</li>
                      <li>هل تحتاج Component جديد؟ → أنشئه في components/</li>
                      <li>هل تحتاج Page جديدة؟ → أنشئها في pages/</li>
                      <li>استخدم React Query لإدارة البيانات</li>
                      <li>استخدم offlineStorage للحفظ المحلي</li>
                      <li>استخدم ActionTracker لتتبع الإجراءات</li>
                      <li>استخدم toast لإشعارات المستخدم</li>
                      <li>اختبر الميزة في وضع Offline</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl p-5 border-2 border-cyan-300">
                    <h3 className="text-2xl font-bold mb-3 text-cyan-800">الأخطاء الشائعة وحلولها:</h3>
                    <div className="space-y-3">
                      <div className="bg-red-50 p-3 rounded-lg border border-red-300">
                        <p className="font-bold text-red-800">❌ لا يعمل Audio</p>
                        <p className="text-sm text-gray-700">الحل: تأكد من الرابط صحيح، استخدم crossOrigin="anonymous"</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-300">
                        <p className="font-bold text-red-800">❌ لا يعمل Speech Recognition</p>
                        <p className="text-sm text-gray-700">الحل: يعمل فقط على HTTPS أو localhost، تحقق من دعم المتصفح</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-300">
                        <p className="font-bold text-red-800">❌ البيانات لا تحفظ</p>
                        <p className="text-sm text-gray-700">الحل: تحقق من await في base44.entities، استخدم invalidateQueries</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-300">
                        <p className="font-bold text-red-800">❌ الكاميرا لا تعمل</p>
                        <p className="text-sm text-gray-700">الحل: يعمل فقط على HTTPS، تحقق من permissions</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border-2 border-cyan-300">
                    <h3 className="text-2xl font-bold mb-3 text-cyan-800">أدوات مفيدة:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mr-6">
                      <li><strong>React DevTools:</strong> لفحص Components</li>
                      <li><strong>Console:</strong> لرؤية الأخطاء والـ logs</li>
                      <li><strong>Network Tab:</strong> لرؤية API calls</li>
                      <li><strong>Application Tab:</strong> لرؤية LocalStorage</li>
                      <li><strong>React Query DevTools:</strong> لفحص الـ cache</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* ============================================ */}
              {/* 11. التطوير المستقبلي */}
              {/* ============================================ */}
              <section className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 border-4 border-indigo-400">
                <h2 className="text-4xl font-bold mb-4 text-indigo-900">🚀 11. التطوير المستقبلي</h2>
                
                <div className="bg-white rounded-xl p-5 border-2 border-indigo-300">
                  <h3 className="text-2xl font-bold mb-3">ميزات مقترحة للمستقبل:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mr-6">
                    <li>تطبيق موبايل (React Native)</li>
                    <li>مزامنة بين الأجهزة</li>
                    <li>مسابقات حفظ جماعية</li>
                    <li>نظام رسائل بين المستخدمين</li>
                    <li>إحصائيات متقدمة ورسوم بيانية</li>
                    <li>تكامل مع Google Calendar</li>
                    <li>تصدير التقدم كـ PDF</li>
                    <li>مشاركة الإنجازات على وسائل التواصل</li>
                    <li>نظام أصدقاء ومتابعة</li>
                    <li>خطط حفظ جماعية</li>
                  </ul>
                </div>
              </section>

              {/* ============================================ */}
              {/* الخاتمة */}
              {/* ============================================ */}
              <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center">
                <h2 className="text-5xl font-bold mb-4">🌟 الخلاصة 🌟</h2>
                <p className="text-2xl mb-4">هذا التطبيق صدقة جارية</p>
                <p className="text-xl mb-6">مجاني 100% لوجه الله تعالى</p>
                
                <div className="bg-white/20 rounded-xl p-6 mb-6">
                  <p className="text-3xl font-bold font-arabic mb-3">﴿ وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا ﴾</p>
                  <p className="text-xl">اللهم اجعلنا من أهل القرآن وخاصته</p>
                </div>

                <div className="text-lg space-y-2">
                  <p>على روح المرحومة: جزبية عبد الرحيم هارون علي</p>
                  <p>المشرف العام: زوكا المرزوق</p>
                  <p>📧 Zookaalmrzwq@gmail.com</p>
                  <p>🌐 zaka.ai</p>
                </div>
              </section>

            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}