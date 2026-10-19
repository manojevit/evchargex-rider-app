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
function StationPhoto({ station, width, online, fade, nearest }: { station: Station; width: number; online: boolean; fade?: boolean; nearest?: boolean }) {
  const [err, setErr] = useState(false);
  const uri = station.images?.[0]?.uri;
  const bg = online ? '#E6F4EC' : '#F2F5F9';
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

      {/* Smooth right-edge dissolve: the photo is crisp and flush on the left and melts
          gradually into the white card on the right. Many closely-spaced stops with an
          ease-out curve mean there's no visible "start line" to the fade — the image and
          the card read as one surface. rgba(255,255,255,0) (not "transparent") avoids any
          grey tint in the blend. */}
      {fade && (
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.03)',
            'rgba(255,255,255,0.12)',
            'rgba(255,255,255,0.3)',
            'rgba(255,255,255,0.56)',
            'rgba(255,255,255,0.82)',
            'rgba(255,255,255,1)',
          ]}
          locations={[0, 0.3, 0.48, 0.64, 0.78, 0.9, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        />
      )}

      {nearest && (
        <View style={{ position: 'absolute', top: 8, left: 8 }} className="rounded-full bg-brand-500 px-2.5 py-1">
          <Txt weight="black" className="text-[9.5px]" style={{ color: '#fff', letterSpacing: 0.4 }}>
            NEAREST
          </Txt>
        </View>
      )}
    </View>
  );
}

/** Full-width list card used on the Stations screen and Home "Swap near you". */
export function StationCard({ station, fade, nearest }: { station: Station; fade?: boolean; nearest?: boolean }) {
  const router = useRouter();
  const online = station.status === 'online';
  const distanceLine = !online
    ? 'Not reporting'
    : `${station.distance_km} km${station.eta_mins != null ? ` · ${station.eta_mins} min` : ''}`;

  return (
    <Pressable
      onPress={() => router.push(`/station/${station.id}`)}
      className="mb-3 flex-row overflow-hidden rounded-2xl bg-surface"
      style={({ pressed }) => [cardShadow, pressed && { opacity: 0.9 }]}
    >
      <StationPhoto station={station} width={120} online={online} fade={fade} nearest={nearest} />
      <View className="flex-1 justify-center p-3.5">
        <View className="flex-row items-center justify-between">
          <Txt weight="extrabold" className="flex-1 pr-2 text-[16.5px] text-foreground" numberOfLines={1}>
            {station.code}
          </Txt>
          <Badge tone={online ? 'success' : 'danger'} dot label={online ? 'Online' : 'Offline'} />
        </View>
        <Txt weight="semibold" className="mt-0.5 text-[13.5px] text-ink" numberOfLines={1}>
          {station.name}
        </Txt>
        <View className="mt-2 flex-row items-center">
          <View className="flex-1 flex-row items-center gap-1 pr-1.5">
            <MapPin size={12} color={colors.faint} />
            <Txt weight="medium" className="flex-1 text-[12px] text-muted" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
              {distanceLine}
            </Txt>
          </View>
          <BatteryCount count={station.charged} active={online} size="md" />
          <ChevronRight size={18} color={colors.faint} style={{ marginLeft: 4 }} />
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
      <StationPhoto station={station} width={100} online={online} />
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
        <View className="mt-2 flex-row items-end justify-between">
          <View className="flex-1 flex-row items-center gap-1 pr-1.5">
            <MapPin size={11} color={colors.faint} />
            <Txt weight="regular" className="flex-1 text-[11.5px] text-faint" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
              {online ? `${station.distance_km} km · ${station.eta_mins} min` : 'Not reporting'}
            </Txt>
          </View>
          <BatteryCount count={station.charged} active={online} size="md" />
        </View>
      </View>
    </Pressable>
  );
}
