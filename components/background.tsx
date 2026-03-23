'use client';

import { useEffect, useState } from 'react';

export function Background() {
  const [backgroundStr, setBackgroundStr] = useState<string>('');

  useEffect(() => {
    // Read initial background
    const stored = localStorage.getItem('settings-background');
    if (stored) {
      setBackgroundStr(stored);
    }

    // Listen to updates
    const handleUpdate = () => {
      const updated = localStorage.getItem('settings-background');
      if (updated) {
        setBackgroundStr(updated);
      }
    };

    window.addEventListener('background-updated', handleUpdate);
    return () => window.removeEventListener('background-updated', handleUpdate);
  }, []);

  return (
    <div 
      className="fixed inset-0 -z-50 bg-cover bg-center bg-no-repeat transition-all duration-500 will-change-transform" 
      style={{ backgroundImage: `url(${backgroundStr})` }}
    />
  );
}
