import { useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { BatteryCharging, MapPin, Zap, type LucideIcon } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';

const { width } = Dimensions.get('window');

type Slide = { Icon: LucideIcon; accent: string; title: string; body: string };

const SLIDES: Slide[] = [
  {
    Icon: Zap,
    accent: colors.brand, // blue
    title: 'Swap, don’t wait to charge',
    body: 'Trade your empty pack for a fully charged one in under a minute. No cables, no waiting.',
  },
  {
    Icon: MapPin,
    accent: '#0EA5E9', // sky
    title: 'Stations all around you',
    body: 'Find the nearest hub, see live battery availability, and navigate straight to it.',
  },
  {
    Icon: BatteryCharging,
    accent: colors.success, // green
    title: 'One simple monthly plan',
    body: 'Unlimited swaps for a flat monthly fee. Nothing to meter, nothing to dispute.',
  },
];

/**
 * Light hero: small, soft accent glow (layered low-opacity rings for a smooth
 * radial falloff) behind a white tile holding the feature icon.
 */
function Hero({ Icon, accent }: { Icon: LucideIcon; accent: string }) {
  // Closely-spaced, very low-opacity rings = a smooth, faint radial glow.
  const rings = [
    { size: 168, opacity: 0.05 },
    { size: 142, opacity: 0.06 },
    { size: 118, opacity: 0.07 },
  ];
  return (
    <View style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center' }}>
      {/* Breathing outermost ring — stays faint (animate opacity drives the view, so keep it low). */}
      <MotiView
        from={{ opacity: 0.04, scale: 0.95 }}
        animate={{ opacity: 0.085, scale: 1.05 }}
        transition={{ type: 'timing', duration: 3000, loop: true, repeatReverse: true }}
        style={{ position: 'absolute', width: 196, height: 196, borderRadius: 98, backgroundColor: accent }}
      />
      {rings.map((r) => (
        <View
          key={r.size}
          style={{ position: 'absolute', width: r.size, height: r.size, borderRadius: r.size / 2, backgroundColor: accent, opacity: r.opacity }}
        />
      ))}
      {/* White tile */}
      <MotiView
        from={{ opacity: 0, scale: 0.82, translateY: 8 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 14, stiffness: 150 }}
        style={{
          width: 96,
          height: 96,
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          shadowColor: accent,
          shadowOpacity: 0.22,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        }}
      >
        <Icon size={44} color={accent} strokeWidth={1.9} />
      </MotiView>
    </View>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList>(null);

  const onViewable = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;

  const last = index === SLIDES.length - 1;
  const next = () => {
    if (last) router.replace('/(auth)/login');
    else ref.current?.scrollToIndex({ index: index + 1 });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFFFFF' }}>
      <StatusBar style="dark" />
      {/* Soft light backdrop */}
      <LinearGradient
        colors={['#FFFFFF', '#F3F7FC', '#EAF1F9']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View style={{ flex: 1, paddingTop: insets.top }}>
        {/* Top bar: logo + skip */}
        <View className="flex-row items-center justify-between px-5 pt-3">
          <Logo variant="row" tone="dark" size="sm" />
          <Pressable hitSlop={10} onPress={() => router.replace('/(auth)/login')}>
            <Txt weight="semibold" className="text-[15px] text-muted">
              Skip
            </Txt>
          </Pressable>
        </View>

        <FlatList
          ref={ref}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => String(i)}
          onViewableItemsChanged={onViewable}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          renderItem={({ item }) => (
            <View style={{ width }} className="flex-1 items-center justify-center px-9">
              <Hero Icon={item.Icon} accent={item.accent} />

              <Txt weight="black" className="mt-12 text-center text-[27px] leading-9 text-foreground">
                {item.title}
              </Txt>
              <Txt weight="regular" className="mt-4 text-center text-[16px] leading-6 text-muted">
                {item.body}
              </Txt>
            </View>
          )}
        />

        {/* Footer */}
        <View className="px-6" style={{ paddingBottom: insets.bottom + 20 }}>
          <View className="mb-8 flex-row items-center justify-center gap-2">
            {SLIDES.map((_, i) => (
              <View key={i} className={cn('h-2 rounded-full', i === index ? 'w-7 bg-primary' : 'w-2 bg-border')} />
            ))}
          </View>
          <Button label={last ? 'Get started' : 'Continue'} onPress={next} />
        </View>
      </View>
    </View>
  );
}
