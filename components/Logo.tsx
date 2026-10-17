import { Image } from 'react-native';
import logoWhite from '../assets/brand/logo-white.png';
import logoInk from '../assets/brand/logo-ink.png';

/** Aspect ratio of the trimmed EVCHARGEX lockup (wordmark + tagline). */
const LOGO_ASPECT = 3230 / 470;

const WIDTHS = { sm: 168, md: 208, lg: 272 } as const;

type Tone = 'dark' | 'light'; // dark = for light backgrounds (ink), light = for dark/brand backgrounds (white)

/**
 * The official EVCHARGEX logo. `tone="light"` is the white version (for the
 * blue splash and the dark menu card); `tone="dark"` is the ink version (for
 * light backgrounds like login and onboarding). The tagline is part of the art.
 */
export function Logo({
  tone = 'dark',
  size = 'md',
  width,
  // kept for call-site compatibility; the lockup already includes the tagline
  variant,
  tagline,
}: {
  tone?: Tone;
  size?: keyof typeof WIDTHS;
  width?: number;
  variant?: 'mark' | 'row' | 'stack';
  tagline?: boolean;
}) {
  void variant;
  void tagline;
  const w = width ?? WIDTHS[size];
  return (
    <Image
      source={tone === 'light' ? logoWhite : logoInk}
      style={{ width: w, height: w / LOGO_ASPECT }}
      resizeMode="contain"
    />
  );
}
