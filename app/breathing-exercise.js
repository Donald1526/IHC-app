import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import { Picker } from "@react-native-picker/picker";
import { Dimensions } from "react-native";

const DURATION = 60; // segundos
const INHALE_DURATION = 4000; // ms
const EXHALE_DURATION = 4000; // ms
const DURATIONS = [1, 2, 3, 5]; // minutos disponibles
const screenWidth = Dimensions.get("window").width;

export default function BreathingExercise() {
  const [started, setStarted] = useState(false);
  const [timer, setTimer] = useState(DURATION);
  const [phase, setPhase] = useState("inhale"); // 'inhale' | 'exhale'
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(1); // minutos
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);
  const phaseTimeoutRef = useRef(null);
  const router = useRouter();
  // Audio states
  const backgroundMusic = useRef(null);
  const inhaleSound = useRef(null);
  const exhaleSound = useRef(null);

  useEffect(() => {
    if (started && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
    if (timer === 0) {
      setShowFeedback(true);
      setStarted(false);
      stopBackgroundMusic();
    }
  }, [started, timer]);

  // Animación y cambio de fase: solo depende de 'phase' y 'started'
  useEffect(() => {
    if (started && timer > 0) {
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      Animated.timing(scaleAnim, {
        toValue: phase === "inhale" ? 1.3 : 1,
        duration: phase === "inhale" ? INHALE_DURATION : EXHALE_DURATION,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();
      playPhaseSound();
      phaseTimeoutRef.current = setTimeout(
        () => {
          setPhase((prev) => (prev === "inhale" ? "exhale" : "inhale"));
        },
        phase === "inhale" ? INHALE_DURATION : EXHALE_DURATION
      );
      return () => clearTimeout(phaseTimeoutRef.current);
    }
  }, [phase, started]);

  useEffect(() => {
    if (started) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
    return () => {
      stopBackgroundMusic();
    };
  }, [started]);

  // Cambia el valor de timer cuando se selecciona una nueva duración
  useEffect(() => {
    if (!started) setTimer(selectedDuration * 60);
  }, [selectedDuration, started]);

  const animateBreathing = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: phase === "inhale" ? 1.3 : 1,
        duration: phase === "inhale" ? INHALE_DURATION : EXHALE_DURATION,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start(() => {
      setPhase((prev) => (prev === "inhale" ? "exhale" : "inhale"));
    });
  };

  // AUDIO: Música de fondo
  const playBackgroundMusic = async () => {
    try {
      if (!backgroundMusic.current) {
        backgroundMusic.current = new Audio.Sound();
        await backgroundMusic.current.loadAsync(
          require("../assets/audio/relaxing-music.mp3")
        );
        await backgroundMusic.current.setIsLoopingAsync(true);
      }
      await backgroundMusic.current.playAsync();
    } catch (e) {
      // Si no hay audio, simplemente no suena
    }
  };
  const stopBackgroundMusic = async () => {
    if (backgroundMusic.current) {
      await backgroundMusic.current.stopAsync();
      await backgroundMusic.current.unloadAsync();
      backgroundMusic.current = null;
    }
  };

  // AUDIO: Voz para inhala/exhala
  const playPhaseSound = async () => {
    try {
      if (phase === "inhale") {
        if (!inhaleSound.current) {
          inhaleSound.current = new Audio.Sound();
          await inhaleSound.current.loadAsync(
            require("../assets/audio/inhale.mp3")
          );
        }
        await inhaleSound.current.replayAsync();
      } else {
        if (!exhaleSound.current) {
          exhaleSound.current = new Audio.Sound();
          await exhaleSound.current.loadAsync(
            require("../assets/audio/exhale.mp3")
          );
        }
        await exhaleSound.current.replayAsync();
      }
    } catch (e) {
      // Si no hay audio, solo muestra el texto
    }
  };

  // Al iniciar, siempre comienza con 'inhale'
  const handleStart = () => {
    setStarted(true);
    setTimer(selectedDuration * 60);
    setPhase("inhale");
    setShowFeedback(false);
  };

  const handleCancel = () => {
    setShowCancel(true);
  };

  const confirmCancel = () => {
    setShowCancel(false);
    setStarted(false);
    setTimer(selectedDuration * 60);
    setShowFeedback(false);
    stopBackgroundMusic();
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
  };

  const cancelDialog = () => (
    <View style={styles.cancelDialog}>
      <Text style={styles.cancelText}>
        ¿Seguro que deseas salir del ejercicio?
      </Text>
      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <TouchableOpacity style={styles.cancelBtn} onPress={confirmCancel}>
          <Text style={{ color: "#fff" }}>Sí</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelBtnOutline}
          onPress={() => setShowCancel(false)}
        >
          <Text style={{ color: "#a78bfa" }}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Calcular progreso
  const progress = 1 - timer / (selectedDuration * 60);
  const elapsed = selectedDuration * 60 - timer;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace("/")}
        >
          <Ionicons name="arrow-back" size={28} color="#a78bfa" />
        </TouchableOpacity>
        <Text style={styles.title}>Ejercicio de Respiración</Text>
      </View>
      <Text style={styles.subtitle}>
        Respiración profunda para aliviar el estrés
      </Text>
      <View style={styles.centerContentAdjusted}>
        <Animated.View
          style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}
        >
          <Image
            source={require("../assets/images/meditation.png")}
            style={styles.circularImage}
          />
        </Animated.View>
        <Text style={styles.phaseText}>
          {started
            ? phase === "inhale"
              ? "Inhale..."
              : "Exhale..."
            : "Listo para comenzar"}
        </Text>
        {/* Barra de progreso y selectores/contadores ahora arriba del botón de empezar */}
        <View style={styles.bottomBarRow}>
          {/* Izquierda: selector o contador */}
          <View style={styles.leftBox}>
            {(!started && !showFeedback) || showFeedback ? (
              <Picker
                selectedValue={selectedDuration}
                style={styles.pickerOnly}
                onValueChange={(itemValue) => setSelectedDuration(itemValue)}
                mode="dropdown"
              >
                {DURATIONS.map((min) => (
                  <Picker.Item key={min} label={`${min}`} value={min} />
                ))}
              </Picker>
            ) : (
              <Text style={styles.elapsedText}>{`${Math.floor(elapsed / 60)}:${(
                elapsed % 60
              )
                .toString()
                .padStart(2, "0")}`}</Text>
            )}
          </View>
          {/* Centro: barra de progreso */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg} />
            <View
              style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
            />
          </View>
          {/* Derecha: tiempo total */}
          <View style={styles.rightBox}>
            <Text style={styles.totalText}>{`${selectedDuration}:00`}</Text>
          </View>
        </View>
        {/* Espacio fijo para botón de iniciar, feedback y cancelar */}
        <View style={styles.feedbackBtnBlock}>
          {showFeedback ? (
            <>
              <TouchableOpacity style={styles.playBtn} onPress={handleStart}>
                <Ionicons name="play" size={36} color="#fff" />
              </TouchableOpacity>
              <View style={styles.feedbackBoxImproved}>
                <Text style={styles.feedbackTextSmall}>
                  ¡Buen trabajo! Tu mente está más tranquila ahora.
                </Text>
              </View>
            </>
          ) : started ? (
            <TouchableOpacity
              style={styles.cancelBtnStyled}
              onPress={handleCancel}
            >
              <Ionicons name="close" size={36} color="#a78bfa" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.playBtn} onPress={handleStart}>
              <Ionicons name="play" size={36} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        {showCancel && cancelDialog()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
    marginTop: 0,
  },
  backBtn: {
    marginRight: 10,
    backgroundColor: "transparent",
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#a78bfa",
    textAlign: "center",
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerContentAdjusted: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#ede9fe",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#a78bfa",
  },
  circularImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#d1c4e9",
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  phaseText: {
    fontSize: 22,
    color: "#a78bfa",
    fontWeight: "600",
    marginBottom: 8,
  },
  timer: {
    fontSize: 20,
    color: "#64748b",
    marginBottom: 16,
  },
  playBtn: {
    backgroundColor: "#a78bfa",
    borderRadius: 40,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 8,
    elevation: 3,
  },
  cancelBtnBig: {
    backgroundColor: "#ede9fe",
    borderRadius: 40,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 8,
    elevation: 3,
  },
  cancelBtnStyled: {
    backgroundColor: "#fff",
    borderRadius: 40,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#ede9fe",
  },
  feedbackBoxImproved: {
    backgroundColor: "#a7f3d0",
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    alignItems: "center",
    maxWidth: 320,
    alignSelf: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  feedbackText: {
    fontSize: 18,
    color: "#047857",
    fontWeight: "bold",
    textAlign: "center",
  },
  feedbackTextSmall: {
    fontSize: 15,
    color: "#047857",
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelDialog: {
    position: "absolute",
    top: "40%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  cancelText: {
    fontSize: 16,
    color: "#1e293b",
    textAlign: "center",
  },
  cancelBtn: {
    backgroundColor: "#a78bfa",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginHorizontal: 8,
  },
  cancelBtnOutline: {
    borderColor: "#a78bfa",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    backgroundColor: "#fff",
  },
  durationPickerBoxBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: "#f3e8ff", // más suave
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 6,
    alignSelf: "center",
    shadowColor: "#a78bfa",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#d1c4e9",
    minWidth: 160,
  },
  durationLabel: {
    fontSize: 15,
    color: "#a78bfa",
    marginRight: 8,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  picker: {
    width: 90,
    height: 36,
    color: "#7c3aed",
    backgroundColor: "#ede9fe",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#a78bfa",
    fontSize: 15,
    marginLeft: 0,
    marginRight: 0,
    paddingHorizontal: 0,
  },
  bottomBarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  leftBox: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  rightBox: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerOnly: {
    width: 48,
    height: 36,
    color: "#7c3aed",
    backgroundColor: "#ede9fe",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#a78bfa",
    fontSize: 15,
    marginLeft: 0,
    marginRight: 0,
    paddingHorizontal: 0,
  },
  elapsedText: {
    fontSize: 16,
    color: "#a78bfa",
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "bold",
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "transparent",
    borderRadius: 6,
    overflow: "hidden",
    marginHorizontal: 8,
    justifyContent: "center",
  },
  progressBarBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ede9fe",
    borderRadius: 6,
  },
  progressBarFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#a78bfa",
    borderRadius: 6,
    height: 8,
  },
  feedbackBtnBlock: {
    minHeight: 90, // Altura suficiente para botón + feedback
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
});
// Para que el audio funcione, sube tus archivos mp3 a assets/audio/ con los nombres:
// relaxing-music.mp3, inhale.mp3, exhale.mp3
