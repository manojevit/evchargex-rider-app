import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Home, Layers, ScanLine, UserRound, Zap } from 'lucide-react-native';
import { MotiView } from '@/lib/motion';
import { Txt } from '@/components/ui/Txt';
import { tap } from '@/lib/haptics';
import { colors, floatShadow, gradients } from '@/lib/theme';
import { cn } from '@/lib/cn';

const TABS: Record<string, { label: string; Icon: typeof Home }> = {
  home: { label: 'Home', Icon: Home },
  stations: { label: 'Stations', Icon: Zap },
  plan: { label: 'Plan', Icon: Layers },
  menu: { label: 'Menu', Icon: UserRound },
};

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab: (routeKey: string) => void;
};

export function TabBar({ state, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bottom = Math.max(insets.bottom, 12);

  return (
    <View pointerEvents="box-none" className="absolute inset-x-0 bottom-0">
      {/* QR scan FAB — bottom right, above the bar */}
      <View pointerEvents="box-none" className="absolute right-5" style={{ bottom: bottom + 82 }}>
        <Pressable
          onPress={() => {
            tap('medium');
            router.push('/scan');
          }}
          style={({ pressed }) => [floatShadow, pressed && { transform: [{ scale: 0.92 }] }]}
          hitSlop={10}
        >
          <LinearGradient
            colors={gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 62,
              height: 62,
              borderRadius: 31,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 4,
              borderColor: '#FFFFFF',
            }}
          >
            <ScanLine size={28} color="#fff" strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
      </View>

      {/* Tab bar */}
      <View
        className="mx-4 flex-row items-center rounded-[28px] bg-card px-2 py-2"
        style={[{ marginBottom: bottom }, barShadow]}
      >
        {state.routes.map((route, index) => {
          const cfg = TABS[route.name];
          if (!cfg) return null;
          const focused = state.index === index;
          const { Icon } = cfg;

          const onPress = () => {
            if (focused) return;
            tap('light');
            navigateToTab(route.key);
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className="flex-1 items-center justify-center py-1"
              hitSlop={6}
              android_ripple={{ color: 'transparent' }}
            >
              <View className="h-9 items-center justify-center">
                {/* animated active pill */}
                <MotiView
                  animate={{ opacity: focused ? 1 : 0, scale: focused ? 1 : 0.6 }}
                  transition={{ type: 'timing', duration: 220 }}
                  className="absolute h-9 w-16 rounded-2xl bg-brand-50"
                />
                <MotiView animate={{ scale: focused ? 1.1 : 1, translateY: focused ? -1 : 0 }} transition={{ type: 'spring', damping: 14 }}>
                  <Icon size={23} color={focused ? colors.brand : colors.faint} strokeWidth={focused ? 2.6 : 2} />
                </MotiView>
              </View>
              <Txt
                weight={focused ? 'bold' : 'medium'}
                className={cn('mt-1 text-[11px]', focused ? 'text-brand-600' : 'text-faint')}
              >
                {cfg.label}
              </Txt>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const barShadow = {
  shadowColor: '#0B1420',
  shadowOpacity: 0.1,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 10 },
  elevation: 12,
} as const;
