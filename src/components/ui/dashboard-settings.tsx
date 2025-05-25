"use client";

import React, { useState } from 'react';
import { Settings, Layout, Palette } from 'lucide-react';
import { CardManager, CardLayoutSettings } from './card-manager';
import { ThemeOption } from './theme-manager';
import { VisualSettings, VisualSettingsState } from './visual-settings';

type DashboardSettingsProps = {
  onCardLayoutChangeAction: (settings: CardLayoutSettings) => void;
  onThemeChangeAction: (theme: ThemeOption) => void;
  onVisualSettingsChangeAction: (settings: VisualSettingsState) => void;
  currentTheme: ThemeOption;
  initialCardLayout?: CardLayoutSettings;
  // initialVisualSettings is not used but might be needed in future implementations
  className?: string;
};

type SettingsTab = 'cards' | 'theme' | 'visuals';

export function DashboardSettings({
  onCardLayoutChangeAction,
  onThemeChangeAction,
  onVisualSettingsChangeAction,
  currentTheme,
  initialCardLayout, // This is CardLayoutSettings from dashboard/page.tsx, potentially with 'visible'
  className = '',
}: DashboardSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('cards');

  const handleClose = () => {
    setIsOpen(false);
  };

  // Transform initialCardLayout from dashboard/page.tsx to CardManager's expected format
  // This maps 'visible' (from dashboard page state) to 'enabled' (for CardManager)
  // and ensures all properties of CardManager's DashboardCard type are present.
  const cardManagerInitialSettings: CardLayoutSettings | undefined = initialCardLayout ? {
    ...initialCardLayout,
    cards: initialCardLayout.cards.map(cardFromDashboard => ({
      id: cardFromDashboard.id,
      title: cardFromDashboard.title,
      // Explicitly map 'visible' to 'enabled'.
      // The 'visible' property might not exist on cardFromDashboard if it's already in CardManager's format,
      // so we check its type. Fallback to a default if necessary, though 'enabled' should ideally be present.
      enabled: typeof cardFromDashboard.visible === 'boolean' ? cardFromDashboard.visible : true,
      // 'size' and 'description' might not be on cardFromDashboard if it's from older localStorage.
      // CardManager's merging logic will fill these from its defaultCards.
      // For type safety here, we provide defaults, but CardManager will refine this.
      size: cardFromDashboard.size || 'medium', 
      description: cardFromDashboard.description || '',
    }))
  } : undefined;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-gradient-to-br from-violet-50 to-gray-100 hover:from-violet-100 hover:to-gray-200 dark:from-gray-700 dark:to-gray-800 dark:hover:from-violet-900/40 dark:hover:to-gray-700 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 group"
        aria-label="Dashboard settings"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-violet-500/10 dark:bg-violet-500/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          <Settings className="h-5 w-5 text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-300" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-50 duration-1000"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={handleClose}>
          <div 
            className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'cards'
                      ? 'border-b-2 border-violet-500 text-violet-600 dark:text-violet-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('cards')}
                >
                  <div className="flex items-center gap-1.5">
                    <Layout className="h-4 w-4" />
                    <span>Cards</span>
                  </div>
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'theme'
                      ? 'border-b-2 border-violet-500 text-violet-600 dark:text-violet-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('theme')}
                >
                  <div className="flex items-center gap-1.5">
                    <Palette className="h-4 w-4" />
                    <span>Theme</span>
                  </div>
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'visuals'
                      ? 'border-b-2 border-violet-500 text-violet-600 dark:text-violet-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('visuals')}
                >
                  <div className="flex items-center gap-1.5">
                    <Settings className="h-4 w-4" />
                    <span>Visuals</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-4">
              {activeTab === 'cards' && (
                <CardManager
                  onUpdateAction={onCardLayoutChangeAction}
                  initialSettings={cardManagerInitialSettings} // Use the transformed settings
                  onCloseAction={handleClose}
                />
              )}

              {activeTab === 'theme' && (
                <div className="p-2">
                  <h3 className="text-base font-medium mb-4" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                    Select Theme
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(['dark', 'nord-dark', 'solarized-dark', 'dracula'] as ThemeOption[]).map(theme => (
                      <div
                        key={theme}
                        className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                          currentTheme === theme
                            ? 'border-violet-500 ring-2 ring-violet-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => onThemeChangeAction(theme)}
                      >
                        <div 
                          className="h-24 w-full rounded-md mb-2 overflow-hidden"
                          style={{
                            background: theme === 'dark' ? '#1a1a1a' :
                                       theme === 'nord-dark' ? '#2e3440' :
                                       theme === 'solarized-dark' ? '#002b36' :
                                       '#282a36' // dracula
                          }}
                        >
                          <div className="h-6 w-full" style={{
                            background: theme === 'dark' ? '#27272a' :
                                      theme === 'nord-dark' ? '#3b4252' :
                                      theme === 'solarized-dark' ? '#073642' :
                                      '#44475a' // dracula
                          }}></div>
                          
                          <div className="flex justify-between p-2">
                            <div className="w-1/2 h-3 rounded" style={{
                              background: theme === 'dark' ? '#8b5cf6' :
                                        theme === 'nord-dark' ? '#88c0d0' :
                                        theme === 'solarized-dark' ? '#2aa198' :
                                        '#bd93f9' // dracula
                            }}></div>
                            <div className="w-3 h-3 rounded-full" style={{
                              background: theme === 'dark' ? '#f43f5e' :
                                        theme === 'nord-dark' ? '#bf616a' :
                                        theme === 'solarized-dark' ? '#cb4b16' :
                                        '#ff5555' // dracula
                            }}></div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                            {theme.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleClose}
                      className="px-3 py-1.5 rounded-md bg-violet-600 text-white hover:bg-violet-700 transition-colors text-xs font-medium"
                      style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                    >
                      Apply Theme
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'visuals' && (
                <div className="p-2">
                  <h3 className="text-base font-medium mb-4" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                    Visual Effects
                  </h3>
                  <div className="space-y-4 pb-4">
                    <VisualSettings 
                      onSettingsChange={onVisualSettingsChangeAction}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleClose}
                      className="px-3 py-1.5 rounded-md bg-violet-600 text-white hover:bg-violet-700 transition-colors text-xs font-medium"
                      style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
