import { useEffect } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Easing } from 'react-native-reanimated';
import { Zap } from 'lucide-react-native';
import { MotiView } from '@/lib/motion';
import { Logo } from '@/components/Logo';
import { gradients } from '@/lib/theme';
import { useStore } from '@/lib/store';

const CYAN = '#38BDF8';
const BLUE = '#1E63F0';

export default function Splash() {
  const router = useRouter();
  const { signedIn } = useStore();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(signedIn ? '/(tabs)/home' : '/onboarding');
    }, 2800);
    return () => clearTimeout(t);
  }, [router, signedIn]);

  return (
    <View className="flex-1" style={{ backgroundColor: '#0B1420' }}>
      <StatusBar style="light" />
      <LinearGradient colors={gradients.splash} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

      {/* Ambient breathing glow */}
      <MotiView
        from={{ opacity: 0.12, scale: 0.9 }}
        animate={{ opacity: 0.34, scale: 1.12 }}
        transition={{ type: 'timing', duration: 2200, loop: true, repeatReverse: true }}
        style={{ position: 'absolute', alignSelf: 'center', top: '26%', width: 440, height: 440, borderRadius: 220, backgroundColor: BLUE }}
        pointerEvents="none"
      />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* Orb cluster */}
        <View style={{ width: 180, height: 180, alignItems: 'center', justifyContent: 'center' }}>
          {/* Electric ripples */}
          {[0, 1, 2].map((i) => (
            <MotiView
              key={i}
              from={{ scale: 0.5, opacity: 0.5 }}
              animate={{ scale: 2.3, opacity: 0 }}
              transition={{ type: 'timing', duration: 2100, loop: true, delay: i * 700 }}
              style={{ position: 'absolute', width: 92, height: 92, borderRadius: 46, borderWidth: 2, borderColor: CYAN }}
              pointerEvents="none"
            />
          ))}

          {/* Spinning charge arc */}
          <MotiView
            from={{ rotate: '0deg' }}
            animate={{ rotate: '360deg' }}
            transition={{ type: 'timing', duration: 1500, loop: true, easing: Easing.linear }}
            style={{
              position: 'absolute',
              width: 152,
              height: 152,
              borderRadius: 76,
              borderWidth: 3,
              borderColor: 'transparent',
              borderTopColor: CYAN,
              borderRightColor: 'rgba(56,189,248,0.3)',
            }}
            pointerEvents="none"
          />

          {/* Glow orb + bolt */}
          <MotiView
            from={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 11, stiffness: 140 }}
            style={{
              width: 98,
              height: 98,
              borderRadius: 49,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(30,99,240,0.22)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.16)',
            }}
          >
            <MotiView
              from={{ scale: 0.88 }}
              animate={{ scale: 1.12 }}
              transition={{ type: 'timing', duration: 850, loop: true, repeatReverse: true }}
            >
              <Zap size={46} color="#fff" fill="#fff" />
            </MotiView>
          </MotiView>
        </View>

        {/* Wordmark with a light sweep */}
        <View style={{ marginTop: 44, overflow: 'hidden' }}>
          <MotiView
            from={{ opacity: 0, translateY: 22, scale: 0.92 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 150, delay: 650 }}
          >
            <Logo variant="stack" tone="light" size="lg" tagline />
          </MotiView>

          {/* Shine bar */}
          <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <MotiView
              from={{ translateX: -260, rotate: '20deg' }}
              animate={{ translateX: 280, rotate: '20deg' }}
              transition={{ type: 'timing', duration: 950, delay: 1200 }}
              style={{ position: 'absolute', top: -40, bottom: -40, width: 56 }}
            >
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </MotiView>
          </View>
        </View>

        {/* Powering-up loader */}
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 30 }}>
          {[0, 1, 2].map((i) => (
            <MotiView
              key={i}
              from={{ opacity: 0.25, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 600, loop: true, repeatReverse: true, delay: 900 + i * 180 }}
              style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: CYAN }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
