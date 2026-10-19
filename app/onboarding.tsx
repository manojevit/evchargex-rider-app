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
import { gradients } from '@/lib/theme';
import { cn } from '@/lib/cn';

const { width } = Dimensions.get('window');

type Slide = { Icon: LucideIcon; accent: string; title: string; body: string };

const SLIDES: Slide[] = [
  {
    Icon: Zap,
    accent: '#3B82F6',
    title: 'Swap, don’t wait to charge',
    body: 'Trade your empty pack for a fully charged one in under a minute. No cables, no waiting.',
  },
  {
    Icon: MapPin,
    accent: '#22D3EE',
    title: 'Stations all around you',
    body: 'Find the nearest hub, see live battery availability, and navigate straight to it.',
  },
  {
    Icon: BatteryCharging,
    accent: '#34D399',
    title: 'One simple monthly plan',
    body: 'Unlimited swaps for a flat monthly fee. Nothing to meter, nothing to dispute.',
  },
];

/** Glowing brand hero for the dark onboarding — layered accent halo + glass tile. */
function Hero({ Icon, accent }: { Icon: LucideIcon; accent: string }) {
  return (
    <View style={{ width: 260, height: 260, alignItems: 'center', justifyContent: 'center' }}>
      {/* Breathing outer halo */}
      <MotiView
        from={{ opacity: 0.35, scale: 0.92 }}
        animate={{ opacity: 0.6, scale: 1.08 }}
        transition={{ type: 'timing', duration: 2600, loop: true, repeatReverse: true }}
        style={{ position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: accent, opacity: 0.12 }}
      />
      <View style={{ position: 'absolute', width: 190, height: 190, borderRadius: 95, backgroundColor: accent, opacity: 0.16 }} />
      <View style={{ position: 'absolute', width: 190, height: 190, borderRadius: 95, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }} />
      {/* Glass tile */}
      <MotiView
        from={{ opacity: 0, scale: 0.8, translateY: 8 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 14, stiffness: 150 }}
        style={{
          width: 124,
          height: 124,
          borderRadius: 38,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.14)',
        }}
      >
        <Icon size={56} color={accent} strokeWidth={1.8} />
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
    <View className="flex-1" style={{ backgroundColor: '#0B1420' }}>
      <StatusBar style="light" />
      {/* Brand-black backdrop (same tone as the splash) */}
      <LinearGradient
        colors={gradients.splash}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View style={{ flex: 1, paddingTop: insets.top }}>
        {/* Top bar: logo + skip */}
        <View className="flex-row items-center justify-between px-5 pt-3">
          <Logo variant="row" tone="light" size="sm" />
          <Pressable hitSlop={10} onPress={() => router.replace('/(auth)/login')}>
            <Txt weight="semibold" className="text-[15px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
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

              <Txt weight="black" className="mt-12 text-center text-[27px] leading-9" style={{ color: '#FFFFFF' }}>
                {item.title}
              </Txt>
              <Txt weight="regular" className="mt-4 text-center text-[16px] leading-6" style={{ color: 'rgba(255,255,255,0.62)' }}>
                {item.body}
              </Txt>
            </View>
          )}
        />

        {/* Footer */}
        <View className="px-6" style={{ paddingBottom: insets.bottom + 20 }}>
          <View className="mb-8 flex-row items-center justify-center gap-2">
            {SLIDES.map((_, i) => (
              <View
                key={i}
                className={cn('h-2 rounded-full', i === index ? 'w-7' : 'w-2')}
                style={{ backgroundColor: i === index ? '#FFFFFF' : 'rgba(255,255,255,0.22)' }}
              />
            ))}
          </View>
          <Button label={last ? 'Get started' : 'Continue'} onPress={next} />
        </View>
      </View>
    </View>
  );
}
