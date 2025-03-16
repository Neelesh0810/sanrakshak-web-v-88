
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always default to light theme
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Force light theme as default
    setTheme('light');
    localStorage.setItem('theme', 'light');

    // Apply the theme immediately
    document.documentElement.classList.remove('dark-mode');
    document.documentElement.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    
    // Apply better text contrast - use full black for text in light mode
    document.documentElement.style.setProperty('--foreground', '0 0% 0%');
    document.documentElement.style.setProperty('--card-foreground', '0 0% 0%');
    document.documentElement.style.setProperty('--popover-foreground', '0 0% 0%');
  }, []);

  useEffect(() => {
    // Update document with current theme class
    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.documentElement.classList.add(`${theme}-mode`);
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
