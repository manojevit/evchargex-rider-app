import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Home, Layers, ScanLine, UserRound, Zap } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { colors, floatShadow, gradients } from '@/lib/theme';
import { cn } from '@/lib/cn';

const TABS: Record<string, { label: string; Icon: typeof Home }> = {
  home: { label: 'Home', Icon: Home },
  stations: { label: 'Stations', Icon: Zap },
  plan: { label: 'Plan', Icon: Layers },
  menu: { label: 'Menu', Icon: UserRound },
};

/**
 * Floating white tab bar (Home · Stations · Plan · Menu) with a separate
 * circular QR scan button anchored at the bottom-right, as requested.
 */
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
      <View pointerEvents="box-none" className="absolute right-5 items-center" style={{ bottom: bottom + 80 }}>
        <Pressable
          onPress={() => router.push('/scan')}
          style={({ pressed }) => [floatShadow, pressed && { transform: [{ scale: 0.93 }] }]}
          hitSlop={10}
        >
          <LinearGradient
            colors={gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 4,
              borderColor: '#FFFFFF',
            }}
          >
            <ScanLine size={30} color="#fff" strokeWidth={2.4} />
          </LinearGradient>
        </Pressable>
      </View>

      {/* Tab bar */}
      <View
        className="mx-4 flex-row items-center justify-around rounded-[26px] bg-surface px-2 py-2"
        style={[{ marginBottom: bottom }, cardBarShadow]}
      >
        {state.routes.map((route, index) => {
          const cfg = TABS[route.name];
          if (!cfg) return null;
          const focused = state.index === index;
          const { Icon } = cfg;

          const onPress = () => {
            if (!focused) navigateToTab(route.key);
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className="flex-1 items-center justify-center py-1.5"
              hitSlop={6}
            >
              <View className={cn('items-center justify-center rounded-2xl px-4 py-1', focused && 'bg-brand-50')}>
                <Icon size={23} color={focused ? colors.brand : colors.faint} strokeWidth={focused ? 2.6 : 2} />
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

const cardBarShadow = {
  shadowColor: '#0B1420',
  shadowOpacity: 0.1,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 10 },
  elevation: 12,
} as const;
