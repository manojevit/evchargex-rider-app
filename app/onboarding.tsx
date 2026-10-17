import { useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { BatteryCharging, MapPin, Zap, type LucideIcon } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';
import { IconTile } from '@/components/ui/IconTile';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';

const { width } = Dimensions.get('window');

const SLIDES: { Icon: LucideIcon; tone: 'brand' | 'success' | 'info'; title: string; body: string }[] = [
  {
    Icon: Zap,
    tone: 'brand',
    title: 'Swap, don’t wait to charge',
    body: 'Trade your empty pack for a fully charged one in under a minute. No cables, no waiting around.',
  },
  {
    Icon: MapPin,
    tone: 'info',
    title: 'Stations all around you',
    body: 'Find the nearest EVCHARGEX hub, check live battery availability, and navigate straight to it.',
  },
  {
    Icon: BatteryCharging,
    tone: 'success',
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
    <View className="flex-1 bg-canvas" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />
      <View className="flex-row justify-end px-5 pt-2">
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
          <View style={{ width }} className="items-center justify-center px-8">
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 14 }}
            >
              <IconTile tone={item.tone} size="lg" rounded="rounded-[32px]" className="h-28 w-28">
                <item.Icon size={52} color={colorFor(item.tone)} strokeWidth={1.8} />
              </IconTile>
            </MotiView>
            <Txt weight="black" className="mt-10 text-center text-[27px] leading-9 text-ink">
              {item.title}
            </Txt>
            <Txt weight="regular" className="mt-4 text-center text-[16px] leading-6 text-muted">
              {item.body}
            </Txt>
          </View>
        )}
      />

      <View className="px-6" style={{ paddingBottom: insets.bottom + 20 }}>
        <View className="mb-8 flex-row items-center justify-center gap-2">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={cn('h-2 rounded-full', i === index ? 'w-6 bg-brand-500' : 'w-2 bg-line')}
            />
          ))}
        </View>
        <Button label={last ? 'Get started' : 'Next'} onPress={next} />
      </View>
    </View>
  );
}

function colorFor(tone: 'brand' | 'success' | 'info'): string {
  return tone === 'brand' ? colors.brand : tone === 'success' ? colors.success : colors.info;
}
