import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { BatteryFull, ChevronRight, Clock, MapPin, Navigation } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Badge } from '@/components/ui/Badge';
import { colors, cardShadow } from '@/lib/theme';
import { cn } from '@/lib/cn';
import type { Station } from '@/lib/data/types';

/**
 * A designed, API-key-free "map": a soft tinted canvas with faint roads,
 * tappable station pins, a live count + legend, and a rich preview card.
 */
export function StylizedMap({ stations }: { stations: Station[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Station | null>(null);
  const online = stations.filter((s) => s.status === 'online').length;

  return (
    <View className="flex-1 overflow-hidden rounded-3xl" style={cardShadow}>
      <LinearGradient colors={['#E8EEF6', '#DCE7F2']} style={{ flex: 1 }}>
        {/* faint "roads" */}
        <View className="absolute left-0 right-0 top-[28%] h-[6px] bg-white/60" />
        <View className="absolute left-0 right-0 top-[62%] h-[6px] bg-white/50" />
        <View className="absolute bottom-0 top-0 left-[36%] w-[6px] bg-white/60" />
        <View className="absolute bottom-0 top-0 left-[68%] w-[6px] bg-white/40" />
        <View className="absolute left-0 right-0 top-[45%] h-[10px] bg-white/70" />

        {/* top: count + legend */}
        <View className="absolute left-3 right-3 top-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5 rounded-full bg-card px-3 py-1.5" style={cardShadow}>
            <MapPin size={14} color={colors.brand} />
            <Txt weight="bold" className="text-[12.5px] text-foreground">
              {stations.length} stations · {online} online
            </Txt>
          </View>
          <View className="flex-row items-center gap-2.5 rounded-full bg-card px-3 py-1.5" style={cardShadow}>
            <Legend color={colors.brand} label="Online" />
            <Legend color={colors.faint} label="Offline" />
          </View>
        </View>

        {/* pins */}
        {stations.map((s) => {
          const isOnline = s.status === 'online';
          const active = selected?.id === s.id;
          return (
            <Pressable
              key={s.id}
              onPress={() => setSelected(s)}
              style={{ position: 'absolute', left: `${s.map.x * 100}%`, top: `${s.map.y * 100}%` }}
            >
              <MotiView animate={{ scale: active ? 1.18 : 1 }} className="items-center" style={{ transform: [{ translateX: -22 }, { translateY: -44 }] }}>
                <View className={cn('h-11 w-11 items-center justify-center rounded-full border-2 border-white', isOnline ? 'bg-brand-500' : 'bg-faint')} style={cardShadow}>
                  <Txt weight="black" className="text-[14px]" style={{ color: '#fff' }}>
                    {isOnline ? s.charged : '—'}
                  </Txt>
                </View>
                <View className={cn('-mt-1 h-3 w-3 rotate-45 border-b-2 border-r-2 border-white', isOnline ? 'bg-brand-500' : 'bg-faint')} />
              </MotiView>
            </Pressable>
          );
        })}

        {/* selected preview */}
        {selected && (
          <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} className="absolute bottom-4 left-4 right-4">
            <View className="rounded-2xl bg-card p-4" style={cardShadow}>
              <View className="flex-row items-center justify-between">
                <Txt weight="extrabold" className="text-[16px] text-foreground">
                  {selected.code}
                </Txt>
                <Badge tone={selected.status === 'online' ? 'success' : 'danger'} dot label={selected.status === 'online' ? 'Online' : 'Offline'} />
              </View>
              <Txt weight="medium" className="mt-0.5 text-[13px] text-muted">
                {selected.name}
              </Txt>

              <View className="mt-3 flex-row items-center gap-4">
                <View className="flex-row items-center gap-1.5">
                  <MapPin size={13} color={colors.faint} />
                  <Txt weight="bold" className="text-[12.5px] text-foreground">
                    {selected.distance_km} km
                  </Txt>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Clock size={13} color={colors.faint} />
                  <Txt weight="bold" className="text-[12.5px] text-foreground">
                    {selected.eta_mins} mins
                  </Txt>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <BatteryFull size={13} color={selected.status === 'online' ? colors.success : colors.faint} />
                  <Txt weight="bold" className={cn('text-[12.5px]', selected.status === 'online' ? 'text-success-ink' : 'text-faint')}>
                    {selected.status === 'online' ? `${selected.charged} ready` : '—'}
                  </Txt>
                </View>
              </View>

              <View className="mt-3 flex-row gap-2.5">
                <Pressable
                  onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.name)}`)}
                  className="flex-row items-center justify-center gap-1.5 rounded-xl border border-border px-3.5 py-2.5"
                >
                  <Navigation size={15} color={colors.brand} fill={colors.brand} />
                  <Txt weight="bold" className="text-[13px] text-brand-600">
                    Navigate
                  </Txt>
                </Pressable>
                <Pressable
                  onPress={() => router.push(`/station/${selected.id}`)}
                  className="flex-1 flex-row items-center justify-center gap-1 rounded-xl bg-brand-500 py-2.5"
                >
                  <Txt weight="bold" className="text-[13px] text-white" style={{ color: '#fff' }}>
                    Open station
                  </Txt>
                  <ChevronRight size={16} color="#fff" />
                </Pressable>
              </View>
            </View>
          </MotiView>
        )}
      </LinearGradient>
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1">
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Txt weight="semibold" className="text-[11px] text-muted">
        {label}
      </Txt>
    </View>
  );
}
