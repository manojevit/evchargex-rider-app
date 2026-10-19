import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { tap } from '@/lib/haptics';

const LEN = 6;
const DEMO_OTP = '123456';

type Status = 'idle' | 'verifying' | 'success' | 'error';

export default function Otp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(28);
  const [status, setStatus] = useState<Status>('idle');
  const [shakeKey, setShakeKey] = useState(0);
  const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  // Auto-verify as soon as all 6 digits are entered — no button to tap.
  // busyRef (not `status` in deps) guards re-entry so the status change that
  // we trigger here doesn't re-run this effect and cancel its own timeout.
  useEffect(() => {
    if (code.length !== LEN || busyRef.current) return;
    busyRef.current = true;
    setStatus('verifying');
    const t = setTimeout(() => {
      if (code === DEMO_OTP) {
        setStatus('success');
        tap('medium');
        setTimeout(() => router.replace('/(auth)/pin'), 500);
      } else {
        setStatus('error');
        tap('heavy');
        setShakeKey((k) => k + 1);
        setTimeout(() => {
          setCode('');
          setStatus('idle');
          busyRef.current = false;
          inputRef.current?.focus();
        }, 700);
      }
    }, 650);
    return () => clearTimeout(t);
  }, [code, router]);

  const boxBorder = (filled: boolean, active: boolean) => {
    if (status === 'success') return 'border-success';
    if (status === 'error') return 'border-danger';
    return filled ? 'border-brand-500' : active ? 'border-brand-300' : 'border-border';
  };

  const shakeVals = shakeKey === 0 ? 0 : [0, -10, 10, -8, 8, -4, 0];

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

      {/* Boxes (shake on a wrong code) */}
      <MotiView key={shakeKey} animate={{ translateX: shakeVals }} transition={{ type: 'timing', duration: 420 }} className="mt-10">
        <Pressable onPress={() => inputRef.current?.focus()} className="flex-row gap-2">
          {Array.from({ length: LEN }).map((_, i) => {
            const char = code[i];
            const active = i === code.length;
            return (
              <View
                key={i}
                className={cn('h-[58px] flex-1 items-center justify-center rounded-xl border-2 bg-card', boxBorder(!!char, active))}
              >
                <Txt weight="black" className="text-[22px] text-foreground">
                  {char ?? ''}
                </Txt>
              </View>
            );
          })}
        </Pressable>
      </MotiView>

      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={(t) => {
          setCode(t.replace(/\D/g, '').slice(0, LEN));
          if (status === 'error') setStatus('idle');
        }}
        editable={status !== 'verifying' && status !== 'success'}
        keyboardType="number-pad"
        maxLength={LEN}
        autoFocus
        style={{ position: 'absolute', opacity: 0, height: 1, width: 1 }}
      />

      {/* Auto-verify status */}
      <View className="mt-6 h-6 flex-row items-center">
        {status === 'verifying' && (
          <>
            <ActivityIndicator size="small" color={colors.brand} />
            <Txt weight="semibold" className="ml-2 text-[14px] text-brand-600">
              Verifying…
            </Txt>
          </>
        )}
        {status === 'success' && (
          <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex-row items-center">
            <View className="h-5 w-5 items-center justify-center rounded-full bg-success">
              <Check size={13} color="#fff" strokeWidth={3} />
            </View>
            <Txt weight="bold" className="ml-2 text-[14px] text-success">
              Verified
            </Txt>
          </MotiView>
        )}
        {status === 'error' && (
          <Txt weight="semibold" className="text-[14px] text-danger">
            That code doesn’t match. Try again.
          </Txt>
        )}
      </View>

      <View className="mt-5 flex-row items-center">
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
    </View>
  );
}
