import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { ArrowDownToLine, ArrowUpFromLine, BatteryFull, ShieldCheck, X, Zap } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/theme';
import { getStation } from '@/lib/data/stations';

/**
 * Quick "start swap" popup (transparent modal). Opened from the station screen,
 * the home nudge, and after a scan. Shows which slot to use and starts the
 * live swap in one tap — no separate preflight page.
 */
export default function SwapStart() {
  const { station: stationId } = useLocalSearchParams<{ station: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const station = getStation(stationId);

  const close = () => router.back();

  if (!station) {
    close();
    return null;
  }

  const returnSlot = station.slots.find((s) => s.state === 'empty')?.slot_number ?? station.slots[0].slot_number;
  const charged = [...station.slots].filter((s) => s.state === 'charged').sort((a, b) => (b.soc ?? 0) - (a.soc ?? 0));
  const dispense = charged[0];

  const start = () => {
    router.replace(`/swap/live?station=${station.id}&ret=${returnSlot}&disp=${dispense?.slot_number ?? ''}`);
  };

  return (
    <View className="flex-1 justify-end">
      {/* Backdrop */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 180 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(8,13,20,0.55)' }}
      >
        <Pressable style={{ flex: 1 }} onPress={close} />
      </MotiView>

      {/* Sheet */}
      <MotiView
        from={{ translateY: 420 }}
        animate={{ translateY: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
        style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: insets.bottom + 18,
        }}
      >
        {/* Grab handle */}
        <View className="mb-4 items-center">
          <View className="h-1.5 w-10 rounded-full bg-border" />
        </View>

        {/* Header */}
        <View className="flex-row items-center">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-brand-50">
            <Zap size={22} color={colors.brand} fill={colors.brand} />
          </View>
          <View className="ml-3 flex-1">
            <Txt weight="black" className="text-[19px] text-ink">
              Ready to swap
            </Txt>
            <Txt weight="medium" className="text-[12.5px] text-muted" numberOfLines={1}>
              {station.code} · {station.name}
            </Txt>
          </View>
          <Pressable onPress={close} hitSlop={10} className="h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <X size={18} color={colors.muted} />
          </Pressable>
        </View>

        {/* Status line */}
        <View className="mt-4 flex-row items-center gap-1.5 self-start rounded-full bg-success-soft px-3 py-1.5">
          <BatteryFull size={14} color={colors.success} />
          <Txt weight="bold" className="text-[12px] text-success-ink">
            Online · {charged.length} full batteries ready
          </Txt>
        </View>

        {/* Steps: put in / take out */}
        <View className="mt-4 gap-2.5">
          <SlotRow
            tone="brand"
            icon={<ArrowDownToLine size={20} color={colors.brand} />}
            label="Put your empty battery in"
            slot={returnSlot}
          />
          <SlotRow
            tone="success"
            icon={<ArrowUpFromLine size={20} color={colors.success} />}
            label="Take your full battery from"
            slot={dispense?.slot_number ?? returnSlot}
          />
        </View>

        {/* Note */}
        <View className="mt-3 flex-row items-start gap-2 rounded-2xl bg-brand-50 p-3.5">
          <ShieldCheck size={16} color={colors.brand} style={{ marginTop: 1 }} />
          <Txt weight="medium" className="flex-1 text-[12.5px] leading-5 text-brand-700">
            You’ll have 3 minutes once you start. Your plan covers this — no charge.
          </Txt>
        </View>

        {/* Actions */}
        <View className="mt-5">
          <Button label="Start swap now" leftIcon={<Zap size={18} color="#fff" fill="#fff" />} onPress={start} />
        </View>
        <Pressable onPress={close} className="mt-2 items-center py-2.5">
          <Txt weight="bold" className="text-[14px] text-muted">
            Cancel
          </Txt>
        </Pressable>
      </MotiView>
    </View>
  );
}

function SlotRow({
  tone,
  icon,
  label,
  slot,
}: {
  tone: 'brand' | 'success';
  icon: React.ReactNode;
  label: string;
  slot: number;
}) {
  return (
    <View className="flex-row items-center rounded-2xl border border-border bg-card p-3.5">
      <View className={`h-11 w-11 items-center justify-center rounded-xl ${tone === 'brand' ? 'bg-brand-50' : 'bg-success-soft'}`}>
        {icon}
      </View>
      <Txt weight="semibold" className="ml-3 flex-1 text-[14px] text-ink">
        {label}
      </Txt>
      <View className={`rounded-xl px-3 py-1.5 ${tone === 'brand' ? 'bg-brand-500' : 'bg-success'}`}>
        <Txt weight="black" className="text-[14px] text-white" style={{ color: '#fff' }}>
          Slot {slot}
        </Txt>
      </View>
    </View>
  );
}
