import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';

export default function RootLayout() {
  const pathname = usePathname();
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="trivia" />
        <Stack.Screen name="speed-reader" />
        <Stack.Screen name="camera" />
        <Stack.Screen name="breathing-exercise" />
        <Stack.Screen name="emotion-simulator" />
        <Stack.Screen name="PausasActivas" />
        <Stack.Screen name="EstiramientosScreen" />
        <Stack.Screen name="DescansoVisualScreen" />
      </Stack>
      {pathname !== '/camera' && (
        <SafeAreaView edges={["bottom"]} style={{backgroundColor: 'transparent'}}>
          <View style={styles.footer}>
            <Text style={styles.footerText}>IHC - Grupo "Interaccion Hombre Cachimbas"</Text>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#5ECBC2',
    alignItems: 'center',
    paddingVertical: 16,
    width: '100%',
    
  },
  footerText: {
    fontSize: 16,
    color: '#111',
    textAlign: 'center',
  },
});