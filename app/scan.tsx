import { useEffect, useRef, useState } from 'react';
import { Dimensions, Linking, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { MotiView } from '@/lib/motion';
import { Camera, Check, Info, Keyboard, QrCode, X } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/theme';
import { STATIONS } from '@/lib/data/stations';

const { width } = Dimensions.get('window');
const FRAME = Math.min(width - 72, 300);

// For the demo, any scanned QR resolves to the first online station.
const TARGET = STATIONS.find((s) => s.status === 'online') ?? STATIONS[0];

export default function Scan() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [found, setFound] = useState(false);
  const handled = useRef(false);

  // Ask for camera permission as soon as the screen opens.
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const proceed = () => {
    if (handled.current) return;
    handled.current = true;
    setFound(true);
    setTimeout(() => router.replace(`/swap/preflight?station=${TARGET.id}`), 750);
  };

  const header = (
    <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center justify-between px-5">
      <Pressable onPress={() => router.back()} hitSlop={10} className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
        <X size={22} color="#fff" />
      </Pressable>
      <Txt weight="bold" className="text-[17px]" style={{ color: '#fff' }}>
        Scan to swap
      </Txt>
      <View className="h-11 w-11" />
    </View>
  );

  // --- Permission not yet granted ---
  if (!permission || !permission.granted) {
    const denied = permission && !permission.granted && !permission.canAskAgain;
    return (
      <View className="flex-1 bg-[#0B1420]">
        <StatusBar style="light" />
        {header}
        <View className="flex-1 items-center justify-center px-8">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-white/10">
            <Camera size={38} color="#fff" />
          </View>
          <Txt weight="black" className="mt-6 text-center text-[22px]" style={{ color: '#fff' }}>
            {denied ? 'Camera access is off' : 'Allow camera access'}
          </Txt>
          <Txt weight="regular" className="mt-2 text-center text-[14px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
            EVCHARGEX uses the camera to scan the QR code on the battery cabinet.
          </Txt>
          <View className="mt-8 w-full">
            <Button
              label={denied ? 'Open settings' : 'Allow camera'}
              onPress={() => (denied ? Linking.openSettings() : requestPermission())}
            />
            <View className="mt-3">
              <Button label="Enter code manually" variant="ghost" onPress={proceed} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  // --- Camera granted: live preview ---
  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={() => proceed()}
      />
      {/* dark scrim top & bottom for legibility */}
      <LinearGradient colors={['rgba(0,0,0,0.55)', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 160 }} pointerEvents="none" />

      {header}

      <View className="flex-1 items-center justify-center">
        <View style={{ width: FRAME, height: FRAME }} className="items-center justify-center">
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
          {!found ? (
            <MotiView
              from={{ translateY: -FRAME / 2 + 20 }}
              animate={{ translateY: FRAME / 2 - 20 }}
              transition={{ type: 'timing', duration: 1600, loop: true, repeatReverse: true }}
              className="absolute h-0.5 w-[82%]"
            >
              <LinearGradient colors={['transparent', '#3B82F6', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: '100%', width: '100%' }} />
            </MotiView>
          ) : (
            <MotiView from={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 12 }} className="items-center">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-success">
                <Check size={44} color="#fff" strokeWidth={3} />
              </View>
              <Txt weight="bold" className="mt-4 text-[16px]" style={{ color: '#fff' }}>
                {TARGET.code} detected
              </Txt>
            </MotiView>
          )}
        </View>
        {!found && (
          <View className="mt-6 flex-row items-center gap-2 rounded-full bg-black/40 px-4 py-2">
            <QrCode size={16} color="#fff" />
            <Txt weight="semibold" className="text-[13px]" style={{ color: '#fff' }}>
              Point at the cabinet QR code
            </Txt>
          </View>
        )}
      </View>

      <View style={{ paddingBottom: insets.bottom + 24 }} className="px-6">
        <Pressable
          onPress={proceed}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-white/15 py-3.5"
        >
          <Keyboard size={18} color="#fff" />
          <Txt weight="semibold" className="text-[14px]" style={{ color: '#fff' }}>
            Enter code manually
          </Txt>
        </Pressable>
        <View className="mt-3 flex-row items-center justify-center gap-1.5">
          <Info size={13} color="rgba(255,255,255,0.6)" />
          <Txt weight="regular" className="text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Point at any QR code to continue the demo.
          </Txt>
        </View>
      </View>
    </View>
  );
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute h-9 w-9 border-brand-400';
  const map: Record<string, string> = {
    tl: 'left-0 top-0 border-l-[3px] border-t-[3px] rounded-tl-xl',
    tr: 'right-0 top-0 border-r-[3px] border-t-[3px] rounded-tr-xl',
    bl: 'left-0 bottom-0 border-l-[3px] border-b-[3px] rounded-bl-xl',
    br: 'right-0 bottom-0 border-r-[3px] border-b-[3px] rounded-br-xl',
  };
  return <View className={`${base} ${map[pos]}`} />;
}
