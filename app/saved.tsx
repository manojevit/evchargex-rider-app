import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bookmark, MapPin } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { IconTile } from '@/components/ui/IconTile';
import { StationCard } from '@/components/StationCard';
import { colors } from '@/lib/theme';
import { useStore } from '@/lib/store';
import { getStation } from '@/lib/data/stations';
import type { Station } from '@/lib/data/types';

export default function Saved() {
  const router = useRouter();
  const { savedIds } = useStore();
  const stations = savedIds.map(getStation).filter((s): s is Station => !!s);

  return (
    <View className="flex-1 bg-canvas">
      <AppBar title="Saved stations" back />
      <Screen contentClassName="px-5 pt-1">
        {stations.length === 0 ? (
          <Card className="mt-6 items-center py-10">
            <IconTile tone="neutral" size="lg" rounded="rounded-2xl">
              <Bookmark size={28} color={colors.faint} />
            </IconTile>
            <Txt weight="extrabold" className="mt-4 text-[17px] text-foreground">
              No saved stations yet
            </Txt>
            <Txt weight="regular" className="mt-2 px-8 text-center text-[13.5px] text-muted">
              Tap the bookmark on any station to save it here for quick access.
            </Txt>
            <View className="mt-5 w-full px-6">
              <Button label="Find stations" leftIcon={<MapPin size={18} color="#fff" />} onPress={() => router.push('/(tabs)/stations')} />
            </View>
          </Card>
        ) : (
          <>
            <Txt weight="bold" className="mb-2 text-[12px] uppercase tracking-wide text-muted">
              {stations.length} saved
            </Txt>
            {stations.map((s) => (
              <StationCard key={s.id} station={s} />
            ))}
          </>
        )}
      </Screen>
    </View>
  );
}
