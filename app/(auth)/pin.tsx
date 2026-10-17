import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { Delete, Lock } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';

const LEN = 4;

export default function Pin() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn } = useStore();

  const [stage, setStage] = useState<'set' | 'confirm'>('set');
  const [first, setFirst] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pin.length !== LEN) return;
    if (stage === 'set') {
      setFirst(pin);
      setStage('confirm');
      setPin('');
    } else {
      if (pin === first) {
        signIn();
        router.replace('/(tabs)/home');
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
          setPin('');
          setStage('set');
          setFirst('');
        }, 700);
      }
    }
  }, [pin, stage, first, signIn, router]);

  const press = (d: string) => {
    if (pin.length < LEN) setPin((p) => p + d);
  };
  const back = () => setPin((p) => p.slice(0, -1));

  return (
    <View className="flex-1 bg-canvas px-6" style={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }}>
      <View className="items-center">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
          <Lock size={28} color={colors.brand} />
        </View>
        <Txt weight="black" className="mt-6 text-[26px] text-ink">
          {stage === 'set' ? 'Create a PIN' : 'Confirm your PIN'}
        </Txt>
        <Txt weight="regular" className="mt-2 text-center text-[15px] text-muted">
          {stage === 'set'
            ? 'Set a 4-digit PIN to unlock the app quickly next time.'
            : 'Enter your PIN again to confirm.'}
        </Txt>

        <MotiView
          animate={{ translateX: error ? [0, -10, 10, -6, 6, 0] : 0 }}
          transition={{ type: 'timing', duration: 400 }}
          className="mt-10 flex-row gap-5"
        >
          {Array.from({ length: LEN }).map((_, i) => (
            <View
              key={i}
              className={cn(
                'h-4 w-4 rounded-full',
                error ? 'bg-danger' : pin.length > i ? 'bg-brand-500' : 'bg-line',
              )}
            />
          ))}
        </MotiView>
        {error && (
          <Txt weight="semibold" className="mt-4 text-[13px] text-danger">
            PINs didn’t match — try again
          </Txt>
        )}
      </View>

      <View className="flex-1" />

      {/* Keypad */}
      <View className="gap-4">
        {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']].map((row) => (
          <View key={row[0]} className="flex-row justify-between">
            {row.map((d) => (
              <Key key={d} label={d} onPress={() => press(d)} />
            ))}
          </View>
        ))}
        <View className="flex-row justify-between">
          <View className="h-[70px] w-[70px]" />
          <Key label="0" onPress={() => press('0')} />
          <Pressable
            onPress={back}
            className="h-[70px] w-[70px] items-center justify-center rounded-full"
            android_ripple={{ color: '#E7EBF1', borderless: true }}
          >
            <Delete size={26} color={colors.ink} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function Key({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="h-[70px] w-[70px] items-center justify-center rounded-full bg-surface"
      style={({ pressed }) => [
        { shadowColor: '#0B1420', shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 },
        pressed && { backgroundColor: '#EEF4FF' },
      ]}
    >
      <Txt weight="bold" className="text-[26px] text-ink">
        {label}
      </Txt>
    </Pressable>
  );
}
