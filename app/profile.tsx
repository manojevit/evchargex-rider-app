import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Bike,
  Building2,
  CalendarDays,
  Hash,
  Lock,
  Phone,
  User,
  Zap,
} from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { IconTile } from '@/components/ui/IconTile';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';
import { useToast } from '@/lib/toast';

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { rider, account, updateName } = useStore();
  const toast = useToast();

  const [name, setName] = useState(rider.name);
  const [focused, setFocused] = useState(false);
  const changed = name.trim().length > 0 && name.trim() !== rider.name;
  const vehicle = account.vehicle;

  const save = () => {
    updateName(name);
    toast.show('Profile updated', 'success');
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <AppBar title="Profile" back />
      <Screen contentClassName="px-5 pt-2" padBottom={140}>
        {/* Avatar */}
        <View className="items-center py-1">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-secondary">
            <Txt weight="black" className="text-[40px] text-brand-700">
              {(name.trim()[0] || rider.avatar_letter).toUpperCase()}
            </Txt>
          </View>
        </View>

        {/* Name — editable */}
        <Txt weight="semibold" className="mb-2 mt-4 text-[13px] text-muted">
          Full name
        </Txt>
        <View className={cn('h-14 flex-row items-center rounded-2xl border bg-card px-4', focused ? 'border-brand-500' : 'border-border')}>
          <User size={18} color={colors.muted} />
          <TextInput
            value={name}
            onChangeText={setName}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Your name"
            placeholderTextColor={colors.faint}
            maxLength={40}
            style={{ flex: 1, marginLeft: 12, fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors.ink }}
          />
        </View>

        {/* Phone — locked */}
        <Txt weight="semibold" className="mb-2 mt-5 text-[13px] text-muted">
          Mobile number
        </Txt>
        <View className="h-14 flex-row items-center rounded-2xl border border-border bg-canvas px-4">
          <Phone size={18} color={colors.faint} />
          <Txt weight="semibold" className="ml-3 flex-1 text-[16px] text-muted">
            {rider.phone}
          </Txt>
          <Lock size={16} color={colors.faint} />
        </View>
        <Txt weight="medium" className="mt-2 text-[12px] text-muted">
          Your mobile number can’t be changed. Contact support if it’s wrong.
        </Txt>

        {/* Account */}
        <Txt weight="bold" className="mb-2 mt-6 text-[12px] uppercase tracking-wide text-muted">
          Account
        </Txt>
        <Card className="p-0">
          <DetailRow icon={<Building2 size={18} color={colors.info} />} tone="info" label="Organisation" value={rider.organisation} />
          <Divider />
          <DetailRow icon={<Hash size={18} color={colors.brand} />} tone="brand" label="Rider ID" value={rider.rider_id} />
          <Divider />
          <DetailRow icon={<CalendarDays size={18} color="#7C3AED" />} tone="violet" label="Member since" value={rider.member_since} />
        </Card>

        {/* Vehicle */}
        <Txt weight="bold" className="mb-2 mt-6 text-[12px] uppercase tracking-wide text-muted">
          Vehicle
        </Txt>
        <Card className="p-0">
          {vehicle ? (
            <>
              <DetailRow icon={<Bike size={18} color={colors.success} />} tone="success" label="Vehicle number" value={vehicle.plate} />
              <Divider />
              <DetailRow icon={<Zap size={18} color={colors.warn} />} tone="warn" label="Model" value={vehicle.model} />
            </>
          ) : (
            <View className="flex-row items-center px-4 py-4">
              <IconTile tone="neutral">
                <Bike size={18} color={colors.faint} />
              </IconTile>
              <Txt weight="semibold" className="ml-3 text-[14px] text-muted">
                No vehicle linked by your fleet operator yet.
              </Txt>
            </View>
          )}
        </Card>
      </Screen>

      <View className="absolute inset-x-0 bottom-0 border-t border-border bg-card px-5 pt-3" style={{ paddingBottom: insets.bottom + 12 }}>
        <Button label="Save changes" disabled={!changed} onPress={save} />
      </View>
    </View>
  );
}

function DetailRow({
  icon,
  tone,
  label,
  value,
}: {
  icon: React.ReactNode;
  tone: 'brand' | 'success' | 'warn' | 'info' | 'violet';
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center px-4 py-3.5">
      <IconTile tone={tone}>{icon}</IconTile>
      <View className="ml-3 flex-1">
        <Txt weight="medium" className="text-[12px] text-muted">
          {label}
        </Txt>
        <Txt weight="bold" className="text-[14.5px] text-foreground" numberOfLines={1}>
          {value}
        </Txt>
      </View>
    </View>
  );
}

function Divider() {
  return <View className="ml-[64px] h-px bg-line" />;
}
