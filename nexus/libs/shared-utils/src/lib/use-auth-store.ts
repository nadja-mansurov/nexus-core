import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface AuthState {
  readonly user: string | null;
  readonly status: 'idle' | 'loading' | 'error'; // Required property
  readonly actions: {
    logout: () => void;
    login: (name: string) => void;
  };
}

const useAuthStore = create<AuthState>()(
  devtools(
    immer((set) => ({
      // 1. Initialize the required status property
      user: null,
      status: 'idle', 

      actions: {
        logout: () => 
          set((state) => { 
            state.user = null; 
            state.status = 'idle'; 
          }, false, 'auth/logout'),

        login: (name) =>
          set(
            (state) => {
              // 2. Safely mutate via Immer
              state.user = name;
              state.status = 'idle'; // Reset status on successful login
            },
            false,
            'auth/login' // Label for Redux DevTools
          ),
      },
    }))
  )
);

// Exporting hooks instead of the raw store
export const useUser = () => useAuthStore((state) => state.user);
export const useAuthStatus = () => useAuthStore((state) => state.status);
export const useAuthActions = () => useAuthStore((state) => state.actions);