import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RamadanCalendar from '../components/ramadan/RamadanCalendar';
import RamadanContent from '../components/ramadan/RamadanContent';
import KhatmahTracker from '../components/ramadan/KhatmahTracker';

export default function RamadanHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 p-4 md:p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🌙</span>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              مركز رمضان
            </h1>
            <span className="text-5xl">🌙</span>
          </div>
          <p className="text-xl text-gray-700 mb-4">
            رمضان كريم - شهر البركة والطاعات
          </p>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-gray-600"
          >
            كل عام وأنتم بألف خير 💚
          </motion.p>
        </motion.div>

        {/* Main Tabs */}
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white p-1 rounded-lg shadow-lg">
            <TabsTrigger 
              value="calendar"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-md"
            >
              📅 التقويم
            </TabsTrigger>
            <TabsTrigger 
              value="content"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white rounded-md"
            >
              📚 المحتوى
            </TabsTrigger>
            <TabsTrigger 
              value="khatmah"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-md"
            >
              ✨ الختمة
            </TabsTrigger>
          </TabsList>

          {/* Calendar Tab */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="calendar" className="space-y-4">
              <RamadanCalendar />
            </TabsContent>
          </motion.div>

          {/* Content Tab */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="content" className="space-y-4">
              <RamadanContent />
            </TabsContent>
          </motion.div>

          {/* Khatmah Tab */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="khatmah" className="space-y-4">
              <KhatmahTracker />
            </TabsContent>
          </motion.div>
        </Tabs>

        {/* Footer Reminder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-gray-600 text-sm"
        >
          <p>
            "شهر رمضان الذي أنزل فيه القرآن هدى للناس وبينات من الهدى والفرقان"
          </p>
          <p className="mt-2 text-xs opacity-75">البقرة 185</p>
        </motion.div>
      </div>
    </div>
  );
}