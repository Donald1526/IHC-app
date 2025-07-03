import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  const menuOptions = [
    {
      title: 'Trivia de Bienestar',
      description: 'Pon a prueba tus conocimientos sobre salud y bienestar',
      icon: 'brain-outline',
      route: '/trivia',
      color: '#6366f1',
    },
    {
      title: 'Entrenador de Lectura Rápida',
      description: 'Mejora tu velocidad y comprensión lectora',
      icon: 'book-outline',
      route: '/speed-reader',
      color: '#10b981',
    },
    {
      title: 'Práctica de Presentación',
      description: 'Graba tu exposición y recibe retroalimentación simulada',
      icon: 'mic-outline',
      route: '/camera',
      color: '#f59e0b',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          entering={FadeInUp.duration(800)} 
          style={styles.header}
        >
          <Text style={styles.title}>Bienestar Mental</Text>
          <Text style={styles.subtitle}>
            Herramientas para mejorar tu bienestar mental y cognitivo
          </Text>
        </Animated.View>

        <View style={styles.menuContainer}>
          {menuOptions.map((option, index) => (
            <Animated.View
              key={option.title}
              entering={FadeInUp.delay(200 + index * 100).duration(600)}
            >
              <TouchableOpacity
                style={[styles.menuOption, { borderLeftColor: option.color }]}
                onPress={() => router.push(option.route)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                  <Ionicons name={option.icon} size={32} color={option.color} />
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

        <Animated.View 
          entering={FadeInDown.delay(600).duration(800)} 
          style={styles.footer}
        >
          <Text style={styles.footerText}>
            Desarrolla hábitos saludables y mejora tu bienestar
          </Text>
        </Animated.View>
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
    paddingTop: 40,
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});