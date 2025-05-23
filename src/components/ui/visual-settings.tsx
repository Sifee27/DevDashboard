"use client";

import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';

type VisualSettingsProps = {
  onChangeAction: (settings: VisualSettingsState) => void; 
  className?: string;
};

export type VisualSettingsState = {
  enableAnimations: boolean;
  backgroundStyle: 'none' | 'code' | 'dots' | 'checkmarks';
  enableMicrointeractions: boolean;
  colorTheme: 'violet' | 'blue' | 'green' | 'amber';
  animationSpeed: 'slow' | 'normal' | 'fast';
  layoutDensity: 'compact' | 'comfortable' | 'spacious';
  contrastMode: 'standard' | 'high';
};

export function VisualSettings({ onChangeAction, className = '' }: VisualSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<VisualSettingsState>({
    enableAnimations: true,
    backgroundStyle: 'code',
    enableMicrointeractions: true,
    colorTheme: 'violet',
    animationSpeed: 'normal',
    layoutDensity: 'comfortable',
    contrastMode: 'standard',
  });

  // Load saved settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('visualSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        onChangeAction(parsed);
      }
    } catch (error) {
      console.error("Failed to load visual settings", error);
    }
  }, [onChangeAction]);

  // Save settings to localStorage when changed
  const updateSettings = (newSettings: Partial<VisualSettingsState>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    // Save to localStorage
    try {
      localStorage.setItem('visualSettings', JSON.stringify(updated));
      onChangeAction(updated);
    } catch (error) {
      console.error("Failed to save visual settings", error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        aria-label="Visual settings"
      >
        <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 p-4 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                Visual Settings
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="border-b dark:border-gray-700 pb-2">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Display</h4>
                
                <label className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-700 dark:text-gray-300">Enable animations</span>
                  <input 
                    type="checkbox" 
                    checked={settings.enableAnimations}
                    onChange={(e) => updateSettings({ enableAnimations: e.target.checked })}
                    className="rounded-sm text-violet-600 focus:ring-violet-500"
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 dark:text-gray-300">Microinteractions</span>
                  <input 
                    type="checkbox" 
                    checked={settings.enableMicrointeractions}
                    onChange={(e) => updateSettings({ enableMicrointeractions: e.target.checked })}
                    className="rounded-sm text-violet-600 focus:ring-violet-500"
                  />
                </label>
              </div>
              
              <div className="border-b dark:border-gray-700 pb-2">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Theme</h4>
                
                <div className="mb-2">
                  <span className="text-xs text-gray-700 dark:text-gray-300 block mb-1.5">Color accent</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['violet', 'blue', 'green', 'amber'] as const).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => updateSettings({ colorTheme: theme })}
                        className={`h-6 rounded-md transition-all ${settings.colorTheme === theme ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500 scale-110' : ''}`}
                        style={{ 
                          backgroundColor: 
                            theme === 'violet' ? '#8b5cf6' : 
                            theme === 'blue' ? '#3b82f6' : 
                            theme === 'green' ? '#10b981' : 
                            '#f59e0b'
                        }}
                        title={theme.charAt(0).toUpperCase() + theme.slice(1)}
                        aria-label={`${theme} color theme`}
                      />
                    ))}
                  </div>
                </div>
                
                <label className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 dark:text-gray-300">High contrast mode</span>
                  <input 
                    type="checkbox" 
                    checked={settings.contrastMode === 'high'}
                    onChange={(e) => updateSettings({ contrastMode: e.target.checked ? 'high' : 'standard' })}
                    className="rounded-sm text-violet-600 focus:ring-violet-500"
                  />
                </label>
              </div>
              
              <div className="border-b dark:border-gray-700 pb-2">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Background</h4>
                
                <div className="mb-2">
                  <span className="text-xs text-gray-700 dark:text-gray-300 block mb-1.5">Style</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['none', 'code', 'dots', 'checkmarks'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateSettings({ backgroundStyle: style })}
                        className={`text-xs px-2 py-1 rounded-md transition-colors ${
                          settings.backgroundStyle === style
                            ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        } border`}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="border-b dark:border-gray-700 pb-2">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Layout & Animation</h4>
                
                <div className="mb-2">
                  <span className="text-xs text-gray-700 dark:text-gray-300 block mb-1.5">Animation speed</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['slow', 'normal', 'fast'] as const).map((speed) => (
                      <button
                        key={speed}
                        onClick={() => updateSettings({ animationSpeed: speed })}
                        className={`text-xs px-2 py-1 rounded-md transition-colors ${
                          settings.animationSpeed === speed
                            ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        } border`}
                      >
                        {speed.charAt(0).toUpperCase() + speed.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-xs text-gray-700 dark:text-gray-300 block mb-1.5">Layout density</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['compact', 'comfortable', 'spacious'] as const).map((density) => (
                      <button
                        key={density}
                        onClick={() => updateSettings({ layoutDensity: density })}
                        className={`text-xs px-2 py-1 rounded-md transition-colors ${
                          settings.layoutDensity === density
                            ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        } border`}
                      >
                        {density.charAt(0).toUpperCase() + density.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-3 flex items-center justify-between">
              <div className="text-[10px] text-gray-500 dark:text-gray-400">
                Settings saved automatically
              </div>
              <button
                onClick={() => {
                  const defaultSettings: VisualSettingsState = {
                    enableAnimations: true,
                    backgroundStyle: 'code',
                    enableMicrointeractions: true,
                    colorTheme: 'violet',
                    animationSpeed: 'normal',
                    layoutDensity: 'comfortable',
                    contrastMode: 'standard',
                  };
                  setSettings(defaultSettings);
                  localStorage.setItem('visualSettings', JSON.stringify(defaultSettings));
                  onChangeAction(defaultSettings);
                }}
                className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
              >
                Reset to defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
