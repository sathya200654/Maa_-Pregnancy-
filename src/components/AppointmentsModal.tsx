import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Calendar, Clock, Plus, Trash2, X, AlertCircle, CheckCircle } from "lucide-react-native";
import { colors, fonts, shadows } from "@/constants/theme";
import { useApp } from "@/context/AppContext";

interface AppointmentsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AppointmentsModal({ visible, onClose }: AppointmentsModalProps) {
  const { reminders, upsertReminder, removeReminder, t } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("10:00 AM");
  const [error, setError] = useState("");

  const handleAddAppointment = async () => {
    if (!title.trim()) {
      setError(t("appointment_title_required", "Please enter appointment title or doctor name."));
      return;
    }
    if (!dateStr.trim()) {
      setError(t("appointment_date_required", "Please enter appointment date (YYYY-MM-DD)."));
      return;
    }

    try {
      const parsedDate = new Date(`${dateStr.trim()} ${timeStr.trim()}`);
      const remindAt = !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : new Date(dateStr.trim()).toISOString();

      await upsertReminder({
        title: title.trim(),
        remindAt: remindAt,
        repeat: "none",
      });

      setTitle("");
      setDateStr("");
      setTimeStr("10:00 AM");
      setError("");
      setIsAdding(false);
    } catch (e) {
      setError(t("invalid_date_format", "Invalid date format. Use YYYY-MM-DD."));
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      t("delete_appointment_title", "Delete Appointment"),
      t("delete_appointment_confirm", "Are you sure you want to remove this appointment?"),
      [
        { text: t("cancel", "Cancel"), style: "cancel" },
        {
          text: t("delete", "Delete"),
          style: "destructive",
          onPress: () => removeReminder(id),
        },
      ]
    );
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    return new Date(a.remind_at).getTime() - new Date(b.remind_at).getTime();
  });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Calendar size={20} color={colors.brand} />
              </View>
              <View>
                <Text style={styles.headerTitle}>{t("appointments_title", "Appointments & Visits")}</Text>
                <Text style={styles.headerSubtitle}>
                  {t("appointments_subtitle", "Manage doctor check-ups and scans")}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color="#7A869A" />
            </TouchableOpacity>
          </View>

          {/* List or Form */}
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {isAdding ? (
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>{t("add_appointment", "Schedule New Visit")}</Text>

                {error ? (
                  <View style={styles.errorBox}>
                    <AlertCircle size={15} color="#E02424" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <Text style={styles.inputLabel}>{t("appointment_title_label", "Visit Description / Doctor")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t("appointment_placeholder", "e.g., Dr. Sharma Ultrasound Scan")}
                  placeholderTextColor="#9AA5B8"
                  value={title}
                  onChangeText={(v) => {
                    setTitle(v);
                    setError("");
                  }}
                />

                <Text style={styles.inputLabel}>{t("appointment_date_label", "Date (YYYY-MM-DD)")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2026-10-15"
                  placeholderTextColor="#9AA5B8"
                  value={dateStr}
                  onChangeText={(v) => {
                    setDateStr(v);
                    setError("");
                  }}
                />

                <Text style={styles.inputLabel}>{t("appointment_time_label", "Time")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10:30 AM"
                  placeholderTextColor="#9AA5B8"
                  value={timeStr}
                  onChangeText={setTimeStr}
                />

                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setIsAdding(false);
                      setError("");
                    }}
                  >
                    <Text style={styles.cancelBtnText}>{t("cancel", "Cancel")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleAddAppointment}>
                    <CheckCircle size={16} color="#FFF" />
                    <Text style={styles.saveBtnText}>{t("save", "Save")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {sortedReminders.length === 0 && !isAdding ? (
              <View style={styles.emptyCard}>
                <Calendar size={42} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>{t("no_upcoming_visits", "No upcoming visits.")}</Text>
                <Text style={styles.emptySubtitle}>
                  {t("empty_appointments_sub", "Keep track of your prenatal care visits and ultrasounds.")}
                </Text>
                <TouchableOpacity style={styles.addPrimaryBtn} onPress={() => setIsAdding(true)}>
                  <Plus size={16} color="#FFF" />
                  <Text style={styles.addPrimaryBtnText}>{t("add_appointment", "Schedule New Visit")}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.remindersList}>
                {sortedReminders.map((item) => {
                  const date = new Date(item.remind_at);
                  const isValidDate = !isNaN(date.getTime());
                  const formattedDate = isValidDate
                    ? date.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : item.remind_at;
                  const formattedTime = isValidDate
                    ? date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
                    : "";

                  const isPast = isValidDate && date.getTime() < Date.now();

                  return (
                    <View key={item.id} style={[styles.card, isPast && styles.cardPast]}>
                      <View style={styles.cardLeft}>
                        <View style={[styles.badge, isPast && styles.badgePast]}>
                          <Calendar size={14} color={isPast ? "#9CA3AF" : colors.brand} />
                          <Text style={[styles.badgeText, isPast && styles.badgeTextPast]}>{formattedDate}</Text>
                        </View>
                        <Text style={[styles.itemTitle, isPast && styles.itemTitlePast]}>{item.title}</Text>
                        {formattedTime ? (
                          <View style={styles.timeRow}>
                            <Clock size={12} color="#8A94A6" />
                            <Text style={styles.timeText}>{formattedTime}</Text>
                          </View>
                        ) : null}
                      </View>
                      <TouchableOpacity
                        style={styles.deleteIconBtn}
                        onPress={() => item.id && handleDelete(item.id)}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {/* Bottom Action */}
          {!isAdding && sortedReminders.length > 0 ? (
            <View style={styles.footer}>
              <TouchableOpacity style={styles.addPrimaryBtn} onPress={() => setIsAdding(true)}>
                <Plus size={18} color="#FFF" />
                <Text style={styles.addPrimaryBtnText}>{t("add_appointment", "Schedule New Visit")}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "85%",
    paddingBottom: 24,
    ...shadows.default,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFE8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: "#FAFAFA",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    marginVertical: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 18,
  },
  remindersList: {
    gap: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F0F0F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardPast: {
    backgroundColor: "#F9FAFB",
    opacity: 0.75,
  },
  cardLeft: {
    flex: 1,
    gap: 5,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#E6F4FC",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  badgePast: {
    backgroundColor: "#E5E7EB",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  badgeTextPast: {
    color: "#6B7280",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 2,
  },
  itemTitlePast: {
    color: "#6B7280",
    textDecorationLine: "line-through",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  timeText: {
    fontSize: 12,
    color: "#6B7280",
  },
  deleteIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  formCard: {
    backgroundColor: "#FAFBFD",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFDFF5",
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2563EB",
    marginBottom: 12,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FDE8E8",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: "#9B1C1C",
    fontSize: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1F2937",
  },
  formButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4B5563",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: colors.brand,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#30343B",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  addPrimaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.brand,
    paddingVertical: 13,
    borderRadius: 14,
    ...shadows.default,
  },
  addPrimaryBtnText: {
    color: "#30343B",
    fontSize: 14,
    fontWeight: "800",
  },
});
