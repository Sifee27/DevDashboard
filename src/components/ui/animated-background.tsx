"use client";

import React, { useRef, useEffect } from 'react';

type AnimatedBackgroundProps = {
  variant?: 'code' | 'dots' | 'checkmarks';
  opacity?: number;
  speed?: number;
  color?: string;
  className?: string;
};

export function AnimatedBackground({
  variant = 'code',
  opacity = 0.03,
  speed = 1,
  color = '#6d28d9',
  className = '',
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Checkmark and commit elements
  const checkmarkPath = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";
  const commitDotRadius = 3;
  const codeElements = ['{', '}', ';', '()', '[]', '//', '=>', '<>', '&&', '||'];
  
  useEffect(() => {
    let animationId: number;
    const elements: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      content?: string;
      size: number;
      opacity: number;
      type: string;
    }[] = [];
    
    // Function to clear all elements
    const clearElements = () => {
      elements.length = 0;
    };
    
    // Initialize or re-initialize the animation
    const initializeAnimation = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas dimensions to match parent
      const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.offsetWidth;
          canvas.height = parent.offsetHeight;
        }
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      // Clear any existing elements
      clearElements();
      
      // Initialize elements based on variant
      const createElements = (count: number) => {
        for (let i = 0; i < count; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const vx = (Math.random() - 0.5) * speed;
          const vy = (Math.random() - 0.5) * speed;
          const size = Math.random() * 10 + 10;
          const elementOpacity = Math.random() * 0.5 + 0.1;
          
          if (variant === 'code') {
            const content = codeElements[Math.floor(Math.random() * codeElements.length)];
            elements.push({ x, y, vx, vy, content, size, opacity: elementOpacity, type: 'text' });
          } else if (variant === 'dots') {
            elements.push({ x, y, vx, vy, size: commitDotRadius, opacity: elementOpacity, type: 'dot' });
          } else if (variant === 'checkmarks') {
            elements.push({ x, y, vx, vy, size, opacity: elementOpacity, type: 'checkmark' });
          }
        }
      };
      
      // Create initial elements (number based on canvas size)
      const elementCount = Math.floor((canvas.width * canvas.height) / 15000);
      createElements(elementCount);
      
      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw elements
        elements.forEach(element => {
          // Update position
          element.x += element.vx;
          element.y += element.vy;
          
          // Bounce off edges
          if (element.x < 0 || element.x > canvas.width) element.vx *= -1;
          if (element.y < 0 || element.y > canvas.height) element.vy *= -1;
          
          // Draw based on type
          ctx.globalAlpha = element.opacity * opacity;
          ctx.fillStyle = color;
          ctx.strokeStyle = color;
          
          if (element.type === 'text' && element.content) {
            ctx.font = `${element.size}px JetBrains Mono, monospace`;
            ctx.fillText(element.content, element.x, element.y);
          } else if (element.type === 'dot') {
            ctx.beginPath();
            ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (element.type === 'checkmark') {
            ctx.save();
            ctx.translate(element.x, element.y);
            ctx.scale(element.size / 24, element.size / 24);
            ctx.beginPath();
            const path = new Path2D(checkmarkPath);
            ctx.fill(path);
            ctx.restore();
          }
        });
        
        animationId = requestAnimationFrame(animate);
      };
      
      // Start animation
      animationId = requestAnimationFrame(animate);
      
      // Cleanup function
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationId);
      };
    };
    
    // Initialize the animation
    const cleanup = initializeAnimation();
    
    // Return cleanup function
    return () => {
      if (cleanup) cleanup();
      cancelAnimationFrame(animationId);
    };
  }, [variant, opacity, speed, color, checkmarkPath, commitDotRadius]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
