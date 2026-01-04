'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@shared/shared-utils';
import { Button } from '@shared/ui-shared';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Prevent Hydration Mismatch: 
  // Only show the toggle once the client has loaded the store
  useEffect(() => {
    setMounted(true);
  }, []);

  const onClick = () => {
    toggleTheme();
  };
  
  if (!mounted) {
    return (
      <Button variant="secondary" className="w-10 h-10 opacity-0">
        {/* Empty placeholder with same dimensions */}
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      onClick={onClick}
      aria-label="Toggle Theme"
      className="flex items-center justify-center p-2 rounded-full"
    >
      {theme === 'light' ? (
        <span>🌙 <span className="ms-2">Dark Mode</span></span>
      ) : (
        <span>☀️ <span className="ms-2">Light Mode</span></span>
      )}
    </Button>
  );
}