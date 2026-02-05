import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Heart, DollarSign, BookOpen, MessageSquare, Settings, Lock, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const currentUser = await base44.auth.me();
      
      // فقط الأدمن يدخل
      if (currentUser.role !== 'admin') {
        toast.error('⛔ غير مصرح لك بالدخول - أدمن فقط');
        navigate(createPageUrl('Home'));
        return;
      }
      
      setUser(currentUser);
      setLoading(false);
    } catch (error) {
      toast.error('⛔ يجب تسجيل الدخول أولاً');
      navigate(createPageUrl('Home'));
    }
  };

  // البيانات
  const { data: orphans = [] } = useQuery({
    queryKey: ['orphans'],
    queryFn: () => base44.entities.Orphan.list(),
    enabled: !!user
  });

  const { data: donations = [] } = useQuery({
    queryKey: ['donations'],
    queryFn: () => base44.entities.Donation.list(),
    enabled: !!user
  });

  const { data: systemLogs = [] } = useQuery({
    queryKey: ['system-logs'],
    queryFn: () => base44.entities.SystemLog.list('-created_date', 50),
    enabled: !!user
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => base44.entities.Bookmark.list(),
    enabled: !!user
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-white text-2xl">⏳ جاري التحقق من الصلاحيات...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const stats = {
    totalOrphans: orphans.length,
    activeOrphans: orphans.filter(o => o.status === 'active').length,
    totalDonations: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
    donationsCount: donations.length,
    recentLogs: systemLogs.length,
    totalBookmarks: bookmarks.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 shadow-2xl border-4 border-amber-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">🔐 لوحة تحكم الأدمن</h1>
                <p className="text-amber-200 text-lg">مرحباً {user?.full_name || 'المشرف'}</p>
              </div>
            </div>
            <Badge className="bg-amber-400 text-gray-900 text-lg px-6 py-2">
              <Lock className="w-5 h-5 ml-2" />
              أدمن
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500 to-green-500 text-white p-6 shadow-xl">
            <Heart className="w-10 h-10 mb-3" />
            <p className="text-4xl font-bold mb-2">{stats.totalOrphans}</p>
            <p className="text-lg">إجمالي الأيتام</p>
            <p className="text-sm opacity-90 mt-1">نشط: {stats.activeOrphans}</p>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6 shadow-xl">
            <DollarSign className="w-10 h-10 mb-3" />
            <p className="text-4xl font-bold mb-2">${stats.totalDonations}</p>
            <p className="text-lg">إجمالي التبرعات</p>
            <p className="text-sm opacity-90 mt-1">عدد: {stats.donationsCount}</p>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 shadow-xl">
            <TrendingUp className="w-10 h-10 mb-3" />
            <p className="text-4xl font-bold mb-2">{stats.recentLogs}</p>
            <p className="text-lg">سجلات النظام</p>
            <p className="text-sm opacity-90 mt-1">آخر 50 إجراء</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => navigate(createPageUrl('OrphansAdmin'))}
            className="h-24 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-bold"
          >
            <div className="text-center">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              إدارة الأيتام
            </div>
          </Button>

          <Button
            onClick={() => navigate(createPageUrl('AdminPanel'))}
            className="h-24 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg font-bold"
          >
            <div className="text-center">
              <Settings className="w-8 h-8 mx-auto mb-2" />
              إعدادات النظام
            </div>
          </Button>

          <Button
            onClick={() => navigate(createPageUrl('Quran'))}
            className="h-24 bg-gradient-to-br from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-lg font-bold"
          >
            <div className="text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              إدارة المحتوى
            </div>
          </Button>

          <Button
            onClick={() => navigate(createPageUrl('Home'))}
            className="h-24 bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-lg font-bold"
          >
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              العودة للرئيسية
            </div>
          </Button>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/95 backdrop-blur-sm p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-purple-600" />
            آخر النشاطات
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {systemLogs.map((log, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge className={`mb-2 ${
                      log.action_type === 'update' ? 'bg-blue-500' :
                      log.action_type === 'prayer' ? 'bg-emerald-500' :
                      log.action_type === 'donation' ? 'bg-amber-500' : 'bg-gray-500'
                    }`}>
                      {log.action_type}
                    </Badge>
                    <p className="text-gray-900 font-semibold">{log.action_details}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {log.platform} • {log.created_by}
                    </p>
                  </div>
                  <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                    {log.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Security Notice */}
        <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 mt-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <Lock className="w-12 h-12" />
            <div>
              <h3 className="text-2xl font-bold mb-2">⚠️ تحذير أمني</h3>
              <p className="text-lg">هذه لوحة تحكم محمية - فقط للمشرفين المصرح لهم</p>
              <p className="text-sm opacity-90 mt-1">Zookaalmrzwq@gmail.com • zaka.ai</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}