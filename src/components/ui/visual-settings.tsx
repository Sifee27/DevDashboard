"use client";

import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { createPortal } from 'react-dom';

type VisualSettingsProps = {
  onSettingsChange: (settings: VisualSettingsState) => void; // Changed from onChangeAction
  className?: string;
};

export type VisualSettingsState = {
  enableAnimations: boolean;
  backgroundStyle: 'none' | 'code' | 'dots' | 'checkmarks' | 'particles' | 'matrix';
  enableMicrointeractions: boolean;
  colorTheme: 'violet' | 'blue' | 'green' | 'amber' | 'rose' | 'cyan' | 'orange' | 'emerald';
  animationSpeed: 'slow' | 'normal' | 'fast';
  layoutDensity: 'compact' | 'comfortable' | 'spacious';
  contrastMode: 'standard' | 'high';
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
  cardShadow: 'none' | 'subtle' | 'medium' | 'strong' | 'glow';
  fontFamily: 'system' | 'mono' | 'sans' | 'serif';
  cardStyle: 'flat' | 'elevated' | 'outlined' | 'glass' | 'gradient';
  spacing: 'tight' | 'normal' | 'relaxed';
};

export function VisualSettings({ onSettingsChange, className = '' }: VisualSettingsProps) { // Changed from onChangeAction
  const [isOpen, setIsOpen] = useState(false); const [settings, setSettings] = useState<VisualSettingsState>({
    enableAnimations: true,
    backgroundStyle: 'code',
    enableMicrointeractions: true,
    colorTheme: 'violet',
    animationSpeed: 'normal',
    layoutDensity: 'comfortable',
    contrastMode: 'standard',
    borderRadius: 'medium',
    cardShadow: 'medium',
    fontFamily: 'system',
    cardStyle: 'elevated',
    spacing: 'normal',
  });
  const [isMounted, setIsMounted] = useState(false);

  // Mount state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('visualSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        onSettingsChange(parsed); // Changed from onChangeAction
      }
    } catch (error) {
      console.error("Failed to load visual settings", error);
    }
  }, [onSettingsChange]);

  // Save settings to localStorage when changed
  const updateSettings = (newSettings: Partial<VisualSettingsState>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    // Save to localStorage
    try {
      localStorage.setItem('visualSettings', JSON.stringify(updated));
      onSettingsChange(updated); // Changed from onChangeAction
    } catch (error) {
      console.error("Failed to save visual settings", error);
    }
  };

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });

  // Update button position when opening the popup
  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        aria-label="Visual settings"
      >
        <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>

      {isMounted && isOpen && createPortal(
        <>
          {/* Overlay for backdrop and capturing clicks */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 backdrop-blur-[2px] z-[9998]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Popup panel - positioned absolutely with high z-index */}
          <div
            className="fixed w-72 p-4 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 z-[9999] max-h-[80vh] overflow-y-auto"
            style={{
              top: `${buttonPosition.top + 10}px`,
              right: `${buttonPosition.right}px`,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              transform: 'translateZ(0)' // Force a stacking context
            }}
          >
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
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Theme</h4>                  <div className="mb-2">
                    <span className="text-xs text-gray-700 dark:text-gray-300 block mb-1.5">Color accent</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['violet', 'blue', 'green', 'amber', 'rose', 'cyan', 'orange', 'emerald'] as const).map((theme) => (
                        <button
                          key={theme}
                          onClick={() => updateSettings({ colorTheme: theme })}
                          className={`h-6 rounded-md transition-all ${settings.colorTheme === theme ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500 scale-110' : ''}`}
                          style={{
                            backgroundColor:
                              theme === 'violet' ? '#8b5cf6' :
                                theme === 'blue' ? '#3b82f6' :
                                  theme === 'green' ? '#10b981' :
                                    theme === 'amber' ? '#f59e0b' :
                                      theme === 'rose' ? '#f43f5e' :
                                        theme === 'cyan' ? '#06b6d4' :
                                          theme === 'orange' ? '#f97316' :
                                            '#10b981'
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
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Background</h4>                  <div className="mb-2">
                    <span className="text-xs text-gray-700 dark:text-gray-300 block mb-1.5">Style</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['none', 'code', 'dots', 'checkmarks', 'particles', 'matrix'] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => updateSettings({ backgroundStyle: style })}
                          className={`text-xs px-2 py-1 rounded-md transition-colors ${settings.backgroundStyle === style
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
                          className={`text-xs px-2 py-1 rounded-md transition-colors ${settings.animationSpeed === speed
                            ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            } border`}
                        >
                          {speed.charAt(0).toUpperCase() + speed.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>                  <div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 block mb-1.5">Layout density</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['compact', 'comfortable', 'spacious'] as const).map((density) => (
                        <button
                          key={density}
                          onClick={() => updateSettings({ layoutDensity: density })}
                          className={`text-xs px-2 py-1 rounded-md transition-colors ${settings.layoutDensity === density
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

                <div className="border-b dark:border-gray-700 pb-2">
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Card Style</h4>

                  <div className="mb-2">
                    <span className="text-xs text-gray-700 dark:text-gray-300 block mb-1.5">Card style</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['flat', 'elevated', 'outlined', 'glass', 'gradient'] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => updateSettings({ cardStyle: style })}
                          className={`text-xs px-2 py-1 rounded-md transition-colors ${settings.cardStyle === style
                            ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            } border`}
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-xs text-gray-700 dark:text-gray-300 block mb-1.5">Border radius</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['none', 'small', 'medium', 'large', 'full'] as const).map((radius) => (
                        <button
                          key={radius}
                          onClick={() => updateSettings({ borderRadius: radius })}
                          className={`text-xs px-2 py-1 rounded-md transition-colors ${settings.borderRadius === radius
                            ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            } border`}
                        >
                          {radius.charAt(0).toUpperCase() + radius.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 block mb-1.5">Shadow</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['none', 'subtle', 'medium', 'strong', 'glow'] as const).map((shadow) => (
                        <button
                          key={shadow}
                          onClick={() => updateSettings({ cardShadow: shadow })}
                          className={`text-xs px-2 py-1 rounded-md transition-colors ${settings.cardShadow === shadow
                            ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            } border`}
                        >
                          {shadow.charAt(0).toUpperCase() + shadow.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-b dark:border-gray-700 pb-2">
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Typography</h4>

                  <div className="mb-2">
                    <span className="text-xs text-gray-700 dark:text-gray-300 block mb-1.5">Font family</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['system', 'mono', 'sans', 'serif'] as const).map((font) => (
                        <button
                          key={font}
                          onClick={() => updateSettings({ fontFamily: font })}
                          className={`text-xs px-2 py-1 rounded-md transition-colors ${settings.fontFamily === font
                            ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            } border`}
                          style={{
                            fontFamily: font === 'mono' ? 'monospace' :
                              font === 'sans' ? 'sans-serif' :
                                font === 'serif' ? 'serif' : 'system-ui'
                          }}
                        >
                          {font.charAt(0).toUpperCase() + font.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 block mb-1.5">Spacing</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['tight', 'normal', 'relaxed'] as const).map((space) => (
                        <button
                          key={space}
                          onClick={() => updateSettings({ spacing: space })}
                          className={`text-xs px-2 py-1 rounded-md transition-colors ${settings.spacing === space
                            ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            } border`}
                        >
                          {space.charAt(0).toUpperCase() + space.slice(1)}
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
                      borderRadius: 'medium',
                      cardShadow: 'medium',
                      fontFamily: 'system',
                      cardStyle: 'elevated',
                      spacing: 'normal',
                    };
                    setSettings(defaultSettings);
                    localStorage.setItem('visualSettings', JSON.stringify(defaultSettings));
                    onSettingsChange(defaultSettings); // Changed from onChangeAction
                  }}
                  className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                >
                  Reset to defaults
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}