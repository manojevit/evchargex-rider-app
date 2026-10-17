import * as Haptics from 'expo-haptics';

/** Fire a haptic tap. No-ops safely on web or unsupported devices. */
export function tap(style: 'light' | 'medium' | 'heavy' | 'selection' = 'light') {
  try {
    if (style === 'selection') {
      Haptics.selectionAsync();
    } else {
      const map = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      } as const;
      Haptics.impactAsync(map[style]);
    }
  } catch {
    /* no-op */
  }
}
