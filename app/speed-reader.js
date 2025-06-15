import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { readingTexts } from '../data/readingTexts';

const { width } = Dimensions.get('window');

export default function SpeedReaderScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('reading');
  const [selectedTextIndex, setSelectedTextIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordsPerMinute, setWordsPerMinute] = useState(150);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showSettings, setShowSettings] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const timerRef = useRef(null);
  const wordTimerRef = useRef(null);
  const startTimeRef = useRef(null);

  const selectedText = readingTexts[selectedTextIndex];
  const words = selectedText.content.split(' ');
  const totalWords = words.length;

  useEffect(() => {
    if (activeTab === 'reading') {
      if (isPlaying) {
        startReading();
      } else {
        stopReading();
      }
    }

    return () => {
      if (wordTimerRef.current) clearTimeout(wordTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, wordsPerMinute, activeTab]);

  useEffect(() => {
    resetReader();
  }, [selectedTextIndex]);

  const startReading = () => {
    if (currentWordIndex >= totalWords) {
      setCurrentWordIndex(0);
    }

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);
    }

    const msPerWord = 60000 / wordsPerMinute;

    const showNextWord = () => {
      setCurrentWordIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex >= totalWords) {
          stopReading();
          setActiveTab('questions');
          return prevIndex;
        }

        wordTimerRef.current = setTimeout(showNextWord, msPerWord);
        return nextIndex;
      });
    };

    wordTimerRef.current = setTimeout(showNextWord, msPerWord);
  };

  const stopReading = () => {
    if (wordTimerRef.current) clearTimeout(wordTimerRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
  };

  const resetReader = () => {
    stopReading();
    setCurrentWordIndex(0);
    setIsPlaying(false);
    setElapsedTime(0);
    startTimeRef.current = null;
    setAnswers([]);
    setShowFeedback(false);
    setShowResults(false);
    setActiveTab('reading');
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    resetReader();
  };

  const handleAnswerQuestion = (questionIndex, isCorrect) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = isCorrect;
    setAnswers(newAnswers);

    setShowFeedback(true);
    setFeedbackMessage(isCorrect ? '¡Correcto!' : 'Incorrecto. Intenta de nuevo.');

    setTimeout(() => {
      setShowFeedback(false);

      if (newAnswers.filter((a) => a !== undefined).length === selectedText.questions.length) {
        setShowResults(true);
      }
    }, 1500);
  };

  const handleSelectText = (index) => {
    setSelectedTextIndex(index);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateReadingProgress = () => {
    return (currentWordIndex / totalWords) * 100;
  };

  const calculateComprehensionScore = () => {
    if (answers.length === 0) return 0;
    const correctAnswers = answers.filter((a) => a).length;
    return Math.round((correctAnswers / selectedText.questions.length) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Entrenador de Lectura</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reading' && styles.tabActive]}
          onPress={() => setActiveTab('reading')}
        >
          <Text style={[styles.tabText, activeTab === 'reading' && styles.tabTextActive]}>
            Lectura
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'questions' && styles.tabActive]}
          onPress={() => setActiveTab('questions')}
        >
          <Text style={[styles.tabText, activeTab === 'questions' && styles.tabTextActive]}>
            Comprensión
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'reading' && (
          <Animated.View entering={FadeIn.duration(500)} style={styles.readingContainer}>
            {/* Settings */}
            <View style={styles.settingsContainer}>
              <TouchableOpacity
                style={styles.settingsHeader}
                onPress={() => setShowSettings(!showSettings)}
              >
                <Text style={styles.settingsTitle}>Configuración</Text>
                <Ionicons
                  name={showSettings ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>

              {showSettings && (
                <View style={styles.settingsContent}>
                  <Text style={styles.sectionTitle}>Selecciona un texto</Text>
                  {readingTexts.map((text, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.textOption,
                        selectedTextIndex === index && styles.textOptionActive,
                      ]}
                      onPress={() => handleSelectText(index)}
                    >
                      <Text
                        style={[
                          styles.textOptionTitle,
                          selectedTextIndex === index && styles.textOptionTitleActive,
                        ]}
                      >
                        {text.title}
                      </Text>
                      <Text style={styles.textOptionMeta}>
                        {text.content.split(' ').length} palabras • {text.difficulty}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  <View style={styles.speedContainer}>
                    <View style={styles.speedHeader}>
                      <Text style={styles.sectionTitle}>Velocidad de lectura</Text>
                      <View style={styles.speedBadge}>
                        <Text style={styles.speedText}>{wordsPerMinute} PPM</Text>
                      </View>
                    </View>
                    <Slider
                      style={styles.slider}
                      minimumValue={100}
                      maximumValue={600}
                      step={10}
                      value={wordsPerMinute}
                      onValueChange={setWordsPerMinute}
                      minimumTrackTintColor="#6366f1"
                      maximumTrackTintColor="#e2e8f0"
                      thumbStyle={styles.sliderThumb}
                    />
                    <View style={styles.speedLabels}>
                      <Text style={styles.speedLabel}>Lento</Text>
                      <Text style={styles.speedLabel}>Moderado</Text>
                      <Text style={styles.speedLabel}>Rápido</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Reading Area */}
            <View style={styles.readingArea}>
              <View style={styles.readingInfo}>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={16} color="#64748b" />
                  <Text style={styles.infoText}>{formatTime(elapsedTime)}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="settings-outline" size={16} color="#64748b" />
                  <Text style={styles.infoText}>{wordsPerMinute} PPM</Text>
                </View>
              </View>

              <View style={styles.wordDisplay}>
                <Animated.Text key={currentWordIndex} entering={FadeIn.duration(200)} style={styles.currentWord}>
                  {words[currentWordIndex]}
                </Animated.Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${calculateReadingProgress()}%` },
                    ]}
                  />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel}>Inicio</Text>
                  <Text style={styles.progressLabel}>{Math.round(calculateReadingProgress())}%</Text>
                  <Text style={styles.progressLabel}>Fin</Text>
                </View>
              </View>

              <View style={styles.controls}>
                <TouchableOpacity style={styles.controlButton} onPress={handleReset}>
                  <Ionicons name="refresh" size={24} color="#64748b" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={28}
                    color="#ffffff"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setActiveTab('questions')}
                >
                  <Ionicons name="checkmark-circle-outline" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}

        {activeTab === 'questions' && (
          <Animated.View entering={FadeIn.duration(500)} style={styles.questionsContainer}>
            {!showResults ? (
              <View>
                <View style={styles.questionsHeader}>
                  <Text style={styles.questionsTitle}>Comprueba tu comprensión</Text>
                  <Text style={styles.questionsSubtitle}>
                    Responde las siguientes preguntas sobre el texto que acabas de leer
                  </Text>
                </View>

                <View style={styles.questionsList}>
                  {selectedText.questions.map((question, qIndex) => (
                    <View key={qIndex} style={styles.questionItem}>
                      <Text style={styles.questionText}>{question.text}</Text>

                      <View style={styles.optionsContainer}>
                        {question.options.map((option, oIndex) => (
                          <TouchableOpacity
                            key={oIndex}
                            style={[
                              styles.optionButton,
                              answers[qIndex] !== undefined && oIndex === question.correctOption
                                ? styles.optionButtonCorrect
                                : answers[qIndex] !== undefined && oIndex === question.userAnswer
                                ? styles.optionButtonIncorrect
                                : styles.optionButtonDefault,
                            ]}
                            onPress={() => {
                              if (answers[qIndex] === undefined) {
                                handleAnswerQuestion(qIndex, oIndex === question.correctOption);
                                question.userAnswer = oIndex;
                              }
                            }}
                            disabled={answers[qIndex] !== undefined}
                          >
                            <Text
                              style={[
                                styles.optionText,
                                answers[qIndex] !== undefined && oIndex === question.correctOption
                                  ? styles.optionTextCorrect
                                  : answers[qIndex] !== undefined && oIndex === question.userAnswer
                                  ? styles.optionTextIncorrect
                                  : styles.optionTextDefault,
                              ]}
                            >
                              {option}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>

                {showFeedback && (
                  <Animated.View entering={FadeIn.duration(300)} style={styles.feedbackContainer}>
                    <Text style={styles.feedbackText}>{feedbackMessage}</Text>
                  </Animated.View>
                )}
              </View>
            ) : (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>Resultados del entrenamiento</Text>
                <Text style={styles.resultsSubtitle}>
                  Has completado el entrenamiento de lectura rápida
                </Text>

                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <Ionicons name="time-outline" size={20} color="#6366f1" />
                      <Text style={styles.statTitle}>Velocidad de lectura</Text>
                    </View>
                    <Text style={styles.statValue}>{wordsPerMinute} PPM</Text>
                    <Text style={styles.statDescription}>
                      {wordsPerMinute < 200
                        ? 'Velocidad básica. Con práctica, puedes mejorar significativamente.'
                        : wordsPerMinute < 400
                        ? 'Buena velocidad. Estás por encima del promedio.'
                        : '¡Excelente velocidad! Estás en el rango de lectores avanzados.'}
                    </Text>
                  </View>

                  <View style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
                      <Text style={styles.statTitle}>Comprensión</Text>
                    </View>
                    <Text style={styles.statValue}>{calculateComprehensionScore()}%</Text>
                    <Text style={styles.statDescription}>
                      {calculateComprehensionScore() < 60
                        ? 'Intenta reducir la velocidad para mejorar la comprensión.'
                        : calculateComprehensionScore() < 80
                        ? 'Buena comprensión. Sigue practicando para mejorar.'
                        : '¡Excelente comprensión! Mantuviste el enfoque mientras leías rápido.'}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.restartButton} onPress={handleReset}>
                  <Ionicons name="refresh" size={20} color="#ffffff" />
                  <Text style={styles.restartButtonText}>Nuevo entrenamiento</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  readingContainer: {
    paddingVertical: 20,
  },
  settingsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  settingsContent: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  textOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  textOptionActive: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f9ff',
  },
  textOptionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  textOptionTitleActive: {
    color: '#6366f1',
  },
  textOptionMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  speedContainer: {
    marginTop: 20,
  },
  speedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  speedBadge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  speedText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#6366f1',
  },
  speedLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  speedLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  readingArea: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  readingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  wordDisplay: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 20,
  },
  currentWord: {
    fontSize: 32,
    fontWeight: '500',
    color: '#1e293b',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionsContainer: {
    paddingVertical: 20,
  },
  questionsHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  questionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  questionsSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  questionsList: {
    gap: 24,
  },
  questionItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionButtonDefault: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  optionButtonCorrect: {
    backgroundColor: '#dcfce7',
    borderColor: '#10b981',
  },
  optionButtonIncorrect: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  optionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  optionTextDefault: {
    color: '#1e293b',
  },
  optionTextCorrect: {
    color: '#065f46',
  },
  optionTextIncorrect: {
    color: '#991b1b',
  },
  feedbackContainer: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    marginTop: 20,
  },
  feedbackText: {
    fontSize: 14,
    color: '#1e293b',
    textAlign: 'center',
  },
  resultsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  statDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  restartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
});