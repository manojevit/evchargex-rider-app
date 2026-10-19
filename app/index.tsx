import { useEffect } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Easing } from 'react-native-reanimated';
import { MotiView } from '@/lib/motion';
import { Logo } from '@/components/Logo';
import { gradients } from '@/lib/theme';
import { useStore } from '@/lib/store';

const CYAN = '#38BDF8';
const BLUE = '#1E63F0';

// Concentric circles make a smooth radial glow (RN has no radial gradient).
const GLOW = [
  { s: 420, o: 0.03, c: BLUE },
  { s: 330, o: 0.045, c: BLUE },
  { s: 250, o: 0.06, c: BLUE },
  { s: 180, o: 0.085, c: BLUE },
  { s: 120, o: 0.12, c: CYAN },
];

export default function Splash() {
  const router = useRouter();
  const { signedIn } = useStore();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(signedIn ? '/(tabs)/home' : '/onboarding');
    }, 3000);
    return () => clearTimeout(t);
  }, [router, signedIn]);

  return (
    <View className="flex-1" style={{ backgroundColor: '#0B1420' }}>
      <StatusBar style="light" />
      <LinearGradient colors={gradients.splash} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* Soft radial brand glow — fades in, then breathes gently */}
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 900 }}
          style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}
          pointerEvents="none"
        >
          <MotiView
            from={{ scale: 0.96 }}
            animate={{ scale: 1.08 }}
            transition={{ type: 'timing', duration: 2400, loop: true, repeatReverse: true, easing: Easing.inOut(Easing.ease) }}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            {GLOW.map((r) => (
              <View key={r.s} style={{ position: 'absolute', width: r.s, height: r.s, borderRadius: r.s / 2, backgroundColor: r.c, opacity: r.o }} />
            ))}
          </MotiView>
        </MotiView>

        {/* Brand lockup — clean fade + rise, full logo (no clipping) */}
        <MotiView
          from={{ opacity: 0, scale: 0.92, translateY: 10 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 150, delay: 250 }}
        >
          <Logo variant="stack" tone="light" size="lg" tagline />
        </MotiView>

        {/* Accent line draws out under the logo */}
        <View style={{ marginTop: 20, width: 168, height: 3, borderRadius: 2, overflow: 'hidden' }}>
          <MotiView
            from={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: 'timing', duration: 700, delay: 800, easing: Easing.out(Easing.cubic) }}
            style={{ flex: 1 }}
          >
            <LinearGradient colors={[CYAN, BLUE]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 2 }} />
          </MotiView>
        </View>

        {/* Sleek loading bar */}
        <View style={{ position: 'absolute', bottom: '16%', width: 150, height: 4, borderRadius: 2, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.12)' }}>
          <MotiView
            from={{ translateX: -150 }}
            animate={{ translateX: 0 }}
            transition={{ type: 'timing', duration: 2500, delay: 350, easing: Easing.out(Easing.cubic) }}
            style={{ width: 150, height: 4 }}
          >
            <LinearGradient colors={[BLUE, CYAN]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 2 }} />
          </MotiView>
        </View>
      </View>
    </View>
  );
}
