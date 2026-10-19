import { Linking, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  BatteryFull,
  BatteryWarning,
  Bookmark,
  ChevronRight,
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
import { BatteryCount } from '@/components/ui/BatteryCount';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { getStation } from '@/lib/data/stations';
import { useStore } from '@/lib/store';
import { useToast } from '@/lib/toast';

export default function StationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isSaved, toggleSaved } = useStore();
  const toast = useToast();
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
  const saved = isSaved(station.id);
  const onToggleSave = () => {
    toggleSaved(station.id);
    toast.show(saved ? 'Removed from saved' : 'Saved to your stations', 'success');
  };
  const available = station.slots.filter((s) => s.state === 'charged').length;
  const empty = station.slots.filter((s) => s.state === 'empty').length;
  const fault = station.slots.filter((s) => s.state === 'fault').length;

  // Open turn-by-turn navigation to this station.
  const openDirections = () =>
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${station.name}, ${station.address}`)}`,
    );

  return (
    <View className="flex-1 bg-canvas">
      <AppBar
        title={station.code}
        back
        right={
          <View className="mr-2 flex-row items-center gap-2">
            <Pressable
              onPress={onToggleSave}
              hitSlop={8}
              className={cn('h-9 w-9 items-center justify-center rounded-full border', saved ? 'border-brand-200 bg-brand-50' : 'border-border bg-card')}
            >
              <Bookmark size={17} color={saved ? colors.brand : colors.muted} fill={saved ? colors.brand : 'transparent'} />
            </Pressable>
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

        <View className="mt-3 flex-row flex-wrap gap-2">
          <Pressable
            onPress={openDirections}
            hitSlop={6}
            className="flex-row items-center gap-1.5 rounded-full border border-brand-200 bg-brand-500 px-3 py-1.5"
            style={({ pressed }) => (pressed ? { opacity: 0.88 } : undefined)}
          >
            <Navigation size={12} color="#fff" fill="#fff" />
            <Txt weight="bold" className="text-[12px] text-white" style={{ color: '#fff' }}>
              {station.distance_km} km{station.eta_mins != null ? ` · ${station.eta_mins} min` : ''}
            </Txt>
            <ChevronRight size={13} color="rgba(255,255,255,0.9)" />
          </Pressable>
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

        {/* Availability — compact single row */}
        <View className="mt-5 flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3" style={{ shadowColor: '#0B1420', shadowOpacity: 0.04, shadowRadius: 10, elevation: 1 }}>
          <View className="flex-row items-center gap-1.5">
            <BatteryCount count={available} active={online} size="md" />
            <Txt weight="medium" className="text-[12px] text-muted">
              charged
            </Txt>
          </View>
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
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={openDirections}
            className="h-14 w-14 items-center justify-center rounded-2xl border border-brand-500 bg-card"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Navigation size={20} color={colors.brand} fill={colors.brand} />
          </Pressable>
          <View className="flex-1">
            <Button
              label="Start swap"
              disabled={!online}
              leftIcon={<Zap size={18} color="#fff" fill="#fff" />}
              onPress={() => router.push(`/swap/start?station=${station.id}`)}
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
