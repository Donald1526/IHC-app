import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const EstiramientosScreen = () => {
  const router = useRouter();
  const [seconds, setSeconds] = useState(60); // Cambiado a 60 segundos (1 minuto)
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime] = useState(60);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Definición de los 3 ejercicios
  const exercises = [
    {
      id: 1,
      name: 'Flexión hacia delante',
      duration: 20, // segundos que se muestra este ejercicio
      images: {
        step1: require('../assets/images/flexion-delante/Flexion_hacia_Delante_Paso1.png'),
        step2: require('../assets/images/flexion-delante/Flexion_hacia_Delante_Paso2.png'),
      },
      instructions: 'Inclina tu cabeza hacia adelante suavemente'
    },
    {
      id: 2,
      name: 'Flexión de barbilla',
      duration: 20,
      images: {
        step1: require('../assets/images/flexion-barbilla/Flexion_de_Barbilla_Paso1.png'),
        step2: require('../assets/images/flexion-barbilla/Flexion_de_Barbilla_Paso2.png'),
      },
      instructions: 'Lleva la barbilla hacia el pecho lentamente'
    },
    {
      id: 3,
      name: 'Postura gato-vaca',
      duration: 20,
      images: {
        step1: require('../assets/images/silla-gato-vaca/Silla_Gato_Vaca_Paso1.png'),
        step2: require('../assets/images/silla-gato-vaca/Silla_Gato_Vaca_Paso2.png'),
      },
      instructions: 'Alterna entre arquear y redondear la espalda'
    }
  ];

  // Timer principal
  useEffect(() => {
    let interval;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  // Rotación automática de ejercicios
  useEffect(() => {
    if (isRunning) {
      // Calcular qué ejercicio mostrar basado en el tiempo transcurrido
      const elapsedTime = initialTime - seconds;
      let newExerciseIndex = 0;
      
      if (elapsedTime >= 40) {
        newExerciseIndex = 2; // Tercer ejercicio (40-60 segundos)
      } else if (elapsedTime >= 20) {
        newExerciseIndex = 1; // Segundo ejercicio (20-40 segundos)
      } else {
        newExerciseIndex = 0; // Primer ejercicio (0-20 segundos)
      }
      
      setCurrentExerciseIndex(newExerciseIndex);
    }
  }, [seconds, isRunning, initialTime]);

  const handleBack = () => {
    router.back();
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setSeconds(initialTime);
    setIsRunning(false);
    setCurrentExerciseIndex(0);
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const { minutes, seconds: displaySeconds } = formatTime(seconds);
  const currentExercise = exercises[currentExerciseIndex];

  // Calcular tiempo restante para el ejercicio actual
  const getExerciseTimeRemaining = () => {
    const elapsedTime = initialTime - seconds;
    const exerciseStartTime = currentExerciseIndex * 20;
    const exerciseElapsedTime = elapsedTime - exerciseStartTime;
    return 20 - exerciseElapsedTime;
  };

  // Indicador de progreso del ejercicio actual
  const getProgressIndicator = () => {
    if (!isRunning) return null;
    
    const timeRemaining = getExerciseTimeRemaining();
    const progress = ((20 - timeRemaining) / 20) * 100;
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Ejercicio {currentExerciseIndex + 1} de 3 • {Math.max(0, Math.ceil(timeRemaining))}s restantes
        </Text>
      </View>
    );
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

      {/* Título del ejercicio actual */}
      <View style={styles.titleContainer}>
        <View style={styles.titleBadge}>
          <Text style={styles.titleText}>{currentExercise.name}</Text>
        </View>
        <Text style={styles.instructionText}>{currentExercise.instructions}</Text>
      </View>

      {/* Indicador de progreso */}
      {getProgressIndicator()}

      {/* Lista de ejercicios */}
      <View style={styles.exerciseListContainer}>
        {exercises.map((exercise, index) => (
          <View 
            key={exercise.id} 
            style={[
              styles.exerciseListItem,
              index === currentExerciseIndex && isRunning && styles.exerciseListItemActive
            ]}
          >
            <View style={[
              styles.exerciseListDot,
              index === currentExerciseIndex && isRunning && styles.exerciseListDotActive
            ]} />
            <Text style={[
              styles.exerciseListText,
              index === currentExerciseIndex && isRunning && styles.exerciseListTextActive
            ]}>
              {exercise.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Tarjetas de ejercicio */}
      <View style={styles.exerciseCardsContainer}>
        
        {/* Tarjeta 1 - Posición inicial */}
        <View style={styles.exerciseCard}>
          <Image 
            source={currentExercise.images.step1}
            style={styles.exerciseImage}
            resizeMode="contain"
          />
          <Text style={styles.stepLabel}>Paso 1</Text>
        </View>

        {/* Tarjeta 2 - Movimiento */}
        <View style={styles.exerciseCard}>
          <Image 
            source={currentExercise.images.step2}
            style={styles.exerciseImage}
            resizeMode="contain"
          />
          <Text style={styles.stepLabel}>Paso 2</Text>
        </View>

      </View>

      {/* Temporizador total */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {minutes}:{displaySeconds}
        </Text>
        <View style={styles.timerLabels}>
          <Text style={styles.timerLabel}>minutos</Text>
          <Text style={styles.timerLabel}>seg</Text>
        </View>
      </View>

      {/* Controles */}
      <View style={styles.controlsContainer}>
        
        {/* Botón Play/Pause */}
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={toggleTimer}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isRunning ? "pause" : "play"} 
            size={26} 
            color="white" 
          />
        </TouchableOpacity>

        {/* Botón Reset */}
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={resetTimer}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={26} color="white" />
        </TouchableOpacity>

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
    paddingBottom: 10,
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
    marginBottom: 20,
  },
  titleBadge: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 8,
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
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  instructionText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  exerciseCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 20,
  },
  exerciseCard: {
    backgroundColor: 'white',
    width: 160,
    height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    padding: 8,
  },
  exerciseImage: {
    width: '90%',
    height: '80%',
  },
  stepLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginTop: 5,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  timerText: {
    fontSize: 36,
    fontWeight: '300',
    color: '#333',
    letterSpacing: 1,
  },
  timerLabels: {
    flexDirection: 'row',
    marginTop: 5,
  },
  timerLabel: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 15,
  },
  exerciseListContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  exerciseListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  exerciseListItemActive: {
    // Estilo para el ejercicio activo
  },
  exerciseListDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginRight: 12,
  },
  exerciseListDotActive: {
    backgroundColor: '#4ECDC4',
  },
  exerciseListText: {
    fontSize: 14,
    color: '#666',
  },
  exerciseListTextActive: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    paddingBottom: 30,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default EstiramientosScreen;