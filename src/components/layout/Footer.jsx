import React from 'react';

export default function Footer() {
  return (
    <footer className="relative mt-8 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        <div className="text-center">
          <p className="text-lg mb-2 font-arabic text-white">﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾</p>
          <p className="text-amber-200 mb-3 text-sm">اللهم اجعلنا من أهل القرآن وخاصته</p>

          <div className="text-xs text-amber-200 mb-2">
            🤲 صدقة جارية • جزبية عبد الرحيم هارون علي
          </div>
          <div className="text-xs text-white mb-2">
            مجاني بالكامل • zaka.ai
          </div>
          <div className="text-xs text-amber-300">
            © 2024 القرآن الكريم
          </div>
        </div>
      </div>
    </footer>
  );
}