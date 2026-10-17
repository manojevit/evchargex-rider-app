/**
 * Raw color + gradient tokens for places that can't take a Tailwind class —
 * lucide icon `color` props, LinearGradient `colors`, shadows, etc. Keep these
 * in sync with tailwind.config.js.
 */

export const colors = {
  brand: '#1E63F0',
  brand600: '#1550D6',
  brand700: '#1340AC',
  brand50: '#EEF4FF',
  brand100: '#DBE7FF',

  success: '#16A34A',
  successSoft: '#DCFCE7',
  warn: '#F59E0B',
  warnSoft: '#FEF3C7',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  info: '#2563EB',
  infoSoft: '#DBEAFE',

  ink: '#0B1420',
  muted: '#6B7684',
  faint: '#9AA4B2',
  line: '#E7EBF1',
  canvas: '#F2F5F9',
  surface: '#FFFFFF',
  white: '#FFFFFF',
} as const;

export const gradients = {
  // Deep blue plan / hero card
  brand: ['#1E63F0', '#1340AC'] as const,
  // Light-blue vehicle card
  brandSoft: ['#EAF1FF', '#DCE8FF'] as const,
  // Splash
  splash: ['#2A6DF4', '#1340AC'] as const,
};

/** Soft shadow used on cards (iOS) — Android uses elevation. */
export const cardShadow = {
  shadowColor: '#0B1420',
  shadowOpacity: 0.06,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 2,
} as const;

export const floatShadow = {
  shadowColor: '#1E63F0',
  shadowOpacity: 0.35,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 8,
} as const;
