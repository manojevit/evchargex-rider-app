import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { ChevronRight, Hand, MapPin, Navigation } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Badge } from '@/components/ui/Badge';
import { colors, cardShadow } from '@/lib/theme';
import { cn } from '@/lib/cn';
import type { Station } from '@/lib/data/types';

/**
 * A designed, API-key-free "map": a soft tinted canvas with faint roads and
 * tappable station pins positioned from each station's normalised map coords.
 */
export function StylizedMap({ stations }: { stations: Station[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Station | null>(null);

  return (
    <View className="flex-1 overflow-hidden rounded-3xl" style={cardShadow}>
      <LinearGradient colors={['#E8EEF6', '#DCE7F2']} className="flex-1">
        {/* faint "roads" */}
        <View className="absolute left-0 right-0 top-[28%] h-[6px] bg-white/60" />
        <View className="absolute left-0 right-0 top-[62%] h-[6px] bg-white/50" />
        <View className="absolute bottom-0 top-0 left-[36%] w-[6px] bg-white/60" />
        <View className="absolute bottom-0 top-0 left-[68%] w-[6px] bg-white/40" />
        <View className="absolute left-0 right-0 top-[45%] h-[10px] bg-white/70" />

        {/* hint pill */}
        <View className="absolute left-4 right-4 top-4 flex-row items-center rounded-2xl bg-surface px-4 py-3" style={cardShadow}>
          <Hand size={18} color={colors.muted} />
          <Txt weight="medium" className="ml-2 text-[14px] text-muted">
            Tap a pin to open a station
          </Txt>
        </View>

        {/* pins */}
        {stations.map((s) => {
          const online = s.status === 'online';
          const active = selected?.id === s.id;
          return (
            <Pressable
              key={s.id}
              onPress={() => setSelected(s)}
              style={{ position: 'absolute', left: `${s.map.x * 100}%`, top: `${s.map.y * 100}%` }}
            >
              <MotiView
                animate={{ scale: active ? 1.15 : 1 }}
                className="items-center"
                style={{ transform: [{ translateX: -22 }, { translateY: -44 }] }}
              >
                <View
                  className={cn(
                    'h-11 w-11 items-center justify-center rounded-full border-2 border-white',
                    online ? 'bg-brand-500' : 'bg-faint',
                  )}
                  style={cardShadow}
                >
                  <Txt weight="black" className="text-[14px] text-white" style={{ color: '#fff' }}>
                    {online ? s.charged : '—'}
                  </Txt>
                </View>
                <View className={cn('-mt-1 h-3 w-3 rotate-45 border-b-2 border-r-2 border-white', online ? 'bg-brand-500' : 'bg-faint')} />
              </MotiView>
            </Pressable>
          );
        })}

        {/* selected preview */}
        {selected && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <Pressable onPress={() => router.push(`/station/${selected.id}`)}>
              <View className="rounded-2xl bg-surface p-4" style={cardShadow}>
                <View className="flex-row items-center justify-between">
                  <Txt weight="extrabold" className="text-[16px] text-ink">
                    {selected.code}
                  </Txt>
                  <Badge tone={selected.status === 'online' ? 'success' : 'danger'} dot label={selected.status === 'online' ? 'Online' : 'Offline'} />
                </View>
                <Txt weight="medium" className="mt-0.5 text-[13px] text-muted">
                  {selected.name}
                </Txt>
                <View className="mt-3 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Badge tone="brand" label={`${selected.distance_km} km`} />
                    <Txt weight="bold" className="text-[13px] text-success-ink">
                      {selected.status === 'online' ? `${selected.charged} available` : 'Not reporting'}
                    </Txt>
                  </View>
                  <View className="flex-row items-center">
                    <Txt weight="bold" className="text-[13px] text-brand-600">
                      Open
                    </Txt>
                    <ChevronRight size={16} color={colors.brand} />
                  </View>
                </View>
              </View>
            </Pressable>
          </MotiView>
        )}
      </LinearGradient>
    </View>
  );
}
