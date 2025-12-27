// مكون لتسريع الانتقالات بين الصفحات
import React from 'react';

export default function FastTransition({ children }) {
  return (
    <div style={{ 
      transition: 'opacity 0.1s ease',
      willChange: 'opacity'
    }}>
      {children}
    </div>
  );
}