import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { BatteryCharging, Check, DoorOpen, Radio, Wifi } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { IconTile } from '@/components/ui/IconTile';
import { StationImageCarousel } from '@/components/StationImageCarousel';
import { colors } from '@/lib/theme';
import { getStation } from '@/lib/data/stations';

export default function Preflight() {
  const { station: stationId } = useLocalSearchParams<{ station: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const station = getStation(stationId);

  if (!station) {
    return (
      <View className="flex-1 bg-canvas">
        <AppBar title="Start swap" back />
      </View>
    );
  }

  // Assign a free return slot and the best charged pack to dispense.
  const returnSlot = station.slots.find((s) => s.state === 'empty')?.slot_number ?? station.slots[0].slot_number;
  const charged = [...station.slots].filter((s) => s.state === 'charged').sort((a, b) => (b.soc ?? 0) - (a.soc ?? 0));
  const dispense = charged[0];

  const checks = [
    { icon: <Wifi size={18} color={colors.success} />, label: 'Station online', ok: true },
    { icon: <Radio size={18} color={colors.success} />, label: 'Cabinet reporting live', ok: true },
    { icon: <BatteryCharging size={18} color={colors.success} />, label: `${charged.length} charged packs available`, ok: true },
    { icon: <DoorOpen size={18} color={colors.success} />, label: `Return slot ${returnSlot} is free`, ok: true },
  ];

  return (
    <View className="flex-1 bg-canvas">
      <AppBar title="Start swap" back />
      <Screen contentClassName="px-5 pt-1" padBottom={140}>
        <View className="mb-3">
          <StationImageCarousel images={station.images} online height={165} />
        </View>
        <Card className="flex-row items-center">
          <IconTile tone="success" size="lg">
            <BatteryCharging size={28} color={colors.success} />
          </IconTile>
          <View className="ml-3 flex-1">
            <View className="flex-row items-center gap-2">
              <Txt weight="extrabold" className="text-[18px] text-ink">
                {station.code}
              </Txt>
              <Badge tone="success" dot label="Online" />
            </View>
            <Txt weight="medium" className="mt-0.5 text-[13px] text-muted">
              {station.name}
            </Txt>
          </View>
        </Card>

        <Txt weight="black" className="mb-1 mt-6 text-[18px] text-ink">
          Pre-flight checks
        </Txt>
        <Txt weight="regular" className="mb-3 text-[13px] text-muted">
          Everything looks good to start your swap.
        </Txt>

        <Card>
          {checks.map((c, i) => (
            <MotiView
              key={c.label}
              from={{ opacity: 0, translateX: -10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 120 * i }}
              className={i > 0 ? 'mt-3 border-t border-line pt-3' : ''}
            >
              <View className="flex-row items-center">
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-success-soft">{c.icon}</View>
                <Txt weight="semibold" className="ml-3 flex-1 text-[14.5px] text-ink">
                  {c.label}
                </Txt>
                <View className="h-6 w-6 items-center justify-center rounded-full bg-success">
                  <Check size={15} color="#fff" strokeWidth={3} />
                </View>
              </View>
            </MotiView>
          ))}
        </Card>

        <View className="mt-4 flex-row gap-3">
          <Card className="flex-1 items-center py-4">
            <Txt weight="medium" className="text-[12px] text-muted">
              Return your pack to
            </Txt>
            <Txt weight="black" className="mt-1 text-[22px] text-brand-600">
              Slot {returnSlot}
            </Txt>
          </Card>
          <Card className="flex-1 items-center py-4">
            <Txt weight="medium" className="text-[12px] text-muted">
              Collect charged from
            </Txt>
            <Txt weight="black" className="mt-1 text-[22px] text-success">
              Slot {dispense?.slot_number}
            </Txt>
          </Card>
        </View>

        <View className="mt-3 rounded-2xl bg-brand-50 p-3.5">
          <Txt weight="medium" className="text-[12.5px] leading-5 text-brand-700">
            You have a 3-minute window once the swap starts. Your plan covers this swap — no charge.
          </Txt>
        </View>
      </Screen>

      <View className="absolute inset-x-0 bottom-0 border-t border-line bg-surface px-5 pt-3" style={{ paddingBottom: insets.bottom + 12 }}>
        <Button
          label="Start swap"
          onPress={() =>
            router.replace(`/swap/live?station=${station.id}&ret=${returnSlot}&disp=${dispense?.slot_number ?? ''}`)
          }
        />
      </View>
    </View>
  );
}
