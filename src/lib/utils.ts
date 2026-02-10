import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs))
} 


export const isIframe = globalThis.self !== window.top;
