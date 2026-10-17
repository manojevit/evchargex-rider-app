import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from '@/lib/motion';
import {
  BadgeCheck,
  BatteryCharging,
  Calendar,
  Check,
  CreditCard,
  FileText,
  Headset,
  Infinity as InfinityIcon,
  Lightbulb,
  Repeat,
  TrendingUp,
} from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { IconTile } from '@/components/ui/IconTile';
import { colors, gradients } from '@/lib/theme';
import { rupees } from '@/lib/format';
import { useStore } from '@/lib/store';
import { PLAN } from '@/lib/data/account';

export default function PlanScreen() {
  const { account } = useStore();
  const plan = account.plan;

  return (
    <View className="flex-1 bg-canvas">
      <AppBar large title="Your plan" subtitle={plan ? 'Manage your monthly battery swap plan' : 'Choose a plan to start swapping'} bell />
      <Screen contentClassName="px-5 pt-1">
        {plan ? <ActivePlan /> : <NoPlan />}
      </Screen>
    </View>
  );
}

function ActivePlan() {
  const plan = PLAN;
  return (
    <>
      {/* Hero */}
      <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }}>
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="overflow-hidden rounded-3xl p-5">
          <View className="flex-row items-center justify-between">
            <View className="rounded-full bg-white/20 px-3 py-1">
              <Txt weight="bold" className="text-[11px] tracking-wide text-white" style={{ color: '#fff' }}>
                CURRENT PLAN
              </Txt>
            </View>
            <View className="flex-row items-center gap-1.5 rounded-full bg-success px-3 py-1">
              <BadgeCheck size={14} color="#fff" />
              <Txt weight="bold" className="text-[12px] text-white" style={{ color: '#fff' }}>
                Active
              </Txt>
            </View>
          </View>

          <Txt weight="black" className="mt-5 text-[30px] text-white" style={{ color: '#fff' }}>
            {plan.name}
          </Txt>
          <View className="flex-row items-end">
            <Txt weight="black" className="text-[40px] text-white" style={{ color: '#fff' }}>
              {rupees(plan.price_rupees)}
            </Txt>
            <Txt weight="medium" className="mb-2 ml-1 text-[16px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {plan.period_label}
            </Txt>
          </View>

          <View className="my-4 h-px bg-white/20" />
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Calendar size={16} color="rgba(255,255,255,0.9)" />
              <Txt weight="semibold" className="text-[13px] text-white" style={{ color: '#fff' }}>
                Renews {plan.renews_on}
              </Txt>
            </View>
            <View className="flex-row items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
              <CreditCard size={14} color="#fff" />
              <Txt weight="semibold" className="text-[12px] text-white" style={{ color: '#fff' }}>
                Auto-pay on
              </Txt>
            </View>
          </View>
        </LinearGradient>
      </MotiView>

      {/* What's included */}
      <Card className="mt-4">
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <BadgeCheck size={20} color={colors.brand} />
            <Txt weight="black" className="text-[18px] text-ink">
              What’s included
            </Txt>
          </View>
          <Badge tone="success" label="ALL ACCESS" />
        </View>
        {plan.benefits.map((b, i) => (
          <View key={b.title} className={i > 0 ? 'mt-3 border-t border-line pt-3' : ''}>
            <View className="flex-row items-start">
              <View className="mt-0.5 h-7 w-7 items-center justify-center rounded-full bg-success-soft">
                <Check size={16} color={colors.success} strokeWidth={3} />
              </View>
              <View className="ml-3 flex-1">
                <Txt weight="bold" className="text-[15px] text-ink">
                  {b.title}
                </Txt>
                <Txt weight="regular" className="mt-0.5 text-[13px] text-muted">
                  {b.detail}
                </Txt>
              </View>
            </View>
          </View>
        ))}
      </Card>

      {/* Stats */}
      <View className="mt-4 flex-row gap-3">
        <Card className="flex-1">
          <View className="flex-row items-center justify-between">
            <Txt weight="bold" className="text-[11px] uppercase tracking-wide text-muted">
              This month
            </Txt>
            <Repeat size={16} color={colors.brand} />
          </View>
          <Txt weight="black" className="mt-2 text-[26px] text-ink">
            {plan.this_month_swaps} swaps
          </Txt>
          <Txt weight="bold" className="text-[12.5px] text-success">
            {rupees(plan.saved_rupees)} saved vs retail
          </Txt>
        </Card>
        <Card className="flex-1">
          <View className="flex-row items-center justify-between">
            <Txt weight="bold" className="text-[11px] uppercase tracking-wide text-muted">
              Health index
            </Txt>
            <TrendingUp size={16} color={colors.success} />
          </View>
          <Txt weight="black" className="mt-2 text-[26px] text-ink">
            {plan.health_index}%
          </Txt>
          <Txt weight="medium" className="text-[12.5px] text-muted">
            Tier 1 pack quality
          </Txt>
        </Card>
      </View>

      {/* Why no per-km */}
      <Card className="mt-4">
        <View className="flex-row items-center gap-2">
          <IconTile tone="brand" size="sm">
            <Lightbulb size={18} color={colors.brand} />
          </IconTile>
          <Txt weight="black" className="text-[17px] text-ink">
            Why no per-km plan?
          </Txt>
        </View>
        <Txt weight="regular" className="mt-3 text-[13.5px] leading-5 text-muted">
          Per-km pricing is widely advertised in this market but no competitor actually ships it. Your plan is a flat monthly
          fee with unlimited swaps — so there is nothing to meter and nothing to dispute.
        </Txt>
      </Card>

      <View className="mt-4">
        <Button label="Change plan" rightIcon={<Repeat size={18} color="#fff" />} />
      </View>
      <View className="mt-3">
        <Button label="Download invoices / receipts" variant="secondary" leftIcon={<FileText size={18} color={colors.brand} />} />
      </View>
      <View className="mt-4 flex-row items-center justify-center gap-1.5">
        <Headset size={15} color={colors.brand} />
        <Txt weight="bold" className="text-[13px] text-brand-600">
          Need help with commercial fleet billing?
        </Txt>
      </View>
    </>
  );
}

function NoPlan() {
  const plan = PLAN;
  return (
    <>
      <Card className="items-center py-8">
        <IconTile tone="neutral" size="lg" rounded="rounded-2xl">
          <BatteryCharging size={30} color={colors.faint} />
        </IconTile>
        <Txt weight="extrabold" className="mt-4 text-[18px] text-ink">
          No active plan
        </Txt>
        <Txt weight="regular" className="mt-2 px-6 text-center text-[14px] leading-5 text-muted">
          Subscribe to start swapping. One flat monthly fee, unlimited swaps, no hidden per-swap charges.
        </Txt>
      </Card>

      <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100 }} className="mt-4">
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="overflow-hidden rounded-3xl p-5">
          <View className="flex-row items-center gap-2">
            <InfinityIcon size={22} color="#fff" />
            <Txt weight="bold" className="text-[13px] tracking-wide text-white" style={{ color: '#fff' }}>
              RECOMMENDED
            </Txt>
          </View>
          <Txt weight="black" className="mt-3 text-[28px] text-white" style={{ color: '#fff' }}>
            {plan.name}
          </Txt>
          <View className="flex-row items-end">
            <Txt weight="black" className="text-[38px] text-white" style={{ color: '#fff' }}>
              {rupees(plan.price_rupees)}
            </Txt>
            <Txt weight="medium" className="mb-2 ml-1 text-[16px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {plan.period_label}
            </Txt>
          </View>
          <View className="mt-4">
            {plan.benefits.map((b) => (
              <View key={b.title} className="mb-2 flex-row items-center gap-2">
                <Check size={16} color="#fff" strokeWidth={3} />
                <Txt weight="semibold" className="text-[13.5px] text-white" style={{ color: '#fff' }}>
                  {b.title}
                </Txt>
              </View>
            ))}
          </View>
        </LinearGradient>
      </MotiView>

      <View className="mt-4">
        <Button label="Subscribe now" />
      </View>
      <Txt weight="medium" className="mt-3 text-center text-[12.5px] text-muted">
        Tip: flip to the active account from Menu → Settings to see the full plan.
      </Txt>
    </>
  );
}
