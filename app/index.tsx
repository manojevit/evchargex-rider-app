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

// Sparks fly outward from the core at the power-surge moment.
const SPARKS = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2;
  const d = 95 + (i % 3) * 14;
  return { x: Math.cos(a) * d, y: Math.sin(a) * d, delay: 980 + (i % 4) * 25 };
});

export default function Splash() {
  const router = useRouter();
  const { signedIn } = useStore();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(signedIn ? '/(tabs)/home' : '/onboarding');
    }, 3100);
    return () => clearTimeout(t);
  }, [router, signedIn]);

  return (
    <View className="flex-1" style={{ backgroundColor: '#0B1420' }}>
      <StatusBar style="light" />
      <LinearGradient colors={gradients.splash} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

      {/* Ambient breathing glow */}
      <MotiView
        from={{ opacity: 0.05, scale: 0.9 }}
        animate={{ opacity: 0.17, scale: 1.1 }}
        transition={{ type: 'timing', duration: 2600, loop: true, repeatReverse: true }}
        style={{ position: 'absolute', alignSelf: 'center', top: '28%', width: 420, height: 420, borderRadius: 210, backgroundColor: BLUE }}
        pointerEvents="none"
      />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* ---- Charge-up cluster: builds, then dissolves into the brand reveal ---- */}
        <MotiView
          from={{ opacity: 0, scale: 0.55 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.55, 1, 1, 0.8] }}
          transition={{ type: 'timing', duration: 1500, easing: Easing.inOut(Easing.ease) }}
          style={{ position: 'absolute', width: 200, height: 200, alignItems: 'center', justifyContent: 'center' }}
          pointerEvents="none"
        >
          {[0, 1, 2].map((i) => (
            <MotiView
              key={i}
              from={{ scale: 0.5, opacity: 0.55 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ type: 'timing', duration: 1500, loop: true, delay: i * 480 }}
              style={{ position: 'absolute', width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: CYAN }}
            />
          ))}
          <MotiView
            from={{ rotate: '0deg' }}
            animate={{ rotate: '360deg' }}
            transition={{ type: 'timing', duration: 1100, loop: true, easing: Easing.linear }}
            style={{ position: 'absolute', width: 150, height: 150, borderRadius: 75, borderWidth: 3, borderColor: 'transparent', borderTopColor: CYAN, borderRightColor: 'rgba(56,189,248,0.3)' }}
          />
          <View style={{ width: 92, height: 92, borderRadius: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(30,99,240,0.22)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)' }}>
            <MotiView from={{ scale: 0.9 }} animate={{ scale: 1.12 }} transition={{ type: 'timing', duration: 560, loop: true, repeatReverse: true }}>
              <Zap size={44} color="#fff" fill="#fff" />
            </MotiView>
          </View>
        </MotiView>

        {/* ---- Power-surge flash ---- */}
        <MotiView
          from={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.85, 0], scale: [0.3, 2, 2.9] }}
          transition={{ type: 'timing', duration: 650, delay: 980 }}
          style={{ position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: '#FFFFFF' }}
          pointerEvents="none"
        />

        {/* ---- Sparks ---- */}
        {SPARKS.map((s, i) => (
          <MotiView
            key={i}
            from={{ opacity: 0, translateX: 0, translateY: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0], translateX: s.x, translateY: s.y, scale: [0.4, 1, 0.2] }}
            transition={{ type: 'timing', duration: 720, delay: s.delay }}
            style={{ position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: CYAN }}
            pointerEvents="none"
          />
        ))}

        {/* ---- Brand reveal: glow flare behind, logo ignites in, light sweep ---- */}
        <MotiView
          from={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.55, 0.22], scale: [0.6, 1.35, 1.05] }}
          transition={{ type: 'timing', duration: 1000, delay: 1150 }}
          style={{ position: 'absolute', width: 300, height: 170, borderRadius: 85, backgroundColor: BLUE }}
          pointerEvents="none"
        />

        <MotiView
          from={{ opacity: 0, scale: 0.82, translateY: 10 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 13, stiffness: 140, delay: 1200 }}
          style={{ overflow: 'hidden' }}
        >
          <Logo variant="stack" tone="light" size="lg" tagline />
          <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <MotiView
              from={{ translateX: -300, rotate: '20deg' }}
              animate={{ translateX: 320, rotate: '20deg' }}
              transition={{ type: 'timing', duration: 900, delay: 1550 }}
              style={{ position: 'absolute', top: -40, bottom: -40, width: 60 }}
            >
              <LinearGradient colors={['transparent', 'rgba(255,255,255,0.55)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
            </MotiView>
          </View>
        </MotiView>

        {/* ---- Sleek loading bar ---- */}
        <View style={{ position: 'absolute', bottom: '18%', width: 150, height: 4, borderRadius: 2, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.12)' }}>
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
