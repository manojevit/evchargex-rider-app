import { Pressable, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import {
  ChevronRight,
  CreditCard,
  HelpCircle,
  Info,
  LifeBuoy,
  LogOut,
  Settings,
  Clock,
} from 'lucide-react-native';
import { Logo } from '@/components/Logo';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { IconTile } from '@/components/ui/IconTile';
import { cardShadow, colors } from '@/lib/theme';
import { useStore } from '@/lib/store';

export default function Menu() {
  const router = useRouter();
  const { rider, signOut } = useStore();

  const items: {
    icon: React.ReactNode;
    tone: 'brand' | 'success' | 'warn' | 'danger' | 'violet' | 'info';
    title: string;
    sub: string;
    href: Href;
    badge?: number;
  }[] = [
    { icon: <Clock size={22} color={colors.brand} />, tone: 'brand', title: 'Swap history', sub: 'View your past swaps', href: '/history' },
    { icon: <CreditCard size={22} color={colors.info} />, tone: 'info', title: 'Subscription & plan', sub: 'Your plan, benefits & billing', href: '/(tabs)/plan' },
    { icon: <LifeBuoy size={22} color={colors.warn} />, tone: 'warn', title: 'Raise a ticket', sub: 'Report an issue or get help', href: '/tickets' },
    { icon: <Settings size={22} color="#7C3AED" />, tone: 'violet', title: 'Settings', sub: 'App preferences & demo controls', href: '/settings' },
    { icon: <HelpCircle size={22} color={colors.brand} />, tone: 'brand', title: 'Help', sub: 'Get support and FAQs', href: '/support' },
    { icon: <Info size={22} color={colors.info} />, tone: 'info', title: 'About & legal', sub: 'Version, terms & privacy', href: '/about' },
  ];

  return (
    <View className="flex-1 bg-canvas">
      <AppBar large title="Menu" bell />
      <Screen contentClassName="px-5 pt-1">
        {/* Profile */}
        <Pressable
          onPress={() => router.push('/profile')}
          className="flex-row items-center rounded-2xl bg-card p-4"
          style={({ pressed }) => [cardShadow, pressed ? { opacity: 0.92 } : null]}
        >
          <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-100">
            <Txt weight="black" className="text-[22px] text-brand-700">
              {(rider.name.trim()[0] || rider.avatar_letter).toUpperCase()}
            </Txt>
          </View>
          <View className="ml-3.5 flex-1">
            <Txt weight="extrabold" className="text-[18px] text-foreground" numberOfLines={1}>
              {rider.name}
            </Txt>
            <Txt weight="medium" className="text-[13px] text-muted" numberOfLines={1}>
              {rider.phone}
            </Txt>
            <View className="mt-1 flex-row items-center gap-1">
              <Txt weight="bold" className="text-[11.5px] text-brand-600">
                View & edit profile
              </Txt>
              <ChevronRight size={13} color={colors.brand} />
            </View>
          </View>
        </Pressable>

        {/* List */}
        <Card className="mt-4 p-0">
          {items.map((it, i) => (
            <Pressable
              key={it.title}
              onPress={() => router.push(it.href)}
              className="flex-row items-center px-4 py-3.5"
              style={({ pressed }) => (pressed ? { backgroundColor: '#F7F9FC' } : undefined)}
            >
              <IconTile tone={it.tone}>{it.icon}</IconTile>
              <View className="ml-3 flex-1">
                <Txt weight="bold" className="text-[15.5px] text-ink">
                  {it.title}
                </Txt>
                <Txt weight="medium" className="text-[12.5px] text-muted">
                  {it.sub}
                </Txt>
              </View>
              {it.badge ? (
                <View className="mr-2 min-w-[20px] items-center rounded-full bg-danger px-1.5 py-0.5">
                  <Txt weight="bold" className="text-[11px] text-white" style={{ color: '#fff' }}>
                    {it.badge}
                  </Txt>
                </View>
              ) : null}
              <ChevronRight size={20} color={colors.faint} />
              {i < items.length - 1 && <View className="absolute bottom-0 left-[68px] right-4 h-px bg-line" />}
            </Pressable>
          ))}
        </Card>

        {/* Log out */}
        <Pressable
          onPress={() => {
            signOut();
            router.replace('/(auth)/login');
          }}
          className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl border border-danger/30 bg-danger-soft/50 py-4"
        >
          <LogOut size={18} color={colors.danger} />
          <Txt weight="bold" className="text-[15px] text-danger">
            Log out
          </Txt>
        </Pressable>

        {/* Brand card */}
        <View className="mt-4 items-center overflow-hidden rounded-2xl bg-[#0B1420] p-6">
          <Logo variant="stack" tone="light" size="md" tagline />
        </View>
        <Txt weight="regular" className="mt-3 text-center text-[11px] text-faint">
          Version 1.0.0 · Demo build
        </Txt>
      </Screen>
    </View>
  );
}
