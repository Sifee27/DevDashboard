import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string using clsx and tailwind-merge
 * Used by shadcn/ui components for conditional class name handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
