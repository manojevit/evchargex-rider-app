import { View } from 'react-native';
import { MotiView } from '@/lib/motion';
import { cn } from '@/lib/cn';

type Tone = 'brand' | 'success' | 'danger' | 'warn';
const FILL: Record<Tone, string> = {
  brand: 'bg-brand-500',
  success: 'bg-success',
  danger: 'bg-danger',
  warn: 'bg-warn',
};

/** 0-100 animated progress bar. */
export function ProgressBar({
  value,
  tone = 'brand',
  className,
  height = 8,
}: {
  value: number;
  tone?: Tone;
  className?: string;
  height?: number;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <View className={cn('w-full overflow-hidden rounded-full bg-line', className)} style={{ height }}>
      <MotiView
        className={cn('h-full rounded-full', FILL[tone])}
        animate={{ width: `${v}%` }}
        transition={{ type: 'timing', duration: 500 }}
      />
    </View>
  );
}
