import { View, type ViewProps } from 'react-native';
import { Txt } from './Txt';
import { cardShadow } from '@/lib/theme';
import { cn } from '@/lib/cn';

interface Props extends ViewProps {
  className?: string;
  /** Drop the soft shadow (e.g. a nested surface). */
  flat?: boolean;
}

/** shadcn Card — white surface, hairline border, soft shadow. */
export function Card({ className, flat, style, children, ...rest }: Props) {
  return (
    <View
      className={cn('rounded-2xl border border-border/70 bg-card p-4', className)}
      style={[flat ? undefined : cardShadow, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

export function CardHeader({ title, description, right }: { title: string; description?: string; right?: React.ReactNode }) {
  return (
    <View className="mb-3 flex-row items-start justify-between">
      <View className="flex-1">
        <Txt weight="extrabold" className="text-[17px] text-foreground">
          {title}
        </Txt>
        {description ? (
          <Txt weight="regular" className="mt-0.5 text-[13px] text-muted">
            {description}
          </Txt>
        ) : null}
      </View>
      {right}
    </View>
  );
}
