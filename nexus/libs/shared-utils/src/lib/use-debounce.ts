'use client';

import { useRef, useCallback, useEffect } from 'react';

type F = (...args: any[]) => void;

export const useDebounce = (fn: F, delay: number): F => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback(
        (...args: any[]) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                fn(...args);
            }, delay);
        },
        [fn, delay]
    );
};