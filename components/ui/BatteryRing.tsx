import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Txt } from './Txt';
import { colors } from '@/lib/theme';
import type { SlotState } from '@/lib/data/types';

/**
 * Circular SOC ring like sir's cabinet grid: green when charged, blue while
 * charging, faint grey when empty.
 */
export function BatteryRing({
  soc,
  state,
  size = 54,
}: {
  soc: number | null;
  state: SlotState;
  size?: number;
}) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pctValue = soc == null ? 0 : Math.max(0, Math.min(100, soc)) / 100;

  const ringColor =
    state === 'charged' ? colors.success : state === 'charging' ? colors.brand : state === 'fault' ? colors.danger : colors.line;
  const label = soc == null ? '—' : `${soc}`;
  const labelColor = state === 'empty' ? colors.faint : colors.ink;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.line} strokeWidth={stroke} fill="none" />
        {soc != null && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={ringColor}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pctValue)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
      </Svg>
      <View className="absolute items-center justify-center">
        <Txt weight="extrabold" className="text-[15px]" style={{ color: labelColor }}>
          {label}
        </Txt>
      </View>
    </View>
  );
}
