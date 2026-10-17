import { useEffect } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { Logo } from '@/components/Logo';
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
      <LinearGradient colors={gradients.splash} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <MotiView
          from={{ opacity: 0, scale: 0.7, translateY: 8 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 160 }}
        >
          <Logo variant="stack" tone="light" size="lg" tagline />
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
