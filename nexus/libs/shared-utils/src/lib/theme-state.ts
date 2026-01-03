export const getTheme = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('user-theme') || 'light';
    }
    return 'light';
};

export const setTheme = (theme: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user-theme', theme);
    window.dispatchEvent(new Event('theme-changed'));
  }
};