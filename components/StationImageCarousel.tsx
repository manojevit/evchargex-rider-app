import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';

type Photo = { uri: string; label: string };

/**
 * Auto-sliding, swipeable station photo carousel with dots and captions.
 * Falls back to a branded placeholder if an image fails to load.
 */
export function StationImageCarousel({
  images,
  height = 180,
  rounded = 24,
  online = true,
}: {
  images: Photo[];
  height?: number;
  rounded?: number;
  online?: boolean;
}) {
  const [w, setW] = useState(0);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const listRef = useRef<FlatList<Photo>>(null);
  const indexRef = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const n = images.length;

  const start = () => {
    stop();
    if (n <= 1 || w === 0) return;
    timer.current = setInterval(() => {
      const next = (indexRef.current + 1) % n;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      indexRef.current = next;
      setIndex(next);
    }, 3500);
  };
  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, n]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (w === 0) return;
    const i = Math.round(e.nativeEvent.contentOffset.x / w);
    indexRef.current = i;
    setIndex(i);
    start();
  };

  return (
    <View
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
      style={{ height, borderRadius: rounded, overflow: 'hidden', backgroundColor: online ? '#E6F4EC' : '#FBE9E9' }}
    >
      {w > 0 && (
        <FlatList
          ref={listRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => String(i)}
          getItemLayout={(_, i) => ({ length: w, offset: w * i, index: i })}
          onScrollBeginDrag={stop}
          onMomentumScrollEnd={onScrollEnd}
          renderItem={({ item, index: i }) => (
            <View style={{ width: w, height }}>
              {failed[i] ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: online ? '#E6F4EC' : '#FBE9E9' }}>
                  <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/70">
                    <Zap size={28} color={online ? colors.success : colors.danger} fill={online ? colors.success : colors.danger} strokeWidth={1.2} />
                  </View>
                </View>
              ) : (
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: w, height }}
                  resizeMode="cover"
                  onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                />
              )}
            </View>
          )}
        />
      )}

      {/* bottom gradient + caption */}
      <LinearGradient
        colors={['transparent', 'rgba(11,20,32,0.55)']}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, justifyContent: 'flex-end', paddingHorizontal: 14, paddingBottom: 10 }}
        pointerEvents="none"
      >
        <Txt weight="semibold" className="text-[12px]" style={{ color: 'rgba(255,255,255,0.95)' }}>
          {images[index]?.label} · representative photo
        </Txt>
      </LinearGradient>

      {/* dots */}
      <View style={{ position: 'absolute', top: 12, right: 12, flexDirection: 'row', gap: 5 }} pointerEvents="none">
        {images.map((_, i) => (
          <View
            key={i}
            className={cn('rounded-full', i === index ? 'bg-white' : 'bg-white/50')}
            style={{ width: i === index ? 18 : 6, height: 6 }}
          />
        ))}
      </View>
    </View>
  );
}
