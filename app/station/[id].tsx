import { Linking, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  BatteryCharging,
  BatteryFull,
  BatteryWarning,
  CircleAlert,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Zap,
} from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { CabinetGrid } from '@/components/CabinetGrid';
import { StationImageCarousel } from '@/components/StationImageCarousel';
import { colors } from '@/lib/theme';
import { getStation } from '@/lib/data/stations';

export default function StationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const station = getStation(id);

  if (!station) {
    return (
      <View className="flex-1 bg-canvas">
        <AppBar title="Station" back />
        <View className="flex-1 items-center justify-center">
          <Txt weight="medium" className="text-muted">
            Station not found.
          </Txt>
        </View>
      </View>
    );
  }

  const online = station.status === 'online';
  const available = station.slots.filter((s) => s.state === 'charged').length;
  const empty = station.slots.filter((s) => s.state === 'empty').length;
  const fault = station.slots.filter((s) => s.state === 'fault').length;

  return (
    <View className="flex-1 bg-canvas">
      <AppBar
        title={station.name}
        back
        bell
        right={
          <View className="mr-2">
            <Badge tone={online ? 'success' : 'danger'} dot label={online ? 'Online' : 'Offline'} />
          </View>
        }
      />

      <Screen contentClassName="px-5 pt-1" padBottom={150}>
        {/* Photos */}
        <View className="mb-4">
          <StationImageCarousel images={station.images} online={online} height={185} />
        </View>

        <Txt weight="black" className="text-[22px] text-ink">
          {station.name}
        </Txt>
        <View className="mt-1 flex-row items-center gap-1.5">
          <MapPin size={14} color={colors.muted} />
          <Txt weight="medium" className="flex-1 text-[13.5px] text-muted">
            {station.address}
          </Txt>
        </View>

        <View className="mt-3 flex-row gap-2">
          <View className="flex-row items-center gap-1.5 rounded-full bg-card px-3 py-1.5 border border-border">
            <Clock size={13} color={colors.muted} />
            <Txt weight="bold" className="text-[12px] text-foreground">
              {station.open_hours}
            </Txt>
          </View>
          <View className="flex-row items-center gap-1.5 rounded-full bg-card px-3 py-1.5 border border-border">
            <BatteryFull size={13} color={colors.muted} />
            <Txt weight="bold" className="text-[12px] text-foreground">
              {station.slot_count} slots
            </Txt>
          </View>
        </View>

        {/* Batteries ready to swap */}
        {online ? (
          <View className="mt-4 flex-row items-center rounded-2xl bg-success-soft p-4">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/70">
              <BatteryCharging size={24} color={colors.success} />
            </View>
            <View className="ml-3 flex-1">
              <Txt weight="black" className="text-[20px] text-success-ink">
                {available} {available === 1 ? 'battery' : 'batteries'} ready
              </Txt>
              <Txt weight="semibold" className="text-[12.5px] text-success-ink">
                Charged packs you can swap right now
              </Txt>
            </View>
          </View>
        ) : (
          <View className="mt-4 flex-row items-center rounded-2xl bg-danger-soft p-4">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/70">
              <CircleAlert size={24} color={colors.danger} />
            </View>
            <View className="ml-3 flex-1">
              <Txt weight="black" className="text-[16px] text-danger-ink">
                Not reporting
              </Txt>
              <Txt weight="semibold" className="text-[12.5px] text-danger-ink">
                Battery stock is unknown right now
              </Txt>
            </View>
          </View>
        )}

        {/* Availability — compact single row */}
        <View className="mt-5 flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3" style={{ shadowColor: '#0B1420', shadowOpacity: 0.04, shadowRadius: 10, elevation: 1 }}>
          <AvailStat icon={<BatteryFull size={17} color={colors.success} />} value={online ? available : '—'} label="charged" />
          <View className="h-6 w-px bg-border" />
          <AvailStat icon={<BatteryWarning size={17} color={colors.warn} />} value={online ? empty : '—'} label="empty" />
          <View className="h-6 w-px bg-border" />
          <AvailStat icon={<CircleAlert size={17} color={colors.danger} />} value={online ? fault : '—'} label="fault" />
        </View>

        {/* Cabinet */}
        <Txt weight="black" className="mt-6 text-[18px] text-ink">
          Cabinet
        </Txt>
        <Txt weight="regular" className="mb-3 text-[13px] text-muted">
          {station.slot_count} slots
        </Txt>
        <CabinetGrid slots={station.slots} />

        {/* Helpline */}
        <Pressable
          onPress={() => Linking.openURL(`tel:${station.helpline.replace(/\s/g, '')}`)}
          className="mt-2 flex-row items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-4"
        >
          <Phone size={18} color={colors.ink} />
          <Txt weight="bold" className="text-[15px] text-ink">
            Station helpline · {station.helpline}
          </Txt>
        </Pressable>
        <Txt weight="medium" className="mt-2 text-center text-[12px] text-muted">
          Answered 24 x 7
        </Txt>
      </Screen>

      {/* Bottom action bar */}
      <View
        className="absolute inset-x-0 bottom-0 border-t border-line bg-surface px-5 pt-3"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        {!online && (
          <Txt weight="medium" className="mb-2 text-center text-[13px] text-muted">
            This station is not reporting right now, so a swap cannot be started here.
          </Txt>
        )}
        <View className="flex-row gap-3">
          <Button
            label="Directions"
            variant="outline"
            block={false}
            className="flex-1"
            leftIcon={<Navigation size={18} color={colors.brand} fill={colors.brand} />}
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${station.name}, ${station.address}`)}`,
              )
            }
          />
          <View className="flex-1">
            <Button
              label="Proceed swap"
              disabled={!online}
              leftIcon={<Zap size={18} color="#fff" fill="#fff" />}
              onPress={() => router.push(`/swap/preflight?station=${station.id}`)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function AvailStat({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      {icon}
      <Txt weight="black" className="text-[16px] text-foreground">
        {value}
      </Txt>
      <Txt weight="medium" className="text-[12px] text-muted">
        {label}
      </Txt>
    </View>
  );
}
