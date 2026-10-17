import { View, type ViewProps } from 'react-native';
import { cardShadow } from '@/lib/theme';
import { cn } from '@/lib/cn';

interface Props extends ViewProps {
  className?: string;
  /** Drop the soft shadow (e.g. nested cards on a tinted surface). */
  flat?: boolean;
}

export function Card({ className, flat, style, children, ...rest }: Props) {
  return (
    <View
      className={cn('rounded-2xl bg-surface p-4', className)}
      style={[flat ? undefined : cardShadow, style]}
      {...rest}
    >
      {children}
    </View>
  );
}
