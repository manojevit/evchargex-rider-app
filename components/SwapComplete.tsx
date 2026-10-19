import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { Check } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/theme';

export function SwapComplete({
  stationName,
  gaveSerial,
  tookSerial,
  seconds,
}: {
  stationName: string;
  gaveSerial: string;
  tookSerial: string;
  seconds: number;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const txId = useRef(Math.random().toString(16).slice(2, 8).toUpperCase()).current;

  // Auto-return to home after 5s; the Done button does it immediately.
  const [count, setCount] = useState(5);
  const navigated = useRef(false);

  const goHome = () => {
    if (navigated.current) return;
    navigated.current = true;
    router.replace('/(tabs)/home');
  };

  useEffect(() => {
    const iv = setInterval(() => setCount((c) => Math.max(0, c - 1)), 1000);
    const t = setTimeout(goHome, 5000);
    return () => {
      clearInterval(iv);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows: [string, React.ReactNode][] = [
    ['Old battery ID', <Txt weight="bold" className="text-[14px] text-ink">{gaveSerial}</Txt>],
    ['New battery ID', <Txt weight="bold" className="text-[14px] text-ink">{tookSerial}</Txt>],
    ['Station', <Txt weight="bold" className="text-[14px] text-ink">{stationName}</Txt>],
    ['Transaction ID', <Txt weight="semibold" className="text-[13px] text-muted">{txId}</Txt>],
    ['Swap time', <Txt weight="bold" className="text-[14px] text-ink">{seconds} sec</Txt>],
    ['Charged', <Txt weight="bold" className="text-[14px] text-success">Included in plan · ₹0</Txt>],
  ];

  return (
    <View className="flex-1 bg-canvas" style={{ paddingTop: insets.top + 16 }}>
      <View className="flex-1 px-5">
        <View className="items-center pt-6">
          <MotiView from={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 13, stiffness: 220 }}>
            <View className="h-28 w-28 items-center justify-center rounded-full bg-success-soft">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-success">
                <Check size={44} color="#fff" strokeWidth={3} />
              </View>
            </View>
          </MotiView>
          <Txt weight="black" className="mt-7 text-center text-[26px] text-ink">
            Battery swap completed
          </Txt>
          <Txt weight="regular" className="mt-2 text-center text-[14.5px] text-muted">
            Your battery has been swapped successfully.
          </Txt>
        </View>

        <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 220 }} className="mt-7">
          <Card>
            {rows.map(([k, v], i) => (
              <View key={k} className={i > 0 ? 'mt-3 flex-row items-center justify-between border-t border-line pt-3' : 'flex-row items-center justify-between'}>
                <Txt weight="medium" className="text-[13.5px] text-muted">
                  {k}
                </Txt>
                {v}
              </View>
            ))}
          </Card>
        </MotiView>
      </View>

      <View className="px-5" style={{ paddingBottom: insets.bottom + 16 }}>
        <Txt weight="medium" className="mb-3 text-center text-[12.5px] text-muted">
          Returning to home in {count}s
        </Txt>
        <Button label="Done" onPress={goHome} />
        <View className="mt-3">
          <Button
            label="View swap history"
            variant="ghost"
            onPress={() => {
              navigated.current = true;
              router.replace('/history');
            }}
          />
        </View>
      </View>
    </View>
  );
}
