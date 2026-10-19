import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { Check, CreditCard, Smartphone, X } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/theme';
import { rupees } from '@/lib/format';
import { cn } from '@/lib/cn';

const PRESETS = [200, 500, 1000, 2000, 3000, 5000];

export default function Topup() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { amount: amountParam } = useLocalSearchParams<{ amount?: string }>();
  const initialAmount = Number(amountParam);
  const [amount, setAmount] = useState(Number.isFinite(initialAmount) && initialAmount > 0 ? initialAmount : 500);
  const [method, setMethod] = useState<'upi' | 'card'>('upi');
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas px-6">
        <MotiView from={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 13 }}>
          <View className="h-24 w-24 items-center justify-center rounded-full bg-success">
            <Check size={48} color="#fff" strokeWidth={3} />
          </View>
        </MotiView>
        <Txt weight="black" className="mt-6 text-[24px] text-ink">
          {rupees(amount)} added
        </Txt>
        <Txt weight="regular" className="mt-2 text-center text-[14px] text-muted">
          Your wallet has been topped up successfully (demo).
        </Txt>
        <View className="mt-8 w-full">
          <Button label="Done" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-canvas" style={{ paddingTop: insets.top + 8 }}>
      <View className="flex-row items-center justify-between px-5 pb-2">
        <Txt weight="black" className="text-[22px] text-ink">
          Add money
        </Txt>
        <Pressable onPress={() => router.back()} hitSlop={10} className="h-10 w-10 items-center justify-center rounded-full bg-surface">
          <X size={20} color={colors.ink} />
        </Pressable>
      </View>

      <View className="px-5 pt-4">
        <Txt weight="semibold" className="mb-2 text-[13px] text-muted">
          Amount
        </Txt>
        <View className="items-center rounded-2xl bg-surface p-5" style={{ shadowColor: '#0B1420', shadowOpacity: 0.05, shadowRadius: 12, elevation: 1 }}>
          <Txt weight="black" className="text-[44px] text-ink">
            {rupees(amount)}
          </Txt>
        </View>

        <View className="mt-4 flex-row flex-wrap justify-between">
          {PRESETS.map((p) => (
            <Pressable key={p} onPress={() => setAmount(p)} style={{ width: '31.5%' }} className={cn('mb-3 items-center rounded-2xl border-2 py-3', amount === p ? 'border-brand-500 bg-brand-50' : 'border-line bg-surface')}>
              <Txt weight="bold" className={cn('text-[15px]', amount === p ? 'text-brand-700' : 'text-ink')}>
                {rupees(p)}
              </Txt>
            </Pressable>
          ))}
        </View>

        <Txt weight="semibold" className="mb-2 mt-2 text-[13px] text-muted">
          Pay using
        </Txt>
        <View className="flex-row gap-3">
          <MethodCard active={method === 'upi'} onPress={() => setMethod('upi')} icon={<Smartphone size={22} color={method === 'upi' ? colors.brand : colors.faint} />} label="UPI" />
          <MethodCard active={method === 'card'} onPress={() => setMethod('card')} icon={<CreditCard size={22} color={method === 'card' ? colors.brand : colors.faint} />} label="Card" />
        </View>
      </View>

      <View className="flex-1" />
      <View className="px-5" style={{ paddingBottom: insets.bottom + 16 }}>
        <Button label={`Add ${rupees(amount)}`} onPress={() => setDone(true)} />
      </View>
    </View>
  );
}

function MethodCard({ active, onPress, icon, label }: { active: boolean; onPress: () => void; icon: React.ReactNode; label: string }) {
  return (
    <Pressable onPress={onPress} className={cn('flex-1 flex-row items-center justify-center gap-2 rounded-2xl border-2 py-4', active ? 'border-brand-500 bg-brand-50' : 'border-line bg-surface')}>
      {icon}
      <Txt weight="bold" className={cn('text-[15px]', active ? 'text-brand-700' : 'text-muted')}>
        {label}
      </Txt>
    </Pressable>
  );
}
