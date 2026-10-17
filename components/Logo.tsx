import { View } from 'react-native';
import { Zap } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { colors } from '@/lib/theme';

type Tone = 'dark' | 'light'; // dark = for light backgrounds, light = for dark/brand backgrounds
type Variant = 'mark' | 'row' | 'stack';

const MARK_SIZE = { sm: 36, md: 48, lg: 64 } as const;
const BOLT_SIZE = { sm: 20, md: 28, lg: 38 } as const;
const WORD_SIZE = { sm: 16, md: 20, lg: 26 } as const;

/** The EVCHARGEX logo — a lightning mark plus the wordmark. */
export function Logo({
  variant = 'row',
  tone = 'dark',
  size = 'md',
  tagline = false,
}: {
  variant?: Variant;
  tone?: Tone;
  size?: keyof typeof MARK_SIZE;
  tagline?: boolean;
}) {
  const onLight = tone === 'dark';
  const markBg = onLight ? colors.brand : '#FFFFFF';
  const boltColor = onLight ? '#FFFFFF' : colors.brand;
  const wordColor = onLight ? colors.ink : '#FFFFFF';
  const taglineColor = onLight ? colors.muted : 'rgba(255,255,255,0.75)';

  const mark = (
    <View
      style={{
        width: MARK_SIZE[size],
        height: MARK_SIZE[size],
        borderRadius: MARK_SIZE[size] * 0.3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: markBg,
      }}
    >
      <Zap size={BOLT_SIZE[size]} color={boltColor} fill={boltColor} strokeWidth={1.5} />
    </View>
  );

  const word = (
    <Txt weight="black" style={{ color: wordColor, letterSpacing: 0.5, fontSize: WORD_SIZE[size] }}>
      EVCHARGEX
    </Txt>
  );

  if (variant === 'mark') return mark;

  if (variant === 'stack') {
    return (
      <View style={{ alignItems: 'center' }}>
        {mark}
        <View style={{ height: 16 }} />
        {word}
        {tagline && (
          <Txt weight="medium" style={{ color: taglineColor, fontSize: 11, letterSpacing: 2, marginTop: 6 }}>
            ELECTRIFYING LAST-MILE MOBILITY
          </Txt>
        )}
      </View>
    );
  }

  // row
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
      {mark}
      <View>
        {word}
        {tagline && (
          <Txt weight="medium" style={{ color: taglineColor, fontSize: 9, letterSpacing: 1.5, marginTop: 2 }}>
            ELECTRIFYING LAST-MILE MOBILITY
          </Txt>
        )}
      </View>
    </View>
  );
}
