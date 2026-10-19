import { View } from 'react-native';
import { MotiView } from '@/lib/motion';
import { Lock, LockOpen } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { BatteryRing } from '@/components/ui/BatteryRing';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';
import type { Slot } from '@/lib/data/types';

const DOT: Record<Slot['state'], string> = {
  charged: 'bg-success',
  charging: 'bg-brand-500',
  empty: 'bg-line',
  fault: 'bg-danger',
};

const STATUS_WORD: Record<Slot['state'], string> = {
  charged: 'Ready',
  charging: 'Charging',
  empty: 'Empty',
  fault: 'Fault',
};

/** Plain lock icon for a slot (open = authorised, otherwise locked). No background box. */
function SlotLock({ open, active }: { open?: boolean; active: boolean }) {
  return open ? (
    <LockOpen size={18} color={colors.brand} />
  ) : (
    <Lock size={18} color={active ? colors.muted : colors.faint} />
  );
}

function SlotCard({ slot, highlight, open }: { slot: Slot; highlight?: boolean; open?: boolean }) {
  const empty = slot.state === 'empty';
  return (
    <MotiView
      className={cn('mb-3 rounded-2xl border bg-surface p-3', highlight ? 'border-brand-500' : 'border-line')}
      style={{ width: '31.5%' }}
    >
      {highlight && <View className="absolute -top-1 left-4 right-4 h-1 rounded-full bg-brand-500" />}
      <View className="flex-row items-start justify-between">
        <BatteryRing soc={slot.soc} state={slot.state} size={46} />
        <View className="pl-2 pt-0.5">
          <SlotLock open={open} active={!empty} />
        </View>
      </View>
      {/* Full battery ID — shrinks to fit the card */}
      <Txt
        weight="bold"
        className="mt-2 text-[11px] text-foreground"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.55}
      >
        {slot.serial ?? '—'}
      </Txt>
      <View className="mt-1 flex-row items-center gap-1.5">
        <View className={cn('h-2 w-2 rounded-full', DOT[slot.state])} />
        <Txt weight="bold" className="flex-1 text-[10.5px] text-ink" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
          Slot {slot.slot_number} · {STATUS_WORD[slot.state]}
        </Txt>
      </View>
    </MotiView>
  );
}

export function CabinetGrid({
  slots,
  highlightSlot,
  openSlot,
}: {
  slots: Slot[];
  highlightSlot?: number | null;
  openSlot?: number | null;
}) {
  return (
    <View className="flex-row flex-wrap justify-between">
      {slots.map((s) => (
        <SlotCard
          key={s.slot_number}
          slot={s}
          highlight={highlightSlot === s.slot_number}
          open={openSlot === s.slot_number}
        />
      ))}
    </View>
  );
}
