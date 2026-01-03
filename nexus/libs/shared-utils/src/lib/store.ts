'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTheme, setTheme as setThemeStorage } from './theme-state';

export const useThemeStore = () => {
    const [theme, setThemeState] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return getTheme();
        }
        return 'light';
    });

    // Sync with localStorage changes from other tabs/windows
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const handleThemeChange = () => {
            setThemeState(getTheme());
        };

        // Listen for theme changes
        window.addEventListener('theme-changed', handleThemeChange);

        // Also listen for storage events (cross-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'user-theme' || e.key === 'theme') {
                handleThemeChange();
            }
        });

        return () => {
            window.removeEventListener('theme-changed', handleThemeChange);
        };
    }, []);

    const setTheme = useCallback((newTheme: string) => {
        setThemeStorage(newTheme);
        setThemeState(newTheme);
    }, []);

    return {
        theme,
        setTheme,
    };
};