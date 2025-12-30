'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Direction = 'ltr' | 'rtl';

const ThemeContext = createContext<{ dir: Direction }>({ dir: 'ltr' });

export const ThemeProvider = ({ children, lang }: { children: React.ReactNode, lang: string }) => {
  const [dir, setDir] = useState<Direction>(lang === 'ar' ? 'rtl' : 'ltr');

  useEffect(() => {
    const newDir = lang === 'ar' ? 'rtl' : 'ltr';
    setDir(newDir);
    document.documentElement.dir = newDir;
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <ThemeContext.Provider value={{ dir }}>
      <div className={dir === 'rtl' ? 'font-arabic' : 'font-sans'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};