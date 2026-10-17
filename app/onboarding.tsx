import { useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

type Slide = { Icon: LucideIcon; color: string; tint: string; title: string; body: string };

const SLIDES: Slide[] = [
  {
    Icon: Zap,
    color: colors.brand,
    tint: '#EEF4FF',
    title: 'Swap, don’t wait to charge',
    body: 'Trade your empty pack for a fully charged one in under a minute. No cables, no waiting.',
  },
  {
    Icon: MapPin,
    color: colors.info,
    tint: '#DBEAFE',
    title: 'Stations all around you',
    body: 'Find the nearest hub, see live battery availability, and navigate straight to it.',
  },
  {
    Icon: BatteryCharging,
    color: colors.success,
    tint: '#DCFCE7',
    title: 'One simple monthly plan',
    body: 'Unlimited swaps for a flat monthly fee. Nothing to meter, nothing to dispute.',
  },
];

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
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />
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
            {/* Layered hero graphic */}
            <MotiView
              from={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              style={{ width: 240, height: 240, alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={{ position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: item.tint, opacity: 0.45 }} />
              <View style={{ position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: item.tint, opacity: 0.8 }} />
              <View style={{ width: 120, height: 120, borderRadius: 40, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <item.Icon size={56} color={item.color} strokeWidth={1.8} />
              </View>
            </MotiView>

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
  );
}
