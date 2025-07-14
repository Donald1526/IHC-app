import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { triviaData, themeNames, getRecommendations } from '../data/triviaData';

const { width } = Dimensions.get('window');

export default function TriviaScreen() {
  const [helpVisible, setHelpVisible] = useState(false);
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState('nutricion');
  const [gameState, setGameState] = useState('playing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const themes = Object.keys(triviaData);
  const currentQuestion = triviaData[selectedTheme][currentQuestionIndex];
  const totalQuestions = triviaData[selectedTheme].length;

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowFeedback(false);
    setSelectedAnswer(null);
    setGameState('playing');
  };

  const handleSelectAnswer = (answer) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === currentQuestion.correctAnswer;
    const newAnswer = {
      correct: isCorrect,
      question: currentQuestion.text,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
    };

    setAnswers([...answers, newAnswer]);

    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowFeedback(false);
        setSelectedAnswer(null);
      } else {
        setGameState('results');
      }
    }, 2000);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowFeedback(false);
    setSelectedAnswer(null);
    setGameState('playing');
  };

  const calculateScore = () => {
    if (answers.length === 0) return 0;
    const correctAnswers = answers.filter((a) => a.correct).length;
    return Math.round((correctAnswers / answers.length) * 100);
  };

  const getButtonStyle = (option) => {
    if (!showFeedback) {
      return [styles.optionButton, styles.optionButtonDefault];
    }

    if (option === currentQuestion.correctAnswer) {
      return [styles.optionButton, styles.optionButtonCorrect];
    }

    if (selectedAnswer === option) {
      return [styles.optionButton, styles.optionButtonIncorrect];
    }

    return [styles.optionButton, styles.optionButtonDisabled];
  };

  const getButtonTextStyle = (option) => {
    if (!showFeedback) {
      return styles.optionText;
    }

    if (option === currentQuestion.correctAnswer) {
      return styles.optionTextCorrect;
    }

    if (selectedAnswer === option) {
      return styles.optionTextIncorrect;
    }

    return styles.optionTextDisabled;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trivia de Bienestar</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setHelpVisible(true)}>
            <Ionicons name="help-circle-outline" size={28} color="#1e293b" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Selector */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.themeSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themeScroll}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme}
                style={[
                  styles.themeButton,
                  selectedTheme === theme && styles.themeButtonActive,
                ]}
                onPress={() => handleThemeSelect(theme)}
              >
                <Text
                  style={[
                    styles.themeButtonText,
                    selectedTheme === theme && styles.themeButtonTextActive,
                  ]}
                >
                  {themeNames[theme]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {gameState === 'playing' && (
          <Animated.View entering={FadeIn.duration(500)} style={styles.gameContainer}>
            {/* Progress */}
            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                  Pregunta {currentQuestionIndex + 1} de {totalQuestions}
                </Text>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>{currentQuestion.difficulty}</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` },
                  ]}
                />
              </View>
            </View>

            {/* Question */}
            <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.questionContainer}>
              <Text style={styles.questionText}>{currentQuestion.text}</Text>
            </Animated.View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <Animated.View
                  key={option}
                  entering={FadeInUp.delay(300 + index * 100).duration(500)}
                >
                  <TouchableOpacity
                    style={getButtonStyle(option)}
                    onPress={() => handleSelectAnswer(option)}
                    disabled={showFeedback}
                    activeOpacity={0.8}
                  >
                    <Text style={getButtonTextStyle(option)}>{option}</Text>
                    {showFeedback && option === currentQuestion.correctAnswer && (
                      <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                    )}
                    {showFeedback && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                      <Ionicons name="close-circle" size={24} color="#ef4444" />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            {/* Feedback */}
            {showFeedback && (
              <Animated.View entering={FadeInDown.duration(500)} style={styles.feedbackContainer}>
                <Text style={styles.feedbackTitle}>
                  {selectedAnswer === currentQuestion.correctAnswer ? '¡Correcto!' : 'Incorrecto'}
                </Text>
                <Text style={styles.feedbackText}>{currentQuestion.explanation}</Text>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {gameState === 'results' && (
          <Animated.View entering={FadeIn.duration(600)} style={styles.resultsContainer}>
            <View style={styles.scoreContainer}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreText}>{calculateScore()}%</Text>
              </View>
              {calculateScore() >= 70 && (
                <Ionicons name="trophy" size={40} color="#f59e0b" style={styles.trophy} />
              )}
            </View>

            <Text style={styles.scoreDescription}>
              {answers.filter((a) => a.correct).length} de {answers.length} respuestas correctas
            </Text>

            <Text style={styles.scoreMessage}>
              {calculateScore() >= 80
                ? '¡Excelente trabajo! Tienes un gran conocimiento sobre este tema.'
                : calculateScore() >= 60
                ? '¡Buen trabajo! Tienes un conocimiento sólido, pero hay espacio para mejorar.'
                : 'Hay oportunidades para aprender más sobre este tema.'}
            </Text>

            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>Recomendaciones personalizadas</Text>
              {getRecommendations(selectedTheme, calculateScore()).map((rec, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInUp.delay(index * 100).duration(500)}
                  style={styles.recommendationItem}
                >
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </Animated.View>
              ))}
            </View>

            <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
              <Ionicons name="refresh" size={20} color="#ffffff" />
              <Text style={styles.restartButtonText}>Jugar de nuevo</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      {/* Modal de ayuda */}
      {helpVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Aquí encontrarás información de ayuda sobre esta pantalla. Puedes personalizar este texto más adelante.
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setHelpVisible(false)}>
              <Text style={{ color: '#1e293b' }}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  headerIcons: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  themeSelector: {
    paddingVertical: 20,
  },
  themeScroll: {
    flexDirection: 'row',
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 20,
  },
  themeButtonActive: {
    backgroundColor: '#5ECBC2',
  },
  themeButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  themeButtonTextActive: {
    color: '#ffffff',
  },
  gameContainer: {
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
  },
  difficultyBadge: {
    backgroundColor: '#E0F7F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    color: '#5ECBC2',
    fontWeight: 'bold',
    fontSize: 13,
  },
  progressBar: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  progressFill: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#5ECBC2',
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  optionButtonDisabled: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  optionText: {
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
  },
  optionTextCorrect: {
    fontSize: 16,
    color: '#065f46',
    flex: 1,
  },
  optionTextIncorrect: {
    fontSize: 16,
    color: '#991b1b',
    flex: 1,
  },
  optionTextDisabled: {
    fontSize: 16,
    color: '#9ca3af',
    flex: 1,
  },
  feedbackContainer: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  resultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#C0E0ED',
    borderWidth: 4,
    borderColor: '#5CAFD6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5CAFD6',
  },
  trophy: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  scoreDescription: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  scoreMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  recommendationsContainer: {
    width: '100%',
    backgroundColor: '#D7EFED',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    color: '#6366f1',
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
    lineHeight: 20,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5ECBC2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  restartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  closeBtn: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resultCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#5CAFD6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F7F5',
  },
  resultCircleText: {
    fontSize: 32,
    color: '#5ECBC2',
    fontWeight: 'bold',
  },
  resultButton: {
    backgroundColor: '#5ECBC2',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    elevation: 2,
  },
  resultButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultButtonSecondary: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    elevation: 2,
    borderWidth: 2,
    borderColor: '#5ECBC2',
  },
  resultButtonSecondaryText: {
    color: '#5ECBC2',
    fontSize: 16,
    fontWeight: 'bold',
  },
});