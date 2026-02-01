import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareTilawaButton({ surahNumber, reciterName, surahName }) {
  const [showDialog, setShowDialog] = useState(false);
  const [note, setNote] = useState('');
  const [userName, setUserName] = useState('');

  const handleShare = () => {
    if (!userName.trim()) {
      toast.error('الرجاء إدخال اسمك');
      return;
    }

    const shareData = {
      surah_number: surahNumber,
      reciter_name: reciterName,
      shared_by: userName,
      note: note,
      created_date: new Date().toISOString(),
      likes_count: 0,
      listens_count: 0
    };

    // حفظ في localStorage
    const savedShares = JSON.parse(localStorage.getItem('sharedTilawat') || '[]');
    savedShares.unshift(shareData);
    localStorage.setItem('sharedTilawat', JSON.stringify(savedShares));

    toast.success('تم مشاركة التلاوة بنجاح! 🎧');
    setShowDialog(false);
    setNote('');
    setUserName('');
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        variant="outline"
        className="bg-blue-500 hover:bg-blue-600 text-white border-0"
      >
        <Share2 className="w-4 h-4 ml-2" />
        مشاركة التلاوة
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl">مشاركة التلاوة</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <p className="text-emerald-800 font-bold">{surahName}</p>
              <p className="text-sm text-emerald-600">القارئ: {reciterName}</p>
            </div>

            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="اسمك"
              className="text-lg"
            />

            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="أضف ملاحظة أو رسالة (اختياري)..."
              className="h-24"
            />

            <Button onClick={handleShare} className="w-full bg-blue-500 hover:bg-blue-600">
              <Share2 className="w-4 h-4 ml-2" />
              مشاركة مع المجتمع
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}