import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from '@/lib/motion';
import { CalendarRange, ChevronLeft, ChevronRight, Clock, Download, X } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const fmt = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/**
 * Bottom-sheet to choose a date range before downloading the swap statement.
 * Quick presets + a custom range picked on a mini month calendar.
 */
export function ExportSheet({
  visible,
  onClose,
  onDownload,
}: {
  visible: boolean;
  onClose: () => void;
  onDownload: (label: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const [custom, setCustom] = useState(false);
  const [month, setMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const reset = () => {
    setCustom(false);
    setStart(null);
    setEnd(null);
  };
  const close = () => {
    reset();
    onClose();
  };
  const pick = (label: string) => {
    onDownload(label);
    reset();
  };

  const presets = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'Last 7 days' },
    { key: 'month', label: 'Last 30 days' },
  ];

  // Calendar cells for the visible month.
  const y = month.getFullYear();
  const m = month.getMonth();
  const offset = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  const onDay = (day: number) => {
    const d = new Date(y, m, day);
    if (!start || (start && end)) {
      setStart(d);
      setEnd(null);
    } else if (d < start) {
      setStart(d);
    } else {
      setEnd(d);
    }
  };

  const dayState = (day: number): 'start' | 'end' | 'between' | 'none' => {
    const d = new Date(y, m, day);
    if (start && sameDay(d, start)) return 'start';
    if (end && sameDay(d, end)) return 'end';
    if (start && end && d > start && d < end) return 'between';
    return 'none';
  };

  const rangeLabel = start ? (end ? `${fmt(start)} – ${fmt(end)}` : fmt(start)) : '';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <View className="flex-1 justify-end">
        <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(8,13,20,0.55)' }} onPress={close} />
        <MotiView
          from={{ translateY: 460 }}
          animate={{ translateY: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 220 }}
          style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: insets.bottom + 18,
          }}
        >
          <View className="mb-4 items-center">
            <View className="h-1.5 w-10 rounded-full bg-border" />
          </View>

          <View className="flex-row items-center">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-brand-50">
              <Download size={20} color={colors.brand} />
            </View>
            <View className="ml-3 flex-1">
              <Txt weight="black" className="text-[18px] text-ink">
                Download statement
              </Txt>
              <Txt weight="medium" className="text-[12.5px] text-muted">
                Choose a date range
              </Txt>
            </View>
            <Pressable onPress={close} hitSlop={10} className="h-9 w-9 items-center justify-center rounded-full bg-secondary">
              <X size={18} color={colors.muted} />
            </Pressable>
          </View>

          {/* Presets */}
          <View className="mt-4">
            {presets.map((p) => (
              <Pressable
                key={p.key}
                onPress={() => pick(p.label)}
                className="flex-row items-center rounded-2xl border border-border bg-card px-4 py-3.5"
                style={({ pressed }) => [{ marginTop: 10 }, pressed ? { opacity: 0.9 } : null]}
              >
                <Clock size={18} color={colors.brand} />
                <Txt weight="bold" className="ml-3 flex-1 text-[14.5px] text-ink">
                  {p.label}
                </Txt>
                <ChevronRight size={18} color={colors.faint} />
              </Pressable>
            ))}

            {/* Custom range toggle */}
            <Pressable
              onPress={() => setCustom((v) => !v)}
              className={cn('mt-2.5 flex-row items-center rounded-2xl border px-4 py-3.5', custom ? 'border-brand-500 bg-brand-50' : 'border-border bg-card')}
            >
              <CalendarRange size={18} color={colors.brand} />
              <Txt weight="bold" className="ml-3 flex-1 text-[14.5px] text-ink">
                Custom range
              </Txt>
              <ChevronRight size={18} color={colors.faint} style={{ transform: [{ rotate: custom ? '90deg' : '0deg' }] }} />
            </Pressable>
          </View>

          {/* Calendar */}
          {custom && (
            <MotiView from={{ opacity: 0, translateY: -6 }} animate={{ opacity: 1, translateY: 0 }} className="mt-3 rounded-2xl border border-border bg-card p-3">
              {/* Month nav */}
              <View className="flex-row items-center justify-between px-1">
                <Pressable onPress={() => setMonth(new Date(y, m - 1, 1))} hitSlop={8} className="h-8 w-8 items-center justify-center rounded-full bg-canvas">
                  <ChevronLeft size={18} color={colors.ink} />
                </Pressable>
                <Txt weight="black" className="text-[14.5px] text-ink">
                  {MONTHS[m]} {y}
                </Txt>
                <Pressable onPress={() => setMonth(new Date(y, m + 1, 1))} hitSlop={8} className="h-8 w-8 items-center justify-center rounded-full bg-canvas">
                  <ChevronRight size={18} color={colors.ink} />
                </Pressable>
              </View>

              {/* Weekday labels */}
              <View className="mt-2 flex-row">
                {WEEKDAYS.map((w, i) => (
                  <View key={i} className="flex-1 items-center">
                    <Txt weight="bold" className="text-[11px] text-faint">
                      {w}
                    </Txt>
                  </View>
                ))}
              </View>

              {/* Day grid */}
              <View className="mt-1 flex-row flex-wrap">
                {cells.map((day, i) => {
                  if (day === null) return <View key={`e${i}`} style={{ width: `${100 / 7}%`, height: 38 }} />;
                  const st = dayState(day);
                  return (
                    <View key={day} style={{ width: `${100 / 7}%`, height: 38 }} className="items-center justify-center">
                      <Pressable
                        onPress={() => onDay(day)}
                        className={cn(
                          'h-9 w-9 items-center justify-center rounded-full',
                          st === 'start' || st === 'end' ? 'bg-brand-500' : st === 'between' ? 'bg-brand-50' : '',
                        )}
                      >
                        <Txt
                          weight={st === 'none' ? 'medium' : 'bold'}
                          className={cn('text-[13px]', st === 'start' || st === 'end' ? 'text-white' : 'text-ink')}
                          style={st === 'start' || st === 'end' ? { color: '#fff' } : undefined}
                        >
                          {day}
                        </Txt>
                      </Pressable>
                    </View>
                  );
                })}
              </View>

              <Txt weight="semibold" className="mt-2 text-center text-[12.5px] text-muted">
                {start ? (end ? `${fmt(start)} – ${fmt(end)}` : `${fmt(start)} — pick an end date`) : 'Pick a start date'}
              </Txt>

              <View className="mt-3">
                <Button label="Download" disabled={!start} leftIcon={<Download size={18} color="#fff" />} onPress={() => pick(rangeLabel)} />
              </View>
            </MotiView>
          )}
        </MotiView>
      </View>
    </Modal>
  );
}
