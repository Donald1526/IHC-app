import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="trivia" />
        <Stack.Screen name="speed-reader" />
        <Stack.Screen name="camera" />
        <Stack.Screen name="PausasActivas" />
        <Stack.Screen name="EstiramientosScreen" />
        <Stack.Screen name="DescansoVisualScreen" />
      </Stack>
    </>
  );
}