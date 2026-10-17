import { useEffect } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MotiView, MotiText } from '@/lib/motion';
import { Zap } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { gradients } from '@/lib/theme';
import { useStore } from '@/lib/store';

export default function Splash() {
  const router = useRouter();
  const { signedIn } = useStore();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(signedIn ? '/(tabs)/home' : '/onboarding');
    }, 2000);
    return () => clearTimeout(t);
  }, [router, signedIn]);

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <LinearGradient colors={gradients.splash} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="flex-1 items-center justify-center">
        <MotiView
          from={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 180 }}
          className="h-24 w-24 items-center justify-center rounded-[28px] bg-white/15"
        >
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white">
            <Zap size={34} color="#1E63F0" fill="#1E63F0" strokeWidth={1.5} />
          </View>
        </MotiView>

        <MotiText
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 250, type: 'timing', duration: 500 }}
          style={{ fontFamily: 'Inter_900Black', fontSize: 34, color: '#fff', marginTop: 22, letterSpacing: 1 }}
        >
          EVCHARGEX
        </MotiText>

        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 500, duration: 500 }}>
          <Txt weight="medium" className="mt-2 text-[13px] tracking-[2px] text-white/80" style={{ color: 'rgba(255,255,255,0.8)' }}>
            ELECTRIFYING LAST-MILE MOBILITY
          </Txt>
        </MotiView>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 900, duration: 600 }}
          className="absolute bottom-16"
        >
          <View className="h-1.5 w-1.5 rounded-full bg-white/60" />
        </MotiView>
      </LinearGradient>
    </View>
  );
}
