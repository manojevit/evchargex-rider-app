import { View } from 'react-native';
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

export default function History() {
  const { account } = useStore();
  const rows = account.history;

  return (
    <View className="flex-1 bg-canvas">
      <AppBar
        title="Swap history"
        back
        right={
          <View className="mr-1 h-10 flex-row items-center gap-1.5 rounded-xl border border-line bg-surface px-3">
            <SlidersHorizontal size={15} color={colors.ink} />
            <Txt weight="bold" className="text-[12px] text-ink">
              Filter
            </Txt>
          </View>
        }
      />
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
          <View className="mt-3 flex-row items-center">
            <View className="flex-1 flex-row items-center rounded-2xl bg-warn-soft/50 p-2.5">
              <IconTile tone="warn" size="sm">
                <BatteryLow size={18} color={colors.warn} />
              </IconTile>
              <View className="ml-2 flex-1">
                <Txt weight="medium" className="text-[11px] text-muted">
                  Gave
                </Txt>
                <Txt weight="bold" className="text-[12px] text-ink" numberOfLines={1}>
                  {row.gave.serial}
                </Txt>
                <Txt weight="bold" className="text-[12px] text-warn-ink">
                  {row.gave.soc}%
                </Txt>
              </View>
            </View>

            <View className="mx-2 h-9 w-9 items-center justify-center rounded-full bg-canvas">
              <ArrowLeftRight size={16} color={colors.muted} />
            </View>

            <View className="flex-1 flex-row items-center rounded-2xl bg-success-soft/50 p-2.5">
              <IconTile tone="success" size="sm">
                <BatteryFull size={18} color={colors.success} />
              </IconTile>
              <View className="ml-2 flex-1">
                <Txt weight="medium" className="text-[11px] text-muted">
                  Took
                </Txt>
                <Txt weight="bold" className="text-[12px] text-ink" numberOfLines={1}>
                  {row.took.serial}
                </Txt>
                <Txt weight="bold" className="text-[12px] text-success-ink">
                  {row.took.soc}%
                </Txt>
              </View>
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
