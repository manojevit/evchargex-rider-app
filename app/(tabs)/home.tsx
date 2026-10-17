import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BatteryLow, Bell, Bike, ChevronRight, PiggyBank, Repeat, ShieldCheck, Zap } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IconTile } from '@/components/ui/IconTile';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { StationCard, StationRowCompact } from '@/components/StationCard';
import { colors } from '@/lib/theme';
import { rupees } from '@/lib/format';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';
import { STATIONS } from '@/lib/data/stations';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { rider, account, unreadAlerts } = useStore();
  const { vehicle, plan } = account;

  // Online stations first, nearest first — the rider's real question is "where can I swap now".
  const stations = [...STATIONS].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'online' ? -1 : 1;
    return (a.distance_km ?? 99) - (b.distance_km ?? 99);
  });
  const [hero, ...rest] = stations;
  const lowBattery = vehicle ? vehicle.battery_pct <= 20 : false;

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center px-5 pb-3">
        <Pressable onPress={() => router.push('/(tabs)/menu')} className="h-11 w-11 items-center justify-center rounded-full bg-secondary">
          <Txt weight="black" className="text-[18px] text-primary-foreground" style={{ color: colors.brand700 }}>
            {rider.avatar_letter}
          </Txt>
        </Pressable>
        <View className="ml-3 flex-1">
          <Txt weight="medium" className="text-[13px] text-muted">
            {greeting()},
          </Txt>
          <Txt weight="extrabold" className="text-[19px] text-foreground">
            {rider.name}
          </Txt>
        </View>
        <Pressable onPress={() => router.push('/alerts')} className="h-11 w-11 items-center justify-center rounded-full bg-card" style={{ shadowColor: '#0B1420', shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 }}>
          <Bell size={20} color={colors.ink} />
          {unreadAlerts > 0 && (
            <View className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-destructive" />
          )}
        </Pressable>
      </View>

      <Screen contentClassName="px-5 pt-1">
        {/* Status strip — one line, only what matters */}
        {vehicle ? (
          <Card className="flex-row items-center">
            <IconTile tone={lowBattery ? 'warn' : 'success'} size="md">
              <Zap size={20} color={lowBattery ? colors.warn : colors.success} fill={lowBattery ? colors.warn : colors.success} strokeWidth={1.5} />
            </IconTile>
            <View className="ml-3 flex-1">
              <View className="flex-row items-end justify-between">
                <Txt weight="semibold" className="text-[13px] text-muted">
                  {vehicle.plate}
                </Txt>
                <Txt weight="black" className={cn('text-[17px]', lowBattery ? 'text-warn' : 'text-foreground')}>
                  {vehicle.battery_pct}%
                </Txt>
              </View>
              <ProgressBar value={vehicle.battery_pct} tone={lowBattery ? 'warn' : 'success'} className="mt-1.5" height={6} />
            </View>
          </Card>
        ) : (
          <Card className="flex-row items-center">
            <IconTile tone="neutral" size="md">
              <Bike size={20} color={colors.faint} />
            </IconTile>
            <View className="ml-3 flex-1">
              <Txt weight="bold" className="text-[14px] text-foreground">
                No vehicle linked
              </Txt>
              <Txt weight="regular" className="text-[12.5px] text-muted">
                Your operator hasn’t added your bike yet.
              </Txt>
            </View>
          </Card>
        )}

        {/* Smart nudge — appears when the pack is running low */}
        {vehicle && lowBattery && hero && hero.status === 'online' && (
          <Pressable
            onPress={() => router.push(`/swap/preflight?station=${hero.id}`)}
            className="mt-3 flex-row items-center rounded-2xl bg-warn-soft p-4"
            style={({ pressed }) => (pressed ? { opacity: 0.9 } : undefined)}
          >
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/70">
              <BatteryLow size={22} color={colors.warn} />
            </View>
            <View className="ml-3 flex-1">
              <Txt weight="black" className="text-[14.5px] text-warn-ink">
                Battery low — swap soon
              </Txt>
              <Txt weight="semibold" className="text-[12.5px] text-warn-ink">
                Nearest: {hero.code} · {hero.distance_km} km away
              </Txt>
            </View>
            <View className="ml-2 flex-row items-center gap-1 rounded-xl bg-warn px-3 py-2">
              <Txt weight="bold" className="text-[12.5px] text-white" style={{ color: '#fff' }}>
                Swap now
              </Txt>
              <ChevronRight size={15} color="#fff" />
            </View>
          </Pressable>
        )}

        {/* Plan status — single slim pill row */}
        <Pressable onPress={() => router.push('/(tabs)/plan')} className="mt-3 flex-row items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3" style={{ shadowColor: '#0B1420', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}>
          <View className="flex-row items-center gap-2.5">
            <ShieldCheck size={18} color={plan ? colors.success : colors.faint} />
            <Txt weight="semibold" className="text-[14px] text-foreground">
              {plan ? 'Unlimited Monthly' : 'No active plan'}
            </Txt>
          </View>
          <View className="flex-row items-center gap-2">
            <Badge tone={plan ? 'success' : 'neutral'} dot label={plan ? 'Active' : 'Choose a plan'} />
            <ChevronRight size={18} color={colors.faint} />
          </View>
        </Pressable>

        {/* This-month stats */}
        {plan && (
          <View className="mt-3 flex-row gap-3">
            <Card className="flex-1">
              <View className="flex-row items-center justify-between">
                <Txt weight="bold" className="text-[11px] uppercase tracking-wide text-muted">
                  This month
                </Txt>
                <Repeat size={16} color={colors.brand} />
              </View>
              <Txt weight="black" className="mt-1.5 text-[22px] text-foreground">
                {plan.this_month_swaps} swaps
              </Txt>
            </Card>
            <Card className="flex-1">
              <View className="flex-row items-center justify-between">
                <Txt weight="bold" className="text-[11px] uppercase tracking-wide text-muted">
                  Saved
                </Txt>
                <PiggyBank size={16} color={colors.success} />
              </View>
              <Txt weight="black" className="mt-1.5 text-[22px] text-success">
                {rupees(plan.saved_rupees)}
              </Txt>
              <Txt weight="medium" className="text-[11px] text-muted">
                vs retail
              </Txt>
            </Card>
          </View>
        )}

        {/* Hero: nearest stations */}
        <View className="mb-3 mt-7 flex-row items-end justify-between">
          <View>
            <Txt weight="black" className="text-[20px] text-foreground">
              Swap near you
            </Txt>
            <Txt weight="regular" className="text-[12.5px] text-muted">
              Tap a station, or scan the QR to start
            </Txt>
          </View>
          <Pressable className="flex-row items-center" onPress={() => router.push('/(tabs)/stations')} hitSlop={8}>
            <Txt weight="bold" className="text-[14px] text-primary">
              See all
            </Txt>
            <ChevronRight size={16} color={colors.brand} />
          </Pressable>
        </View>

        {hero && <StationCard station={hero} />}
        {rest.slice(0, 2).map((s) => (
          <StationRowCompact key={s.id} station={s} />
        ))}
      </Screen>
    </View>
  );
}
