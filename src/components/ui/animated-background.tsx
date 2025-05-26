"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Element type definition for animated particles
 */
interface AnimatedElement {
  x: number;
  y: number;
  vx: number;
  vy: number;
  content?: string;
  size: number;
  opacity: number;
  type: string;
}

/**
 * Constants defined outside the component to prevent TDZ issues
 */
const ANIMATION_CONSTANTS = {
  CODE_ELEMENTS: ['{', '}', ';', '()', '[]', '//', '=>', '<>', '&&', '||'],
  MATRIX_CHARACTERS: ['0', '1', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'λ', 'μ', 'π', 'ρ', 'σ', 'τ', 'φ', 'χ', 'ψ', 'ω'],
  COMMIT_DOT_RADIUS: 4,
  DEFAULT_COLOR: '#6d28d9',
  DEFAULT_OPACITY: 0.03,
  DEFAULT_SPEED: 1,
  DEFAULT_VARIANT: 'code' as const
};

/**
 * Props interface for the AnimatedBackground component
 */
interface AnimatedBackgroundProps {
  variant?: 'code' | 'dots' | 'checkmarks' | 'particles' | 'matrix';
  opacity?: number;
  speed?: number;
  color?: string;
  className?: string;
}

/**
 * AnimatedBackground Component
 * Creates a canvas-based animated background with different visual styles
 */
export function AnimatedBackground({
  variant = ANIMATION_CONSTANTS.DEFAULT_VARIANT,
  opacity = ANIMATION_CONSTANTS.DEFAULT_OPACITY,
  speed = ANIMATION_CONSTANTS.DEFAULT_SPEED,
  color = ANIMATION_CONSTANTS.DEFAULT_COLOR,
  className = '',
}: AnimatedBackgroundProps) {
  // Refs for canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State to track initialization status
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  /**
   * Create and manage animation elements based on current canvas dimensions
   */
  const createElements = useCallback((canvas: HTMLCanvasElement, count: number, variant: string): AnimatedElement[] => {
    // Defensive programming: ensure we have a valid count
    const safeCount = Math.max(20, count);
    const elements: AnimatedElement[] = [];

    // Create elements based on the specified variant
    for (let i = 0; i < safeCount; i++) {
      try {
        // Basic properties for all element types
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const baseSpeed = 0.2 * (speed || ANIMATION_CONSTANTS.DEFAULT_SPEED);
        const vx = (Math.random() - 0.5) * baseSpeed;
        const vy = (Math.random() - 0.5) * baseSpeed;
        // Create elements based on variant
        if (variant === 'code') {
          const codeElements = ANIMATION_CONSTANTS.CODE_ELEMENTS;
          const content = codeElements[Math.floor(Math.random() * codeElements.length)];
          elements.push({
            x, y, vx, vy,
            content,
            size: Math.floor(Math.random() * 8) + 10, // 10-18px
            opacity: Math.random() * 0.5 + 0.2, // 0.2-0.7
            type: 'text'
          });
        } else if (variant === 'dots') {
          elements.push({
            x, y, vx, vy,
            size: Math.floor(Math.random() * 2) + ANIMATION_CONSTANTS.COMMIT_DOT_RADIUS - 2, // 2-4px
            opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8
            type: 'dot'
          });
        } else if (variant === 'particles') {
          elements.push({
            x, y, vx, vy,
            size: Math.floor(Math.random() * 3) + 1, // 1-4px
            opacity: Math.random() * 0.8 + 0.2, // 0.2-1.0
            type: 'particle'
          });
        } else if (variant === 'matrix') {
          const matrixChars = ANIMATION_CONSTANTS.MATRIX_CHARACTERS;
          const content = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          elements.push({
            x, y,
            vx: 0, // Matrix characters fall straight down
            vy: (Math.random() * 2 + 0.5) * baseSpeed * 10, // Faster falling speed
            content,
            size: Math.floor(Math.random() * 6) + 12, // 12-18px
            opacity: Math.random() * 0.8 + 0.2, // 0.2-1.0
            type: 'matrix'
          });
        } else {
          elements.push({
            x, y, vx, vy,
            size: Math.floor(Math.random() * 8) + 12, // 12-20px
            opacity: Math.random() * 0.4 + 0.2, // 0.2-0.6
            type: 'checkmark'
          });
        }
      } catch (error) {
        console.error('Error creating animation element:', error);
      }
    }

    return elements;
  }, [speed]);

  useEffect(() => {
    let animationId: number | null = null;
    let elements: AnimatedElement[] = [];
    let isComponentMounted = true;

    // Initialize the canvas when the component mounts
    const initTimeout = setTimeout(() => {
      try {
        // Get canvas and context
        const canvas = canvasRef.current;
        if (!canvas || !isComponentMounted) return;

        const ctx = canvas.getContext('2d');
        if (!ctx || !isComponentMounted) return;

        // Function to resize canvas to match parent dimensions
        function resizeCanvas() {
          if (!canvas || !isComponentMounted) return;

          const parent = canvas.parentElement;
          if (!parent) return;

          // Default to window dimensions as fallback
          const newWidth = parent.offsetWidth || window.innerWidth;
          const newHeight = parent.offsetHeight || window.innerHeight;

          // Update canvas dimensions if changed
          if (canvas.width !== newWidth || canvas.height !== newHeight) {
            canvas.width = newWidth;
            canvas.height = newHeight;

            // Recreate elements when canvas size changes
            const elementCount = Math.floor((canvas.width * canvas.height) / 15000);
            elements = createElements(canvas, Math.max(30, elementCount), variant);
          }
        };

        // Set initial canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        resizeCanvas();

        // Create initial elements
        const elementCount = Math.floor((canvas.width * canvas.height) / 15000);
        elements = createElements(canvas, Math.max(30, elementCount), variant);

        // Add resize listener
        window.addEventListener('resize', resizeCanvas);

        /**
         * Animation loop function
         */
        const animate = () => {
          if (!canvas || !ctx || !isComponentMounted) return;

          // Skip if canvas is not visible
          if (!canvas.offsetParent || canvas.width === 0 || canvas.height === 0) {
            animationId = requestAnimationFrame(animate);
            return;
          }

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Ensure we have elements to animate
          if (elements.length === 0) {
            elements = createElements(canvas, 30, variant);
          }

          // Safe color value
          const safeColor = color || ANIMATION_CONSTANTS.DEFAULT_COLOR;
          const safeOpacity = opacity || ANIMATION_CONSTANTS.DEFAULT_OPACITY;

          // Update and draw each element
          elements.forEach(element => {
            try {              // Update position
              element.x += element.vx;
              element.y += element.vy;

              // Handle different boundary behaviors based on type
              if (element.type === 'matrix') {
                // Matrix characters fall down and reset at top
                if (element.y > canvas.height + element.size) {
                  element.y = -element.size;
                  element.x = Math.random() * canvas.width;
                }
                // Keep within horizontal bounds
                if (element.x < 0 || element.x > canvas.width) {
                  element.x = Math.random() * canvas.width;
                }
              } else {
                // Bounce off edges with proper bounds checking for other types
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
              }

              // Draw based on type
              ctx.globalAlpha = element.opacity * opacity;
              ctx.fillStyle = color;
              ctx.strokeStyle = color;

              // Set drawing properties
              ctx.globalAlpha = element.opacity * safeOpacity;
              ctx.fillStyle = safeColor;
              ctx.strokeStyle = safeColor;
              // Draw based on element type
              if (element.type === 'text' && element.content) {
                // Code elements
                ctx.font = `${element.size}px monospace`;
                ctx.fillText(element.content, element.x, element.y);
              } else if (element.type === 'dot') {
                // Main dot
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
                ctx.fill();

                // Add subtle glow effect
                ctx.globalAlpha = element.opacity * safeOpacity * 0.4;
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.size * 1.5, 0, Math.PI * 2);
                ctx.fill();
              } else if (element.type === 'particle') {
                // Small floating particles
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
                ctx.fill();

                // Add particle trail effect
                ctx.globalAlpha = element.opacity * safeOpacity * 0.3;
                ctx.beginPath();
                ctx.arc(element.x - element.vx * 5, element.y - element.vy * 5, element.size * 0.7, 0, Math.PI * 2);
                ctx.fill();
              } else if (element.type === 'matrix' && element.content) {
                // Matrix-style falling characters
                ctx.font = `${element.size}px monospace`;
                ctx.fillStyle = safeColor === '#6d28d9' ? '#00ff00' : safeColor; // Default to green for matrix
                ctx.fillText(element.content, element.x, element.y);

                // Add trailing effect
                const trailLength = 3;
                for (let i = 1; i <= trailLength; i++) {
                  ctx.globalAlpha = (element.opacity * safeOpacity) / (i + 1);
                  ctx.fillText(element.content, element.x, element.y - (element.size * i * 0.8));
                }
              } else if (element.type === 'checkmark') {
                // Simple checkmark using path commands
                ctx.save();
                ctx.translate(element.x, element.y);
                const checkSize = element.size * 0.8;

                ctx.beginPath();
                ctx.moveTo(-checkSize / 2, 0);
                ctx.lineTo(-checkSize / 6, checkSize / 2);
                ctx.lineTo(checkSize / 2, -checkSize / 3);
                ctx.lineWidth = checkSize / 4;
                ctx.stroke();
                ctx.restore();
              }
            } catch {
              // Silently handle errors in individual elements
              // to prevent breaking the entire animation
            }
          });

          // Request next frame
          animationId = requestAnimationFrame(animate);
        };

        // Start the animation
        animationId = requestAnimationFrame(animate);

        // Mark as initialized
        setIsInitialized(true);

      } catch (error) {
        console.error('Error initializing animated background:', error);
      }
    }, 100); // Short delay to ensure component is mounted

    // Cleanup function
    return () => {
      isComponentMounted = false;
      clearTimeout(initTimeout);

      if (typeof animationId === 'number') {
        cancelAnimationFrame(animationId);
      }

      // Clean up window event listeners - this is a noop but satisfies TypeScript
      window.removeEventListener('resize', () => { });
    };
  }, [variant, opacity, speed, color, createElements]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none animated-background ${className}`}
      aria-hidden="true"
      style={{ zIndex: 1 }}
      data-initialized={isInitialized}
    />
  );
}
