import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F2F5F9' },
        animation: 'slide_from_right',
      }}
    />
  );
}
