import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatePresence, MotiView } from '@/lib/motion';
import { Check, Info, TriangleAlert } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { colors } from '@/lib/theme';

type Tone = 'default' | 'success' | 'error';
interface ToastState {
  id: number;
  message: string;
  tone: Tone;
}

const ToastContext = createContext<{ show: (message: string, tone?: Tone) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, tone: Tone = 'default') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), message, tone });
    timer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + 96, alignItems: 'center' }}>
        <AnimatePresence>
          {toast && (
            <MotiView
              key={toast.id}
              from={{ opacity: 0, translateY: 16, scale: 0.96 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              exit={{ opacity: 0, translateY: 16 }}
              transition={{ type: 'timing', duration: 220 }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                maxWidth: '88%',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 16,
                backgroundColor: '#0B1420',
              }}
            >
              {toast.tone === 'success' ? (
                <Check size={18} color={colors.success} strokeWidth={3} />
              ) : toast.tone === 'error' ? (
                <TriangleAlert size={18} color={colors.warn} />
              ) : (
                <Info size={18} color="#8BB0FF" />
              )}
              <Txt weight="semibold" className="text-[13.5px]" style={{ color: '#fff', flexShrink: 1 }}>
                {toast.message}
              </Txt>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx ?? { show: () => {} };
}
