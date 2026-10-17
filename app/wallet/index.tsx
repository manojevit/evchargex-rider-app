import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Receipt,
  ShieldCheck,
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

export default function Wallet() {
  const router = useRouter();
  const { account } = useStore();
  const low = account.wallet_balance_rupees < 100;

  return (
    <View className="flex-1 bg-canvas">
      <AppBar title="Wallet" back bell />
      <Screen contentClassName="px-5 pt-1">
        {/* Balance hero */}
        <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }}>
          <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="overflow-hidden rounded-3xl p-5">
            <View className="flex-row items-center gap-2">
              <WalletIcon size={18} color="rgba(255,255,255,0.9)" />
              <Txt weight="semibold" className="text-[13px] text-white" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Available balance
              </Txt>
            </View>
            <Txt weight="black" className="mt-2 text-[42px] text-white" style={{ color: '#fff' }}>
              {rupees(account.wallet_balance_rupees)}
            </Txt>
            <View className="mt-4 flex-row gap-3">
              <View className="flex-1">
                <Button label="Add money" variant="secondary" leftIcon={<Plus size={18} color={colors.brand} />} onPress={() => router.push('/wallet/topup')} />
              </View>
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
