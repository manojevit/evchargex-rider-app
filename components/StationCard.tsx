import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BatteryFull, ChevronRight, MapPin } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Badge } from '@/components/ui/Badge';
import { BatteryCount } from '@/components/ui/BatteryCount';
import { colors, cardShadow } from '@/lib/theme';
import type { Station } from '@/lib/data/types';

/** Full-height station photo that fills the left side of the card (flush to the edges). */
function StationPhoto({ station, width, online, fade }: { station: Station; width: number; online: boolean; fade?: boolean }) {
  const [err, setErr] = useState(false);
  const uri = station.images?.[0]?.uri;
  const bg = fade ? '#FFFFFF' : online ? '#E6F4EC' : '#F2F5F9';
  return (
    <View style={{ width, alignSelf: 'stretch', backgroundColor: bg }}>
      {uri && !err ? (
        <Image
          source={{ uri }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width }}
          resizeMode="cover"
          onError={() => setErr(true)}
        />
      ) : (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <BatteryFull size={30} color={online ? colors.success : colors.faint} strokeWidth={2} />
        </View>
      )}

      {/* Horizontal edge-fade: left & right edges melt into the white card; center stays sharp.
          Uses rgba(255,255,255,0) (not "transparent") so there's no grey boundary. */}
      {fade && (
        <LinearGradient
          colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
          locations={[0, 0.24, 0.76, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        />
      )}
    </View>
  );
}

/** Full-width list card used on the Stations screen and Home "Swap near you". */
export function StationCard({ station, fade }: { station: Station; fade?: boolean }) {
  const router = useRouter();
  const online = station.status === 'online';

  return (
    <Pressable
      onPress={() => router.push(`/station/${station.id}`)}
      className="mb-3 flex-row overflow-hidden rounded-2xl bg-surface"
      style={({ pressed }) => [cardShadow, pressed && { opacity: 0.9 }]}
    >
      <StationPhoto station={station} width={112} online={online} fade={fade} />
      <View className="flex-1 p-3.5">
        <View className="flex-row items-center justify-between">
          <Txt weight="extrabold" className="flex-1 pr-2 text-[16.5px] text-foreground" numberOfLines={1}>
            {station.code}
          </Txt>
          <Badge tone={online ? 'success' : 'danger'} dot label={online ? 'Online' : 'Offline'} />
        </View>
        <Txt weight="medium" className="mt-0.5 text-[13px] text-muted" numberOfLines={1}>
          {station.name}
        </Txt>
        <View className="mt-1 flex-row items-center gap-1">
          <MapPin size={12} color={colors.faint} />
          <Txt weight="regular" className="flex-1 text-[12px] text-faint" numberOfLines={1}>
            {station.area}, {station.city}
          </Txt>
        </View>
        <View className="mt-2.5 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <Badge tone="brand" label={`${station.distance_km} km`} />
            <BatteryCount count={station.charged} active={online} size="md" />
          </View>
          <ChevronRight size={20} color={colors.faint} />
        </View>
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
      className="mb-2.5 flex-row overflow-hidden rounded-2xl border border-border bg-surface"
      style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
    >
      <StationPhoto station={station} width={92} online={online} />
      <View className="flex-1 p-3">
        <View className="flex-row items-center gap-2">
          <Txt weight="bold" className="text-[15px] text-ink" numberOfLines={1}>
            {station.code}
          </Txt>
          <Badge tone={online ? 'success' : 'danger'} dot label={online ? 'ONLINE' : 'OFFLINE'} />
        </View>
        <Txt weight="medium" className="mt-0.5 text-[12.5px] text-muted" numberOfLines={1}>
          {station.name}
        </Txt>
        <View className="mt-1 flex-row items-center gap-1">
          <MapPin size={11} color={colors.faint} />
          <Txt weight="regular" className="flex-1 text-[11.5px] text-faint" numberOfLines={1}>
            {station.distance_km} km · {station.eta_mins} mins away
          </Txt>
        </View>
      </View>
      <View className="items-center justify-center pl-1 pr-3.5">
        <BatteryCount count={station.charged} active={online} size="lg" />
      </View>
    </Pressable>
  );
}
