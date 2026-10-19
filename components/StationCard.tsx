import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BatteryFull, ChevronRight, MapPin, Zap } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Badge } from '@/components/ui/Badge';
import { BatteryCount } from '@/components/ui/BatteryCount';
import { colors, cardShadow } from '@/lib/theme';
import { cn } from '@/lib/cn';
import type { Station } from '@/lib/data/types';

/**
 * Big featured station card: a full-bleed photo with the station name, status
 * and distance overlaid on a soft gradient — the hero on the Home screen.
 */
export function StationHero({ station }: { station: Station }) {
  const router = useRouter();
  const [err, setErr] = useState(false);
  const online = station.status === 'online';
  const uri = station.images?.[0]?.uri;
  const go = () => router.push(online ? `/swap/start?station=${station.id}` : `/station/${station.id}`);

  return (
    <Pressable
      onPress={go}
      className="mb-3 overflow-hidden rounded-3xl bg-surface"
      style={({ pressed }) => [cardShadow, pressed && { opacity: 0.96 }]}
    >
      <View style={{ height: 214 }}>
        {uri && !err ? (
          <Image
            source={{ uri }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
            resizeMode="cover"
            onError={() => setErr(true)}
          />
        ) : (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B1420' }}>
            <BatteryFull size={46} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          </View>
        )}

        {/* Gradient for text legibility */}
        <LinearGradient
          colors={['rgba(11,20,32,0)', 'rgba(11,20,32,0.2)', 'rgba(11,20,32,0.85)']}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '72%' }}
          pointerEvents="none"
        />

        {/* Top badges */}
        <View style={{ position: 'absolute', top: 14, left: 14, flexDirection: 'row', gap: 8 }}>
          <View className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5" style={{ backgroundColor: 'rgba(11,20,32,0.55)' }}>
            <View className={cn('h-1.5 w-1.5 rounded-full', online ? 'bg-success' : 'bg-danger')} />
            <Txt weight="bold" className="text-[11.5px]" style={{ color: '#fff' }}>
              {online ? 'Online' : 'Offline'}
            </Txt>
          </View>
          <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: 'rgba(30,99,240,0.92)' }}>
            <Txt weight="bold" className="text-[11.5px]" style={{ color: '#fff' }}>
              Nearest
            </Txt>
          </View>
        </View>

        {/* Bottom overlay */}
        <View style={{ position: 'absolute', left: 16, right: 16, bottom: 14 }}>
          <Txt weight="black" className="text-[24px]" style={{ color: '#fff' }} numberOfLines={1}>
            {station.code}
          </Txt>
          <View className="mt-1 flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center gap-1 pr-2">
              <MapPin size={13} color="rgba(255,255,255,0.85)" />
              <Txt weight="medium" className="flex-1 text-[13px]" style={{ color: 'rgba(255,255,255,0.9)' }} numberOfLines={1}>
                {station.name}
              </Txt>
            </View>
            <View className="flex-row items-center gap-2 rounded-full px-3 py-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <Txt weight="bold" className="text-[12.5px]" style={{ color: '#fff' }}>
                {station.distance_km} km
              </Txt>
              <View style={{ width: 1, height: 12, backgroundColor: 'rgba(255,255,255,0.4)' }} />
              <Zap size={12} color="#fff" fill="#fff" />
              <Txt weight="bold" className="text-[12.5px]" style={{ color: '#fff' }}>
                {online ? `${station.charged} ready` : '—'}
              </Txt>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/** Full-height station photo that fills the left side of the card (flush to the edges). */
function StationPhoto({ station, width, online }: { station: Station; width: number; online: boolean }) {
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
    </View>
  );
}

/** Full-width list card used on the Stations screen and Home "Swap near you". */
export function StationCard({ station }: { station: Station }) {
  const router = useRouter();
  const online = station.status === 'online';

  return (
    <Pressable
      onPress={() => router.push(`/station/${station.id}`)}
      className="mb-3 flex-row overflow-hidden rounded-2xl bg-surface"
      style={({ pressed }) => [cardShadow, pressed && { opacity: 0.9 }]}
    >
      <StationPhoto station={station} width={112} online={online} />
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
