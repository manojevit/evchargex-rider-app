import { Text, type TextProps } from 'react-native';
import { cssInterop } from 'nativewind';

/**
 * Inter ships one file per weight in React Native, so we can't rely on the
 * `font-bold` weight utility (it would set fontWeight but keep the Regular
 * file). Instead every bit of text goes through <Txt weight="..."> which picks
 * the correct Inter family. className still controls size and color.
 */

export type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

const FAMILY: Record<Weight, string> = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
  black: 'Inter_900Black',
};

interface Props extends TextProps {
  weight?: Weight;
  className?: string;
}

cssInterop(Text, { className: 'style' });

export function Txt({ weight = 'regular', style, className, ...rest }: Props) {
  return (
    <Text
      className={className}
      style={[{ fontFamily: FAMILY[weight], color: '#0B1420' }, style]}
      {...rest}
    />
  );
}
