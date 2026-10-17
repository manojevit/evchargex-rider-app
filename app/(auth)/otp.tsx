import { useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { ArrowLeft } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';

const LEN = 6;
const DEMO_OTP = '123456';

export default function Otp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(28);
  const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const valid = code.length === LEN;

  return (
    <View className="flex-1 bg-canvas px-6" style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 }}>
      <Pressable onPress={() => router.back()} hitSlop={10} className="h-11 w-11 items-center justify-center rounded-2xl bg-surface">
        <ArrowLeft size={22} color={colors.ink} />
      </Pressable>

      <MotiView from={{ opacity: 0, translateY: 14 }} animate={{ opacity: 1, translateY: 0 }} className="mt-6">
        <Txt weight="black" className="text-[28px] text-ink">
          Verify your number
        </Txt>
        <Txt weight="regular" className="mt-3 text-[16px] leading-6 text-muted">
          Enter the {LEN}-digit code we sent to{' '}
          <Txt weight="bold" className="text-[16px] text-ink">
            +91 78770 18453
          </Txt>
        </Txt>
      </MotiView>

      {/* Boxes */}
      <Pressable onPress={() => inputRef.current?.focus()} className="mt-10 flex-row gap-2">
        {Array.from({ length: LEN }).map((_, i) => {
          const char = code[i];
          const active = i === code.length;
          return (
            <View
              key={i}
              className={cn(
                'h-[58px] flex-1 items-center justify-center rounded-xl border-2 bg-card',
                char ? 'border-brand-500' : active ? 'border-brand-300' : 'border-border',
              )}
            >
              <Txt weight="black" className="text-[22px] text-foreground">
                {char ?? ''}
              </Txt>
            </View>
          );
        })}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, LEN))}
        keyboardType="number-pad"
        maxLength={LEN}
        autoFocus
        style={{ position: 'absolute', opacity: 0, height: 1, width: 1 }}
      />

      <View className="mt-6 flex-row items-center">
        <Txt weight="medium" className="text-[13.5px] text-muted">
          Didn’t get it?{' '}
        </Txt>
        {seconds > 0 ? (
          <Txt weight="semibold" className="text-[13.5px] text-faint">
            Resend in 0:{seconds.toString().padStart(2, '0')}
          </Txt>
        ) : (
          <Pressable onPress={() => setSeconds(28)} hitSlop={8}>
            <Txt weight="bold" className="text-[13.5px] text-brand-600">
              Resend code
            </Txt>
          </Pressable>
        )}
      </View>

      <View className="mt-4 self-start rounded-xl bg-brand-50 px-3 py-2">
        <Txt weight="medium" className="text-[12.5px] text-brand-700">
          Demo tip: the code is {DEMO_OTP}
        </Txt>
      </View>

      <View className="flex-1" />
      <Button label="Verify" disabled={!valid} onPress={() => router.push('/(auth)/pin')} />
    </View>
  );
}
