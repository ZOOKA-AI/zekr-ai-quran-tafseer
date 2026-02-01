// =================== قاعدة بيانات المقرئين العالمية ===================

export const QARI_SYSTEM = {
    version: "2.0.0",
    lastUpdate: new Date().toISOString(),
    autoUpdate: true,
    
    // المصادر الرئيسية للتحديث التلقائي
    sources: [
        "https://everyayah.com/data/",
        "https://server8.mp3quran.net/",
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
                style: "حدر",
                rating: 5,
                audio_base: "https://everyayah.com/data/Husary_128kbps/",
                formats: ["64", "128", "192"]
            },
            {
                id: "minshawy",
                name: "محمد صديق المنشاوي",
                country: "EG",
                style: "تحقيق",
                rating: 5,
                audio_base: "https://everyayah.com/data/Minshawy_Murattal_128kbps/"
            },
            {
                id: "abdulbaset",
                name: "عبد الباسط عبد الصمد",
                country: "EG",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://everyayah.com/data/Abdul_Basit_Murattal_128kbps/"
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
                imam: "الحرم المكي"
            },
            {
                id: "shuraim",
                name: "سعود الشريم",
                country: "SA",
                style: "حدر",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/shur/"
            },
            {
                id: "alafasy",
                name: "مشاري العفاسي",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://everyayah.com/data/Alafasy_128kbps/"
            },
            {
                id: "hudhaify",
                name: "علي الحذيفي",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/hud/"
            },
            {
                id: "maher",
                name: "ماهر المعيقلي",
                country: "SA",
                style: "حدر",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/maher/"
            },
            {
                id: "shatr",
                name: "محمود علي البنا",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/mab/"
            },
            {
                id: "banah",
                name: "سامي الدعيجي",
                country: "SA",
                style: "تحقيق",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/sde/"
            },
            {
                id: "shams",
                name: "محمود خليل الحصري (جودة عالية)",
                country: "EG",
                style: "حدر",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/hus/"
            },
            {
                id: "noor",
                name: "عبد الله البعيجان",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/abb/"
            }
        ],
        
        // 🌍 المقرئين العالميين
        international: [
            {
                id: "bukhatir",
                name: "أبو بكر الشاطري",
                country: "YE",
                style: "تحقيق",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/bkt/"
            },
            {
                id: "jibril",
                name: "محمد أيوب",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/ayb/"
            },
            {
                id: "khushmad",
                name: "أحمد الحذيفي",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/ahd/"
            },
            {
                id: "khalil",
                name: "خليل الحصري",
                country: "EG",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/khh/"
            },
            {
                id: "saad",
                name: "سعد الغامدي",
                country: "SA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/sgg/"
            },
            {
                id: "paquistan",
                name: "قاري عبد الباسط",
                country: "PK",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/"
            },
            {
                id: "indonesia",
                name: "أحمد الجلبان",
                country: "ID",
                style: "حدر",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/ajl/"
            },
            {
                id: "qatar",
                name: "الشيخ محمد الكرتي",
                country: "QA",
                style: "ترتيل",
                rating: 5,
                audio_base: "https://server8.mp3quran.net/mkrt/"
            }
        ]
    },
    
    // نظام ذاكرة التخزين الذكي
    audioCache: {
        maxSize: 500 * 1024 * 1024, // 500MB
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
        
        getQarisByCountry: function(countryCode) {
            return this.getAllQaris().filter(qari => qari.country === countryCode);
        },
        
        getQarisByStyle: function(style) {
            return this.getAllQaris().filter(qari => qari.style === style);
        },
        
        searchQari: function(query) {
            const all = this.getAllQaris();
            return all.filter(qari => 
                qari.name.includes(query) || 
                qari.id.includes(query)
            );
        },
        
        generateAudioUrl: function(qariId, surah, ayah, quality = '128') {
            const qari = this.getAllQaris().find(q => q.id === qariId);
            if (!qari) return null;
            
            const surahStr = surah.toString().padStart(3, '0');
            const ayahStr = ayah.toString().padStart(3, '0');
            
            return qari.audio_base + surahStr + ayahStr + '.mp3';
        }
    }
};

export default QARI_SYSTEM;