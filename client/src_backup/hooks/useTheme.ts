import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const useTheme = (defaultTheme: Theme = 'dark') => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage or use default
    return (localStorage.getItem('theme') as Theme) || defaultTheme;
  });
  
  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', theme);
    
    // Update document body class
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  return { theme, toggleTheme };
};

export default useTheme;