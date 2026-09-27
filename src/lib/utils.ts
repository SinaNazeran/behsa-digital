import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Compose conditional class names with Tailwind-aware conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** move arr[from] to index `to`, shifting the rest; false (and untouched)
    when either index is out of range or nothing would change */
export function moveInPlace<T>(arr: T[], from: number, to: number): boolean {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= arr.length || to >= arr.length || from === to) return false;
  arr.splice(to, 0, ...arr.splice(from, 1));
  return true;
}
