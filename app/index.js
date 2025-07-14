import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  const menuOptions = [
    {
      title: 'Jugar Trivia Interactiva',
      description: 'Pon a prueba tus conocimientos sobre salud y bienestar',
      icon: 'help-circle-outline',
      route: '/trivia',
    },
    {
      title: 'Entrenar lectura rápida',
      description: 'Mejora tu velocidad y comprension lectora',
      icon: 'book-outline',
      route: '/speed-reader',
    },
    {
      title: 'Realizar respiración guiada',
      description: 'Relájate con una rutina de guiada de respiracion',
      icon: 'pulse-outline',
      route: '/breathing-exercise',
    },
    {
      title: 'Ejecutar pausas ergonómicas',
      description: 'Realiza pausas guiadas para sentirte mejor',
      icon: 'accessibility-outline',
      route: '/PausasActivas',
    },
    {
      title: 'Registrar Estado Emocional',
      description: 'Registra como te sientes actualmente',
      icon: 'happy-outline',
      route: '/emotion-simulator',
    },
    {
      title: 'Practica de Exposicion Oral',
      description: 'Mejora tus habilidades para hablar en público y exposicion',
      icon: 'mic-outline',
      route: '/camera',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          entering={FadeInUp.duration(800)}
          style={styles.header}
        >
          <Text style={styles.title}>UniBalance</Text>
          <Text style={styles.subtitle}>
            Herramientas para mejorar tu bienestar mental y cognitivo
          </Text>
        </Animated.View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={true}>
        <View style={styles.menuContainer}>
          {menuOptions.map((option, index) => (
            <Animated.View
              key={option.title}
              entering={FadeInUp.delay(200 + index * 100).duration(600)}
            >
              <TouchableOpacity
                  style={styles.menuOption}
                onPress={() => router.push(option.route)}
                activeOpacity={0.8}
              >
                  <View style={styles.iconContainer}>
                    <Ionicons name={option.icon} size={32} color={'#5ECBC2'} />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        </ScrollView>


      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop:40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  menuContainer: {
    flex: 1,
    gap: 16,
  },
  menuOption: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 8,
    borderLeftColor: '#5ECBC2',
    borderWidth: 2,
    borderColor: '#5ECBC2',
    shadowColor: '#5ECBC2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#5ECBC2',
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
