import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { AnimatePresence, MotiView } from '@/lib/motion';
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  BatteryCharging,
  Check,
  DoorClosed,
} from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CabinetGrid } from '@/components/CabinetGrid';
import { SwapComplete } from '@/components/SwapComplete';
import { colors } from '@/lib/theme';
import { mmss } from '@/lib/format';
import { cn } from '@/lib/cn';
import { getStation } from '@/lib/data/stations';

type Phase = 'return_open' | 'inserted' | 'verifying' | 'processing' | 'dispense_open' | 'collected' | 'completed';

const ORDER: Phase[] = ['return_open', 'inserted', 'verifying', 'processing', 'dispense_open', 'collected', 'completed'];
const STEP_OF: Record<Phase, number> = {
  return_open: 1,
  inserted: 2,
  verifying: 3,
  processing: 4,
  dispense_open: 5,
  collected: 6,
  completed: 6,
};

// The rider advances each step themselves — nothing happens automatically.
const NEXT_LABEL: Record<Phase, string> = {
  return_open: 'I’ve inserted my battery',
  inserted: 'I’ve closed the door',
  verifying: 'Battery verified — continue',
  processing: 'Dispense my charged battery',
  dispense_open: 'I’ve collected the battery',
  collected: 'Finish swap',
  completed: '',
};

export default function SwapLive() {
  const { station: stationId, ret, disp } = useLocalSearchParams<{ station: string; ret: string; disp: string }>();
  const insets = useSafeAreaInsets();
  const station = getStation(stationId);

  const returnSlot = Number(ret);
  const dispenseSlot = Number(disp);

  const [phase, setPhase] = useState<Phase>('return_open');
  const [remaining, setRemaining] = useState(180);
  const startedAt = useRef(Date.now());

  // Countdown — visual only; it never forces a step.
  useEffect(() => {
    if (phase === 'completed') return;
    const t = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
      setRemaining(Math.max(0, 180 - elapsed));
    }, 500);
    return () => clearInterval(t);
  }, [phase]);

  const advance = () => setPhase((p) => {
    const i = ORDER.indexOf(p);
    return i < ORDER.length - 1 ? ORDER[i + 1] : p;
  });

  const dispenseSerial = useMemo(
    () => station?.slots.find((s) => s.slot_number === dispenseSlot)?.serial ?? 'INCBZG5145M0625',
    [station, dispenseSlot],
  );

  if (!station) {
    return (
      <View className="flex-1 bg-background">
        <AppBar title="Swap" back />
      </View>
    );
  }

  if (phase === 'completed') {
    const seconds = Math.round((Date.now() - startedAt.current) / 1000);
    return (
      <SwapComplete
        stationName={station.name}
        gaveSerial="INCBZG5145M0241"
        tookSerial={dispenseSerial}
        seconds={seconds}
      />
    );
  }

  const step = STEP_OF[phase];
  const urgent = remaining <= 20;
  const timerVisible = phase === 'return_open' || phase === 'inserted';
  const highlightSlot = phase === 'return_open' || phase === 'inserted' ? returnSlot : phase === 'dispense_open' || phase === 'collected' ? dispenseSlot : null;
  const openSlot = phase === 'return_open' ? returnSlot : phase === 'dispense_open' ? dispenseSlot : null;

  return (
    <View className="flex-1 bg-background">
      <AppBar title="Swap in progress" />
      <Screen contentClassName="px-5 pt-2" padBottom={120}>
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={phase}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -12 }}
            transition={{ type: 'timing', duration: 260 }}
          >
            <PhaseView phase={phase} returnSlot={returnSlot} dispenseSlot={dispenseSlot} remaining={remaining} urgent={urgent} timerVisible={timerVisible} />
          </MotiView>
        </AnimatePresence>

        {/* Live cabinet */}
        <View className="mt-6">
          <Txt weight="bold" className="mb-3 text-center text-[12px] uppercase tracking-widest text-muted">
            Live cabinet status
          </Txt>
          <CabinetGrid slots={station.slots} highlightSlot={highlightSlot} openSlot={openSlot} />
        </View>

        {/* Step progress */}
        <View className="mt-2 items-center">
          <Txt weight="bold" className="mb-2 text-[11px] uppercase tracking-wider text-muted">
            Step {step} of 6
          </Txt>
          <View className="w-[70%] flex-row gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} className={cn('h-1.5 flex-1 rounded-full', i < step ? 'bg-primary' : 'bg-border')} />
            ))}
          </View>
        </View>
      </Screen>

      {/* Fixed action button — the rider taps to advance each step */}
      <View className="absolute inset-x-0 bottom-0 border-t border-border bg-card px-5 pt-3" style={{ paddingBottom: insets.bottom + 12 }}>
        <Button label={NEXT_LABEL[phase]} onPress={advance} rightIcon={<ArrowRight size={18} color="#fff" />} />
      </View>
    </View>
  );
}

function PhaseView({
  phase,
  returnSlot,
  dispenseSlot,
  remaining,
  urgent,
  timerVisible,
}: {
  phase: Phase;
  returnSlot: number;
  dispenseSlot: number;
  remaining: number;
  urgent: boolean;
  timerVisible: boolean;
}) {
  if (phase === 'return_open') {
    return (
      <View className="items-center">
        <Txt weight="black" className="text-center text-[30px] text-primary">
          Slot {returnSlot} is open
        </Txt>
        <Txt weight="regular" className="mt-2 text-center text-[14px] text-muted">
          Open the lit slot and insert your discharged battery.
        </Txt>
        {timerVisible && (
          <>
            <Txt weight="black" className={cn('mt-5 text-[56px] tabular-nums', urgent ? 'text-danger' : 'text-foreground')}>
              {mmss(remaining)}
            </Txt>
            <View className="w-[60%]">
              <ProgressBar value={(remaining / 180) * 100} tone={urgent ? 'danger' : 'brand'} />
            </View>
          </>
        )}
        <View className="mt-6 w-full rounded-2xl bg-card p-5" style={{ shadowColor: '#0B1420', shadowOpacity: 0.04, shadowRadius: 10, elevation: 1 }}>
          {['Remove the battery from your vehicle.', 'Insert it into the opened slot.', 'Connect the cabinet connector.'].map((t, i) => (
            <View key={i} className={cn('flex-row items-center', i > 0 && 'mt-3')}>
              <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Txt weight="bold" className="text-[11px]" style={{ color: '#fff' }}>
                  {i + 1}
                </Txt>
              </View>
              <Txt weight="semibold" className="ml-3 flex-1 text-[14px] text-foreground">
                {t}
              </Txt>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (phase === 'inserted') {
    return (
      <Centered
        tone="brand"
        icon={<ArrowDownToLine size={46} color={colors.brand} />}
        title="Battery deposited"
        lines={[`Discharged battery detected in Slot ${returnSlot}.`, 'Now close the cabinet door, then tap below.']}
      />
    );
  }

  if (phase === 'verifying' || phase === 'processing') {
    return (
      <View className="items-center">
        <MotiView from={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ loop: true, type: 'timing', duration: 900 }} className="h-28 w-28 items-center justify-center rounded-full bg-success-soft">
          {phase === 'verifying' ? <Check size={52} color={colors.success} strokeWidth={3} /> : <BatteryCharging size={48} color={colors.success} />}
        </MotiView>
        <Txt weight="black" className="mt-6 text-center text-[24px] text-success">
          {phase === 'verifying' ? 'Verifying your battery' : 'Return confirmed'}
        </Txt>
        <Txt weight="medium" className="mt-2 text-center text-[14px] text-foreground">
          {phase === 'verifying' ? 'The cabinet is checking the returned pack.' : 'A charged battery is ready for you.'}
        </Txt>
      </View>
    );
  }

  if (phase === 'dispense_open') {
    return (
      <View className="items-center">
        <Txt weight="black" className="text-center text-[30px] text-success">
          Collect charged battery
        </Txt>
        <Txt weight="regular" className="mt-2 text-center text-[14px] text-muted">
          Slot {dispenseSlot} is open for collection.
        </Txt>
        <View className="mt-5 rounded-full bg-success-soft px-5 py-2">
          <Txt weight="black" className="text-[18px] text-success-ink">
            Slot {dispenseSlot}
          </Txt>
        </View>
        <View className="mt-6 w-full rounded-2xl border border-success/20 bg-success-soft/40 p-5">
          {['Open the output slot.', 'Remove the charged battery.', 'Close the output door.'].map((t, i) => (
            <View key={i} className={cn('flex-row items-center', i > 0 && 'mt-3')}>
              <View className="h-6 w-6 items-center justify-center rounded-full bg-success">
                <Txt weight="bold" className="text-[11px]" style={{ color: '#fff' }}>
                  {i + 1}
                </Txt>
              </View>
              <Txt weight="semibold" className="ml-3 flex-1 text-[14px] text-foreground">
                {t}
              </Txt>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // collected
  return (
    <Centered
      tone="success"
      icon={<ArrowUpFromLine size={46} color={colors.success} />}
      title="Battery collected"
      lines={['Charged pack removed successfully.', 'Tap below to finish your swap.']}
    />
  );
}

function Centered({ tone, icon, title, lines }: { tone: 'brand' | 'success'; icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <View className="items-center">
      <View className={cn('h-28 w-28 items-center justify-center rounded-full', tone === 'brand' ? 'bg-brand-50' : 'bg-success-soft')}>
        {icon}
      </View>
      <Txt weight="black" className="mt-6 text-center text-[26px] text-foreground">
        {title}
      </Txt>
      <View className="mt-4 w-full rounded-2xl bg-card p-5" style={{ shadowColor: '#0B1420', shadowOpacity: 0.04, shadowRadius: 10, elevation: 1 }}>
        {lines.map((l, i) => (
          <View key={i} className={cn('flex-row items-center justify-center', i > 0 && 'mt-1')}>
            {i === 0 && <DoorClosed size={16} color={colors.muted} style={{ marginRight: 8 }} />}
            <Txt weight={i === lines.length - 1 ? 'bold' : 'semibold'} className={cn('text-center text-[14px]', i === lines.length - 1 ? 'text-primary' : 'text-foreground')}>
              {l}
            </Txt>
          </View>
        ))}
      </View>
    </View>
  );
}
