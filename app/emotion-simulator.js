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
  { symbol: "😄", label: "Muy feliz",   key: "very_happy" },
  { symbol: "🙂", label: "Feliz",       key: "happy"      },
  { symbol: "😐", label: "Neutral",     key: "neutral"    },
  { symbol: "😟", label: "Preocupado",  key: "worried"    },
  { symbol: "😡", label: "Molesto",     key: "angry"      },
  { symbol: "😴", label: "Cansado",     key: "tired"      },
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
  const [resourcesVisible, setResourcesVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const router = useRouter();

  const isCritical = selected === "angry" || selected === "worried";
  const selectedEmoji = emojis.find((e) => e.key === selected) || {};

  // Función de retroceso: siempre vuelve al index.js (pantalla principal)
  const handleBack = () => {
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con botón de retroceder */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
          <Ionicons name="arrow-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Emociones</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setHelpVisible(true)}>
            <Ionicons name="help-circle-outline" size={28} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/emotion-chart")} style={{ marginLeft: 16 }}>
            <Ionicons name="stats-chart-outline" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido scrollable */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        <Text style={styles.guideText}>¿Cómo te sientes hoy?</Text>

        {/* Emociones en grid 2x3 */}
        <View style={styles.gridContainer}>
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
                <Text style={[
                  styles.emojiLabel,
                  selected === e.key && styles.selectedEmojiLabel
                ]}>
                  {e.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Feedback inmediato */}
        {selected && (
          <View style={styles.feedbackCard}>
            <View style={styles.iconWrapper}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                  <Text style={styles.feedbackEmoji}>{selectedEmoji.symbol}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.feedbackText}>{feedbackText[selected]}</Text>
            <TouchableOpacity style={styles.audioBtn}>
              <Ionicons name="play-circle" size={32} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Botones de acción */}
        {selected && !isCritical && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setConfirmVisible(true)}
          >
            <Text style={styles.actionText}>Registrar emoción</Text>
          </TouchableOpacity>
        )}

        {selected && isCritical && (
          <>
            <TouchableOpacity
              style={[styles.actionBtn, { marginBottom: 8 }]}
              onPress={() => setResourcesVisible(true)}
            >
              <Text style={styles.actionText}>Recursos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setConfirmVisible(true)}
            >
              <Text style={styles.actionText}>Registrar emoción</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Modal de ayuda */}
      <Modal visible={helpVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Para registrar tu emoción, elige la opción que mejor refleje cómo te sientes en este momento. Si tu emoción es intensa o negativa, considera leer la recomendación o acceder a los recursos antes de continuar. Luego, presiona "Registrar emoción", tu registro se guardará y podrás consultarlo luego pulsando el gráfico al costado del título.
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setHelpVisible(false)}>
              <Text style={{ color: colors.textSecondary }}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de recursos */}
      <Modal visible={resourcesVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recursos</Text>
            <ScrollView style={{ marginBottom: 12 }}>
              {resources.map((r) => (
                <TouchableOpacity key={r.label} style={styles.resourceItem}>
                  <Text style={styles.resourceText}>
                    {r.icon} {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.footerBtn}>
              <Text style={styles.footerText}>Contactar consejería</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setResourcesVisible(false)}
            >
              <Text style={{ color: colors.textSecondary }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmación */}
      <Modal visible={confirmVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar registro</Text>
            <Text style={{ textAlign: "center", marginVertical: 16 }}>
              Vas a registrar: {selectedEmoji.symbol} {selectedEmoji.label}
            </Text>
            <TouchableOpacity
              style={styles.footerBtn}
              onPress={() => {
                // Lógica para guardar el registro
                setConfirmVisible(false);
                setSelected(null);
              }}
            >
              <Text style={styles.footerText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setConfirmVisible(false)}
            >
              <Text style={{ color: colors.textSecondary }}>Cancelar</Text>
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
    paddingTop: 40,
    marginBottom: 20,
  },
  title: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  guideText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: colors.textSecondary,
  },
  gridContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emojiButton: {
    width: (SCREEN_WIDTH - 48) / 2,
    marginBottom: 16,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedEmoji: {
    backgroundColor: colors.primary,
  },
  emojiSymbol: {
    fontSize: 36,
    marginBottom: 8,
  },
  emojiLabel: {
    fontSize: 14,
    textAlign: "center",
    color: colors.textPrimary,
    fontWeight: "500",
  },
  selectedEmojiLabel: {
    color: colors.surface,
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
    marginHorizontal: 16,
    marginVertical: 8,
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
  modalText: {
    fontSize: 14,
    marginBottom: 16,
    color: colors.textPrimary,
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
