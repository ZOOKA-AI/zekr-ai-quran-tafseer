import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function CameraReader() {
  const [isOpen, setIsOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsOpen(true);
    } catch (error) {
      toast.error('لا يمكن الوصول للكاميرا');
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
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      processImage(imageData);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
        setIsOpen(true);
        processImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData) => {
    setIsProcessing(true);
    try {
      // تحويل base64 إلى blob
      const blob = await (await fetch(imageData)).blob();
      
      // رفع الصورة
      const { file_url } = await base44.integrations.Core.UploadFile({ file: blob });
      
      // تحليل الصورة باستخدام AI
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `أنت مساعد قرآني ذكي. انظر للصورة وقم بما يلي:
1. إذا كانت صفحة من القرآن، اقرأ الآيات الموجودة
2. إذا كان كتاب إسلامي، اقرأ النص واشرحه
3. إذا كان سؤال مكتوب، أجب عليه
4. فسر المحتوى بشكل واضح ومفصل`,
        file_urls: [file_url]
      });
      
      setResult(response);
      
      // قراءة النتيجة بصوت
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      toast.error('خطأ في معالجة الصورة');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="flex gap-2">
        <Button
          onClick={startCamera}
          className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white"
        >
          <Camera className="w-4 h-4 ml-2" />
          افتح الكاميرا
        </Button>
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="border-2 border-gradient-to-r from-blue-500 to-teal-500"
        >
          <Upload className="w-4 h-4 ml-2" />
          ارفع صورة
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/95 via-slate-900/95 to-gray-900/95 backdrop-blur-xl border-2 border-cyan-400/50 shadow-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">📷 الكاميرا الذكية</h3>
          <Button
            onClick={stopCamera}
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {!capturedImage ? (
          <div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg mb-4"
            />
            <Button
              onClick={captureImage}
              className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white"
            >
              <Camera className="w-5 h-5 ml-2" />
              التقط صورة
            </Button>
          </div>
        ) : (
          <div>
            <img src={capturedImage} alt="Captured" className="w-full rounded-lg mb-4" />
            
            {isProcessing && (
              <div className="text-center py-4">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-2" />
                <p className="text-cyan-300">جاري قراءة وتحليل الصورة...</p>
              </div>
            )}

            {result && (
              <div className="bg-white/10 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
                <p className="text-cyan-100 leading-relaxed">{result}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setCapturedImage(null);
                  setResult('');
                }}
                variant="outline"
                className="flex-1 border-cyan-400 text-cyan-300 hover:bg-cyan-400/20"
              >
                التقط صورة جديدة
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="flex-1 border-red-400 text-red-300 hover:bg-red-400/20"
              >
                إغلاق
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}