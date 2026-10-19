import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from '@/lib/motion';
import { ChevronDown, Headset, Mail, Phone } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { colors, gradients } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { SUPPORT } from '@/lib/data/account';

export default function Support() {
  const [open, setOpen] = useState<string | null>(SUPPORT.topics[0].id);

  return (
    <View className="flex-1 bg-canvas">
      <AppBar title="Help & support" back />
      <Screen contentClassName="px-5 pt-1">
        {/* Helpline hero */}
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 28, padding: 22, overflow: 'hidden' }}>
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Headset size={26} color="#fff" />
          </View>
          <Txt weight="black" className="mt-3 text-[20px] text-white" style={{ color: '#fff' }}>
            We’re here 24 × 7
          </Txt>
          <Txt weight="regular" className="mt-1 text-[13.5px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Call or email anytime — priority support for plan members.
          </Txt>

          <View className="mt-4 gap-2.5">
            <Pressable onPress={() => Linking.openURL(`tel:${SUPPORT.helpline.replace(/\s/g, '')}`)} className="flex-row items-center justify-center gap-2 rounded-2xl bg-white py-3.5">
              <Phone size={18} color={colors.brand} />
              <Txt weight="bold" className="text-[14.5px] text-brand-600">
                Call {SUPPORT.helpline}
              </Txt>
            </Pressable>
            <Pressable onPress={() => Linking.openURL(`mailto:${SUPPORT.email}`)} className="flex-row items-center justify-center gap-2 rounded-2xl bg-white/15 py-3.5">
              <Mail size={18} color="#fff" />
              <Txt weight="bold" className="text-[14px] text-white" style={{ color: '#fff' }}>
                {SUPPORT.email}
              </Txt>
            </Pressable>
          </View>
        </LinearGradient>

        {/* FAQ */}
        <Txt weight="black" className="mb-3 mt-6 text-[18px] text-ink">
          Frequently asked
        </Txt>
        {SUPPORT.topics.map((t) => {
          const isOpen = open === t.id;
          return (
            <Pressable key={t.id} onPress={() => setOpen(isOpen ? null : t.id)}>
              <Card className="mb-3">
                <View className="flex-row items-center">
                  <Txt weight="bold" className="flex-1 pr-3 text-[15px] text-ink">
                    {t.title}
                  </Txt>
                  <View className={cn('h-7 w-7 items-center justify-center rounded-full', isOpen ? 'bg-brand-50' : 'bg-canvas')}>
                    <MotiView animate={{ rotate: isOpen ? '180deg' : '0deg' }}>
                      <ChevronDown size={18} color={isOpen ? colors.brand : colors.muted} />
                    </MotiView>
                  </View>
                </View>
                {isOpen && (
                  <MotiView from={{ opacity: 0, translateY: -6 }} animate={{ opacity: 1, translateY: 0 }}>
                    <Txt weight="regular" className="mt-3 text-[13.5px] leading-5 text-muted">
                      {t.body}
                    </Txt>
                  </MotiView>
                )}
              </Card>
            </Pressable>
          );
        })}
      </Screen>
    </View>
  );
}
