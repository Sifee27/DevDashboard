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
};

export function VisualSettings({ onChangeAction, className = '' }: VisualSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<VisualSettingsState>({
    enableAnimations: true,
    backgroundStyle: 'code',
    enableMicrointeractions: true,
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
        <div className="absolute right-0 mt-2 w-64 p-3 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="space-y-3">
            <h3 className="text-sm font-medium font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              Visual Settings
            </h3>
            
            <div className="space-y-2">
              <label className="flex items-center justify-between">
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
              
              <div className="pt-1">
                <span className="text-xs text-gray-700 dark:text-gray-300 block mb-1.5">Background style</span>
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
            
            <div className="pt-2 text-[10px] text-gray-500 dark:text-gray-400">
              Changes apply immediately and will be saved for your next visit.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
