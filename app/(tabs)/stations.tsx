import { useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { ArrowUpDown, List, Map as MapIcon, Search, SlidersHorizontal } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { StationCard } from '@/components/StationCard';
import { StylizedMap } from '@/components/StylizedMap';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { STATIONS } from '@/lib/data/stations';

type Filter = 'all' | 'online' | 'available';
type Sort = 'nearest' | 'batteries';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'online', label: 'Online' },
  { key: 'available', label: 'Available now' },
];

export default function Stations() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('nearest');
  const [showFilters, setShowFilters] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = STATIONS.filter((s) => {
      if (q && !`${s.code} ${s.name} ${s.city} ${s.area}`.toLowerCase().includes(q)) return false;
      if (filter === 'online') return s.status === 'online';
      if (filter === 'available') return s.status === 'online' && s.charged > 0;
      return true;
    });
    out = [...out].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'online' ? -1 : 1;
      return sort === 'nearest'
        ? (a.distance_km ?? 99) - (b.distance_km ?? 99)
        : b.charged - a.charged;
    });
    return out;
  }, [query, filter, sort]);

  const onlineCount = STATIONS.filter((s) => s.status === 'online').length;

  return (
    <View className="flex-1 bg-background">
      <AppBar
        large
        title="Stations"
        subtitle="Find nearby battery swap stations"
        right={
          <View className="flex-row items-center rounded-full bg-card p-1" style={{ shadowColor: '#0B1420', shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 }}>
            <Toggle active={view === 'map'} onPress={() => setView('map')} icon={<MapIcon size={16} color={view === 'map' ? '#fff' : colors.muted} />} label="Map" />
            <Toggle active={view === 'list'} onPress={() => setView('list')} icon={<List size={16} color={view === 'list' ? '#fff' : colors.muted} />} label="List" />
          </View>
        }
      />

      {/* Search + filter */}
      <View className="flex-row items-center gap-2.5 px-5 pb-2 pt-1">
        <View className="h-12 flex-1 flex-row items-center rounded-2xl border border-border bg-card px-3.5">
          <Search size={18} color={colors.faint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search station, city or area"
            placeholderTextColor={colors.faint}
            style={{ flex: 1, marginLeft: 8, fontFamily: 'Inter_500Medium', fontSize: 15, color: colors.ink }}
          />
        </View>
        <Pressable
          onPress={() => setShowFilters((v) => !v)}
          className={cn('h-12 w-12 items-center justify-center rounded-2xl border', showFilters || filter !== 'all' ? 'border-brand-500 bg-brand-50' : 'border-border bg-card')}
        >
          <SlidersHorizontal size={19} color={showFilters || filter !== 'all' ? colors.brand : colors.ink} />
        </Pressable>
      </View>

      {/* Collapsible filter chips */}
      {showFilters && (
        <View className="flex-row flex-wrap items-center gap-2 px-5 pb-2">
          {FILTERS.map((f) => (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              className={cn('rounded-full border px-3.5 py-1.5', filter === f.key ? 'border-brand-500 bg-brand-500' : 'border-border bg-card')}
            >
              <Txt weight="bold" className={cn('text-[12.5px]', filter === f.key ? 'text-white' : 'text-muted')} style={filter === f.key ? { color: '#fff' } : undefined}>
                {f.label}
              </Txt>
            </Pressable>
          ))}
        </View>
      )}

      {view === 'list' ? (
        <Screen contentClassName="px-5">
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Txt weight="bold" className="text-[15px] text-foreground">
                {list.length} {list.length === 1 ? 'station' : 'stations'}
              </Txt>
              <Txt weight="regular" className="text-[12px] text-muted">
                {onlineCount} online nearby
              </Txt>
            </View>
            <Pressable
              onPress={() => setSort((s) => (s === 'nearest' ? 'batteries' : 'nearest'))}
              className="flex-row items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2"
            >
              <ArrowUpDown size={14} color={colors.muted} />
              <Txt weight="bold" className="text-[12px] text-foreground">
                {sort === 'nearest' ? 'Nearest' : 'Most batteries'}
              </Txt>
            </Pressable>
          </View>
          {list.length === 0 ? (
            <View className="mt-16 items-center">
              <Txt weight="bold" className="text-[15px] text-foreground">
                No stations match
              </Txt>
              <Txt weight="regular" className="mt-1 text-[13px] text-muted">
                Try a different search or filter.
              </Txt>
            </View>
          ) : (
            list.map((s, i) => <StationCard key={s.id} station={s} fade nearest={i === 0 && sort === 'nearest' && s.status === 'online'} />)
          )}
        </Screen>
      ) : (
        <Screen contentClassName="px-5 pt-1">
          <View style={{ height: 400 }}>
            <StylizedMap stations={list} />
          </View>
          <Txt weight="black" className="mb-2 mt-5 text-[17px] text-foreground">
            {list.length} {list.length === 1 ? 'station' : 'stations'} nearby
          </Txt>
          {list.map((s, i) => (
            <StationCard key={s.id} station={s} fade nearest={i === 0 && sort === 'nearest' && s.status === 'online'} />
          ))}
        </Screen>
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
