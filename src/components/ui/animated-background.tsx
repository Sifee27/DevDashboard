"use client";

import React, { useRef, useEffect } from 'react';

// Define element type outside component to avoid TDZ issues
type Element = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  content?: string;
  size: number;
  opacity: number;
  type: string;
};

// Constants moved outside component to avoid TDZ issues
const CODE_ELEMENTS = ['{', '}', ';', '()', '[]', '//', '=>', '<>', '&&', '||'];
const COMMIT_DOT_RADIUS = 4;
const CHECKMARK_PATH = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";

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
  
  useEffect(() => {
    // Early return if dependencies aren't ready
    if (!variant || !opacity || !speed || !color) return;
    
    // Store animation frame ID for cleanup
    let animationId: number | undefined;
    
    // Get canvas and context first - if these fail, don't proceed
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas reference not available");
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get 2D context");
      return;
    }
    
    // Array to store animation elements - created after canvas check
    const elements: Element[] = [];
    
    // Function to clear all elements
    const clearElements = () => {
      elements.length = 0;
    };
    
    // Initialize or re-initialize the animation
    const initializeAnimation = () => {
      console.log(`Initializing ${variant} background animation`); // Debug log
      
      // Force a specific size initially to avoid zero dimensions
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Set canvas dimensions to match parent
      const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (parent) {
          const newWidth = parent.offsetWidth || window.innerWidth;
          const newHeight = parent.offsetHeight || window.innerHeight;
          
          // Only update if dimensions actually change
          if (canvas.width !== newWidth || canvas.height !== newHeight) {
            canvas.width = newWidth;
            canvas.height = newHeight;
            console.log(`Canvas resized to: ${newWidth}x${newHeight}`); // Debug log
            
            // Re-create elements when resizing to maintain density
            clearElements();
            const elementCount = Math.floor((canvas.width * canvas.height) / 15000);
            createElements(Math.max(20, elementCount)); // Ensure minimum number of elements
          }
        }
      };
      
      // Initial resize
      resizeCanvas();
      
      // Add resize event listener
      window.addEventListener('resize', resizeCanvas);
      
      // Clear any existing elements
      clearElements();
      
      // Create initial elements based on variant
      const createElements = (count: number) => {
        // Make sure we have a valid count
        const safeCount = Math.max(1, count);
        
        for (let i = 0; i < safeCount; i++) {
          // Calculate position and velocity
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const baseSpeed = 0.2 * speed;
          const vx = (Math.random() - 0.5) * baseSpeed;
          const vy = (Math.random() - 0.5) * baseSpeed;
          
          // Create element based on variant type
          if (variant === 'code') {
            const content = CODE_ELEMENTS[Math.floor(Math.random() * CODE_ELEMENTS.length)];
            const size = Math.floor(Math.random() * 8) + 10; // 10-18px
            elements.push({
              x, y, vx, vy,
              content,
              size,
              opacity: Math.random() * 0.5 + 0.2, // 0.2-0.7
              type: 'text'
            });
          } else if (variant === 'dots') {
            const size = Math.floor(Math.random() * 2) + COMMIT_DOT_RADIUS - 2; // 2-4px
            elements.push({
              x, y, vx, vy,
              size,
              opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8
              type: 'dot'
            });
          } else if (variant === 'checkmarks') {
            const size = Math.floor(Math.random() * 8) + 12; // 12-20px
            elements.push({
              x, y, vx, vy,
              size,
              opacity: Math.random() * 0.4 + 0.2, // 0.2-0.6
              type: 'checkmark'
            });
          }
        }
      };
      
      // Create initial elements (number based on canvas size and variant)
      let elementCount = Math.floor((canvas.width * canvas.height) / 15000);
      
      // Adjust density based on variant and ensure minimum count
      if (variant === 'dots') {
        elementCount = Math.floor(elementCount * 1.5); // More dots
      } else if (variant === 'checkmarks') {
        elementCount = Math.floor(elementCount * 0.8); // Fewer checkmarks
      }
      
      // Ensure a minimum number of elements
      elementCount = Math.max(30, elementCount);
      console.log(`Creating ${elementCount} ${variant} elements`); // Debug log
      
      createElements(elementCount);
      
      // Animation loop
      const animate = () => {
        // Skip animation if canvas is not visible (e.g., tab is inactive)
        if (!canvas.offsetParent || canvas.width === 0 || canvas.height === 0) {
          animationId = requestAnimationFrame(animate);
          return;
        }
        
        // Clear canvas with each frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Check if we have elements to animate
        if (elements.length === 0) {
          console.log('No elements to animate, recreating...'); // Debug log
          createElements(Math.max(30, Math.floor((canvas.width * canvas.height) / 15000)));
        }
        
        // Update and draw elements
        elements.forEach(element => {
          // Update position based on velocity and speed factor
          element.x += element.vx;
          element.y += element.vy;
          
          // Bounce off edges with proper handling
          if (element.x < 0) {
            element.x = 0;
            element.vx *= -1;
          } else if (element.x > canvas.width) {
            element.x = canvas.width;
            element.vx *= -1;
          }
          
          if (element.y < 0) {
            element.y = 0;
            element.vy *= -1;
          } else if (element.y > canvas.height) {
            element.y = canvas.height;
            element.vy *= -1;
          }
          
          // Draw based on type
          ctx.globalAlpha = element.opacity * opacity;
          ctx.fillStyle = color;
          ctx.strokeStyle = color;
          
          try {
            // Set drawing properties based on element type
            ctx.globalAlpha = element.opacity * opacity;
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            
            if (element.type === 'text' && element.content) {
              // Code elements
              try {
                ctx.font = `${element.size}px monospace`;
                ctx.fillText(element.content, element.x, element.y);
              } catch (err) {
                console.error('Error drawing text element:', err);
              }
            } else if (element.type === 'dot') {
              // Dots with subtle glow effect
              try {
                // Main dot
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Add subtle glow
                ctx.globalAlpha = element.opacity * opacity * 0.4;
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.size * 1.5, 0, Math.PI * 2);
                ctx.fill();
              } catch (err) {
                console.error('Error drawing dot element:', err);
              }
            } else if (element.type === 'checkmark') {
              // Simpler checkmark implementation that works across browsers
              try {
                ctx.save();
                ctx.translate(element.x, element.y);
                const checkSize = element.size * 0.8;
                
                // Draw checkmark manually instead of using Path2D for compatibility
                ctx.beginPath();
                ctx.moveTo(-checkSize/2, 0);
                ctx.lineTo(-checkSize/6, checkSize/2);
                ctx.lineTo(checkSize/2, -checkSize/3);
                ctx.lineWidth = checkSize/4;
                ctx.stroke();
                ctx.restore();
              } catch (err) {
                console.error('Error drawing checkmark element:', err);
              }
            }
          } catch (err) {
            console.error('Error in element rendering:', err);
          }
        });
        
        animationId = requestAnimationFrame(animate);
      };
      
      // Ensure we have at least some elements before starting animation
      if (elements.length === 0) {
        createElements(Math.max(30, Math.floor((canvas.width * canvas.height) / 15000)));
      }
      
      // Start animation
      animationId = requestAnimationFrame(animate);
      
      // Return cleanup function
      return () => {
        console.log('Cleaning up animation'); // Debug log
        window.removeEventListener('resize', resizeCanvas);
        if (typeof animationId === 'number') cancelAnimationFrame(animationId);
      };
    };
    
    // Initialize the animation and store cleanup function
    const cleanup = initializeAnimation();
    
    // Return cleanup function for useEffect
    return () => {
      console.log('Component unmounting, cleaning up animation'); // Debug log
      if (cleanup) cleanup();
      if (typeof animationId === 'number') cancelAnimationFrame(animationId);
    };
  }, [variant, opacity, speed, color]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 pointer-events-none animated-background ${className}`}
      aria-hidden="true"
      style={{ zIndex: 1 }}
    />
  );
}
