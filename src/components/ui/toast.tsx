// Toast wrapper component for DevDashboard
// Uses sonner for lightweight toast notifications
import { Toaster as SonnerToaster } from 'sonner';

interface ToasterProps {
  // You can customize the toaster with theme, position, etc.
  className?: string;
}

export function Toaster({ className }: ToasterProps) {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          fontFamily: 'var(--font-space-grotesk)',
          borderRadius: '0.375rem',
        },
        classNames: {
          title: 'font-mono', // Apply JetBrains Mono to toast titles
        }
      }}
      theme="system" // Uses system preference and follows our dark mode
      className={className}
    />
  );
}
