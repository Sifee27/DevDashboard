'use client';

import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-space-grotesk)',
            borderRadius: '0.375rem', // rounded-md to match our design system
          },
          classNames: {
            title: 'font-mono', // Apply JetBrains Mono to toast titles
          }
        }}
        theme="system" // Will follow the system/app dark mode setting
      />
    </>
  );
}
