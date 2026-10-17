import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from '@/lib/motion';
import {
  Bike,
  BatteryCharging,
  ChevronRight,
  Navigation,
  QrCode,
  Repeat,
  ShieldCheck,
} from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { StationRowCompact } from '@/components/StationCard';
import { colors, gradients } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';
import { STATIONS } from '@/lib/data/stations';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning, good to see you again';
  if (h < 17) return 'Good afternoon, good to see you again';
  return 'Good evening, good to see you again';
}

export default function Home() {
  const router = useRouter();
  const { rider, account } = useStore();
  const { vehicle, plan, swaps_today } = account;

  return (
    <View className="flex-1 bg-canvas">
      <AppBar large title="Home" subtitle={greeting()} bell />
      <Screen contentClassName="px-5 pt-1">
        {/* Profile card */}
        <Pressable onPress={() => router.push('/(tabs)/menu')}>
          <Card className="flex-row items-center">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-50">
              <Txt weight="black" className="text-[22px] text-brand-600">
                {rider.avatar_letter}
              </Txt>
            </View>
            <View className="ml-3.5 flex-1">
              <Txt weight="medium" className="text-[13px] text-muted">
                Welcome back,
              </Txt>
              <Txt weight="extrabold" className="text-[20px] text-ink">
                {rider.name}
              </Txt>
              <Txt weight="medium" className="mt-0.5 text-[13px] text-muted">
                {rider.phone}
              </Txt>
            </View>
            <ChevronRight size={22} color={colors.faint} />
          </Card>
        </Pressable>

        {/* Vehicle card / empty state */}
        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 80 }}>
          {vehicle ? (
            <LinearGradient
              colors={gradients.brandSoft}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="mt-4 overflow-hidden rounded-2xl p-5"
            >
              <Txt weight="bold" className="text-[12px] uppercase tracking-wider text-brand-700">
                Your vehicle
              </Txt>
              <Txt weight="black" className="mt-1 text-[28px] text-ink">
                {vehicle.plate}
              </Txt>
              <Txt weight="medium" className="text-[14px] text-muted">
                {vehicle.model}
              </Txt>

              <View className="mt-4 flex-row items-center rounded-2xl bg-white/70 p-3.5">
                <IconTile tone="success" size="md">
                  <BatteryCharging size={22} color={colors.success} />
                </IconTile>
                <View className="ml-3 flex-1">
                  <View className="flex-row items-end justify-between">
                    <Txt weight="medium" className="text-[12.5px] text-muted">
                      Battery
                    </Txt>
                    <Txt weight="black" className="text-[18px] text-ink">
                      {vehicle.battery_pct}%
                    </Txt>
                  </View>
                  <ProgressBar value={vehicle.battery_pct} tone="success" className="mt-1.5" height={7} />
                </View>
                <View className="ml-4 border-l border-line pl-4">
                  <Txt weight="black" className="text-[18px] text-ink">
                    ~{vehicle.range_km} km
                  </Txt>
                  <Txt weight="medium" className="text-[11px] text-muted">
                    est. range
                  </Txt>
                </View>
              </View>
            </LinearGradient>
          ) : (
            <Card className="mt-4 items-center py-8">
              <IconTile tone="neutral" size="lg" rounded="rounded-2xl">
                <Bike size={30} color={colors.faint} />
              </IconTile>
              <Txt weight="extrabold" className="mt-4 text-[18px] text-ink">
                No vehicle on your account
              </Txt>
              <Txt weight="regular" className="mt-2 px-6 text-center text-[14px] leading-5 text-muted">
                Your fleet operator has not linked a bike to you yet, so there is no pack to report on.
              </Txt>
            </Card>
          )}
        </MotiView>

        {/* Quick stats */}
        <View className="mt-4 flex-row gap-3">
          <Pressable className="flex-1" onPress={() => router.push('/(tabs)/plan')}>
            <Card className={cn('flex-row items-center', plan ? '' : '')}>
              <IconTile tone={plan ? 'success' : 'neutral'}>
                <ShieldCheck size={20} color={plan ? colors.success : colors.faint} />
              </IconTile>
              <View className="ml-2.5 flex-1">
                <Txt weight="medium" className="text-[12px] text-muted">
                  Subscription
                </Txt>
                <Txt weight="extrabold" className={cn('text-[16px]', plan ? 'text-success' : 'text-danger')}>
                  {plan ? 'Active' : 'None'}
                </Txt>
              </View>
              <ChevronRight size={18} color={colors.faint} />
            </Card>
          </Pressable>

          <Pressable className="flex-1" onPress={() => router.push('/history')}>
            <Card className="flex-row items-center">
              <IconTile tone="brand">
                <Repeat size={20} color={colors.brand} />
              </IconTile>
              <View className="ml-2.5 flex-1">
                <Txt weight="medium" className="text-[12px] text-muted">
                  Swaps today
                </Txt>
                <Txt weight="extrabold" className="text-[16px] text-ink">
                  {swaps_today}
                </Txt>
              </View>
              <ChevronRight size={18} color={colors.faint} />
            </Card>
          </Pressable>
        </View>

        {/* Action row */}
        <View className="mt-3 flex-row gap-3">
          <Pressable
            className="flex-1 flex-row items-center rounded-2xl border border-line bg-surface p-4"
            onPress={() => router.push('/(tabs)/stations')}
          >
            <Navigation size={20} color={colors.ink} fill={colors.ink} />
            <View className="ml-2.5">
              <Txt weight="bold" className="text-[15px] text-ink">
                Navigate
              </Txt>
              <Txt weight="medium" className="text-[11.5px] text-muted">
                Find nearest station
              </Txt>
            </View>
          </Pressable>

          <Pressable className="flex-1" onPress={() => router.push('/scan')}>
            <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="flex-1 flex-row items-center rounded-2xl p-4">
              <QrCode size={22} color="#fff" />
              <View className="ml-2.5">
                <Txt weight="bold" className="text-[15px] text-white" style={{ color: '#fff' }}>
                  Start swap
                </Txt>
                <Txt weight="medium" className="text-[11.5px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  Scan QR at station
                </Txt>
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Nearest stations */}
        <View className="mb-3 mt-7 flex-row items-center justify-between">
          <Txt weight="black" className="text-[20px] text-ink">
            Nearest stations
          </Txt>
          <Pressable className="flex-row items-center" onPress={() => router.push('/(tabs)/stations')} hitSlop={8}>
            <Txt weight="bold" className="text-[14px] text-brand-600">
              See all
            </Txt>
            <ChevronRight size={16} color={colors.brand} />
          </Pressable>
        </View>

        {STATIONS.slice(0, 3).map((s) => (
          <StationRowCompact key={s.id} station={s} />
        ))}
      </Screen>
    </View>
  );
}
