export const getTheme = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('user-theme') || 'light';
    }
    return 'light';
};

export const setTheme = (theme: string) => {
  localStorage.setItem('theme', theme);

  window.dispatchEvent(new Event('theme-changed'));
};