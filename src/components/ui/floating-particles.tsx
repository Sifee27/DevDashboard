"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingParticlesProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  speed?: 'slow' | 'normal' | 'fast';
  color?: string;
  opacity?: number;
}

export function FloatingParticles({ 
  count = 50, 
  size = 'md', 
  speed = 'normal',
  color = 'rgba(139, 92, 246, 0.3)',
  opacity = 0.6 
}: FloatingParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: getSizeValue(size) + Math.random() * 2,
    delay: Math.random() * 10,
    duration: getSpeedValue(speed) + Math.random() * 5,
    direction: Math.random() > 0.5 ? 1 : -1
  }));

  function getSizeValue(size: string) {
    switch (size) {
      case 'sm': return 1;
      case 'md': return 2;
      case 'lg': return 3;
      default: return 2;
    }
  }

  function getSpeedValue(speed: string) {
    switch (speed) {
      case 'slow': return 15;
      case 'normal': return 10;
      case 'fast': return 5;
      default: return 10;
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            opacity: opacity * (0.5 + Math.random() * 0.5),
          }}
          animate={{
            y: [0, particle.direction * 20, 0],
            x: [0, particle.direction * 10, 0],
            scale: [1, 1.2, 1],
            opacity: [opacity * 0.3, opacity, opacity * 0.3],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
