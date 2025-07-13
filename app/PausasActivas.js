import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PausasActivas = () => {
  const router = useRouter();
  const scaleAnim1 = new Animated.Value(1);
  const scaleAnim2 = new Animated.Value(1);

  const handlePressIn = (animValue) => {
    Animated.spring(animValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (animValue) => {
    Animated.spring(animValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleEstiramientos = () => {
    router.push('/EstiramientosScreen');
  };

  const handleDescansoVisual = () => {
    router.push('/DescansoVisualScreen');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header con botón de retroceso */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Título principal */}
      <View style={styles.titleContainer}>
        <View style={styles.titleBadge}>
          <Text style={styles.titleText}>Pausas Activas de Bienestar</Text>
        </View>
        <Text style={styles.subtitleText}>Elige tu descanso ideal</Text>
      </View>

      {/* Opciones de pausa */}
      <View style={styles.optionsContainer}>
        
        {/* Ejercicios de estiramiento */}
        <Animated.View style={{ transform: [{ scale: scaleAnim1 }] }}>
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={handleEstiramientos}
            onPressIn={() => handlePressIn(scaleAnim1)}
            onPressOut={() => handlePressOut(scaleAnim1)}
            activeOpacity={1}
          >
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#4ECDC4' }]}>
                <Ionicons name="accessibility-outline" size={30} color="white" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.optionText}>Ejercicios de estiramiento</Text>
                <Text style={styles.optionSubtext}>Relaja músculos y articulaciones • 5-10 min</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#bbb" />
          </TouchableOpacity>
        </Animated.View>

        {/* Descanso visual */}
        <Animated.View style={{ transform: [{ scale: scaleAnim2 }] }}>
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={handleDescansoVisual}
            onPressIn={() => handlePressIn(scaleAnim2)}
            onPressOut={() => handlePressOut(scaleAnim2)}
            activeOpacity={1}
          >
            <View style={styles.optionContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#4ECDC4' }]}>
                <Ionicons name="eye-outline" size={30} color="white" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.optionText}>Descanso visual</Text>
                <Text style={styles.optionSubtext}>Ejercicios para relajar la vista • 2-5 min</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#bbb" />
          </TouchableOpacity>
        </Animated.View>

      </View>

      {/* Indicador inferior */}
      <View style={styles.bottomIndicator}>
        <View style={styles.indicator} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40, // Reducido de 60 a 40
  },
  titleBadge: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  titleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitleText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 16, // Más redondeado
    padding: 18, // Reducido ligeramente
    marginBottom: 12, // Reducido de 15 a 12
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3, // Sombra más suave
    },
    shadowOpacity: 0.08, // Más sutil
    shadowRadius: 6,
    elevation: 4,
    minHeight: 75, // Altura mínima para consistencia
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 52, // Ligeramente más grande
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16, // Más espacio
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600', // Más bold
    marginBottom: 2,
  },
  optionSubtext: {
    fontSize: 12,
    color: '#888',
    fontWeight: '400',
  },
  bottomIndicator: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  indicator: {
    width: 50, // Más largo
    height: 5, // Más alto
    backgroundColor: '#ccc', // Más visible
    borderRadius: 3,
  },
});

export default PausasActivas;