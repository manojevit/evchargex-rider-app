import { ScrollView, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/lib/cn';

/**
 * Screen body on the canvas background. `scroll` wraps content in a ScrollView
 * with sensible bottom padding so the floating tab bar / FAB never covers it.
 */
export function Screen({
  children,
  scroll = true,
  className,
  contentClassName,
  padBottom = 120,
  ...rest
}: {
  children: React.ReactNode;
  scroll?: boolean;
  className?: string;
  contentClassName?: string;
  padBottom?: number;
} & ScrollViewProps) {
  if (!scroll) {
    return <View className={cn('flex-1 bg-canvas', className)}>{children}</View>;
  }
  return (
    <ScrollView
      className={cn('flex-1 bg-canvas', className)}
      contentContainerStyle={{ paddingBottom: padBottom }}
      showsVerticalScrollIndicator={false}
      contentContainerClassName={contentClassName}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

/** Spacer that fills the top safe-area inset (status bar) with a given bg. */
export function StatusBarSpacer({ className }: { className?: string }) {
  const insets = useSafeAreaInsets();
  return <View style={{ height: insets.top }} className={className} />;
}
