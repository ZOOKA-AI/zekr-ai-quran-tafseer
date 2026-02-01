// =================== قاعدة بيانات المقرئين العالمية الموسعة ===================

export const QARI_SYSTEM = {
    version: "3.0.0",
    lastUpdate: new Date().toISOString(),
    autoUpdate: true,
    
    // المصادر الرئيسية للتحديث التلقائي
    sources: [
        "https://everyayah.com/data/",
        "https://server8.mp3quran.net/",
        "https://server6.mp3quran.net/",
        "https://server7.mp3quran.net/",
        "https://server9.mp3quran.net/",
        "https://server10.mp3quran.net/",
        "https://server11.mp3quran.net/",
        "https://server12.mp3quran.net/",
        "https://download.quranicaudio.com/"
    ],
    
    // التصنيف الجغرافي للمقرئين
    qaris: {
        // 🇪🇬 المقرئين المصريين
        egyptian: [
            {
                id: "husary",
                name: "محمود خليل الحصري",
                country: "EG",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/hsr/",
                formats: ["64", "128", "192"],
                verified: true,
                description: "من أعظم قراء القرآن الكريم"
            },
            {
                id: "husary_muallim",
                name: "الحصري (معلم)",
                country: "EG",
                style: "تعليم",
                rating: 5,
                audio_base: "https://everyayah.com/data/Husary_Muallim_128kbps/",
                verified: true,
                description: "للتعليم والتكرار"
            },
            {
                id: "minshawy",
                name: "محمد صديق المنشاوي",
                country: "EG",
                style: "مرتل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/mnsh/",
                verified: true,
                description: "صوت ملائكي"
            },
            {
                id: "minshawy_murattal",
                name: "المنشاوي (مرتل)",
                country: "EG",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://everyayah.com/data/Minshawy_Murattal_128kbps/",
                verified: true
            },
            {
                id: "abdulbaset",
                name: "عبد الباسط عبد الصمد",
                country: "EG",
                style: "مرتل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/basit/",
                verified: true,
                description: "الصوت الذهبي"
            },
            {
                id: "abdulbaset_mujawwad",
                name: "عبد الباسط (مجود)",
                country: "EG",
                style: "تجويد",
                rating: 5,
                audio_base: "https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/",
                verified: true
            },
            {
                id: "tablaway",
                name: "محمد الطبلاوي",
                country: "EG",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/tblwy/",
                verified: true
            },
            {
                id: "shahat",
                name: "الشحات محمد أنور",
                country: "EG",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/shahat/",
                verified: true
            },
            {
                id: "qamhawi",
                name: "محمد محمود القحطاني",
                country: "EG",
                style: "ترتيل",
                rating: 4,
                audio_base: "https://server8.mp3quran.net/qhtni/",
                verified: true
            },
            {
                id: "banna",
                name: "محمود علي البنا",
                country: "EG",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/bna/",
                verified: true
            }
        ],
        
        // 🇸🇦 المقرئين السعوديين
        saudi: [
            {
                id: "sudais",
                name: "عبد الرحمن السديس",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/sds/",
                imam: "الحرم المكي",
                verified: true,
                description: "إمام الحرم المكي"
            },
            {
                id: "shuraim",
                name: "سعود الشريم",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/shur/",
                imam: "الحرم المكي",
                verified: true
            },
            {
                id: "alafasy",
                name: "مشاري العفاسي",
                country: "KW",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/afs/",
                verified: true,
                description: "صوت مميز ومؤثر"
            },
            {
                id: "hudhaify",
                name: "علي الحذيفي",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/hthf/",
                imam: "المسجد النبوي",
                verified: true
            },
            {
                id: "maher",
                name: "ماهر المعيقلي",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/maher/",
                imam: "الحرم المكي",
                verified: true,
                description: "من أجمل الأصوات"
            },
            {
                id: "ghamdi",
                name: "سعد الغامدي",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/s_gmd/",
                verified: true
            },
            {
                id: "ayoub",
                name: "محمد أيوب",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/ayyb/",
                imam: "المسجد النبوي",
                verified: true
            },
            {
                id: "juhany",
                name: "عبد الله الجهني",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/jhn/",
                imam: "الحرم المكي",
                verified: true
            },
            {
                id: "dosary",
                name: "ياسر الدوسري",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/yasser/",
                verified: true,
                description: "صوت خاشع"
            },
            {
                id: "baleela",
                name: "بندر بليلة",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/balila/",
                imam: "الحرم المكي",
                verified: true
            },
            {
                id: "fares_abbad",
                name: "فارس عباد",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/frs_a/",
                verified: true
            },
            {
                id: "khalid_jalil",
                name: "خالد الجليل",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/khl_jl/",
                verified: true,
                description: "تلاوة مؤثرة"
            },
            {
                id: "nasser_qatami",
                name: "ناصر القطامي",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/qatami/",
                verified: true
            },
            {
                id: "salah_budair",
                name: "صلاح البدير",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/s_bud/",
                imam: "المسجد النبوي",
                verified: true
            },
            {
                id: "ahmed_ajamy",
                name: "أحمد العجمي",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/ajm/",
                verified: true
            },
            {
                id: "ibrahim_dosary",
                name: "إبراهيم الدوسري",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/ibr_dsr/",
                verified: true
            }
        ],
        
        // 🌍 المقرئين العالميين
        international: [
            {
                id: "bukhatir",
                name: "أبو بكر الشاطري",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/bkr/",
                verified: true,
                description: "صوت جميل ومميز"
            },
            {
                id: "muaiqly",
                name: "ماهر المعيقلي (2)",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/maher/",
                verified: true
            },
            {
                id: "hani_rifai",
                name: "هاني الرفاعي",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/hani/",
                verified: true
            },
            {
                id: "mishary_rashid",
                name: "مشاري راشد العفاسي",
                country: "KW",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://everyayah.com/data/Alafasy_128kbps/",
                verified: true
            },
            {
                id: "parhizgar",
                name: "شهريار برهيزكار",
                country: "IR",
                style: "ترتيل",
                rating: 4,
                audio_base: "https://server8.mp3quran.net/prhz/",
                verified: true
            },
            {
                id: "wadih_yamani",
                name: "وديع اليمني",
                country: "YE",
                style: "ترتيل",
                rating: 4,
                audio_base: "https://server8.mp3quran.net/wdy/",
                verified: true
            },
            {
                id: "akram_alaqli",
                name: "أكرم العلاقمي",
                country: "SA",
                style: "ترتيل",
                rating: 4,
                audio_base: "https://server8.mp3quran.net/akrm/",
                verified: true
            },
            {
                id: "ibrahim_akhdar",
                name: "إبراهيم الأخضر",
                country: "SA",
                style: "ترتيل",
                rating: 4,
                audio_base: "https://server8.mp3quran.net/akhdr/",
                verified: true
            },
            {
                id: "mohammad_luhaidan",
                name: "محمد اللحيدان",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/lhdan/",
                verified: true,
                description: "قراءة خاشعة"
            },
            {
                id: "adel_kalbani",
                name: "عادل الكلباني",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/kl_bani/",
                verified: true
            },
            {
                id: "abdullah_basfar",
                name: "عبد الله بصفر",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/basf/",
                verified: true
            },
            {
                id: "sahl_yassin",
                name: "سهل ياسين",
                country: "SA",
                style: "ترتيل",
                rating: 4,
                audio_base: "https://server8.mp3quran.net/shl_ysn/",
                verified: true
            },
            {
                id: "tawfeeq_sayegh",
                name: "توفيق الصائغ",
                country: "SA",
                style: "ترتيل",
                rating: 4,
                audio_base: "https://server8.mp3quran.net/twfq/",
                verified: true
            },
            {
                id: "mahmoud_ali_banna_muallim",
                name: "البنا (معلم)",
                country: "EG",
                style: "تعليم",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/bna_mlm/",
                verified: true
            },
            {
                id: "abdullah_matrood",
                name: "عبد الله المطرود",
                country: "SA",
                style: "ترتيل",
                rating: 4,
                audio_base: "https://server8.mp3quran.net/mtrd/",
                verified: true
            }
        ]
    },
    
    // نظام ذاكرة التخزين الذكي
    audioCache: {
        maxSize: 1000 * 1024 * 1024, // 1GB
        currentSize: 0,
        cacheMap: new Map(),
        
        cacheAudio: function(url, audioData) {
            const audioSize = audioData.byteLength || audioData.size || 0;
            
            if (this.currentSize + audioSize > this.maxSize) {
                this.cleanupCache();
            }
            
            const cacheKey = btoa(url).replace(/[^a-z0-9]/gi, '');
            this.cacheMap.set(cacheKey, {
                data: audioData,
                timestamp: Date.now(),
                size: audioSize
            });
            
            this.currentSize += audioSize;
            
            try {
                localStorage.setItem(`audio_cache_${cacheKey}`, JSON.stringify(audioData));
            } catch (e) {
                this.cleanupCache();
            }
        },
        
        getCachedAudio: function(url) {
            const cacheKey = btoa(url).replace(/[^a-z0-9]/gi, '');
            
            if (this.cacheMap.has(cacheKey)) {
                return this.cacheMap.get(cacheKey).data;
            }
            
            const stored = localStorage.getItem(`audio_cache_${cacheKey}`);
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (e) {
                    return null;
                }
            }
            
            return null;
        },
        
        cleanupCache: function() {
            const sortedEntries = Array.from(this.cacheMap.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp);
            
            const toDelete = Math.floor(sortedEntries.length * 0.2);
            
            for (let i = 0; i < toDelete; i++) {
                const [key, value] = sortedEntries[i];
                this.currentSize -= value.size;
                this.cacheMap.delete(key);
                localStorage.removeItem(`audio_cache_${key}`);
            }
        }
    },
    
    // واجهة برمجة التطبيق
    api: {
        getAllQaris: function() {
            const all = [];
            Object.values(QARI_SYSTEM.qaris).forEach(category => {
                all.push(...category);
            });
            return all;
        },
        
        getVerifiedQaris: function() {
            return this.getAllQaris().filter(qari => qari.verified === true);
        },
        
        getQarisByCountry: function(countryCode) {
            return this.getAllQaris().filter(qari => qari.country === countryCode);
        },
        
        getQarisByStyle: function(style) {
            return this.getAllQaris().filter(qari => qari.style === style);
        },
        
        getQarisByRating: function(minRating = 5) {
            return this.getAllQaris().filter(qari => qari.rating >= minRating);
        },
        
        searchQari: function(query) {
            const all = this.getAllQaris();
            const q = query.toLowerCase();
            return all.filter(qari => 
                qari.name.toLowerCase().includes(q) || 
                qari.id.toLowerCase().includes(q) ||
                (qari.description && qari.description.toLowerCase().includes(q))
            );
        },
        
        generateSurahUrl: function(qariId, surah) {
            const qari = this.getAllQaris().find(q => q.id === qariId);
            if (!qari) return null;
            
            const surahStr = surah.toString().padStart(3, '0');
            return qari.audio_base + surahStr + '.mp3';
        },
        
        generateAudioUrl: function(qariId, surah, ayah, quality = '128') {
            const qari = this.getAllQaris().find(q => q.id === qariId);
            if (!qari) return null;
            
            const surahStr = surah.toString().padStart(3, '0');
            const ayahStr = ayah.toString().padStart(3, '0');
            
            // بعض المصادر تستخدم صيغة مختلفة
            if (qari.audio_base.includes('everyayah')) {
                return qari.audio_base + surahStr + ayahStr + '.mp3';
            }
            
            return qari.audio_base + surahStr + '.mp3';
        },
        
        testAudioUrl: async function(url) {
            try {
                const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
                return response.ok || response.type === 'opaque';
            } catch {
                return false;
            }
        },
        
        getStats: function() {
            const all = this.getAllQaris();
            const verified = this.getVerifiedQaris();
            return {
                total: all.length,
                verified: verified.length,
                egyptian: QARI_SYSTEM.qaris.egyptian.length,
                saudi: QARI_SYSTEM.qaris.saudi.length,
                international: QARI_SYSTEM.qaris.international.length
            };
        }
    }
};

export default QARI_SYSTEM;