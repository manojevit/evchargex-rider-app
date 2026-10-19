import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { Check, CreditCard, Infinity as InfinityIcon, ShieldCheck, Smartphone, X } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/theme';
import { rupees } from '@/lib/format';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';
import { PLAN } from '@/lib/data/account';

export default function Subscribe() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setPersona } = useStore();
  const [method, setMethod] = useState<'upi' | 'card'>('upi');
  const [done, setDone] = useState(false);

  const pay = () => {
    setPersona('rich'); // activate the plan
    setDone(true);
  };

  if (done) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas px-6">
        <MotiView from={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 13 }}>
          <View className="h-24 w-24 items-center justify-center rounded-full bg-success">
            <Check size={48} color="#fff" strokeWidth={3} />
          </View>
        </MotiView>
        <Txt weight="black" className="mt-6 text-center text-[24px] text-ink">
          You’re subscribed!
        </Txt>
        <Txt weight="regular" className="mt-2 text-center text-[14px] leading-5 text-muted">
          {PLAN.name} is now active. Enjoy unlimited swaps — renews {PLAN.renews_on}.
        </Txt>
        <View className="mt-8 w-full">
          <Button label="Start swapping" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-canvas" style={{ paddingTop: insets.top + 8 }}>
      <View className="flex-row items-center justify-between px-5 pb-2">
        <Txt weight="black" className="text-[22px] text-ink">
          Subscribe
        </Txt>
        <Pressable onPress={() => router.back()} hitSlop={10} className="h-10 w-10 items-center justify-center rounded-full bg-surface">
          <X size={20} color={colors.ink} />
        </Pressable>
      </View>

      <View className="px-5 pt-3">
        {/* Plan summary */}
        <View className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
          <View className="flex-row items-center gap-2">
            <InfinityIcon size={18} color={colors.brand} />
            <Txt weight="black" className="text-[17px] text-ink">
              {PLAN.name}
            </Txt>
          </View>
          <View className="mt-1 flex-row items-end">
            <Txt weight="black" className="text-[30px] text-brand-700">
              {rupees(PLAN.price_rupees)}
            </Txt>
            <Txt weight="medium" className="mb-1.5 ml-1 text-[14px] text-muted">
              {PLAN.period_label}
            </Txt>
          </View>
          <View className="mt-2">
            {PLAN.benefits.slice(0, 3).map((b) => (
              <View key={b.title} className="mb-1 flex-row items-center gap-2">
                <Check size={15} color={colors.success} strokeWidth={3} />
                <Txt weight="semibold" className="text-[13px] text-ink">
                  {b.title}
                </Txt>
              </View>
            ))}
          </View>
        </View>

        {/* Payment method */}
        <Txt weight="semibold" className="mb-2 mt-5 text-[13px] text-muted">
          Pay using
        </Txt>
        <View className="flex-row gap-3">
          <MethodCard active={method === 'upi'} onPress={() => setMethod('upi')} icon={<Smartphone size={22} color={method === 'upi' ? colors.brand : colors.faint} />} label="UPI" />
          <MethodCard active={method === 'card'} onPress={() => setMethod('card')} icon={<CreditCard size={22} color={method === 'card' ? colors.brand : colors.faint} />} label="Card" />
        </View>

        {/* Total */}
        <View className="mt-5 flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5">
          <Txt weight="semibold" className="text-[14px] text-muted">
            Total today
          </Txt>
          <Txt weight="black" className="text-[18px] text-ink">
            {rupees(PLAN.price_rupees)}
          </Txt>
        </View>
        <View className="mt-3 flex-row items-center gap-2">
          <ShieldCheck size={15} color={colors.success} />
          <Txt weight="medium" className="flex-1 text-[12px] text-muted">
            Cancel anytime. No per-swap charges, ever.
          </Txt>
        </View>
      </View>

      <View className="flex-1" />
      <View className="px-5" style={{ paddingBottom: insets.bottom + 16 }}>
        <Button label={`Pay ${rupees(PLAN.price_rupees)}`} onPress={pay} />
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
