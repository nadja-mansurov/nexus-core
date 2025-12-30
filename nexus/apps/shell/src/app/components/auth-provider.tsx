'use client'; // This logic is browser-only

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSync } from '@shared/shared-utils';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Memoize the callback to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    router.push('/login');
  }, [router]);

  // useAuthSync is now a proper React hook, called at the top level
  useAuthSync(handleLogout);

  return <>{children}</>;
}