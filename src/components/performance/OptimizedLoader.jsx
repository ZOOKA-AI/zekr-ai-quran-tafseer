import React, { memo } from 'react';

// محمل خفيف جداً ومحسّن
const OptimizedLoader = memo(() => {
  return (
    <div className="fixed inset-0 bg-emerald-500 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-8xl mb-4 animate-pulse">📖</div>
        <p className="text-white text-3xl font-bold">ذكر</p>
      </div>
    </div>
  );
});

export default OptimizedLoader;