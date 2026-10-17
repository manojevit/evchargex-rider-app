import { View } from 'react-native';
import { cn } from '@/lib/cn';

type Tone = 'brand' | 'success' | 'warn' | 'danger' | 'info' | 'neutral' | 'violet';

const BG: Record<Tone, string> = {
  brand: 'bg-brand-50',
  success: 'bg-success-soft',
  warn: 'bg-warn-soft',
  danger: 'bg-danger-soft',
  info: 'bg-info-soft',
  neutral: 'bg-canvas',
  violet: 'bg-[#EDE9FE]',
};

type SizeKey = 'sm' | 'md' | 'lg';
const SIZES: Record<SizeKey, string> = { sm: 'h-9 w-9', md: 'h-11 w-11', lg: 'h-14 w-14' };

/** Rounded, softly-tinted square behind a lucide icon — used all over the design. */
export function IconTile({
  children,
  tone = 'brand',
  size = 'md',
  rounded = 'rounded-2xl',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  size?: SizeKey;
  rounded?: string;
  className?: string;
}) {
  return (
    <View className={cn('items-center justify-center', SIZES[size], rounded, BG[tone], className)}>
      {children}
    </View>
  );
}
