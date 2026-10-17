import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Txt } from './Txt';
import { cn } from '@/lib/cn';
import { colors, floatShadow, gradients } from '@/lib/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

interface Props extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  block?: boolean;
  className?: string;
}

const HEIGHT: Record<Size, string> = { md: 'h-12', lg: 'h-14' };

export function Button({
  label,
  variant = 'primary',
  size = 'lg',
  loading,
  leftIcon,
  rightIcon,
  block = true,
  className,
  disabled,
  ...rest
}: Props) {
  const isDisabled = disabled || loading;

  const textColor =
    variant === 'primary' || variant === 'danger'
      ? '#FFFFFF'
      : variant === 'outline' || variant === 'ghost'
        ? colors.brand
        : colors.ink;

  const inner = (
    <View className="flex-row items-center justify-center gap-2">
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {leftIcon}
          <Txt weight="bold" className="text-base" style={{ color: textColor }}>
            {label}
          </Txt>
          {rightIcon}
        </>
      )}
    </View>
  );

  const base = cn(HEIGHT[size], 'rounded-2xl items-center justify-center px-5', block && 'w-full', isDisabled && 'opacity-50', className);

  if (variant === 'primary') {
    return (
      <Pressable disabled={isDisabled} style={({ pressed }) => [floatShadow, pressed && { opacity: 0.9 }]} {...rest}>
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className={base}>
          {inner}
        </LinearGradient>
      </Pressable>
    );
  }

  const bg =
    variant === 'secondary'
      ? 'bg-brand-50'
      : variant === 'outline'
        ? 'bg-surface border border-brand-500'
        : variant === 'danger'
          ? 'bg-danger'
          : 'bg-transparent';

  return (
    <Pressable
      disabled={isDisabled}
      className={cn(base, bg)}
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
      {...rest}
    >
      {inner}
    </Pressable>
  );
}
