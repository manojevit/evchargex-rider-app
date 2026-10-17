import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { Txt } from './Txt';
import { cn } from '@/lib/cn';
import { colors } from '@/lib/theme';
import { useStore } from '@/lib/store';

interface Props {
  title?: string;
  subtitle?: string;
  back?: boolean;
  bell?: boolean;
  /** Large left-aligned title block (Home / Stations style) vs centered small bar. */
  large?: boolean;
  right?: React.ReactNode;
}

export function AppBar({ title, subtitle, back, bell, large, right }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { unreadAlerts } = useStore();

  return (
    <View style={{ paddingTop: insets.top + 6 }} className="bg-canvas px-5 pb-2">
      <View className="min-h-[44px] flex-row items-center">
        {back && (
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-surface"
            style={{ shadowColor: '#0B1420', shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 }}
          >
            <ArrowLeft size={22} color={colors.ink} />
          </Pressable>
        )}

        <View className="flex-1">
          {large ? (
            <>
              <Txt weight="black" className="text-[30px] text-ink">
                {title}
              </Txt>
              {subtitle ? (
                <Txt weight="regular" className="mt-0.5 text-[15px] text-muted">
                  {subtitle}
                </Txt>
              ) : null}
            </>
          ) : (
            <Txt weight="extrabold" className="text-[20px] text-ink">
              {title}
            </Txt>
          )}
        </View>

        {right}

        {bell && (
          <Pressable
            onPress={() => router.push('/alerts')}
            hitSlop={10}
            className="h-11 w-11 items-center justify-center rounded-full bg-surface"
            style={{ shadowColor: '#0B1420', shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 }}
          >
            <Bell size={20} color={colors.ink} />
            {unreadAlerts > 0 && (
              <View className="absolute -right-0.5 -top-0.5 min-w-[18px] items-center justify-center rounded-full bg-danger px-1">
                <Txt weight="bold" className="text-[10px] text-white" style={{ color: '#fff' }}>
                  {unreadAlerts > 9 ? '9+' : unreadAlerts}
                </Txt>
              </View>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
