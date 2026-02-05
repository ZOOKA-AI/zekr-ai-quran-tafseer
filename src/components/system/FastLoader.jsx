import React from 'react';

/**
 * محمل سريع - يظهر فوراً ويختفي بسرعة
 */
export default function FastLoader() {
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShow(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-6xl animate-pulse">⏳</div>
    </div>
  );
}