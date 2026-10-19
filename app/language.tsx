import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Txt } from '@/components/ui/Txt';
import { Card } from '@/components/ui/Card';
import { AppBar } from '@/components/ui/AppBar';
import { Screen } from '@/components/ui/Screen';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/cn';
import { useStore } from '@/lib/store';
import { tap } from '@/lib/haptics';

const LANGUAGES = [
  { name: 'English', native: 'English' },
  { name: 'Hindi', native: 'हिन्दी' },
];

export default function Language() {
  const router = useRouter();
  const { language, setLanguage } = useStore();

  return (
    <View className="flex-1 bg-background">
      <AppBar title="Language" back />
      <Screen contentClassName="px-5 pt-1">
        <Txt weight="regular" className="mb-3 text-[13px] text-muted">
          Choose the language you’re most comfortable with.
        </Txt>
        <Card className="p-0">
          {LANGUAGES.map((lang, i) => {
            const selected = language === lang.name;
            return (
              <Pressable
                key={lang.name}
                onPress={() => {
                  tap('selection');
                  setLanguage(lang.name);
                  router.back();
                }}
                className="flex-row items-center px-4 py-3.5"
                style={({ pressed }) => (pressed ? { backgroundColor: '#F7F9FC' } : undefined)}
              >
                <View className="flex-1">
                  <Txt weight="bold" className="text-[15.5px] text-foreground">
                    {lang.native}
                  </Txt>
                  {lang.native !== lang.name && (
                    <Txt weight="medium" className="text-[12.5px] text-muted">
                      {lang.name}
                    </Txt>
                  )}
                </View>
                {selected ? (
                  <View className="h-6 w-6 items-center justify-center rounded-full bg-brand-500">
                    <Check size={15} color="#fff" strokeWidth={3} />
                  </View>
                ) : (
                  <View className="h-6 w-6 rounded-full border-2 border-border" />
                )}
                {i < LANGUAGES.length - 1 && <View className="absolute bottom-0 left-4 right-4 h-px bg-line" />}
              </Pressable>
            );
          })}
        </Card>
      </Screen>
    </View>
  );
}
