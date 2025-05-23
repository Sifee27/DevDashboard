"use client";

import { useEffect, useState, useCallback } from 'react';
// Import only the type, not the actual module (which we'll load dynamically)
import type confetti from 'canvas-confetti';

// Define the props interface
interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

/**
 * ConfettiEffect component - Creates a confetti animation effect when triggered
 * Uses dynamic import to avoid SSR issues and prevent TDZ errors
 */
export function ConfettiEffect({ trigger = false, onComplete }: ConfettiEffectProps) {
  // Initialize state
  const [played, setPlayed] = useState<boolean>(false);
  
  // Define a proper type for the confetti module
  type ConfettiFunction = (options?: confetti.Options) => Promise<null>;
  interface ConfettiModule {
    default: ConfettiFunction;
    reset: () => void;
    create: (canvas?: HTMLCanvasElement, options?: confetti.Options) => confetti.CreateTypes;
  }
  const [confettiModule, setConfettiModule] = useState<ConfettiModule | null>(null);

  // Load the confetti module dynamically to avoid SSR issues
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Dynamically import the confetti module
    import('canvas-confetti')
      .then(module => setConfettiModule(module as unknown as ConfettiModule))
      .catch(error => {
        console.error('Failed to load confetti module:', error);
      });
  }, []);

  // Define the confetti animation function
  const runConfettiAnimation = useCallback(() => {
    if (!confettiModule) return;
    
    try {
      // Create confetti instance with safe defaults
      const myConfetti = confettiModule.create(undefined, { 
        resize: true,
        useWorker: true
      });
      
      if (!myConfetti) return;
      
      // Fire multiple bursts for a more impressive effect
      const end = Date.now() + 1000; // duration
      const colors = ['#8b5cf6', '#6d28d9', '#4c1d95', '#7c3aed', '#5b21b6'];
      
      const frame = () => {
        // Left side burst
        myConfetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        
        // Right side burst
        myConfetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          setPlayed(true);
          if (onComplete && typeof onComplete === 'function') {
            onComplete();
          }
        }
      };
      
      // Start the animation
      frame();
    } catch (error) {
      console.error('Error running confetti animation:', error);
      // Ensure played state is updated even if animation fails
      setPlayed(true);
      if (onComplete && typeof onComplete === 'function') {
        onComplete();
      }
    }
  }, [confettiModule, onComplete]);

  // Trigger the confetti effect
  useEffect(() => {
    // Only trigger if conditions are met and module is loaded
    if (trigger && !played && confettiModule) {
      runConfettiAnimation();
    }
  }, [trigger, played, confettiModule, runConfettiAnimation]);
  
  // Reset the played state if trigger becomes false
  useEffect(() => {
    if (trigger === false) {
      setPlayed(false);
    }
  }, [trigger]);

  // This component doesn't render anything visible
  return null;
}
