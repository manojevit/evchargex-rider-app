import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { MotiView } from '@/lib/motion';
import { ChevronDown, FileText, Globe, Mail, Scale, ShieldCheck } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { Logo } from '@/components/Logo';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { SUPPORT } from '@/lib/data/account';

const LEGAL = [
  {
    id: 'terms',
    icon: FileText,
    title: 'Terms of Service',
    body: 'By using EVCHARGEX you agree to swap only certified packs at authorised stations, keep your account details accurate, and use the service lawfully. This is a demo build, so no real agreement is formed.',
  },
  {
    id: 'privacy',
    icon: ShieldCheck,
    title: 'Privacy Policy',
    body: 'We use your mobile number and email only to run your account, process swaps and send service updates. We never sell your data. This demo runs entirely on dummy data.',
  },
  {
    id: 'licenses',
    icon: Scale,
    title: 'Open-source licenses',
    body: 'EVCHARGEX is built with React Native, Expo and other open-source libraries, used under their respective licenses.',
  },
];

export default function About() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-canvas">
      <AppBar title="About & legal" back />
      <Screen contentClassName="px-5 pt-1">
        {/* Brand */}
        <View className="items-center overflow-hidden rounded-2xl bg-[#0B1420] p-7">
          <Logo variant="stack" tone="light" size="md" tagline />
          <Txt weight="medium" className="mt-4 text-[12px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Version 1.0.0 · Demo build
          </Txt>
        </View>

        {/* Legal */}
        <Txt weight="bold" className="mb-2 mt-6 text-[12px] uppercase tracking-wide text-muted">
          Legal
        </Txt>
        {LEGAL.map((item) => {
          const isOpen = open === item.id;
          const Icon = item.icon;
          return (
            <Pressable key={item.id} onPress={() => setOpen(isOpen ? null : item.id)}>
              <Card className="mb-3">
                <View className="flex-row items-center">
                  <View className="h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
                    <Icon size={18} color={colors.brand} />
                  </View>
                  <Txt weight="bold" className="ml-3 flex-1 text-[15px] text-ink">
                    {item.title}
                  </Txt>
                  <MotiView animate={{ rotate: isOpen ? '180deg' : '0deg' }}>
                    <ChevronDown size={18} color={colors.muted} />
                  </MotiView>
                </View>
                {isOpen && (
                  <MotiView from={{ opacity: 0, translateY: -6 }} animate={{ opacity: 1, translateY: 0 }}>
                    <Txt weight="regular" className="mt-3 text-[13.5px] leading-5 text-muted">
                      {item.body}
                    </Txt>
                  </MotiView>
                )}
              </Card>
            </Pressable>
          );
        })}

        {/* Company */}
        <Txt weight="bold" className="mb-2 mt-4 text-[12px] uppercase tracking-wide text-muted">
          Company
        </Txt>
        <Card className="p-0">
          <LinkRow icon={<Globe size={18} color={colors.info} />} label="Website" value="evchargex.com" onPress={() => Linking.openURL('https://evchargex.com')} />
          <LinkRow icon={<Mail size={18} color={colors.brand} />} label="Email" value={SUPPORT.email} onPress={() => Linking.openURL(`mailto:${SUPPORT.email}`)} last />
        </Card>

        <Txt weight="medium" className="mb-2 mt-6 text-center text-[11.5px] text-faint">
          © 2026 EVCHARGEX · Made in India
        </Txt>
      </Screen>
    </View>
  );
}

function LinkRow({ icon, label, value, onPress, last }: { icon: React.ReactNode; label: string; value: string; onPress: () => void; last?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3.5"
      style={({ pressed }) => (pressed ? { backgroundColor: '#F7F9FC' } : undefined)}
    >
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-canvas">{icon}</View>
      <View className="ml-3 flex-1">
        <Txt weight="medium" className="text-[12px] text-muted">
          {label}
        </Txt>
        <Txt weight="bold" className="text-[14.5px] text-ink">
          {value}
        </Txt>
      </View>
      {!last && <View className="absolute bottom-0 left-[64px] right-4 h-px bg-line" />}
    </Pressable>
  );
}
