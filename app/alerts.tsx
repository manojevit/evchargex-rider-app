import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { MotiView } from '@/lib/motion';
import { AlertTriangle, Bell, CheckCircle2, Info } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { cardShadow, colors } from '@/lib/theme';
import { timeOnly } from '@/lib/format';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';
import type { AppAlert } from '@/lib/data/types';

const ICON_BG: Record<AppAlert['severity'], string> = {
  success: 'bg-success-soft',
  warn: 'bg-warn-soft',
  danger: 'bg-danger-soft',
  info: 'bg-info-soft',
};
const ICON_COLOR: Record<AppAlert['severity'], string> = {
  success: colors.success,
  warn: colors.warn,
  danger: colors.danger,
  info: colors.info,
};

function AlertIcon({ severity }: { severity: AppAlert['severity'] }) {
  const color = ICON_COLOR[severity];
  if (severity === 'success') return <CheckCircle2 size={20} color={color} />;
  if (severity === 'info') return <Info size={20} color={color} />;
  return <AlertTriangle size={20} color={color} />;
}

export default function Alerts() {
  const { account, unreadAlerts, markAllAlertsRead, markAlertRead } = useStore();
  const [tab, setTab] = useState<'all' | 'unread'>('all');

  const list = tab === 'all' ? account.alerts : account.alerts.filter((a) => !a.read);

  return (
    <View className="flex-1 bg-canvas">
      <AppBar title="Alerts" back />
      <View className="flex-row items-center justify-between px-5 pb-2 pt-1">
        <View className="flex-row rounded-full bg-surface p-1" style={{ shadowColor: '#0B1420', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 }}>
          <Tab label="All" active={tab === 'all'} onPress={() => setTab('all')} />
          <Tab label="Unread" active={tab === 'unread'} onPress={() => setTab('unread')} />
        </View>
        <View className="flex-row items-center gap-3">
          <Txt weight="bold" className="text-[13px] text-ink">
            {unreadAlerts} unread
          </Txt>
          <Pressable onPress={markAllAlertsRead} hitSlop={8}>
            <Txt weight="bold" className="text-[13px] text-brand-600">
              Mark all read
            </Txt>
          </Pressable>
        </View>
      </View>

      <Screen contentClassName="px-5 pt-2">
        {list.length === 0 ? (
          <Card className="mt-10 items-center py-10">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-canvas">
              <Bell size={28} color={colors.faint} />
            </View>
            <Txt weight="extrabold" className="mt-4 text-[17px] text-ink">
              You’re all caught up
            </Txt>
            <Txt weight="regular" className="mt-2 text-center text-[13.5px] text-muted">
              No {tab === 'unread' ? 'unread ' : ''}alerts right now.
            </Txt>
          </Card>
        ) : (
          list.map((a, i) => (
            <MotiView key={a.id} from={{ opacity: 0, translateY: 8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 50 }}>
              <Pressable
                onPress={() => markAlertRead(a.id)}
                className={cn(
                  'mb-3 flex-row items-start rounded-2xl border bg-card p-4',
                  a.read ? 'border-border/70' : 'border-brand-200',
                )}
                style={cardShadow}
              >
                <View className={cn('h-11 w-11 items-center justify-center rounded-2xl', ICON_BG[a.severity])}>
                  <AlertIcon severity={a.severity} />
                </View>
                <View className="ml-3 flex-1">
                  <View className="flex-row items-center justify-between">
                    <Txt weight="bold" className="flex-1 pr-2 text-[15px] text-foreground" numberOfLines={1}>
                      {a.title}
                    </Txt>
                    {!a.read && <View className="h-2.5 w-2.5 rounded-full bg-brand-500" />}
                  </View>
                  <Txt weight="regular" className="mt-1 text-[13px] leading-5 text-muted" numberOfLines={3}>
                    {a.body}
                  </Txt>
                  <Txt weight="medium" className="mt-1.5 text-[11.5px] text-faint">
                    {timeOnly(a.at)}
                  </Txt>
                </View>
              </Pressable>
            </MotiView>
          ))
        )}
      </Screen>
    </View>
  );
}

function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className={cn('rounded-full px-4 py-1.5', active && 'bg-brand-50')}>
      <Txt weight="bold" className={cn('text-[13px]', active ? 'text-brand-600' : 'text-muted')}>
        {label}
      </Txt>
    </Pressable>
  );
}
