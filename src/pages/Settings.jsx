import React from 'react';
import BackgroundSelector from '../components/settings/BackgroundSelector';
import UserPreferences from '../components/settings/UserPreferences';
import DailyNotifications from '../components/notifications/DailyNotifications';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
            <SettingsIcon className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">الإعدادات</h1>
          <p className="text-gray-700 text-lg">خصص تجربتك كما تحب</p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* Background Selector */}
          <BackgroundSelector />

          {/* User Preferences */}
          <UserPreferences />

          {/* Daily Notifications */}
          <DailyNotifications />
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">تطبيق زَكْر</h3>
            <p className="text-gray-700 mb-2">منصة قرآنية شاملة</p>
            <p className="text-gray-600 text-sm">الإصدار 2.0.0</p>
            <p className="text-emerald-600 font-bold mt-4">
              🤲 صدقة جارية على روح جزبية عبد الرحيم هارون علي
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}