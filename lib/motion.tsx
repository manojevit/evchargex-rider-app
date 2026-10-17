import type { ComponentProps, FC } from 'react';
import { MotiView as BaseMotiView, MotiText as BaseMotiText, AnimatePresence } from 'moti';

/**
 * Moti's `transition` prop has a union type that TypeScript resolves badly when
 * the styled type is `any` (it matches the per-key record variant and rejects a
 * plain `{ type: 'timing', ... }`). These wrappers keep every other prop typed
 * (className, from, animate, exit…) and only loosen `transition`.
 */
type ViewProps = Omit<ComponentProps<typeof BaseMotiView>, 'transition'> & { transition?: any };
type TextProps = Omit<ComponentProps<typeof BaseMotiText>, 'transition'> & { transition?: any };

export const MotiView = BaseMotiView as unknown as FC<ViewProps>;
export const MotiText = BaseMotiText as unknown as FC<TextProps>;
export { AnimatePresence };
