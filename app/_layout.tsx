import '../global.css';

import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import { StoreProvider } from '@/lib/store';
import { ToastProvider } from '@/lib/toast';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StoreProvider>
          <ToastProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F2F5F9' } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="scan" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="swap/start" options={{ presentation: 'transparentModal', animation: 'fade' }} />
            <Stack.Screen name="swap/live" options={{ gestureEnabled: false }} />
            <Stack.Screen name="station/[id]" />
            <Stack.Screen name="history" />
            <Stack.Screen name="subscribe" options={{ presentation: 'modal' }} />
            <Stack.Screen name="alerts" />
            <Stack.Screen name="tickets" />
            <Stack.Screen name="support" />
            <Stack.Screen name="about" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="language" />
          </Stack>
          </ToastProvider>
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
