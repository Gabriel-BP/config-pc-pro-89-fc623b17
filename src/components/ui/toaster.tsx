
// This file is kept for backward compatibility with existing imports.
// The actual Toaster is now imported directly from 'sonner' in main.tsx

import { toast } from "sonner";

export { toast };

export function Toaster() {
  // This is an empty component since we're using the Toaster from sonner directly
  return null;
}
