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
  const commitDotRadius = 4; // Increased dot size for better visibility
  const codeElements = ['{', '}', ';', '()', '[]', '//', '=>', '<>', '&&', '||'];
  
  useEffect(() => {
    // Store animation frame ID for cleanup
    let animationId: number;
    
    // Define element type
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
    
    // Array to store animation elements
    const elements: Element[] = [];
    
    // Function to clear all elements
    const clearElements = () => {
      elements.length = 0;
    };
    
    // Initialize or re-initialize the animation
    const initializeAnimation = () => {
      console.log(`Initializing ${variant} background animation`); // Debug log
      
      // Get canvas and context
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('Canvas reference not available');
        return null;
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get 2D context from canvas');
        return null;
      }
      
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
                
                // Draw checkmark manually for maximum browser compatibility
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
        cancelAnimationFrame(animationId);
      };
    };
    
    // Initialize the animation and store cleanup function
    const cleanup = initializeAnimation();
    
    // Return cleanup function for useEffect
    return () => {
      console.log('Component unmounting, cleaning up animation'); // Debug log
      if (cleanup) cleanup();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [variant, opacity, speed, color, checkmarkPath, commitDotRadius, codeElements]);
  
  // Debug log on render
  console.log(`Rendering AnimatedBackground with variant: ${variant}, speed: ${speed}`);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 pointer-events-none animated-background ${className}`}
      aria-hidden="true"
      style={{ zIndex: 1 }}
    />
  );
}
