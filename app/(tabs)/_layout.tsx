import { Tabs } from 'expo-router';
import { TabBar } from '@/components/shell/TabBar';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="stations" />
      <Tabs.Screen name="plan" />
      <Tabs.Screen name="menu" />
    </Tabs>
  );
}
