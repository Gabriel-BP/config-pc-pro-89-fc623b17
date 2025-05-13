
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Helper function to prevent default on button clicks (for filters)
export function preventDefaultClick(callback: Function) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    callback(e);
  };
}
