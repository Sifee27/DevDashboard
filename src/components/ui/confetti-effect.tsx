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
      // Create confetti instance without additional options
      const myConfetti = confettiModule.create();
      
      if (!myConfetti) return;
      
      // Enhanced confetti effect with wider screen coverage
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#FFA500'];
      const end = Date.now() + 2000; // longer duration for more impact
      
      // Function to create a burst of confetti
      const fireBurst = () => {
        // Left side burst
        myConfetti({
          particleCount: 50,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 0.5 },
          colors: colors,
          scalar: 1.5 // larger confetti pieces
        });
        
        // Center burst
        myConfetti({
          particleCount: 100,
          angle: 90,
          spread: 100,
          origin: { x: 0.5, y: 0.3 },
          colors: colors,
          scalar: 1.8 // larger confetti pieces
        });
        
        // Right side burst
        myConfetti({
          particleCount: 50,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.5 },
          colors: colors,
          scalar: 1.5 // larger confetti pieces
        });
      };
      
      // Initial burst
      fireBurst();
      
      // Set interval for continued bursts
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          setPlayed(true);
          if (onComplete) onComplete();
          return;
        }
        
        fireBurst();
      }, 300); // Fire every 300ms for continuous effect
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
