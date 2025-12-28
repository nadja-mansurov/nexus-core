'use client'; // This marks it as a Client Component

import { emitLogout } from '@shared/shared-utils';

export function LogoutButton() {
  return (
    <button 
      onClick={() => emitLogout()}
      className="px-4 py-2 bg-red-600 text-white rounded"
    >
      Logout
    </button>
  );
}