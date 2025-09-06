// firefly-dashboard/src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-helpers: merge + conditional classes */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
