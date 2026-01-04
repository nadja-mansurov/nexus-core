'use client';

import { useUser, useAuthStatus } from '@shared/shared-utils';
import { ThemeToggle } from './toggle-theme';
import { LogoutButton } from './logout-button';

export function UserHeader() {
  const user = useUser();
  const status = useAuthStatus();

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <header>
      {user ? <span>Welcome, {user}!</span> : <span>Please Log In</span>}
      
      {user && <LogoutButton /> }
      <ThemeToggle />
    </header>
  );
}