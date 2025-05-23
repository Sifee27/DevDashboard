"use client";

import React, { useState, useEffect } from 'react';
import { Check, Moon } from 'lucide-react';

export type ThemeOption = 'system' | 'dark' | 'nord-dark' | 'solarized-dark' | 'dracula';

export type ThemeSettings = {
  theme: ThemeOption;
  darkMode: boolean;
};

const themeStyles = {
  'dark': {
    background: '#1a1a1a',
    text: '#ffffff',
    accent: '#8b5cf6'
  },
  'nord-dark': {
    background: '#2e3440',
    text: '#eceff4',
    accent: '#88c0d0'
  },
  'solarized-dark': {
    background: '#002b36',
    text: '#839496',
    accent: '#2aa198'
  },
  'dracula': {
    background: '#282a36',
    text: '#f8f8f2',
    accent: '#bd93f9'
  }
};

type ThemeManagerProps = {
  currentTheme: ThemeOption;
  onThemeChange: (theme: ThemeOption) => void;
  className?: string;
};

export function ThemeManager({ currentTheme, onThemeChange, className = '' }: ThemeManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleThemeChange = (theme: ThemeOption) => {
    onThemeChange(theme);
    setIsOpen(false);
  };

  // Apply theme classes to document element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-nord-dark', 'theme-solarized-dark', 'theme-dracula');
    
    if (currentTheme !== 'system') {
      root.classList.add(`theme-${currentTheme}`);
    }
  }, [currentTheme]);
  
  return (
    <div className={`relative ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
        aria-label="Theme settings"
      >
        <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 p-3 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <h3 className="text-sm font-medium font-mono mb-2" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
            Select Theme
          </h3>
          
          <div className="grid grid-cols-2 gap-2 mb-1">
            {(['dark', 'nord-dark', 'solarized-dark', 'dracula'] as ThemeOption[]).map((theme) => (
              <button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                className={`relative flex flex-col items-center p-2 rounded-md transition-all duration-200 ${
                  currentTheme === theme 
                    ? 'ring-2 ring-violet-500 dark:ring-violet-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div 
                  className="w-full h-8 rounded-sm mb-1.5 border border-gray-300 dark:border-gray-600"
                  style={{ 
                    background: themeStyles[theme].background,
                    borderColor: themeStyles[theme].accent
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    {currentTheme === theme && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-xs font-medium truncate">
                  {theme.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </button>
            ))}
          </div>
          
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
            Theme changes apply immediately and will be saved
          </div>
        </div>
      )}
    </div>
  );
}
