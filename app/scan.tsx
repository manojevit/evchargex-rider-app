import { useEffect, useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { Check, Info, Keyboard, QrCode, X } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { colors } from '@/lib/theme';
import { STATIONS } from '@/lib/data/stations';

const { width } = Dimensions.get('window');
const FRAME = Math.min(width - 72, 300);

// Scanning always "finds" the first online station, for a predictable demo.
const TARGET = STATIONS.find((s) => s.status === 'online') ?? STATIONS[0];

export default function Scan() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [found, setFound] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFound(true), 2600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!found) return;
    const t = setTimeout(() => router.replace(`/swap/preflight?station=${TARGET.id}`), 850);
    return () => clearTimeout(t);
  }, [found, router]);

  return (
    <View className="flex-1 bg-[#0B1420]">
      <StatusBar style="light" />
      {/* Simulated camera backdrop */}
      <LinearGradient colors={['#1B2430', '#0B1420']} className="absolute inset-0" />

      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center justify-between px-5">
        <Pressable onPress={() => router.back()} hitSlop={10} className="h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
          <X size={22} color="#fff" />
        </Pressable>
        <Txt weight="bold" className="text-[17px] text-white" style={{ color: '#fff' }}>
          Scan to swap
        </Txt>
        <View className="h-11 w-11" />
      </View>

      <View className="flex-1 items-center justify-center">
        <View style={{ width: FRAME, height: FRAME }} className="items-center justify-center">
          {/* corner brackets */}
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />

          {!found ? (
            <>
              <MotiView
                from={{ translateY: -FRAME / 2 + 20 }}
                animate={{ translateY: FRAME / 2 - 20 }}
                transition={{ type: 'timing', duration: 1600, loop: true, repeatReverse: true }}
                className="absolute h-0.5 w-[80%]"
              >
                <LinearGradient colors={['transparent', '#3B82F6', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="h-full w-full" />
              </MotiView>
              <QrCode size={64} color="rgba(255,255,255,0.85)" strokeWidth={1.4} />
              <Txt weight="medium" className="mt-4 text-[14px] text-white/80" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Point at the cabinet QR
              </Txt>
            </>
          ) : (
            <MotiView from={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 12 }} className="items-center">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-success">
                <Check size={44} color="#fff" strokeWidth={3} />
              </View>
              <Txt weight="bold" className="mt-4 text-[16px] text-white" style={{ color: '#fff' }}>
                {TARGET.code} detected
              </Txt>
            </MotiView>
          )}
        </View>
      </View>

      <View style={{ paddingBottom: insets.bottom + 24 }} className="px-6">
        <View className="rounded-2xl bg-white/10 p-4">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <QrCode size={20} color="#fff" />
            </View>
            <View className="flex-1">
              <Txt weight="bold" className="text-[15px] text-white" style={{ color: '#fff' }}>
                Scan the QR on the cabinet
              </Txt>
              <Txt weight="regular" className="text-[12.5px] text-white/70" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Align the code within the frame to start your swap.
              </Txt>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => router.replace(`/swap/preflight?station=${TARGET.id}`)}
          className="mt-3 flex-row items-center justify-center gap-2 rounded-2xl bg-white/10 py-3.5"
        >
          <Keyboard size={18} color="#fff" />
          <Txt weight="semibold" className="text-[14px] text-white" style={{ color: '#fff' }}>
            Enter code manually
          </Txt>
        </Pressable>

        <View className="mt-3 flex-row items-center justify-center gap-1.5">
          <Info size={13} color="rgba(255,255,255,0.6)" />
          <Txt weight="regular" className="text-[12px] text-white/60" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Demo: scanning is simulated — no camera needed.
          </Txt>
        </View>
      </View>
    </View>
  );
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute h-8 w-8 border-brand-400';
  const map: Record<string, string> = {
    tl: 'left-0 top-0 border-l-[3px] border-t-[3px] rounded-tl-xl',
    tr: 'right-0 top-0 border-r-[3px] border-t-[3px] rounded-tr-xl',
    bl: 'left-0 bottom-0 border-l-[3px] border-b-[3px] rounded-bl-xl',
    br: 'right-0 bottom-0 border-r-[3px] border-b-[3px] rounded-br-xl',
  };
  return <View className={`${base} ${map[pos]}`} />;
}
