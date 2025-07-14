import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ResultsScreen() {
  const router = useRouter();
  const { audioData, audioUri } = useLocalSearchParams();

  const [analysis, setAnalysis] = useState({
    averageVolume: 0,
    longPauses: 0,
    consistency: 0,
    energyTrend: 'stable',
    score: 0,
    feedback: '',
    color: '#28A745',
    emoji: '🌟'
  });

  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Simular un pequeño delay para hacer más realista el análisis
    const timer = setTimeout(() => {
      generateFictionalAnalysis();
      setIsAnalyzing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const generateFictionalAnalysis = () => {
    // Usar distribución sesgada hacia resultados mejores
    // 70% probabilidad de resultado bueno-excelente, 25% promedio, 5% bajo
    const randomValue = Math.random();
    let performanceFactor;
    
    if (randomValue < 0.70) {
      // Resultado bueno-excelente (70-95%)
      performanceFactor = 0.7 + (Math.random() * 0.3);
    } else if (randomValue < 0.95) {
      // Resultado promedio (40-70%)
      performanceFactor = 0.4 + (Math.random() * 0.3);
    } else {
      // Resultado bajo (20-40%) - solo 5% de probabilidad
      performanceFactor = 0.2 + (Math.random() * 0.2);
    }
    
    // Generar pausas largas primero, correlacionadas con el rendimiento
    const maxPauses = performanceFactor > 0.7 ? 4 : (performanceFactor > 0.4 ? 6 : 8);
    const minPauses = performanceFactor > 0.7 ? 2 : (performanceFactor > 0.4 ? 3 : 5);
    const longPauses = Math.floor(Math.random() * (maxPauses - minPauses + 1)) + minPauses;
    
    // El volumen y consistencia se basan en las pausas y factor de rendimiento
    const pausesPenalty = (longPauses - 2) / 6; // 0-1, donde más pausas = mayor penalización
    
    const averageVolume = Math.floor(
      (45 + (performanceFactor * 40)) * (1 - pausesPenalty * 0.3)
    ); // 45-85, reducido por pausas
    
    const consistency = Math.floor(
      (60 + (performanceFactor * 35)) * (1 - pausesPenalty * 0.4)
    ); // 60-95, más afectado por pausas
    
    // El puntaje final se basa en todas las métricas
    const baseScore = (performanceFactor * 30) + 60; // 60-90 base
    const pausesPenaltyScore = (longPauses - 2) * 2; // Penalización por pausas (0-12)
    const volumeBonus = averageVolume > 65 ? 2 : 0; // Bonus por buen volumen
    const consistencyBonus = consistency > 80 ? 3 : 0; // Bonus por buena consistencia
    
    const score = Math.max(60, Math.min(90, 
      Math.floor(baseScore - pausesPenaltyScore + volumeBonus + consistencyBonus)
    ));
    
    // Determinar tendencia de energía basada en el volumen promedio
    let energyTrend;
    if (averageVolume > 70) {
      energyTrend = 'ascendente';
    } else if (averageVolume < 55) {
      energyTrend = 'descendente';
    } else {
      energyTrend = 'estable';
    }

    // Generar feedback basado en los valores correlacionados
    const feedback = generateFeedback(score, averageVolume, longPauses, consistency);
    
    // Determinar color y emoji basado en el puntaje
    const { color, emoji } = getScoreVisuals(score);

    setAnalysis({
      averageVolume,
      longPauses,
      consistency,
      energyTrend,
      score,
      feedback,
      color,
      emoji
    });
  };

  const generateFeedback = (score, volume, pauses, consistency) => {
    const feedbackOptions = {
      excellent: [
        "¡Excelente presentación! Tu voz transmite confianza y claridad con muy pocas interrupciones.",
        "Muy bien logrado. Mantienes un ritmo fluido y constante con pausas naturales.",
        "Presentación sobresaliente. Tu control vocal es excelente y el flujo es perfecto.",
        "¡Impresionante! Demuestras gran dominio del ritmo y la modulación vocal.",
        "Fantástico desempeño. Tu consistencia y fluidez son ejemplares."
      ],
      good: [
        "Buena presentación en general. El flujo es bueno aunque algunas pausas podrían optimizarse.",
        "Bien ejecutado. Tu voz es clara y el ritmo es apropiado con espacio para mejorar.",
        "Presentación sólida. Buen control general, considera reducir algunas pausas largas.",
        "Buen trabajo. Tu consistencia es notable, solo ajusta el timing de algunas pausas.",
        "Resultado positivo. Tienes buena base, pulir algunos detalles te llevará al siguiente nivel."
      ],
      average: [
        "Presentación promedio. Las pausas frecuentes afectan el flujo del discurso.",
        "Decente ejecución. Trabaja en reducir las interrupciones para mejor fluidez.",
        "Resultado aceptable. El exceso de pausas largas interrumpe la conexión con la audiencia.",
        "Presentación regular. Enfócate en mantener un ritmo más continuo.",
        "Tienes potencial. Con práctica puedes lograr mayor fluidez y control."
      ],
      needsWork: [
        "Hay mucho potencial para crecer. Las pausas largas y frecuentes afectan la efectividad.",
        "Necesitas más práctica, pero vas por buen camino. Reduce las interrupciones para mejor impacto.",
        "Área de mejora identificada. Trabaja en la fluidez para conectar mejor con tu audiencia.",
        "Con dedicación puedes mejorar significativamente. Enfócate en la continuidad del mensaje."
      ]
    };

    let category;
    // La categoría ahora considera tanto el score como las pausas
    if (score >= 80 && pauses <= 4) {
      category = 'excellent';
    } else if (score >= 70 && pauses <= 6) {
      category = 'good';
    } else if (score >= 60 && pauses <= 7) {
      category = 'average';
    } else {
      category = 'needsWork';
    }

    const options = feedbackOptions[category];
    return options[Math.floor(Math.random() * options.length)];
  };

  const getScoreVisuals = (score) => {
    if (score >= 85) {
      return { color: '#28A745', emoji: '🌟' };
    } else if (score >= 75) {
      return { color: '#17A2B8', emoji: '🎯' };
    } else if (score >= 65) {
      return { color: '#FFC107', emoji: '👍' };
    } else {
      return { color: '#FD7E14', emoji: '📈' };
    }
  };

  const getVolumeLabel = (volume) => {
    if (volume > 70) return 'Alto';
    if (volume > 55) return 'Medio';
    return 'Bajo';
  };

  const getPausesLabel = (pauses) => {
    if (pauses > 6) return 'Muchas';
    if (pauses > 4) return 'Algunas';
    if (pauses > 2) return 'Pocas';
    return 'Mínimas';
  };

  const getConsistencyLabel = (consistency) => {
    if (consistency > 80) return 'Excelente';
    if (consistency > 70) return 'Buena';
    if (consistency > 60) return 'Regular';
    return 'Necesita mejorar';
  };

  const getEnergyTrendLabel = (trend) => {
    const labels = {
      'ascendente': 'Ascendente 📈',
      'descendente': 'Descendente 📉',
      'estable': 'Estable ➡️'
    };
    return labels[trend] || 'Estable ➡️';
  };

  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Analizando tu presentación...</Text>
          <Text style={styles.loadingSubtext}>Esto tomará solo unos segundos</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>

          <Text style={styles.title}>Resultados del Análisis</Text>
        </View>

        <View style={[styles.scoreCard, { backgroundColor: analysis.color + '20' }]}>
          <Text style={styles.scoreEmoji}>{analysis.emoji}</Text>
          <Text style={[styles.scoreText, { color: analysis.color }]}>
            {analysis.score}/100
          </Text>
          <Text style={styles.scoreLabel}>Puntuación General</Text>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{analysis.averageVolume}%</Text>
            <Text style={styles.metricLabel}>Volumen Promedio</Text>
            <Text style={styles.metricSublabel}>{getVolumeLabel(analysis.averageVolume)}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{analysis.longPauses}</Text>
            <Text style={styles.metricLabel}>Pausas Largas</Text>
            <Text style={styles.metricSublabel}>{getPausesLabel(analysis.longPauses)}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{analysis.consistency}%</Text>
            <Text style={styles.metricLabel}>Consistencia</Text>
            <Text style={styles.metricSublabel}>{getConsistencyLabel(analysis.consistency)}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{getEnergyTrendLabel(analysis.energyTrend)}</Text>
            <Text style={styles.metricLabel}>Tendencia de Energía</Text>
          </View>
        </View>

        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>Retroalimentación</Text>
          <Text style={styles.feedbackText}>{analysis.feedback}</Text>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: analysis.color }]}
          onPress={() => router.push('/camera')}
        >
          <Text style={styles.actionButtonText}>Realizar Nuevo Análisis</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  scoreCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  metricSublabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  feedbackContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
