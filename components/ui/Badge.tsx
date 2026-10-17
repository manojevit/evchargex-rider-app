import { View } from 'react-native';
import { Txt } from './Txt';
import { cn } from '@/lib/cn';

type Tone = 'success' | 'warn' | 'danger' | 'info' | 'brand' | 'neutral';

const TONES: Record<Tone, { bg: string; text: string; dot: string }> = {
  success: { bg: 'bg-success-soft', text: 'text-success-ink', dot: 'bg-success' },
  warn: { bg: 'bg-warn-soft', text: 'text-warn-ink', dot: 'bg-warn' },
  danger: { bg: 'bg-danger-soft', text: 'text-danger-ink', dot: 'bg-danger' },
  info: { bg: 'bg-info-soft', text: 'text-info-ink', dot: 'bg-info' },
  brand: { bg: 'bg-brand-50', text: 'text-brand-700', dot: 'bg-brand-500' },
  neutral: { bg: 'bg-canvas', text: 'text-muted', dot: 'bg-faint' },
};

interface Props {
  label: string;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}

export function Badge({ label, tone = 'neutral', dot, className }: Props) {
  const t = TONES[tone];
  return (
    <View className={cn('flex-row items-center gap-1.5 rounded-full px-2.5 py-1', t.bg, className)}>
      {dot && <View className={cn('h-1.5 w-1.5 rounded-full', t.dot)} />}
      <Txt weight="bold" className={cn('text-xs', t.text)}>
        {label}
      </Txt>
    </View>
  );
}
