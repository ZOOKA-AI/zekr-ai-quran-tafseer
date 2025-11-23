import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { trackCameraScan } from '../system/ActionTracker';

export default function CameraScanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
      }
      setIsOpen(true);
      toast.success('تم فتح الكاميرا بنجاح 📷');
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('لا يمكن الوصول للكاميرا - تأكد من السماح بالوصول');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsOpen(false);
    setCapturedImage(null);
    setResult('');
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl);
    processImage(imageDataUrl);
  };

  const processImage = async (imageDataUrl) => {
    setIsProcessing(true);
    try {
      // تحويل base64 إلى blob
      const blob = await fetch(imageDataUrl).then(r => r.blob());
      
      // رفع الصورة
      const { file_url } = await base44.integrations.Core.UploadFile({ file: blob });
      
      // تحليل الصورة بالذكاء الاصطناعي
      const analysisResult = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت خبير في القرآن الكريم والنصوص الإسلامية. 

صدقة جارية لوجه الله تعالى على روح المرحومة: جزبية عبد الرحيم هارون علي
اللهم اغفر لها وارحمها وأدخلها الفردوس الأعلى

انظر لهذه الصورة وقم بما يلي:
1. اقرأ النص العربي الموجود في الصورة (إن وجد)
2. إذا كان النص من القرآن الكريم، اذكر السورة ورقم الآية
3. قدم تفسيراً مختصراً للنص
4. إذا لم يكن النص قرآنياً، حاول التعرف على ماهيته (حديث، دعاء، إلخ)`,
        file_urls: [file_url]
      });
      
      setResult(analysisResult);
      
      // تسجيل المسح بالكاميرا
      trackCameraScan('مسح نص قرآني بالكاميرا وتحليله');
      
      // قراءة النتيجة بالصوت
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(analysisResult);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      toast.error('حدث خطأ في تحليل الصورة');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Button
        onClick={startCamera}
        className="bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 hover:scale-105 transition-all text-white px-4 py-2 rounded-lg shadow-lg"
      >
        <Camera className="w-5 h-5 mr-2" />
        مسح بالكاميرا
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-900 border-white/20 max-w-2xl w-full">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-lg font-bold">📷 مسح النصوص القرآنية</h3>
                <Button onClick={stopCamera} variant="ghost" size="icon">
                  <X className="w-6 h-6 text-white" />
                </Button>
              </div>

              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg mb-4"
                  />
                  <Button
                    onClick={captureImage}
                    className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:scale-105 transition-all"
                  >
                    📸 التقط الصورة
                  </Button>
                </>
              ) : (
                <>
                  <img src={capturedImage} alt="Captured" className="w-full rounded-lg mb-4" />
                  
                  {isProcessing && (
                    <div className="text-center text-white mb-4">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p>جاري التحليل...</p>
                    </div>
                  )}

                  {result && (
                    <div className="bg-white/10 rounded-lg p-4 mb-4 border border-white/20">
                      <p className="text-purple-300 text-sm mb-2 font-bold">النتيجة:</p>
                      <p className="text-white leading-relaxed whitespace-pre-wrap">{result}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setCapturedImage(null);
                        setResult('');
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500"
                    >
                      📸 التقط صورة أخرى
                    </Button>
                    <Button
                      onClick={stopCamera}
                      variant="outline"
                      className="flex-1"
                    >
                      إغلاق
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}