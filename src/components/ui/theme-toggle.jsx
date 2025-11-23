import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <Button
      onClick={() => setIsDark(!isDark)}
      variant="ghost"
      size="icon"
      className="fixed top-24 left-6 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-full w-12 h-12 hover:scale-110 transition-all"
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-amber-500" />
      ) : (
        <Moon className="w-6 h-6 text-indigo-600" />
      )}
    </Button>
  );
}