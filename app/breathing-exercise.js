import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Platform,
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
const MAIN_COLOR = "#5ECBC2";

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
  const finishSound = useRef(null);

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
      playFinishSound();
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

  // AUDIO: Sonido de finalización
  const playFinishSound = async () => {
    try {
      if (!finishSound.current) {
        finishSound.current = new Audio.Sound();
        await finishSound.current.loadAsync(
          require("../assets/audio/finish.mp3")
        );
      }
      await finishSound.current.replayAsync();
    } catch (e) {
      // Si no hay audio, simplemente no suena
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
      {/* Botón de retroceso arriba a la izquierda */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.replace("/")}
      >
        <Ionicons name="arrow-back" size={28} color={MAIN_COLOR} />
      </TouchableOpacity>
      {/* Header centrado y estilizado */}
      <View style={styles.headerBox}>
        <Text style={styles.title}>Ejercicio de Respiración</Text>
      </View>
      <Text style={styles.subtitle}>
        Respiración profunda para aliviar el estrés
      </Text>
      <View style={styles.centerContentAdjusted}>
        <Animated.View
          style={[
            styles.circle,
            {
              backgroundColor: "rgba(94,203,194,0.18)",
              borderColor: MAIN_COLOR,
            },
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Image
            source={require("../assets/images/meditation.png")}
            style={styles.circularImage}
          />
        </Animated.View>
        <Text style={styles.phaseText}>
          {started ? (
            phase === "inhale" ? (
              "Inhale..."
            ) : (
              "Exhale..."
            )
          ) : (
            <Text style={{ color: MAIN_COLOR }}>Listo para comenzar</Text>
          )}
        </Text>
        {/* Barra de progreso y selectores/contadores ahora arriba del botón de empezar */}
        <View style={styles.bottomBarRow}>
          {/* Izquierda: selector o contador */}
          <View style={styles.leftBox}>
            {(!started && !showFeedback) || showFeedback ? (
              <Picker
                selectedValue={selectedDuration}
                style={[
                  styles.pickerOnly,
                  { borderColor: MAIN_COLOR, color: MAIN_COLOR },
                ]}
                onValueChange={(itemValue) => setSelectedDuration(itemValue)}
                mode="dropdown"
              >
                {DURATIONS.map((min) => (
                  <Picker.Item key={min} label={`${min}`} value={min} />
                ))}
              </Picker>
            ) : (
              <Text
                style={[styles.elapsedText, { color: MAIN_COLOR }]}
              >{`${Math.floor(elapsed / 60)}:${(elapsed % 60)
                .toString()
                .padStart(2, "0")}`}</Text>
            )}
          </View>
          {/* Centro: barra de progreso */}
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBarBg, { backgroundColor: "#b2ece7" }]}
            />
            <View
              style={[
                styles.progressBarFill,
                { backgroundColor: MAIN_COLOR, width: `${progress * 100}%` },
              ]}
            />
          </View>
          {/* Derecha: tiempo total */}
          <View style={styles.rightBox}>
            <Text
              style={[styles.totalText, { color: MAIN_COLOR }]}
            >{`${selectedDuration}:00`}</Text>
          </View>
        </View>
        {/* Espacio fijo para botón de iniciar, feedback y cancelar */}
        <View style={styles.feedbackBtnBlock}>
          {showFeedback ? (
            <>
              <TouchableOpacity
                style={styles.playBtnFloating}
                onPress={handleStart}
              >
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
              <Ionicons name="close" size={36} color={MAIN_COLOR} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.playBtnFloating}
              onPress={handleStart}
            >
              <Ionicons name="play" size={36} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        {showCancel && cancelDialog()}
      </View>
      {/* Footer personalizado */}
      <View style={styles.footerCustom}>
        <Text style={styles.footerTextCustom}>
          IHC - Grupo “Interacción Hombre Cachimbas”
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 16,
  },
  backBtn: {
    marginRight: 10,
    backgroundColor: "transparent",
    padding: 4,
  },
  headerBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MAIN_COLOR,
    borderRadius: 25,
    marginHorizontal: 32,
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 10,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#111",
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
    backgroundColor: MAIN_COLOR,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: MAIN_COLOR,
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
    color: MAIN_COLOR,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  timer: {
    fontSize: 20,
    color: "#64748b",
    marginBottom: 16,
  },
  playBtnFloating: {
    backgroundColor: MAIN_COLOR,
    borderRadius: 40,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 8,
    elevation: 18,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    ...Platform.select({
      android: {
        elevation: 24,
      },
    }),
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
    elevation: 18,
    borderWidth: 2,
    borderColor: MAIN_COLOR,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    ...Platform.select({
      android: {
        elevation: 24,
      },
    }),
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
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 16,
  },
  feedbackTextSmall: {
    fontSize: 15,
    color: "#065f46",
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
    backgroundColor: MAIN_COLOR,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginHorizontal: 8,
  },
  cancelBtnOutline: {
    borderColor: MAIN_COLOR,
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
    color: MAIN_COLOR,
    backgroundColor: "#e0f7f5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MAIN_COLOR,
    fontSize: 15,
    marginLeft: 0,
    marginRight: 0,
    paddingHorizontal: 0,
  },
  elapsedText: {
    fontSize: 16,
    color: MAIN_COLOR,
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 16,
    color: MAIN_COLOR,
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
    backgroundColor: "#b2ece7",
    borderRadius: 6,
  },
  progressBarFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: MAIN_COLOR,
    borderRadius: 6,
    height: 8,
  },
  feedbackBtnBlock: {
    minHeight: 90,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  footerCustom: {
    width: "100%",
    backgroundColor: MAIN_COLOR,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: MAIN_COLOR,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  footerTextCustom: {
    color: "#111",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
// Para que el audio funcione, sube tus archivos mp3 a assets/audio/ con los nombres:
// relaxing-music.mp3, inhale.mp3, exhale.mp3
