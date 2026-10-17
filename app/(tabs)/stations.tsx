import { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { List, Map as MapIcon, Search, SlidersHorizontal } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { StationCard } from '@/components/StationCard';
import { StylizedMap } from '@/components/StylizedMap';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { STATIONS } from '@/lib/data/stations';

export default function Stations() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STATIONS;
    return STATIONS.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <View className="flex-1 bg-canvas">
      <AppBar
        large
        title="Stations"
        subtitle="Find nearby battery swap stations"
        right={
          <View className="flex-row items-center rounded-full bg-surface p-1" style={{ shadowColor: '#0B1420', shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 }}>
            <Toggle active={view === 'map'} onPress={() => setView('map')} icon={<MapIcon size={16} color={view === 'map' ? '#fff' : colors.muted} />} label="Map" />
            <Toggle active={view === 'list'} onPress={() => setView('list')} icon={<List size={16} color={view === 'list' ? '#fff' : colors.muted} />} label="List" />
          </View>
        }
      />

      {/* Search */}
      <View className="flex-row items-center gap-2.5 px-5 pb-3 pt-1">
        <View className="h-12 flex-1 flex-row items-center rounded-2xl border border-line bg-surface px-3.5">
          <Search size={18} color={colors.faint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search station, city or area"
            placeholderTextColor={colors.faint}
            style={{ flex: 1, marginLeft: 8, fontFamily: 'Inter_500Medium', fontSize: 15, color: colors.ink }}
          />
        </View>
        <Pressable className="h-12 w-12 items-center justify-center rounded-2xl border border-line bg-surface">
          <SlidersHorizontal size={19} color={colors.ink} />
        </Pressable>
      </View>

      {view === 'list' ? (
        <Screen contentClassName="px-5">
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Txt weight="bold" className="text-[15px] text-ink">
                {filtered.length} stations nearby
              </Txt>
              <Txt weight="regular" className="text-[12px] text-muted">
                Sorted by nearest
              </Txt>
            </View>
            <View className="flex-row items-center rounded-xl border border-line bg-surface px-3 py-2">
              <Txt weight="medium" className="text-[12px] text-muted">
                Sort{' '}
              </Txt>
              <Txt weight="bold" className="text-[12px] text-ink">
                Nearest
              </Txt>
            </View>
          </View>
          {filtered.map((s) => (
            <StationCard key={s.id} station={s} />
          ))}
        </Screen>
      ) : (
        <View className="flex-1 px-5 pb-[130px] pt-1">
          <StylizedMap stations={filtered} />
        </View>
      )}
    </View>
  );
}

function Toggle({ active, onPress, icon, label }: { active: boolean; onPress: () => void; icon: React.ReactNode; label: string }) {
  return (
    <Pressable onPress={onPress} className={cn('flex-row items-center gap-1.5 rounded-full px-3.5 py-2', active && 'bg-brand-500')}>
      {icon}
      <Txt weight="bold" className={cn('text-[13px]', active ? 'text-white' : 'text-muted')} style={active ? { color: '#fff' } : undefined}>
        {label}
      </Txt>
    </Pressable>
  );
}
