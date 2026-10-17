/** Tiny classnames joiner (clsx-lite) for NativeWind className props. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
