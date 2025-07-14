import { FontAwesome } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
  const router = useRouter();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef(null);
  const volumeAnim = useRef(new Animated.Value(0.8)).current;
  const volumeIntervalRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const intervalRef = useRef(null);
  const lastVolumeRef = useRef(0.5);

  useEffect(() => {
    requestAllPermissions();
  }, []);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const requestAllPermissions = async () => {
    try {
      let cameraGranted = cameraPermission?.granted;
      let microphoneGranted = microphonePermission?.granted;
      let mediaLibraryGranted = mediaLibraryPermission?.granted;

      if (!cameraGranted) {
        const { granted } = await requestCameraPermission();
        cameraGranted = granted;
      }
      if (!microphoneGranted) {
        const { granted } = await requestMicrophonePermission();
        microphoneGranted = granted;
      }
      if (!mediaLibraryGranted) {
        const { granted } = await requestMediaLibraryPermission();
        mediaLibraryGranted = granted;
      }

      if (!cameraGranted || !microphoneGranted || !mediaLibraryGranted) {
        Alert.alert(
          'Permisos Necesarios',
          'Esta aplicación necesita permisos de Cámara, Micrófono y Galería para funcionar correctamente.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      Alert.alert(
        'Error de Permisos',
        'Ocurrió un error al solicitar permisos. Por favor, revisa la configuración de tu dispositivo.',
        [{ text: 'OK' }]
      );
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current) return;

    if (!cameraPermission?.granted || !microphonePermission?.granted) {
      Alert.alert('Permisos Insuficientes', 'Por favor, concede los permisos de cámara y micrófono para grabar.');
      return;
    }

    setVideoUri(null);
    setIsRecording(true);
    setRecordingDuration(0);
    startVolumeSimulation();

    try {
      const video = await cameraRef.current.recordAsync({
        maxDuration: 60,
        quality: '720p',
        mute: false,
      });

      setVideoUri(video.uri);
      console.log('Video grabado en:', video.uri);
    } catch (error) {
      console.error('Error al grabar video:', error);
      Alert.alert(
        'Error de Grabación',
        'No se pudo grabar el video. Asegúrate de que los permisos estén habilitados y el micrófono no esté en uso por otra app.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) return;
    stopVolumeSimulation();
    cameraRef.current.stopRecording();
  };

  const saveVideoToLibrary = async () => {
    if (!videoUri) {
      Alert.alert('Advertencia', 'No hay video para guardar.');
      return;
    }
    if (!mediaLibraryPermission?.granted) {
      Alert.alert('Permiso Requerido', 'Necesitamos permiso para acceder a tu galería y guardar el video.');
      await requestMediaLibraryPermission();
      return;
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(videoUri);
      await MediaLibrary.createAlbumAsync('ExpoVideosApp', asset, false);
      Alert.alert('Éxito', 'Video guardado en la galería!');
      setVideoUri(null);
      setRecordingDuration(0);
      router.push('/results');
    } catch (error) {
      console.error('Error al guardar video:', error);
      Alert.alert('Error', 'No se pudo guardar el video en la galería.');
    }
  };

  const handleReset = () => {
    stopRecording();
    setVideoUri(null);
    setRecordingDuration(0);
    console.log('Grabación reseteada.');
  };

  const handleFinalize = async () => {
    if (isRecording) {
      await stopRecording();
      setTimeout(() => {
        if (videoUri) {
          saveVideoToLibrary();
        } else {
          Alert.alert('Advertencia', 'No hay video para finalizar o guardar.');
        }
      }, 500);
    } else if (videoUri) {
      saveVideoToLibrary();
    } else {
      Alert.alert('Advertencia', 'No hay video para finalizar o guardar.');
    }
  };

  const startVolumeSimulation = () => {
    volumeIntervalRef.current = setInterval(() => {
      let change = (Math.random() - 0.5) * 0.1;
      let nextVolume = lastVolumeRef.current + change;
      nextVolume = Math.max(0.1, Math.min(0.95, nextVolume));
      lastVolumeRef.current = nextVolume;

      Animated.timing(volumeAnim, {
        toValue: nextVolume,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }, 800);
  };

  const stopVolumeSimulation = () => {
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    volumeAnim.setValue(0);
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!cameraPermission || !microphonePermission || !mediaLibraryPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionMessage}>Cargando permisos...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted || !microphonePermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionMessage}>
          Necesitamos acceso a tu cámara y micrófono para usar esta función.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestAllPermissions}>
          <Text style={styles.permissionButtonText}>Otorgar Permisos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.permissionButton} onPress={() => router.back()}>
          <Text style={styles.permissionButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }



  return (
    <SafeAreaView style={styles.cameraScreenContainer}>
      <View style={styles.backButtonOuterContainer}>
          <TouchableOpacity style={styles.backButtonInnerContainer} onPress={() => router.back()}>
              <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <View style={styles.titleBubble}>
            <Text style={styles.titleText}>Practica de Exposicion</Text>
        </View>
        <Text style={styles.subtitleText}>
            Practica tu presentación grabándose y recibe retroalimentación
        </Text>
      </View>

      <View style={styles.cameraPreviewAndControls}>
        <CameraView
          ref={cameraRef}
          style={styles.cameraView}
          facing="front"
          mode="video"
          onCameraReady={() => console.log('Camera ready!')}
        />
      </View>

      <View style={styles.recordingStatusAndTimerContainer}>
        <View style={styles.micProgressContainer}>
          <FontAwesome name="microphone" size={24} color="#DDC7F9" />
          <View style={styles.micProgressBarBackground}>
            <Animated.View
              style={[
                styles.micProgressBarFill,
                {
                  width: volumeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['5%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
        </View>
        <Text style={styles.timerText}>{formatTime(recordingDuration)}</Text>
      </View>
              
      <View style={styles.bottomControlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={handleReset} disabled={isRecording}>
              <FontAwesome name="refresh" size={24} color={isRecording ? 'lightgray' : 'gray'} />
              <Text style={[styles.controlButtonText, isRecording && {color: 'lightgray'}]}>Resetear</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.recordMainButton, isRecording ? styles.recordMainButtonActive : {}]}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={!cameraPermission?.granted || !microphonePermission?.granted}
          >
              <View style={[
                  styles.recordMainButtonInner,
                  isRecording && styles.recordMainButtonInnerActive
              ]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleFinalize} disabled={isRecording && !videoUri}>
              <FontAwesome name="check" size={24} color={isRecording && !videoUri ? 'lightgray' : 'gray'} />
              <Text style={[styles.controlButtonText, isRecording && !videoUri && {color: 'lightgray'}]}>Finalizar</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 20,
  },
  permissionMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraScreenContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButtonOuterContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButtonInnerContainer: {
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  titleBubble: {
    backgroundColor: '#DDC7F9',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C3893',
  },
  subtitleText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginHorizontal: 40,
  },
  cameraPreviewAndControls: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraView: {
    flex: 1,
    width: '100%',
  },
  previewImageOverlay: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  previewImagePlaceholder: {
  },
  recordingStatusAndTimerContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  micProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  micProgressBarBackground: {
    width: 150,
    height: 10,
    backgroundColor: '#F3E5F5',
    borderRadius: 5,
    marginLeft: 10,
    overflow: 'hidden',
  },
  micProgressBarFill: {
    height: '100%',
    backgroundColor: '#F06292',
    borderRadius: 5,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  bottomControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
    marginBottom: 40,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  controlButtonText: {
    color: 'gray',
    fontSize: 12,
    marginTop: 5,
  },
  recordMainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  recordMainButtonActive: {
    backgroundColor: 'rgba(255, 68, 68, 0.3)',
    borderColor: '#ff4444',
  },
  recordMainButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff4444',
  },
  recordMainButtonInnerActive: {
    borderRadius: 8,
    width: 30,
    height: 30,
  },
});