// app/emotion-chart.js

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LineChart } from "react-native-chart-kit";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const colors = {
  primary:       "#8A76D2",
  secondary:     "#B39DDB",
  accent:        "#E1BEE7",
  background:    "#F3F3F8",
  surface:       "#FFFFFF",
  textPrimary:   "#5E42A6",
  textSecondary: "#757575",
};

const emotionValues = {
  very_happy: 5,
  happy: 4,
  neutral: 3,
  worried: 2,
  angry: 1,
  tired: 1.5,
};

const emotionEmojis = {
  very_happy: "😄",
  happy: "🙂",
  neutral: "😐",
  worried: "😟",
  angry: "😡",
  tired: "😴",
};

const emotionLabels = {
  very_happy: "Muy feliz",
  happy: "Feliz",
  neutral: "Neutral",
  worried: "Preocupado",
  angry: "Molesto",
  tired: "Cansado",
};

export default function EmotionChart() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("7");
  const [emotionData, setEmotionData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const data = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (13 - i));
      const formattedDate = date.toISOString().split("T")[0];
      const emotions = Object.keys(emotionValues);
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomTime = `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
      return {
        date: formattedDate,
        emotion: randomEmotion,
        time: randomTime,
      };
    });
    setEmotionData(data);
  }, []);

  const getFilteredData = () => {
    const today = new Date();
    const days = parseInt(selectedPeriod);
    const start = new Date(today);
    start.setDate(today.getDate() - (days - 1));
    return emotionData.filter(item => {
      const d = new Date(item.date);
      return d >= start && d <= today;
    });
  };

  const prepareChartData = () => {
    const grouped = {};
    getFilteredData().forEach(({ date, emotion }) => {
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(emotionValues[emotion]);
    });
    const labels = [];
    const data = [];
    Object.keys(grouped).sort().forEach(date => {
      const avg = grouped[date].reduce((a, b) => a + b) / grouped[date].length;
      const d = new Date(date);
      labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
      data.push(avg);
    });
    return { labels, data };
  };

  const chartData = prepareChartData();

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    color: (opacity = 1) => `rgba(138, 118, 210, ${opacity})`,
    strokeWidth: 3,
    decimalPlaces: 1,
  };

  const getStatistics = () => {
    const data = getFilteredData();
    if (!data.length) return null;
    const counts = {};
    let total = 0;
    data.forEach(({ emotion }) => {
      counts[emotion] = (counts[emotion] || 0) + 1;
      total += emotionValues[emotion];
    });
    const most = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    return {
      totalRecords: data.length,
      averageValue: total / data.length,
      mostCommonEmotion: most,
    };
  };

  const stats = getStatistics();
  const recentData = getFilteredData().slice(-10).reverse();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/emotion-simulator')}>
          <Ionicons name="arrow-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Historial</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.periodSelector}>
          <Text style={styles.sectionTitle}>Período</Text>
          <View style={styles.periodButtons}>
            {["7", "14", "30"].map(p => (
              <TouchableOpacity
                key={p}
                onPress={() => setSelectedPeriod(p)}
                style={[styles.periodButton, selectedPeriod === p && styles.selectedPeriodButton]}
              >
                <Text style={[styles.periodButtonText, selectedPeriod === p && styles.selectedPeriodButtonText]}>
                  {p} días
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Evolución emocional</Text>
          {chartData.labels.length > 0 ? (
            <LineChart
              data={{ labels: chartData.labels, datasets: [{ data: chartData.data }] }}
              width={SCREEN_WIDTH - 32}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              fromZero
              segments={4}
            />
          ) : (
            <Text>No hay datos</Text>
          )}
        </View>

        {stats && (
          <View style={styles.statisticsContainer}>
            <Text style={styles.sectionTitle}>Estadísticas</Text>
            <Text>Total de registros: {stats.totalRecords}</Text>
            <Text>Promedio emocional: {stats.averageValue.toFixed(1)}</Text>
            <Text>Más común: {emotionLabels[stats.mostCommonEmotion]} {emotionEmojis[stats.mostCommonEmotion]}</Text>
          </View>
        )}

        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Historial reciente</Text>
          {recentData.map((item, i) => (
            <View key={i} style={styles.historyItem}>
              <Text>{emotionEmojis[item.emotion]} {emotionLabels[item.emotion]}</Text>
              <Text>{item.time} - {new Date(item.date).toLocaleDateString()}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, paddingTop: 0, marginBottom: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
  scrollContainer: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primary, marginVertical: 12 },
  periodSelector: { marginBottom: 16 },
  periodButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  periodButton: { padding: 10, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.secondary },
  selectedPeriodButton: { backgroundColor: colors.secondary },
  periodButtonText: { color: colors.textPrimary },
  selectedPeriodButtonText: { color: colors.surface },
  chartContainer: { marginBottom: 24 },
  chart: { borderRadius: 16 },
  statisticsContainer: { padding: 16, backgroundColor: colors.surface, borderRadius: 12, marginBottom: 20 },
  historyContainer: { marginBottom: 24 },
  historyItem: { padding: 12, backgroundColor: colors.surface, marginBottom: 8, borderRadius: 8 },
});
