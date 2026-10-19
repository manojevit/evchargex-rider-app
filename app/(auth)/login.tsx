import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { MapPin, ShieldCheck, Timer, Zap } from 'lucide-react-native';
import { Logo } from '@/components/Logo';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';
import { colors, gradients } from '@/lib/theme';
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
    <View className="flex-1 bg-canvas">
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Brand hero */}
          <LinearGradient
            colors={gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingTop: insets.top + 22, paddingHorizontal: 24, paddingBottom: 52, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, overflow: 'hidden' }}
          >
            {/* Faint electric glow motif */}
            <View pointerEvents="none" style={{ position: 'absolute', top: -70, right: -50, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.10)' }} />
            <View pointerEvents="none" style={{ position: 'absolute', top: 30, right: 36, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.08)' }} />

            <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }}>
              <Logo variant="row" tone="light" size="md" tagline />
              <Txt weight="black" className="mt-9 text-[32px] leading-10 text-white" style={{ color: '#fff' }}>
                Full charge,{'\n'}every ride.
              </Txt>
              <Txt weight="medium" className="mt-2.5 text-[14.5px] leading-5" style={{ color: 'rgba(255,255,255,0.82)' }}>
                Swap your empty pack for a full one in under a minute.
              </Txt>

              {/* Trust chips */}
              <View className="mt-5 flex-row flex-wrap gap-2">
                <HeroChip icon={<Timer size={13} color="#fff" />} label="Swap in <60s" />
                <HeroChip icon={<MapPin size={13} color="#fff" />} label="1,200+ stations" />
                <HeroChip icon={<Zap size={13} color="#fff" fill="#fff" />} label="Unlimited plan" />
              </View>
            </MotiView>
          </LinearGradient>

          {/* Floating form card */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 120 }}
            style={{
              marginTop: -30,
              marginHorizontal: 20,
              borderRadius: 28,
              backgroundColor: '#FFFFFF',
              padding: 22,
              shadowColor: '#0B1420',
              shadowOpacity: 0.1,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 12 },
              elevation: 8,
            }}
          >
            <Txt weight="black" className="text-[21px] text-ink">
              Enter your number
            </Txt>
            <Txt weight="regular" className="mt-1.5 text-[13.5px] leading-5 text-muted">
              We’ll text you a one-time code to sign in. No password needed.
            </Txt>

            <Txt weight="semibold" className="mb-2 mt-5 text-[12.5px] text-muted">
              Mobile number
            </Txt>
            <View className={cn('h-14 flex-row items-center rounded-2xl border bg-canvas px-4', focused ? 'border-brand-500' : 'border-border')}>
              <IndiaFlag />
              <Txt weight="bold" className="ml-2 text-[16px] text-ink">
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
                style={{ flex: 1, fontFamily: 'Inter_700Bold', fontSize: 17, letterSpacing: 0.5, color: colors.ink }}
              />
            </View>

            <View className="mt-6">
              <Button label="Continue" disabled={!valid} rightIcon={<Zap size={18} color="#fff" fill="#fff" />} onPress={() => router.push('/(auth)/otp')} />
            </View>

            <View className="mt-4 flex-row items-center justify-center gap-1.5">
              <ShieldCheck size={14} color={colors.success} />
              <Txt weight="medium" className="text-[12px] text-muted">
                Secure OTP login · your number stays private
              </Txt>
            </View>
          </MotiView>

          <View className="flex-1" />

          <Pressable className="items-center px-8 pt-6" hitSlop={8} style={{ paddingBottom: insets.bottom + 16 }}>
            <Txt weight="medium" className="text-center text-[12px] leading-4 text-faint">
              By continuing you agree to our Terms & Privacy Policy
            </Txt>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function IndiaFlag() {
  return (
    <View style={{ width: 22, height: 15, borderRadius: 3, overflow: 'hidden', borderWidth: 1, borderColor: '#E3E8EF' }}>
      <View style={{ flex: 1, backgroundColor: '#FF9933' }} />
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#0A3D91' }} />
      </View>
      <View style={{ flex: 1, backgroundColor: '#138808' }} />
    </View>
  );
}

function HeroChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
      {icon}
      <Txt weight="bold" className="text-[11.5px] text-white" style={{ color: '#fff' }}>
        {label}
      </Txt>
    </View>
  );
}
