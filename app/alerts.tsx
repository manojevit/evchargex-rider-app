import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { MotiView } from '@/lib/motion';
import { AlertTriangle, Bell, Info } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/lib/theme';
import { timeOnly } from '@/lib/format';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';
import type { AppAlert } from '@/lib/data/types';

const ACCENT: Record<AppAlert['severity'], string> = {
  warn: 'bg-warn',
  danger: 'bg-danger',
  info: 'bg-info',
};

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
            <MotiView key={a.id} from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: i * 50 }}>
              <Pressable onPress={() => markAlertRead(a.id)} className="mb-3 overflow-hidden rounded-2xl bg-surface" style={{ shadowColor: '#0B1420', shadowOpacity: 0.05, shadowRadius: 12, elevation: 1 }}>
                <View className="flex-row">
                  <View className={cn('w-1.5', ACCENT[a.severity])} />
                  <View className="flex-1 p-4">
                    <View className="flex-row items-start">
                      <View className={cn('h-10 w-10 items-center justify-center rounded-xl', a.severity === 'info' ? 'bg-info-soft' : a.severity === 'warn' ? 'bg-warn-soft' : 'bg-danger-soft')}>
                        {a.severity === 'info' ? (
                          <Info size={20} color={colors.info} />
                        ) : (
                          <AlertTriangle size={20} color={a.severity === 'warn' ? colors.warn : colors.danger} />
                        )}
                      </View>
                      <View className="ml-3 flex-1">
                        <View className="flex-row items-start justify-between">
                          <Txt weight="bold" className="flex-1 pr-2 text-[15px] text-ink">
                            {a.title}
                          </Txt>
                          <View className="flex-row items-center gap-1.5">
                            <Txt weight="medium" className="text-[11.5px] text-muted">
                              {timeOnly(a.at)}
                            </Txt>
                            {!a.read && <View className="h-2 w-2 rounded-full bg-brand-500" />}
                          </View>
                        </View>
                        <Txt weight="regular" className="mt-1 text-[13px] leading-5 text-muted">
                          {a.body}
                        </Txt>
                      </View>
                    </View>
                  </View>
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
