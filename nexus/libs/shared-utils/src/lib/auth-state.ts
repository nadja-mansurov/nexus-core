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
  if (typeof window !== 'undefined') {
    const channel = new BroadcastChannel(AUTH_CHANNEL);
    channel.onmessage = (event) => {
      if (event.data === 'LOGOUT') onLogout();
    };
  }
};