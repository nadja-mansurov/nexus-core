'use client'; // This marks it as a Client Component

import { emitLogout } from '@shared/shared-utils';

export function LogoutButton() {
  const handleClick = () => {
    console.log('Button clicked!');
    emitLogout();
  };

  return (
    <button 
      onClick={handleClick}
      className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}