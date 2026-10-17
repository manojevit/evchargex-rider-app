import { ActivityIndicator, Pressable, type GestureResponderEvent, type PressableProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cva, type VariantProps } from 'class-variance-authority';
import { Txt } from './Txt';
import { cn } from '@/lib/cn';
import { tap } from '@/lib/haptics';
import { colors, floatShadow, gradients } from '@/lib/theme';

/**
 * shadcn / react-native-reusables Button, with a tactile press (sinks slightly)
 * inspired by opensourceui. Variant names kept backwards-compatible with the
 * app (primary / secondary / outline / ghost / danger).
 */
const buttonVariants = cva('flex-row items-center justify-center rounded-2xl', {
  variants: {
    variant: {
      primary: '',
      secondary: 'bg-secondary',
      outline: 'border border-border bg-card',
      ghost: 'bg-transparent',
      danger: 'bg-destructive',
    },
    size: {
      sm: 'h-10 px-4 gap-1.5',
      md: 'h-12 px-5 gap-2',
      lg: 'h-14 px-6 gap-2',
    },
    block: { true: 'w-full', false: 'self-start' },
  },
  defaultVariants: { variant: 'primary', size: 'lg', block: true },
});

interface Props
  extends Omit<PressableProps, 'children' | 'style'>,
    VariantProps<typeof buttonVariants> {
  label: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const TEXT_COLOR: Record<string, string> = {
  primary: '#FFFFFF',
  danger: '#FFFFFF',
  secondary: colors.brand700,
  outline: colors.ink,
  ghost: colors.brand,
};

const TEXT_SIZE: Record<string, string> = { sm: 'text-[14px]', md: 'text-[15px]', lg: 'text-[16px]' };
const SIZE_H: Record<string, number> = { sm: 40, md: 48, lg: 56 };

export function Button({
  label,
  variant = 'primary',
  size = 'lg',
  block = true,
  loading,
  leftIcon,
  rightIcon,
  className,
  disabled,
  onPress,
  ...rest
}: Props) {
  const isDisabled = disabled || loading;
  const textColor = TEXT_COLOR[variant ?? 'primary'];
  const textSize = TEXT_SIZE[size ?? 'lg'];

  const handlePress = (e: GestureResponderEvent) => {
    tap('light');
    onPress?.(e);
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {leftIcon}
          <Txt weight="bold" className={textSize} style={{ color: textColor }} numberOfLines={1}>
            {label}
          </Txt>
          {rightIcon}
        </>
      )}
    </>
  );

  const shell = cn(buttonVariants({ variant, size, block }), isDisabled && 'opacity-50', className);

  // Primary = brand gradient with a soft glow. Layout is set via `style` (not
  // just className) because expo-linear-gradient doesn't reliably apply flex
  // classes on web.
  if (variant === 'primary') {
    return (
      <Pressable
        disabled={isDisabled}
        onPress={handlePress}
        style={({ pressed }) => [
          floatShadow,
          block ? { width: '100%' } : { alignSelf: 'flex-start' },
          isDisabled && { opacity: 0.5 },
          pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 },
        ]}
        {...rest}
      >
        <LinearGradient
          colors={gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            height: SIZE_H[size ?? 'lg'],
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
            columnGap: 8,
          }}
          className={className}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      disabled={isDisabled}
      onPress={handlePress}
      className={shell}
      style={({ pressed }) => (pressed ? { transform: [{ scale: 0.98 }], opacity: 0.9 } : undefined)}
      {...rest}
    >
      {content}
    </Pressable>
  );
}

export { buttonVariants };
