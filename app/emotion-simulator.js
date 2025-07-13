// app/emotion-simulator.js

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_MARGIN = 8;
const NUM_COLUMNS = 3;
const ITEM_WIDTH = (SCREEN_WIDTH - ITEM_MARGIN * 2 * NUM_COLUMNS) / NUM_COLUMNS;

// Paleta de colores integrada
const colors = {
  primary:       "#8A76D2",
  secondary:     "#B39DDB",
  accent:        "#E1BEE7",
  background:    "#F3F3F8",
  surface:       "#FFFFFF",
  textPrimary:   "#5E42A6",
  textSecondary: "#757575",
  iconGreen:     "#00796B",
  iconOrange:    "#FFA726",
};

const emojis = [
  { symbol: "😄", label: "Muy feliz", key: "very_happy" },
  { symbol: "🙂", label: "Feliz", key: "happy" },
  { symbol: "😐", label: "Neutral", key: "neutral" },
  { symbol: "😟", label: "Preocupado", key: "worried" },
  { symbol: "😡", label: "Molesto", key: "angry" },
  { symbol: "😴", label: "Cansado", key: "tired" },
];

const feedbackText = {
  very_happy: "¡Genial! Sigue así.",
  happy:      "¡Qué bien! Disfruta tu día.",
  neutral:    "Está bien sentirse así.",
  worried:    "Respira hondo, estamos contigo.",
  angry:      "Tómate un momento para calmarte.",
  tired:      "Descansa un poco si puedes.",
};

const resources = [
  { icon: "📘", label: "Mini-guía de relajación" },
  { icon: "🎧", label: "Playlist calma" },
  { icon: "📝", label: "Artículo paso a paso" },
];

export default function EmotionSimulator() {
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const isCritical = selected === "angry" || selected === "worried";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Mi estado emocional</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Pregunta */}
        <Text style={styles.guideText}>¿Cómo te sientes hoy?</Text>

        {/* Grid de emociones */}
        <View style={styles.grid}>
          {emojis.map((e) => (
            <TouchableOpacity
              key={e.key}
              style={[
                styles.emojiButton,
                selected === e.key && styles.selectedEmoji,
              ]}
              onPress={() => setSelected(e.key)}
            >
              <Text style={styles.emojiSymbol}>{e.symbol}</Text>
              <Text style={styles.emojiLabel}>{e.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback inmediato */}
        {selected && (
          <View style={styles.feedbackCard}>
            <View style={styles.iconWrapper}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                  <Text style={styles.feedbackEmoji}>
                    {emojis.find((e) => e.key === selected).symbol}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.feedbackText}>{feedbackText[selected]}</Text>
            <TouchableOpacity style={styles.audioBtn}>
              <Ionicons name="play-circle" size={32} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Botón principal */}
        {selected && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              if (isCritical) {
                // lógica de llamada a consejería
              } else {
                setModalVisible(true);
              }
            }}
          >
            <Text style={styles.actionText}>
              {isCritical ? "Llamar a consejería" : "Ver recursos"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal de recursos */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recursos</Text>
            <ScrollView style={{ marginBottom: 12 }}>
              {resources.map((r) => (
                <TouchableOpacity key={r.label} style={styles.resourceItem}>
                  <Text style={styles.resourceText}>{r.icon} {r.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.footerBtn}>
              <Text style={styles.footerText}>Contactar consejería</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: colors.textSecondary }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  title: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  guideText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingHorizontal: ITEM_MARGIN,
  },
  emojiButton: {
    flexBasis: ITEM_WIDTH,
    margin: ITEM_MARGIN,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  selectedEmoji: {
    backgroundColor: colors.primary,
  },
  emojiSymbol: {
    fontSize: 32,
  },
  emojiLabel: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
    color: colors.textPrimary,
  },
  feedbackCard: {
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(225,190,231,0.4)",
    margin: 16,
  },
  iconWrapper: {
    marginBottom: 8,
    alignItems: "center",
  },
  outerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(138,118,210,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.iconGreen,
    borderWidth: 6,
    borderColor: colors.iconOrange,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackEmoji: {
    fontSize: 48,
    color: colors.surface,
  },
  feedbackText: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: "center",
    color: colors.textPrimary,
  },
  audioBtn: {
    marginTop: 8,
  },
  actionBtn: {
    backgroundColor: colors.secondary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    margin: 16,
  },
  actionText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    maxHeight: "80%",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: colors.primary,
  },
  resourceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  resourceText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  footerBtn: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  footerText: {
    color: colors.surface,
    fontSize: 14,
  },
  closeBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
});
