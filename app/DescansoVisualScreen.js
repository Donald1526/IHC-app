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

const DescansoVisualScreen = () => {
  const router = useRouter();
  const [seconds, setSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentExercise, setCurrentExercise] = useState('movimientos'); // 'movimientos' o 'parpadeo'
  const [currentDirection, setCurrentDirection] = useState('centro');
  const [initialTime] = useState(60);
  const [blinkState, setBlinkState] = useState('open'); // 'open', 'closed'

  // Direcciones de movimiento ocular con las nuevas imágenes
  const directions = [
    { 
      name: 'centro', 
      instruction: 'Posición inicial',
      image: require('../assets/images/descanso-ocular/posicion_inicial_sin_fondo.png')
    },
    { 
      name: 'arriba', 
      instruction: 'Mira hacia arriba',
      image: require('../assets/images/descanso-ocular/mirando_arriba_sin_fondo.png')
    },
    { 
      name: 'derecha', 
      instruction: 'Mira hacia la derecha',
      image: require('../assets/images/descanso-ocular/mirando_derecha_sin_fondo.png')
    },
    { 
      name: 'abajo', 
      instruction: 'Mira hacia abajo',
      image: require('../assets/images/descanso-ocular/mirando_abajo_sin_fondo.png')
    },
    { 
      name: 'izquierda', 
      instruction: 'Mira hacia la izquierda',
      image: require('../assets/images/descanso-ocular/mirando_izquierda_sin_fondo.png')
    },
  ];

  // Estados para parpadeo
  const blinkImages = {
    open: require('../assets/images/descanso-ocular/posicion_inicial_sin_fondo.png'),
    closed: require('../assets/images/descanso-ocular/cerrado_sin_fondo.png'),
  };

  const [directionIndex, setDirectionIndex] = useState(0);

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

  // Función para ejercicios de movimientos oculares
  useEffect(() => {
    let directionInterval;
    if (isRunning && currentExercise === 'movimientos') {
      directionInterval = setInterval(() => {
        const nextIndex = (directionIndex + 1) % directions.length;
        setDirectionIndex(nextIndex);
        
        const direction = directions[nextIndex];
        setCurrentDirection(direction.name);
      }, 3000); // Cada 3 segundos
    }
    return () => clearInterval(directionInterval);
  }, [isRunning, directionIndex, currentExercise]);

  // Función para ejercicios de parpadeo
  useEffect(() => {
    let blinkInterval;
    if (isRunning && currentExercise === 'parpadeo') {
      blinkInterval = setInterval(() => {
        // Ciclo de parpadeo: abrir -> cerrar -> abrir
        setBlinkState('closed');
        
        // Mantener cerrado por un momento y luego abrir
        setTimeout(() => {
          setBlinkState('open');
        }, 500); // Mantener cerrado por 500ms
      }, 2000); // Cada 2 segundos
    }
    return () => clearInterval(blinkInterval);
  }, [isRunning, currentExercise]);

  const handleBack = () => {
    router.back();
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setSeconds(initialTime);
    setIsRunning(false);
    setDirectionIndex(0);
    setCurrentDirection('centro');
    setBlinkState('open');
  };

  const switchExercise = (exerciseType) => {
    setCurrentExercise(exerciseType);
    setIsRunning(false);
    resetTimer();
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

  // Instrucciones dinámicas según el ejercicio
  const getCurrentInstruction = () => {
    if (currentExercise === 'movimientos') {
      return directions[directionIndex]?.instruction || 'Posición inicial';
    } else if (currentExercise === 'parpadeo') {
      if (blinkState === 'open') return 'Parpadea lentamente';
      if (blinkState === 'closed') return 'Cierra y abre los ojos';
      return 'Relaja los músculos oculares';
    }
  };

  const getCurrentSubInstruction = () => {
    if (currentExercise === 'movimientos') {
      return 'Sigue el movimiento con tus ojos';
    } else if (currentExercise === 'parpadeo') {
      return 'Parpadea siguiendo el ritmo del ojo';
    }
  };

  // Obtener la imagen actual según el ejercicio
  const getCurrentImage = () => {
    if (currentExercise === 'movimientos') {
      return directions[directionIndex]?.image || directions[0].image;
    } else if (currentExercise === 'parpadeo') {
      return blinkImages[blinkState] || blinkImages.open;
    }
  };

  // Indicador de progreso para movimientos oculares
  const getProgressIndicator = () => {
    if (!isRunning || currentExercise !== 'movimientos') return null;
    
    return (
      <View style={styles.directionsList}>
        {directions.map((direction, index) => (
          <View 
            key={direction.name} 
            style={[
              styles.directionItem,
              index === directionIndex && styles.directionItemActive
            ]}
          >
            <View style={[
              styles.directionDot,
              index === directionIndex && styles.directionDotActive
            ]} />
            <Text style={[
              styles.directionText,
              index === directionIndex && styles.directionTextActive
            ]}>
              {direction.name}
            </Text>
          </View>
        ))}
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

      {/* Título del ejercicio */}
      <View style={styles.titleContainer}>
        <View style={styles.titleBadge}>
          <Text style={styles.titleText}>Descanso Visual</Text>
        </View>
      </View>

      {/* Selector de ejercicios */}
      <View style={styles.exerciseSelector}>
        <TouchableOpacity 
          style={[styles.selectorButton, currentExercise === 'movimientos' && styles.selectorButtonActive]}
          onPress={() => switchExercise('movimientos')}
        >
          <Text style={[styles.selectorText, currentExercise === 'movimientos' && styles.selectorTextActive]}>
            Movimientos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.selectorButton, currentExercise === 'parpadeo' && styles.selectorButtonActive]}
          onPress={() => switchExercise('parpadeo')}
        >
          <Text style={[styles.selectorText, currentExercise === 'parpadeo' && styles.selectorTextActive]}>
            Parpadeo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Indicador de progreso para movimientos */}
      {getProgressIndicator()}

      {/* Instrucción actual */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>{getCurrentInstruction()}</Text>
        <Text style={styles.subInstructionText}>{getCurrentSubInstruction()}</Text>
      </View>

      {/* Imagen del ojo */}
      <View style={styles.eyeContainer}>
        <View style={styles.eyeImageCard}>
          <Image 
            source={getCurrentImage()}
            style={styles.eyeImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Temporizador */}
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
    marginBottom: 15,
  },
  titleBadge: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
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
  exerciseSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectorButtonActive: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  selectorText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectorTextActive: {
    color: 'white',
  },
  directionsList: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  directionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  directionItemActive: {
    // Estilo para la dirección activa
  },
  directionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  directionDotActive: {
    backgroundColor: '#4ECDC4',
  },
  directionText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  directionTextActive: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subInstructionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  eyeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  eyeImageCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  eyeImage: {
    width: 200,
    height: 150,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
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

export default DescansoVisualScreen;