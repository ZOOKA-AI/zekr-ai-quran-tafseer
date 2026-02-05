import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, DollarSign, Send, CheckCircle, XCircle, Clock, CreditCard, Phone } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function OrphansAdminPage() {
  const [activeTab, setActiveTab] = useState('orphans');
  const [bankAccount, setBankAccount] = useState({});
  const [transferData, setTransferData] = useState({});
  const queryClient = useQueryClient();

  // البيانات
  const { data: orphans = [] } = useQuery({
    queryKey: ['orphans'],
    queryFn: () => base44.entities.Orphan.list()
  });

  const { data: donations = [] } = useQuery({
    queryKey: ['donations'],
    queryFn: () => base44.entities.Donation.list()
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['orphan-requests'],
    queryFn: () => base44.entities.OrphanRequest.list()
  });

  const { data: bankAccounts = [] } = useQuery({
    queryKey: ['bank-accounts'],
    queryFn: () => base44.entities.AdminBankAccount.list()
  });

  // تحديث حالة اليتيم
  const updateOrphanMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Orphan.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['orphans']);
      toast.success('تم تحديث البيانات');
    }
  });

  // تحديث حالة التبرع
  const updateDonationMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Donation.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['donations']);
      toast.success('تم تحديث حالة التبرع');
    }
  });

  // تحديث حالة الطلب
  const updateRequestMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.OrphanRequest.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['orphan-requests']);
      toast.success('تم تحديث حالة الطلب');
    }
  });

  // حفظ الحساب البنكي
  const saveBankAccountMutation = useMutation({
    mutationFn: (data) => base44.entities.AdminBankAccount.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['bank-accounts']);
      toast.success('تم حفظ الحساب البنكي');
      setBankAccount({});
    }
  });

  // تحويل للمستفيد
  const transferMutation = useMutation({
    mutationFn: async ({ orphanId, amount, method }) => {
      const orphan = orphans.find(o => o.id === orphanId);
      const newTotal = (orphan.total_received || 0) + amount;
      
      await base44.entities.Orphan.update(orphanId, {
        total_received: newTotal,
        last_transfer_date: new Date().toISOString()
      });

      toast.success(`✅ تم تحويل $${amount} بنجاح`);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['orphans']);
      setTransferData({});
    }
  });

  const stats = {
    pendingOrphans: orphans.filter(o => o.status === 'pending').length,
    activeOrphans: orphans.filter(o => o.status === 'active').length,
    pendingDonations: donations.filter(d => d.status === 'pending').length,
    confirmedDonations: donations.filter(d => d.status === 'confirmed').length,
    totalDonations: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
    totalTransferred: orphans.reduce((sum, o) => sum + (o.total_received || 0), 0),
    balance: donations.reduce((sum, d) => sum + (d.amount || 0), 0) - orphans.reduce((sum, o) => sum + (o.total_received || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة إدارة خدمة الأيتام</h1>
          <p className="text-gray-600">إدارة الأيتام والتبرعات والطلبات</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-6">
            <DollarSign className="w-10 h-10 mb-2" />
            <p className="text-3xl font-bold mb-1">${stats.totalDonations}</p>
            <p className="text-sm">إجمالي التبرعات</p>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6">
            <Send className="w-10 h-10 mb-2" />
            <p className="text-3xl font-bold mb-1">${stats.totalTransferred}</p>
            <p className="text-sm">المحول للأيتام</p>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6">
            <CreditCard className="w-10 h-10 mb-2" />
            <p className="text-3xl font-bold mb-1">${stats.balance}</p>
            <p className="text-sm">الرصيد المتاح</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <Button onClick={() => setActiveTab('orphans')} className={activeTab === 'orphans' ? 'bg-emerald-600' : 'bg-gray-300'}>
            👤 الأيتام ({orphans.length})
          </Button>
          <Button onClick={() => setActiveTab('donations')} className={activeTab === 'donations' ? 'bg-amber-600' : 'bg-gray-300'}>
            💰 التبرعات ({donations.length})
          </Button>
          <Button onClick={() => setActiveTab('requests')} className={activeTab === 'requests' ? 'bg-blue-600' : 'bg-gray-300'}>
            📋 الطلبات ({requests.length})
          </Button>
          <Button onClick={() => setActiveTab('bank')} className={activeTab === 'bank' ? 'bg-purple-600' : 'bg-gray-300'}>
            🏦 الحساب البنكي
          </Button>
          <Button onClick={() => setActiveTab('transfer')} className={activeTab === 'transfer' ? 'bg-pink-600' : 'bg-gray-300'}>
            💸 تحويل أموال
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'orphans' && (
          <div className="space-y-4">
            {orphans.map(orphan => (
              <Card key={orphan.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{orphan.full_name}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><strong>العمر:</strong> {orphan.age} سنة</p>
                      <p><strong>الوصي:</strong> {orphan.guardian_name}</p>
                      <p><strong>الهاتف:</strong> {orphan.guardian_phone}</p>
                      <p><strong>الدولة:</strong> {orphan.country}</p>
                      <p><strong>الاحتياج الشهري:</strong> ${orphan.monthly_needs}</p>
                      <p><strong>المستلم:</strong> ${orphan.total_received || 0}</p>
                    </div>
                    <Badge className={`mt-2 ${
                      orphan.status === 'active' ? 'bg-green-500' :
                      orphan.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}>
                      {orphan.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateOrphanMutation.mutate({ id: orphan.id, data: { status: 'active', verified: true } })}
                      className="bg-green-500 hover:bg-green-600"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => updateOrphanMutation.mutate({ id: orphan.id, data: { status: 'completed' } })}
                      className="bg-red-500 hover:bg-red-600"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="space-y-4">
            {donations.map(donation => (
              <Card key={donation.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {donation.is_anonymous ? '🎭 متبرع مجهول' : donation.donor_name || 'متبرع'}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><strong>المبلغ:</strong> ${donation.amount}</p>
                      <p><strong>الطريقة:</strong> {donation.payment_method}</p>
                      <p><strong>النوع:</strong> {donation.donation_type}</p>
                      <p><strong>العملية:</strong> {donation.transaction_id || 'غير محدد'}</p>
                    </div>
                    <Badge className={`mt-2 ${
                      donation.status === 'confirmed' ? 'bg-green-500' :
                      donation.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}>
                      {donation.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateDonationMutation.mutate({ id: donation.id, data: { status: 'confirmed' } })}
                      className="bg-green-500 hover:bg-green-600"
                      size="sm"
                    >
                      تأكيد
                    </Button>
                    <Button
                      onClick={() => updateDonationMutation.mutate({ id: donation.id, data: { status: 'transferred' } })}
                      className="bg-blue-500 hover:bg-blue-600"
                      size="sm"
                    >
                      تم التحويل
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-4">
            {requests.map(request => (
              <Card key={request.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{request.request_type}</h3>
                    <p className="text-gray-700 mb-2">{request.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><strong>المبلغ:</strong> ${request.amount_needed}</p>
                      <p><strong>الأهمية:</strong> {request.urgency}</p>
                    </div>
                    <Badge className={`mt-2 ${
                      request.status === 'fulfilled' ? 'bg-green-500' :
                      request.status === 'approved' ? 'bg-blue-500' :
                      request.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {request.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateRequestMutation.mutate({ id: request.id, data: { status: 'approved' } })}
                      className="bg-green-500 hover:bg-green-600"
                      size="sm"
                    >
                      قبول
                    </Button>
                    <Button
                      onClick={() => updateRequestMutation.mutate({ id: request.id, data: { status: 'fulfilled', fulfilled_date: new Date().toISOString() } })}
                      className="bg-blue-500 hover:bg-blue-600"
                      size="sm"
                    >
                      تنفيذ
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'bank' && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">إعداد الحساب البنكي</h2>
            <div className="space-y-4">
              <Input
                placeholder="اسم الحساب"
                value={bankAccount.account_name || ''}
                onChange={(e) => setBankAccount({...bankAccount, account_name: e.target.value})}
              />
              <Input
                placeholder="اسم البنك"
                value={bankAccount.bank_name || ''}
                onChange={(e) => setBankAccount({...bankAccount, bank_name: e.target.value})}
              />
              <Input
                placeholder="رقم الحساب"
                value={bankAccount.account_number || ''}
                onChange={(e) => setBankAccount({...bankAccount, account_number: e.target.value})}
              />
              <Input
                placeholder="رقم IBAN"
                value={bankAccount.iban || ''}
                onChange={(e) => setBankAccount({...bankAccount, iban: e.target.value})}
              />
              <Input
                placeholder="كود SWIFT"
                value={bankAccount.swift_code || ''}
                onChange={(e) => setBankAccount({...bankAccount, swift_code: e.target.value})}
              />
              <Input
                placeholder="رقم فودافون كاش"
                value={bankAccount.vodafone_cash || ''}
                onChange={(e) => setBankAccount({...bankAccount, vodafone_cash: e.target.value})}
              />
              <Button
                onClick={() => saveBankAccountMutation.mutate(bankAccount)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              >
                حفظ الحساب
              </Button>
            </div>

            {bankAccounts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">الحسابات المحفوظة</h3>
                {bankAccounts.map(acc => (
                  <Card key={acc.id} className="p-4 mb-4">
                    <p><strong>{acc.account_name}</strong> - {acc.bank_name}</p>
                    <p className="text-sm text-gray-600">الرصيد: ${acc.balance || 0}</p>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'transfer' && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">تحويل أموال للمستفيدين</h2>
            <div className="space-y-4">
              <Select value={transferData.orphanId || ''} onValueChange={(v) => setTransferData({...transferData, orphanId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر اليتيم" />
                </SelectTrigger>
                <SelectContent>
                  {orphans.filter(o => o.status === 'active').map(orphan => (
                    <SelectItem key={orphan.id} value={orphan.id}>
                      {orphan.full_name} - {orphan.transfer_method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="المبلغ"
                value={transferData.amount || ''}
                onChange={(e) => setTransferData({...transferData, amount: Number(e.target.value)})}
              />
              <Select value={transferData.method || ''} onValueChange={(v) => setTransferData({...transferData, method: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="طريقة التحويل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vodafone_cash">📱 فودافون كاش</SelectItem>
                  <SelectItem value="bank_transfer">🏦 تحويل بنكي</SelectItem>
                  <SelectItem value="iban">💳 IBAN</SelectItem>
                  <SelectItem value="ai_transfer">🤖 تحويل AI</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => transferMutation.mutate(transferData)}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500"
                disabled={!transferData.orphanId || !transferData.amount}
              >
                <Send className="w-5 h-5 ml-2" />
                تحويل الآن
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}