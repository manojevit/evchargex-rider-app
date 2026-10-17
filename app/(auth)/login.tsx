import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { Phone, ShieldCheck } from 'lucide-react-native';
import { Logo } from '@/components/Logo';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Pre-filled with the demo rider's number so you can breeze through the flow.
  const [phone, setPhone] = useState('78770 18453');
  const [focused, setFocused] = useState(false);

  const digits = phone.replace(/\D/g, '');
  const valid = digits.length === 10;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-canvas">
      <View className="flex-1 px-6" style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 20 }}>
        <MotiView from={{ opacity: 0, translateY: 14 }} animate={{ opacity: 1, translateY: 0 }}>
          <Logo variant="row" tone="dark" size="md" tagline />
          <Txt weight="black" className="mt-8 text-[30px] leading-9 text-foreground">
            Sign in to{'\n'}continue
          </Txt>
          <Txt weight="regular" className="mt-3 text-[16px] leading-6 text-muted">
            Enter your mobile number and we’ll send a one-time code to verify it.
          </Txt>
        </MotiView>

        <View className="mt-10">
          <Txt weight="semibold" className="mb-2 text-[13px] text-muted">
            Mobile number
          </Txt>
          <View
            className={cn(
              'h-14 flex-row items-center rounded-2xl border bg-surface px-4',
              focused ? 'border-brand-500' : 'border-line',
            )}
          >
            <Phone size={18} color={colors.muted} />
            <Txt weight="semibold" className="ml-3 text-[17px] text-ink">
              +91
            </Txt>
            <View className="mx-3 h-6 w-px bg-line" />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              keyboardType="number-pad"
              placeholder="00000 00000"
              placeholderTextColor={colors.faint}
              maxLength={11}
              style={{ flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 17, color: colors.ink }}
            />
          </View>

          <View className="mt-4 flex-row items-center gap-2">
            <ShieldCheck size={15} color={colors.success} />
            <Txt weight="medium" className="text-[12.5px] text-muted">
              Your number is only used to secure your account.
            </Txt>
          </View>
        </View>

        <View className="flex-1" />

        <Button label="Continue" disabled={!valid} onPress={() => router.push('/(auth)/otp')} />
        <Pressable className="mt-4 items-center" hitSlop={8}>
          <Txt weight="medium" className="text-[13px] text-muted">
            By continuing you agree to our Terms & Privacy Policy
          </Txt>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
