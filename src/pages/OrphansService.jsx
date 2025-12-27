import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Users, DollarSign, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import OrphanBot from '../components/orphans/OrphanBot';

export default function OrphansServicePage() {
  const [activeTab, setActiveTab] = useState('register');
  const [orphanForm, setOrphanForm] = useState({});
  const [donationForm, setDonationForm] = useState({});
  const [requestForm, setRequestForm] = useState({});
  const [orphans, setOrphans] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const savedOrphans = localStorage.getItem('orphans');
    if (savedOrphans) setOrphans(JSON.parse(savedOrphans));
    
    const savedDonations = localStorage.getItem('donations');
    if (savedDonations) setDonations(JSON.parse(savedDonations));
  }, []);

  const registerOrphan = () => {
    const orphan = { ...orphanForm, id: Date.now().toString(), status: 'pending', created_date: new Date().toISOString() };
    const updated = [...orphans, orphan];
    setOrphans(updated);
    localStorage.setItem('orphans', JSON.stringify(updated));
    toast.success('🤲 تم تسجيل اليتيم بنجاح - جزاك الله خيراً');
    setOrphanForm({});
  };

  const registerDonation = () => {
    const donation = { ...donationForm, id: Date.now().toString(), status: 'pending', created_date: new Date().toISOString() };
    const updated = [...donations, donation];
    setDonations(updated);
    localStorage.setItem('donations', JSON.stringify(updated));
    toast.success('💚 تم تسجيل التبرع - بارك الله فيك');
    setDonationForm({});
  };

  const registerRequest = () => {
    toast.success('📋 تم إرسال الطلب بنجاح');
    setRequestForm({});
  };

  const stats = {
    totalOrphans: orphans.length,
    activeOrphans: orphans.filter(o => o.status === 'active').length,
    totalDonations: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
    donorsCount: donations.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full shadow-2xl mb-6">
            <Heart className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">خدمة أيتام الأمة الإسلامية</h1>
          <p className="text-2xl text-emerald-600 font-bold mb-4">﴿ وَيَسْأَلُونَكَ عَنِ الْيَتَامَىٰ قُلْ إِصْلَاحٌ لَّهُمْ خَيْرٌ ﴾</p>
          <p className="text-lg text-gray-700">صدقة جارية لوجه الله تعالى 🤲</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-6 shadow-xl">
            <Users className="w-12 h-12 mb-3" />
            <p className="text-3xl font-bold mb-2">{stats.totalOrphans}</p>
            <p className="text-sm">إجمالي الأيتام</p>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 shadow-xl">
            <CheckCircle className="w-12 h-12 mb-3" />
            <p className="text-3xl font-bold mb-2">{stats.activeOrphans}</p>
            <p className="text-sm">الأيتام النشطين</p>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6 shadow-xl">
            <DollarSign className="w-12 h-12 mb-3" />
            <p className="text-3xl font-bold mb-2">${stats.totalDonations}</p>
            <p className="text-sm">إجمالي التبرعات</p>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 shadow-xl">
            <Heart className="w-12 h-12 mb-3" />
            <p className="text-3xl font-bold mb-2">{stats.donorsCount}</p>
            <p className="text-sm">عدد المتبرعين</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap justify-center">
          <Button
            onClick={() => setActiveTab('register')}
            className={`${activeTab === 'register' ? 'bg-emerald-600' : 'bg-gray-300'} text-white px-6 py-3`}
          >
            📝 تسجيل يتيم
          </Button>
          <Button
            onClick={() => setActiveTab('donate')}
            className={`${activeTab === 'donate' ? 'bg-amber-600' : 'bg-gray-300'} text-white px-6 py-3`}
          >
            💰 تبرع الآن
          </Button>
          <Button
            onClick={() => setActiveTab('request')}
            className={`${activeTab === 'request' ? 'bg-blue-600' : 'bg-gray-300'} text-white px-6 py-3`}
          >
            📋 طلب مساعدة
          </Button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forms */}
          <div className="lg:col-span-2">
            {activeTab === 'register' && (
              <Card className="p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Users className="w-8 h-8 text-emerald-600" />
                  تسجيل يتيم جديد
                </h2>
                <div className="space-y-4">
                  <Input
                    placeholder="الاسم الكامل *"
                    value={orphanForm.full_name || ''}
                    onChange={(e) => setOrphanForm({...orphanForm, full_name: e.target.value})}
                    className="h-12 text-lg"
                  />
                  <Input
                    type="number"
                    placeholder="العمر *"
                    value={orphanForm.age || ''}
                    onChange={(e) => setOrphanForm({...orphanForm, age: Number(e.target.value)})}
                    className="h-12 text-lg"
                  />
                  <Input
                    placeholder="اسم الوصي *"
                    value={orphanForm.guardian_name || ''}
                    onChange={(e) => setOrphanForm({...orphanForm, guardian_name: e.target.value})}
                    className="h-12 text-lg"
                  />
                  <Input
                    placeholder="رقم هاتف الوصي *"
                    value={orphanForm.guardian_phone || ''}
                    onChange={(e) => setOrphanForm({...orphanForm, guardian_phone: e.target.value})}
                    className="h-12 text-lg"
                  />
                  <Textarea
                    placeholder="العنوان الكامل *"
                    value={orphanForm.address || ''}
                    onChange={(e) => setOrphanForm({...orphanForm, address: e.target.value})}
                    className="h-24 text-lg"
                  />
                  <Input
                    placeholder="الدولة *"
                    value={orphanForm.country || ''}
                    onChange={(e) => setOrphanForm({...orphanForm, country: e.target.value})}
                    className="h-12 text-lg"
                  />
                  <Input
                    type="number"
                    placeholder="الاحتياجات الشهرية (بالدولار) *"
                    value={orphanForm.monthly_needs || ''}
                    onChange={(e) => setOrphanForm({...orphanForm, monthly_needs: Number(e.target.value)})}
                    className="h-12 text-lg"
                  />
                  <Select value={orphanForm.transfer_method || ''} onValueChange={(v) => setOrphanForm({...orphanForm, transfer_method: v})}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="طريقة التحويل *" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vodafone_cash">📱 فودافون كاش</SelectItem>
                      <SelectItem value="bank_transfer">🏦 تحويل بنكي</SelectItem>
                      <SelectItem value="iban">💳 IBAN</SelectItem>
                      <SelectItem value="ai_transfer">🤖 تحويل عبر AI</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="رقم الحساب / المحفظة *"
                    value={orphanForm.account_number || ''}
                    onChange={(e) => setOrphanForm({...orphanForm, account_number: e.target.value})}
                    className="h-12 text-lg"
                  />
                  {orphanForm.transfer_method === 'bank_transfer' && (
                    <Input
                      placeholder="اسم البنك"
                      value={orphanForm.bank_name || ''}
                      onChange={(e) => setOrphanForm({...orphanForm, bank_name: e.target.value})}
                      className="h-12 text-lg"
                    />
                  )}
                  {orphanForm.transfer_method === 'iban' && (
                    <Input
                      placeholder="رقم IBAN"
                      value={orphanForm.iban || ''}
                      onChange={(e) => setOrphanForm({...orphanForm, iban: e.target.value})}
                      className="h-12 text-lg"
                    />
                  )}
                  <Textarea
                    placeholder="ملاحظات إضافية"
                    value={orphanForm.notes || ''}
                    onChange={(e) => setOrphanForm({...orphanForm, notes: e.target.value})}
                    className="h-24 text-lg"
                  />
                  <Button
                    onClick={registerOrphan}
                    className="w-full h-14 text-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                  >
                    <Send className="w-6 h-6 ml-2" />
                    تسجيل اليتيم
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'donate' && (
              <Card className="p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-amber-600" />
                  تبرع لأيتام المسلمين
                </h2>
                <div className="space-y-4">
                  <Input
                    placeholder="الاسم (اختياري)"
                    value={donationForm.donor_name || ''}
                    onChange={(e) => setDonationForm({...donationForm, donor_name: e.target.value})}
                    className="h-12 text-lg"
                  />
                  <Input
                    type="email"
                    placeholder="البريد الإلكتروني (اختياري)"
                    value={donationForm.donor_email || ''}
                    onChange={(e) => setDonationForm({...donationForm, donor_email: e.target.value})}
                    className="h-12 text-lg"
                  />
                  <Input
                    placeholder="رقم الهاتف (اختياري)"
                    value={donationForm.donor_phone || ''}
                    onChange={(e) => setDonationForm({...donationForm, donor_phone: e.target.value})}
                    className="h-12 text-lg"
                  />
                  <Input
                    type="number"
                    placeholder="المبلغ (بالدولار) *"
                    value={donationForm.amount || ''}
                    onChange={(e) => setDonationForm({...donationForm, amount: Number(e.target.value)})}
                    className="h-12 text-lg"
                  />
                  <Select value={donationForm.payment_method || ''} onValueChange={(v) => setDonationForm({...donationForm, payment_method: v})}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="طريقة الدفع *" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vodafone_cash">📱 فودافون كاش</SelectItem>
                      <SelectItem value="bank_transfer">🏦 تحويل بنكي</SelectItem>
                      <SelectItem value="iban">💳 IBAN</SelectItem>
                      <SelectItem value="ai_transfer">🤖 تحويل AI</SelectItem>
                      <SelectItem value="other">💰 أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="رقم العملية (Transaction ID)"
                    value={donationForm.transaction_id || ''}
                    onChange={(e) => setDonationForm({...donationForm, transaction_id: e.target.value})}
                    className="h-12 text-lg"
                  />
                  <Select value={donationForm.donation_type || 'general'} onValueChange={(v) => setDonationForm({...donationForm, donation_type: v})}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="نوع التبرع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">💚 تبرع عام</SelectItem>
                      <SelectItem value="specific_orphan">👤 تبرع ليتيم محدد</SelectItem>
                      <SelectItem value="monthly">📅 تبرع شهري</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4">
                    <p className="text-emerald-800 font-bold text-center">
                      🤲 جزاك الله خيراً على دعمك لأيتام المسلمين
                    </p>
                  </div>
                  <Button
                    onClick={registerDonation}
                    className="w-full h-14 text-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    <Heart className="w-6 h-6 ml-2" />
                    تأكيد التبرع
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'request' && (
              <Card className="p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                  تسجيل طلب مساعدة
                </h2>
                <div className="space-y-4">
                  <Select value={requestForm.request_type || ''} onValueChange={(v) => setRequestForm({...requestForm, request_type: v})}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="نوع الطلب *" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent_need">🚨 احتياج عاجل</SelectItem>
                      <SelectItem value="medical">🏥 علاج طبي</SelectItem>
                      <SelectItem value="education">📚 تعليم</SelectItem>
                      <SelectItem value="housing">🏠 سكن</SelectItem>
                      <SelectItem value="food">🍲 طعام</SelectItem>
                      <SelectItem value="clothing">👕 ملابس</SelectItem>
                      <SelectItem value="other">📋 أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="وصف الطلب بالتفصيل *"
                    value={requestForm.description || ''}
                    onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                    className="h-32 text-lg"
                  />
                  <Input
                    type="number"
                    placeholder="المبلغ المطلوب (بالدولار) *"
                    value={requestForm.amount_needed || ''}
                    onChange={(e) => setRequestForm({...requestForm, amount_needed: Number(e.target.value)})}
                    className="h-12 text-lg"
                  />
                  <Select value={requestForm.urgency || 'medium'} onValueChange={(v) => setRequestForm({...requestForm, urgency: v})}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="درجة الأهمية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 منخفضة</SelectItem>
                      <SelectItem value="medium">🟡 متوسطة</SelectItem>
                      <SelectItem value="high">🟠 عالية</SelectItem>
                      <SelectItem value="critical">🔴 حرجة</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={registerRequest}
                    className="w-full h-14 text-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Send className="w-6 h-6 ml-2" />
                    إرسال الطلب
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Bot Assistant */}
          <div>
            <OrphanBot />
          </div>
        </div>
      </div>
    </div>
  );
}