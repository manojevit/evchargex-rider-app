import { Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Receipt,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet as WalletIcon,
} from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { IconTile } from '@/components/ui/IconTile';
import { colors, gradients } from '@/lib/theme';
import { dateTime, rupees } from '@/lib/format';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';
import type { LedgerEntry } from '@/lib/data/types';

const QUICK = [200, 500, 1000];

export default function Wallet() {
  const router = useRouter();
  const { account } = useStore();
  const low = account.wallet_balance_rupees < 100;
  const plan = account.plan;

  const added = account.ledger.filter((e) => e.direction === 'credit').reduce((s, e) => s + e.amount_rupees, 0);
  const spent = account.ledger.filter((e) => e.direction === 'debit').reduce((s, e) => s + e.amount_rupees, 0);

  const topup = (amount?: number) => router.push(amount ? `/wallet/topup?amount=${amount}` : '/wallet/topup');

  return (
    <View className="flex-1 bg-canvas">
      <AppBar title="Wallet" back bell />
      <Screen contentClassName="px-5 pt-1">
        {/* Balance hero */}
        <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }}>
          <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 28, padding: 22, overflow: 'hidden' }}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <WalletIcon size={18} color="rgba(255,255,255,0.9)" />
                <Txt weight="semibold" className="text-[13px] text-white" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Available balance
                </Txt>
              </View>
              {plan?.auto_pay && (
                <View className="flex-row items-center gap-1 rounded-full bg-white/15 px-2.5 py-1">
                  <RefreshCw size={12} color="#fff" />
                  <Txt weight="bold" className="text-[11px] text-white" style={{ color: '#fff' }}>
                    Auto-pay on
                  </Txt>
                </View>
              )}
            </View>
            <Txt weight="black" className="mt-2 text-[42px] text-white" style={{ color: '#fff' }}>
              {rupees(account.wallet_balance_rupees)}
            </Txt>

            <View className="mt-4">
              <Button label="Add money" variant="secondary" leftIcon={<Plus size={18} color={colors.brand} />} onPress={() => topup()} />
            </View>

            {/* Quick add */}
            <View className="mt-3 flex-row gap-2">
              {QUICK.map((q) => (
                <Pressable
                  key={q}
                  onPress={() => topup(q)}
                  className="flex-1 items-center rounded-2xl border border-white/25 bg-white/10 py-2.5"
                  style={({ pressed }) => (pressed ? { opacity: 0.8 } : undefined)}
                >
                  <Txt weight="bold" className="text-[13.5px] text-white" style={{ color: '#fff' }}>
                    + {rupees(q)}
                  </Txt>
                </Pressable>
              ))}
            </View>
          </LinearGradient>
        </MotiView>

        {low && (
          <View className="mt-3 flex-row items-center gap-2 rounded-2xl bg-warn-soft p-3.5">
            <ShieldCheck size={18} color={colors.warn} />
            <Txt weight="semibold" className="flex-1 text-[13px] text-warn-ink">
              Your balance is low. Top up to keep swaps uninterrupted.
            </Txt>
          </View>
        )}

        {/* Added / Spent stats */}
        <View className="mt-4 flex-row gap-3">
          <StatCard tone="success" icon={<TrendingUp size={16} color={colors.success} />} label="Added" value={rupees(added)} />
          <StatCard tone="neutral" icon={<TrendingDown size={16} color={colors.muted} />} label="Spent" value={rupees(spent)} />
        </View>

        {/* Transactions */}
        <View className="mb-2 mt-6 flex-row items-center justify-between">
          <Txt weight="black" className="text-[18px] text-ink">
            Transactions
          </Txt>
          <Receipt size={18} color={colors.muted} />
        </View>

        {account.ledger.length === 0 ? (
          <Card className="mt-6 items-center py-10">
            <IconTile tone="neutral" size="lg" rounded="rounded-2xl">
              <Receipt size={28} color={colors.faint} />
            </IconTile>
            <Txt weight="extrabold" className="mt-4 text-[16px] text-ink">
              No transactions yet
            </Txt>
            <Txt weight="regular" className="mt-1 text-center text-[13px] text-muted">
              Add money to your wallet to get started.
            </Txt>
          </Card>
        ) : (
          <Card className="p-0">
            {account.ledger.map((e, i) => (
              <TxRow key={e.id} e={e} last={i === account.ledger.length - 1} />
            ))}
          </Card>
        )}
      </Screen>
    </View>
  );
}

function StatCard({ tone, icon, label, value }: { tone: 'success' | 'neutral'; icon: React.ReactNode; label: string; value: string }) {
  return (
    <View className="flex-1 rounded-2xl border border-border bg-card p-3.5" style={{ shadowColor: '#0B1420', shadowOpacity: 0.04, shadowRadius: 10, elevation: 1 }}>
      <View className={cn('h-8 w-8 items-center justify-center rounded-xl', tone === 'success' ? 'bg-success-soft' : 'bg-canvas')}>
        {icon}
      </View>
      <Txt weight="black" className={cn('mt-2 text-[18px]', tone === 'success' ? 'text-success' : 'text-ink')}>
        {value}
      </Txt>
      <Txt weight="medium" className="text-[12px] text-muted">
        {label}
      </Txt>
    </View>
  );
}

function TxRow({ e, last }: { e: LedgerEntry; last: boolean }) {
  const credit = e.direction === 'credit';
  return (
    <View className={cn('flex-row items-center px-4 py-3.5', !last && 'border-b border-line')}>
      <IconTile tone={credit ? 'success' : 'neutral'}>
        {credit ? <ArrowDownLeft size={20} color={colors.success} /> : <ArrowUpRight size={20} color={colors.muted} />}
      </IconTile>
      <View className="ml-3 flex-1">
        <Txt weight="bold" className="text-[14px] text-ink">
          {e.note}
        </Txt>
        <Txt weight="medium" className="text-[11.5px] text-muted">
          {dateTime(e.at)}
        </Txt>
      </View>
      <Txt weight="black" className={cn('text-[15px]', credit ? 'text-success' : 'text-ink')}>
        {credit ? '+' : '–'}
        {rupees(e.amount_rupees)}
      </Txt>
    </View>
  );
}
