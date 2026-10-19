import { View } from 'react-native';
import { Txt } from '@/components/ui/Txt';
import { colors } from '@/lib/theme';

/**
 * A chunky 12V-style battery with the count shown inside it.
 * Green when batteries are ready; muted "—" when the station isn't reporting.
 */
export function BatteryCount({
  count,
  active = true,
  size = 'md',
}: {
  count: number | string;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dims =
    size === 'lg'
      ? { w: 44, h: 30, nubW: 4, nubH: 13, font: 17, r: 9 }
      : size === 'sm'
        ? { w: 28, h: 18, nubW: 3, nubH: 8, font: 12, r: 6 }
        : { w: 34, h: 22, nubW: 3, nubH: 10, font: 14, r: 7 };

  const border = active ? '#16A34A' : colors.faint;
  const bg = active ? '#DCFCE7' : colors.canvas;
  const text = active ? '#0F7A38' : colors.faint;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: dims.w,
          height: dims.h,
          borderRadius: dims.r,
          borderWidth: 2,
          borderColor: border,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Txt weight="black" style={{ fontSize: dims.font, lineHeight: dims.font + 2, color: text }}>
          {active ? count : '—'}
        </Txt>
      </View>
      {/* Positive terminal nub */}
      <View style={{ width: dims.nubW, height: dims.nubH, borderTopRightRadius: 2, borderBottomRightRadius: 2, backgroundColor: border, marginLeft: 1.5 }} />
    </View>
  );
}
