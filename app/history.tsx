import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { MotiView } from '@/lib/motion';
import { ArrowLeftRight, BatteryFull, BatteryLow, Clock, MapPin, ShieldCheck, SlidersHorizontal } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { IconTile } from '@/components/ui/IconTile';
import { colors } from '@/lib/theme';
import { dateTime } from '@/lib/format';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';
import type { SwapHistoryRow } from '@/lib/data/types';

type Filter = 'all' | 'completed' | 'cancelled';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function History() {
  const { account } = useStore();
  const [filter, setFilter] = useState<Filter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const rows = useMemo(() => {
    if (filter === 'all') return account.history;
    if (filter === 'completed') return account.history.filter((r) => r.status === 'completed');
    return account.history.filter((r) => r.status !== 'completed');
  }, [account.history, filter]);

  return (
    <View className="flex-1 bg-background">
      <AppBar
        title="Swap history"
        back
        right={
          <Pressable
            onPress={() => setShowFilters((v) => !v)}
            className={cn('mr-1 h-10 flex-row items-center gap-1.5 rounded-xl border px-3', showFilters || filter !== 'all' ? 'border-brand-500 bg-brand-50' : 'border-border bg-card')}
          >
            <SlidersHorizontal size={15} color={showFilters || filter !== 'all' ? colors.brand : colors.ink} />
            <Txt weight="bold" className={cn('text-[12px]', showFilters || filter !== 'all' ? 'text-brand-600' : 'text-ink')}>
              Filter
            </Txt>
          </Pressable>
        }
      />
      {showFilters && (
        <View className="flex-row gap-2 px-5 pb-1 pt-1">
          {FILTERS.map((f) => (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              className={cn('rounded-full border px-3.5 py-1.5', filter === f.key ? 'border-brand-500 bg-brand-500' : 'border-border bg-card')}
            >
              <Txt weight="bold" className={cn('text-[12.5px]', filter === f.key ? 'text-white' : 'text-muted')} style={filter === f.key ? { color: '#fff' } : undefined}>
                {f.label}
              </Txt>
            </Pressable>
          ))}
        </View>
      )}
      <Screen contentClassName="px-5 pt-1">
        <Txt weight="regular" className="mb-3 text-[13px] text-muted">
          View your past battery swap transactions
        </Txt>

        {rows.length === 0 ? (
          <Card className="mt-10 items-center py-10">
            <IconTile tone="neutral" size="lg" rounded="rounded-2xl">
              <Clock size={30} color={colors.faint} />
            </IconTile>
            <Txt weight="extrabold" className="mt-4 text-[17px] text-ink">
              No swaps yet
            </Txt>
            <Txt weight="regular" className="mt-2 px-8 text-center text-[13.5px] text-muted">
              Once you complete your first battery swap, it will show up here.
            </Txt>
          </Card>
        ) : (
          rows.map((row, i) => <HistoryCard key={row.id} row={row} index={i} />)
        )}
      </Screen>
    </View>
  );
}

function HistoryCard({ row, index }: { row: SwapHistoryRow; index: number }) {
  const cancelled = row.status !== 'completed';
  return (
    <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: index * 60 }}>
      <Card className="mb-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Clock size={15} color={colors.muted} />
            <Txt weight="bold" className="text-[13.5px] text-ink">
              {dateTime(row.at)}
            </Txt>
          </View>
          <Badge
            tone={cancelled ? 'danger' : 'success'}
            dot
            label={cancelled ? row.status.toUpperCase() : 'COMPLETED'}
          />
        </View>

        {!cancelled && (
          <View className="mt-3 rounded-2xl bg-canvas p-3">
            {/* Gave */}
            <View className="flex-row items-center">
              <IconTile tone="warn" size="sm">
                <BatteryLow size={18} color={colors.warn} />
              </IconTile>
              <View className="ml-2.5 flex-1">
                <Txt weight="medium" className="text-[11px] text-muted">
                  Gave
                </Txt>
                <Txt weight="bold" className="text-[14px] text-ink" numberOfLines={1} adjustsFontSizeToFit>
                  {row.gave.serial}
                </Txt>
              </View>
              <Txt weight="black" className="text-[14px] text-warn-ink">
                {row.gave.soc}%
              </Txt>
            </View>

            <View className="my-2 flex-row items-center gap-2 pl-1">
              <View className="h-7 w-7 items-center justify-center rounded-full bg-brand-50">
                <ArrowLeftRight size={14} color={colors.brand} />
              </View>
              <View className="h-px flex-1 bg-line" />
            </View>

            {/* Took */}
            <View className="flex-row items-center">
              <IconTile tone="success" size="sm">
                <BatteryFull size={18} color={colors.success} />
              </IconTile>
              <View className="ml-2.5 flex-1">
                <Txt weight="medium" className="text-[11px] text-muted">
                  Took
                </Txt>
                <Txt weight="bold" className="text-[14px] text-ink" numberOfLines={1} adjustsFontSizeToFit>
                  {row.took.serial}
                </Txt>
              </View>
              <Txt weight="black" className="text-[14px] text-success-ink">
                {row.took.soc}%
              </Txt>
            </View>
          </View>
        )}

        <View className="mt-3 flex-row items-center justify-between border-t border-line pt-3">
          <View className="flex-row items-center gap-1.5">
            <MapPin size={14} color={colors.muted} />
            <View>
              <Txt weight="bold" className="text-[13px] text-ink">
                {row.station_code}
              </Txt>
              {!cancelled && (
                <Txt weight="medium" className="text-[11px] text-muted">
                  Slot {row.slot_in} in · Slot {row.slot_out} out
                </Txt>
              )}
            </View>
          </View>
          <View className="flex-row items-center gap-1.5">
            <ShieldCheck size={15} color={cancelled ? colors.muted : colors.success} />
            <View>
              <Txt weight="bold" className={cn('text-[12.5px]', cancelled ? 'text-muted' : 'text-ink')}>
                {cancelled ? 'No charge' : 'Included in plan'}
              </Txt>
              <Txt weight="medium" className="text-[11px] text-muted">
                {cancelled ? 'Swap not completed' : 'No extra charge'}
              </Txt>
            </View>
          </View>
        </View>
      </Card>
    </MotiView>
  );
}
