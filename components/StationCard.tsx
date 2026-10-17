import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BatteryFull, ChevronRight, MapPin, Navigation } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Badge } from '@/components/ui/Badge';
import { IconTile } from '@/components/ui/IconTile';
import { colors } from '@/lib/theme';
import { cardShadow } from '@/lib/theme';
import { cn } from '@/lib/cn';
import type { Station } from '@/lib/data/types';

/** A stylised station glyph tile (we have no real photos in the demo). */
function StationGlyph({ online, size = 'md' }: { online: boolean; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-[72px] w-[72px]' : 'h-14 w-14';
  return (
    <View className={cn('items-center justify-center rounded-2xl', box, online ? 'bg-success-soft' : 'bg-canvas')}>
      <BatteryFull size={size === 'lg' ? 32 : 26} color={online ? colors.success : colors.faint} strokeWidth={2} />
    </View>
  );
}

/** Full-width list card used on the Stations screen. */
export function StationCard({ station }: { station: Station }) {
  const router = useRouter();
  const online = station.status === 'online';

  return (
    <Pressable
      onPress={() => router.push(`/station/${station.id}`)}
      className="mb-3 rounded-2xl bg-surface p-4"
      style={({ pressed }) => [cardShadow, pressed && { opacity: 0.9 }]}
    >
      <View className="flex-row items-center">
        <StationGlyph online={online} size="lg" />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center justify-between">
            <Txt weight="extrabold" className="text-[17px] text-ink">
              {station.code}
            </Txt>
            <Badge tone={online ? 'success' : 'danger'} dot label={online ? 'Online' : 'Offline'} />
          </View>
          <Txt weight="medium" className="mt-0.5 text-[13px] text-muted">
            {station.name}
          </Txt>
          <View className="mt-1 flex-row items-center gap-1">
            <MapPin size={12} color={colors.faint} />
            <Txt weight="regular" className="text-[12px] text-faint" numberOfLines={1}>
              {station.area}, {station.city}
            </Txt>
          </View>
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Badge tone="brand" label={`${station.distance_km} km`} />
          <View className="flex-row items-center gap-1.5">
            <View className={cn('h-6 w-6 items-center justify-center rounded-lg', online ? 'bg-success-soft' : 'bg-canvas')}>
              <BatteryFull size={14} color={online ? colors.success : colors.faint} />
            </View>
            <Txt weight="bold" className={cn('text-[13px]', online ? 'text-success-ink' : 'text-faint')}>
              {online ? `${station.charged} available` : 'Not reporting'}
            </Txt>
          </View>
        </View>
        <ChevronRight size={20} color={colors.faint} />
      </View>
    </Pressable>
  );
}

/** Compact card used in the Home "Nearest stations" list. */
export function StationRowCompact({ station }: { station: Station }) {
  const router = useRouter();
  const online = station.status === 'online';
  return (
    <Pressable
      onPress={() => router.push(`/station/${station.id}`)}
      className="mb-2.5 flex-row items-center rounded-2xl border border-line bg-surface p-3"
      style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
    >
      <StationGlyph online={online} />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center gap-2">
          <Txt weight="bold" className="text-[15px] text-ink">
            {station.code}
          </Txt>
          <Badge tone={online ? 'success' : 'danger'} dot label={online ? 'ONLINE' : 'OFFLINE'} />
        </View>
        <Txt weight="medium" className="mt-0.5 text-[12.5px] text-muted" numberOfLines={1}>
          {station.name}
        </Txt>
        <View className="mt-1 flex-row items-center gap-1">
          <MapPin size={11} color={colors.faint} />
          <Txt weight="regular" className="text-[11.5px] text-faint">
            {station.distance_km} km · {station.eta_mins} mins away
          </Txt>
        </View>
      </View>
      <View className="ml-2 items-center">
        <View className={cn('h-12 w-12 items-center justify-center rounded-xl', online ? 'bg-success-soft' : 'bg-canvas')}>
          <Txt weight="black" className={cn('text-[18px]', online ? 'text-success-ink' : 'text-faint')}>
            {online ? station.charged : '—'}
          </Txt>
        </View>
        <Txt weight="medium" className="mt-0.5 text-[10px] text-faint">
          charged
        </Txt>
      </View>
    </Pressable>
  );
}

export { StationGlyph };
