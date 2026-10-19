import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { MotiView } from '@/lib/motion';
import {
  BatteryWarning,
  CircleHelp,
  LifeBuoy,
  MapPin,
  Smartphone,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { IconTile } from '@/components/ui/IconTile';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { dayLabel, timeOnly } from '@/lib/format';
import { useStore } from '@/lib/store';
import { useToast } from '@/lib/toast';
import { TICKET_CATEGORIES } from '@/lib/data/account';
import type { Ticket } from '@/lib/data/types';

const CAT_ICON: Record<string, LucideIcon> = {
  'Swap issue': Zap,
  'Payment & wallet': Wallet,
  'Battery / pack': BatteryWarning,
  'Station problem': MapPin,
  'App / account': Smartphone,
  Other: CircleHelp,
};

export default function Tickets() {
  const { tickets, addTicket } = useStore();
  const toast = useToast();
  const [category, setCategory] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [focused, setFocused] = useState(false);

  const canSubmit = !!category && body.trim().length >= 5;

  const submit = () => {
    if (!canSubmit || !category) return;
    addTicket(category, body);
    toast.show('Ticket raised — we’ll get back to you', 'success');
    setCategory(null);
    setBody('');
  };

  return (
    <View className="flex-1 bg-canvas">
      <AppBar title="Help tickets" back />
      <Screen contentClassName="px-5 pt-1" padBottom={40}>
        {/* Intro */}
        <View className="flex-row items-center">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-brand-50">
            <LifeBuoy size={22} color={colors.brand} />
          </View>
          <View className="ml-3 flex-1">
            <Txt weight="black" className="text-[19px] text-ink">
              Raise a ticket
            </Txt>
            <Txt weight="medium" className="text-[12.5px] text-muted">
              Tell us what went wrong — we’ll sort it out.
            </Txt>
          </View>
        </View>

        {/* Category */}
        <Txt weight="bold" className="mb-2 mt-6 text-[12px] uppercase tracking-wide text-muted">
          What’s it about?
        </Txt>
        <View className="flex-row flex-wrap gap-2">
          {TICKET_CATEGORIES.map((c) => {
            const Icon = CAT_ICON[c] ?? CircleHelp;
            const on = category === c;
            return (
              <Pressable
                key={c}
                onPress={() => setCategory(on ? null : c)}
                className={cn('flex-row items-center gap-1.5 rounded-full border px-3.5 py-2', on ? 'border-brand-500 bg-brand-500' : 'border-border bg-card')}
              >
                <Icon size={15} color={on ? '#fff' : colors.muted} />
                <Txt weight="bold" className={cn('text-[12.5px]', on ? 'text-white' : 'text-ink')} style={on ? { color: '#fff' } : undefined}>
                  {c}
                </Txt>
              </Pressable>
            );
          })}
        </View>

        {/* Description */}
        <Txt weight="bold" className="mb-2 mt-5 text-[12px] uppercase tracking-wide text-muted">
          Describe the issue
        </Txt>
        <View className={cn('rounded-2xl border bg-card p-3', focused ? 'border-brand-500' : 'border-border')}>
          <TextInput
            value={body}
            onChangeText={setBody}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. Slot 3 didn’t open after it was authorised."
            placeholderTextColor={colors.faint}
            multiline
            maxLength={400}
            style={{ minHeight: 104, textAlignVertical: 'top', fontFamily: 'Inter_500Medium', fontSize: 15, color: colors.ink, lineHeight: 21 }}
          />
        </View>
        <Txt weight="medium" className="mt-1.5 text-right text-[11px] text-faint">
          {body.length}/400
        </Txt>

        <View className="mt-3">
          <Button label="Submit ticket" disabled={!canSubmit} onPress={submit} />
        </View>

        {/* Your tickets */}
        <Txt weight="black" className="mb-3 mt-8 text-[18px] text-ink">
          Your tickets
        </Txt>
        {tickets.length === 0 ? (
          <Card className="items-center py-8">
            <IconTile tone="neutral" size="lg" rounded="rounded-2xl">
              <LifeBuoy size={26} color={colors.faint} />
            </IconTile>
            <Txt weight="bold" className="mt-3 text-[15px] text-foreground">
              No tickets yet
            </Txt>
            <Txt weight="regular" className="mt-1 px-10 text-center text-[13px] text-muted">
              Anything you raise will show up here with its status.
            </Txt>
          </Card>
        ) : (
          tickets.map((t, i) => <TicketCard key={t.id} ticket={t} index={i} />)
        )}
      </Screen>
    </View>
  );
}

function TicketCard({ ticket, index }: { ticket: Ticket; index: number }) {
  const Icon = CAT_ICON[ticket.category] ?? CircleHelp;
  const tone = ticket.status === 'resolved' ? 'success' : ticket.status === 'in_progress' ? 'info' : 'warn';
  const label = ticket.status === 'resolved' ? 'RESOLVED' : ticket.status === 'in_progress' ? 'IN PROGRESS' : 'OPEN';
  return (
    <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: index * 60 }}>
      <Card className="mb-3">
        <View className="flex-row items-center">
          <IconTile tone={tone === 'warn' ? 'warn' : tone === 'info' ? 'info' : 'success'} size="sm">
            <Icon size={18} color={tone === 'warn' ? colors.warn : tone === 'info' ? colors.info : colors.success} />
          </IconTile>
          <View className="ml-3 flex-1">
            <Txt weight="bold" className="text-[14.5px] text-ink">
              {ticket.category}
            </Txt>
            <Txt weight="medium" className="text-[11.5px] text-muted">
              {ticket.id} · {dayLabel(ticket.at)} · {timeOnly(ticket.at)}
            </Txt>
          </View>
          <Badge tone={tone} dot label={label} />
        </View>
        <Txt weight="regular" className="mt-3 text-[13.5px] leading-5 text-foreground">
          {ticket.body}
        </Txt>
      </Card>
    </MotiView>
  );
}
