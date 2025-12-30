'use client';

import { useEffect } from 'react';

const AUTH_CHANNEL = 'auth_stream';

export const emitLogout = () => {
  if (typeof window !== 'undefined') {
    // 1. Clear local data
    localStorage.removeItem('user');
    
    // 2. Tell everyone else to log out
    const channel = new BroadcastChannel(AUTH_CHANNEL);
    channel.postMessage('LOGOUT');
    channel.close(); // Clean up the connection
  }
};

export const useAuthSync = (onLogout: () => void) => {
  useEffect(() => {
    // Only set up in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const channel = new BroadcastChannel(AUTH_CHANNEL);
    channel.onmessage = (event) => {
      if (event.data === 'LOGOUT') {
        onLogout();
      }
    };

    // Cleanup function to close the channel
    return () => {
      channel.close();
    };
  }, [onLogout]);
};