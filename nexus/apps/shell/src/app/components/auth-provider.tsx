'use client'; // This logic is browser-only

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSync } from '@shared/shared-utils';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // We wrap this in useEffect to ensure it only runs in the browser
    const cleanup = useAuthSync(() => {
      router.push('/login');
    });

    return () => cleanup?.(); 
  }, [router]);

  return <>{children}</>;
}