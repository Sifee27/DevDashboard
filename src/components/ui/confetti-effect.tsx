"use client";

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

type ConfettiEffectProps = {
  trigger: boolean;
  onComplete?: () => void;
};

export function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    // Only trigger if the component gets a true trigger and hasn't played yet
    if (trigger && !played) {
      // Play the confetti animation
      const myConfetti = confetti.create(undefined, { 
        resize: true,
        useWorker: true
      });
      
      // Fire multiple bursts for a more impressive effect
      const end = Date.now() + 1000; // duration
      
      const colors = ['#8b5cf6', '#6d28d9', '#4c1d95', '#7c3aed', '#5b21b6'];
      
      (function frame() {
        myConfetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        
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
          if (onComplete) {
            onComplete();
          }
        }
      }());
    }
  }, [trigger, played, onComplete]);
  
  // Reset the played state if trigger becomes false
  useEffect(() => {
    if (!trigger) {
      setPlayed(false);
    }
  }, [trigger]);

  // This component doesn't render anything visible
  return null;
}
