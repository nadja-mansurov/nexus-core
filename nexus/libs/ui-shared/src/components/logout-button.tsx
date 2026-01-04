'use client'; // This marks it as a Client Component

import { emitLogout } from '@shared/shared-utils';
import { Button } from '@shared/ui-shared';

export function LogoutButton() {
  const handleClick = () => {
    console.log('Button clicked!');
    emitLogout();
  };

  return (
    <Button 
      onClick={handleClick}
    >
      Logout
    </Button>
  );
}