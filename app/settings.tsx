import { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  BatteryCharging,
  Bell,
  ChevronRight,
  Fingerprint,
  Globe,
  Repeat,
  ShieldCheck,
  UserRound,
  Wrench,
} from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { IconTile } from '@/components/ui/IconTile';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';
import { useToast } from '@/lib/toast';

export default function Settings() {
  const router = useRouter();
  const toast = useToast();
  const { persona, setPersona } = useStore();
  const [push, setPush] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const rich = persona === 'rich';

  return (
    <View className="flex-1 bg-canvas">
      <AppBar title="Settings" back />
      <Screen contentClassName="px-5 pt-1">
        {/* DEMO CONTROLS — the live persona toggle */}
        <View className="mb-1 flex-row items-center gap-2">
          <Wrench size={15} color={colors.brand} />
          <Txt weight="bold" className="text-[12px] uppercase tracking-wider text-brand-600">
            Demo controls
          </Txt>
        </View>
        <Card className="border border-brand-100">
          <View className="flex-row items-center">
            <IconTile tone="brand">
              <Repeat size={20} color={colors.brand} />
            </IconTile>
            <View className="ml-3 flex-1">
              <Txt weight="bold" className="text-[15px] text-ink">
                Demo account state
              </Txt>
              <Txt weight="medium" className="text-[12px] text-muted">
                Flip between an active rider and a brand-new rider.
              </Txt>
            </View>
          </View>

          <View className="mt-4 flex-row gap-2.5">
            <Pressable className="flex-1" onPress={() => setPersona('rich')} hitSlop={6} android_ripple={{ color: '#DBE7FF' }}>
              <View className={cn('items-center rounded-2xl border-2 p-3.5', rich ? 'border-brand-500 bg-brand-50' : 'border-border bg-card')}>
                <BatteryCharging size={24} color={rich ? colors.brand : colors.faint} />
                <Txt weight="bold" className={cn('mt-2 text-[13.5px]', rich ? 'text-brand-700' : 'text-muted')}>
                  Active rider
                </Txt>
                <Txt weight="medium" className="text-[10.5px] text-muted">
                  Full data
                </Txt>
              </View>
            </Pressable>
            <Pressable className="flex-1" onPress={() => setPersona('empty')} hitSlop={6} android_ripple={{ color: '#DBE7FF' }}>
              <View className={cn('items-center rounded-2xl border-2 p-3.5', !rich ? 'border-brand-500 bg-brand-50' : 'border-border bg-card')}>
                <UserRound size={24} color={!rich ? colors.brand : colors.faint} />
                <Txt weight="bold" className={cn('mt-2 text-[13.5px]', !rich ? 'text-brand-700' : 'text-muted')}>
                  New rider
                </Txt>
                <Txt weight="medium" className="text-[10.5px] text-muted">
                  Empty state
                </Txt>
              </View>
            </Pressable>
          </View>
          <View className="mt-3 flex-row items-center justify-center gap-2">
            <Badge tone={rich ? 'success' : 'neutral'} dot label={rich ? 'Showing: Active rider' : 'Showing: New rider'} />
          </View>
        </Card>

        {/* General */}
        <SectionTitle>General</SectionTitle>
        <Card className="p-0">
          <Row icon={<Globe size={20} color={colors.info} />} tone="info" title="Language" value="English" onPress={() => toast.show('More languages coming soon.')} />
        </Card>

        {/* Preferences */}
        <SectionTitle>Preferences</SectionTitle>
        <Card className="p-0">
          <ToggleRow icon={<Bell size={20} color={colors.warn} />} tone="warn" title="Push notifications" sub="Swap updates & alerts" value={push} onValueChange={setPush} />
          <Divider />
          <ToggleRow icon={<Fingerprint size={20} color="#7C3AED" />} tone="violet" title="Unlock with biometrics" sub="Use fingerprint to open the app" value={biometrics} onValueChange={setBiometrics} />
        </Card>

        {/* Security */}
        <SectionTitle>Security</SectionTitle>
        <Card className="p-0">
          <Row icon={<ShieldCheck size={20} color={colors.success} />} tone="success" title="Change PIN" value="" onPress={() => router.push('/(auth)/pin')} />
        </Card>

        <Txt weight="regular" className="mt-6 text-center text-[11.5px] text-faint">
          EVCHARGEX · v1.0.0 · Demo build
        </Txt>
      </Screen>
    </View>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Txt weight="bold" className="mb-2 mt-6 text-[12px] uppercase tracking-wider text-muted">
      {children}
    </Txt>
  );
}
function Divider() {
  return <View className="ml-[68px] h-px bg-line" />;
}

function Row({
  icon,
  tone,
  title,
  value,
  onPress,
}: {
  icon: React.ReactNode;
  tone: 'brand' | 'success' | 'warn' | 'info' | 'violet';
  title: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center px-4 py-3.5" style={({ pressed }) => (pressed ? { backgroundColor: '#F7F9FC' } : undefined)}>
      <IconTile tone={tone}>{icon}</IconTile>
      <Txt weight="bold" className="ml-3 flex-1 text-[15px] text-ink">
        {title}
      </Txt>
      {value ? (
        <Txt weight="medium" className="mr-2 text-[13.5px] text-muted">
          {value}
        </Txt>
      ) : null}
      <ChevronRight size={20} color={colors.faint} />
    </Pressable>
  );
}

function ToggleRow({
  icon,
  tone,
  title,
  sub,
  value,
  onValueChange,
}: {
  icon: React.ReactNode;
  tone: 'brand' | 'success' | 'warn' | 'info' | 'violet';
  title: string;
  sub: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center px-4 py-3.5">
      <IconTile tone={tone}>{icon}</IconTile>
      <View className="ml-3 flex-1">
        <Txt weight="bold" className="text-[15px] text-ink">
          {title}
        </Txt>
        <Txt weight="medium" className="text-[12px] text-muted">
          {sub}
        </Txt>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.line, true: colors.brand }}
        thumbColor="#fff"
      />
    </View>
  );
}
