import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Lock, Phone, User } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';
import { useToast } from '@/lib/toast';

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { rider, updateName } = useStore();
  const toast = useToast();

  const [name, setName] = useState(rider.name);
  const [focused, setFocused] = useState(false);
  const changed = name.trim().length > 0 && name.trim() !== rider.name;

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
        <View className="items-center py-2">
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
      </Screen>

      <View className="absolute inset-x-0 bottom-0 border-t border-border bg-card px-5 pt-3" style={{ paddingBottom: insets.bottom + 12 }}>
        <Button label="Save changes" disabled={!changed} onPress={save} />
      </View>
    </View>
  );
}
