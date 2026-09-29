import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { AlertTriangle, PhoneCall } from "lucide-react-native";

import { colors, shadows } from "@/constants/theme";
import { useApp } from "@/context/AppContext";

type EmergencySupportButtonProps = {
  onPress: () => void;
  variant?: "header" | "large";
};

export function EmergencySupportButton({ onPress, variant = "header" }: EmergencySupportButtonProps) {
  const { t } = useApp();

  return (
    <Pressable
      style={[
        styles.emergencyBtnBase,
        variant === "large" ? styles.emergencyLarge : styles.emergencyHeader,
      ]}
      onPress={onPress}
      onLongPress={() => Alert.alert(t("sos_alert_title"), t("sos_alert_body"), [{ text: "OK" }])}
      delayLongPress={200}
      accessibilityRole="button"
      accessibilityLabel={t("sos_alert_title")}
      accessibilityHint={t("sos_alert_body")}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View style={styles.iconCircle}>
        <AlertTriangle size={variant === "large" ? 18 : 14} color={colors.white} />
      </View>
      <Text style={[styles.emergencyText, variant === "large" && styles.emergencyTextLarge]}>
        SOS
      </Text>
      {variant === "large" && <PhoneCall size={14} color={colors.white} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  emergencyBtnBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC2626", // High-visibility medical emergency red
    borderRadius: 20,
    ...shadows.soft,
  },
  emergencyHeader: {
    height: 36,
    paddingHorizontal: 12,
    gap: 6,
    borderWidth: 1.5,
    borderColor: "#FECACA",
  },
  emergencyLarge: {
    height: 48,
    paddingHorizontal: 20,
    gap: 10,
    borderRadius: 24,
  },
  iconCircle: {
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  emergencyTextLarge: {
    fontSize: 15,
  },
});