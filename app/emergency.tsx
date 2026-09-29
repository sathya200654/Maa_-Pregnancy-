import { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  AlertCircle,
  AlertTriangle,
  Ambulance,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  ShieldAlert,
  Stethoscope,
  UserCheck,
} from "lucide-react-native";

import { colors, shadows, radius, spacing } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { pregnancyWeek } from "@/services/date";

const { width } = Dimensions.get("window");

const redFlagSymptoms = [
  {
    id: "bleeding",
    title: "Heavy Vaginal Bleeding",
    urgency: "CRITICAL",
    icon: "🩸",
    desc: "Bright red bleeding soaking a pad within 1-2 hours or accompanied by severe cramping.",
    action: "Call 108 immediately. Lie on your left side and do not insert anything vaginally.",
  },
  {
    id: "preeclampsia",
    title: "Severe Headache & Face Swelling",
    urgency: "HIGH",
    icon: "⚡",
    desc: "Persistent throbbing headache that won't go away, sudden blurred vision, or swelling in face and hands (signs of preeclampsia/high BP).",
    action: "Sit quietly, check blood pressure if possible, and contact your doctor or hospital immediately.",
  },
  {
    id: "contractions",
    title: "Regular Painful Contractions",
    urgency: "HIGH",
    icon: "⏱️",
    desc: "Contractions coming every 3-5 minutes, lasting 45-60 seconds, or fluid leaking/water breaking.",
    action: "Time the contractions. If <37 weeks (preterm) or water broke with greenish tint, go to hospital now.",
  },
  {
    id: "movement",
    title: "Decreased or Absent Baby Movement",
    urgency: "CRITICAL",
    icon: "👶",
    desc: "Noticeable drop in kicks or less than 10 movements over a 2-hour window in 3rd trimester.",
    action: "Drink cold water, lie on your left side, and count kicks. If no movement within 30 mins, seek urgent CTG check.",
  },
  {
    id: "fever",
    title: "High Fever or Chills (>38.5°C / 101.3°F)",
    urgency: "MODERATE",
    icon: "🌡️",
    desc: "Fever accompanied by abdominal tenderness, foul-smelling discharge, or burning urination.",
    action: "Hydrate immediately. Do not take self-prescribed medications without clinician guidance.",
  },
];

export default function EmergencyScreen() {
  const { profile } = useApp();
  const [activeTab, setActiveTab] = useState<"actions" | "symptoms">("actions");
  const [expandedSymptom, setExpandedSymptom] = useState<string | null>("bleeding");

  const currentWeek = profile?.due_date ? pregnancyWeek(profile.due_date) : null;

  const callNumber = useCallback(async (phoneNumber: string) => {
    const sanitized = phoneNumber.replace(/\s+/g, "");
    const telUrl = `tel:${sanitized}`;
    if (Platform.OS === "web") {
      window.open(telUrl, "_self");
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(telUrl);
      if (!canOpen) {
        Alert.alert("Call Unavailable", `Please dial ${sanitized} directly on your phone keypad.`);
        return;
      }
      await Linking.openURL(telUrl);
    } catch {
      Alert.alert("Dialer Error", `Could not launch phone dialer for ${sanitized}.`);
    }
  }, []);

  // Format concise, high-priority emergency message
  const getSOSMessage = () => {
    return [
      "🚨 *URGENT MATERNAL MEDICAL SOS ALERT* 🚨",
      "",
      `👤 *Patient Name:* ${profile?.name || "Mother"}`,
      currentWeek ? `🤰 *Pregnancy Stage:* Week ${currentWeek}` : "",
      profile?.blood_type ? `🩸 *Blood Group:* ${profile.blood_type}` : "",
      profile?.doctor_phone ? `🩺 *Doctor:* ${profile.doctor_name || "Doctor"} (${profile.doctor_phone})` : "",
      "",
      "⚠️ *EMERGENCY: Immediate medical assistance required!*",
      "⚠️ *Please call or reach out immediately!*",
    ]
      .filter(Boolean)
      .join("\n");
  };

  // 1. WhatsApp SOS Action
  const sendWhatsAppSOS = async () => {
    const message = getSOSMessage();
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/?text=${encoded}`;

    if (Platform.OS === "web") {
      window.open(waUrl, "_blank");
      return;
    }

    try {
      const nativeWa = `whatsapp://send?text=${encoded}`;
      const canOpen = await Linking.canOpenURL(nativeWa);
      if (canOpen) {
        await Linking.openURL(nativeWa);
      } else {
        await Linking.openURL(waUrl);
      }
    } catch {
      await Linking.openURL(waUrl);
    }
  };

  // 2. SMS SOS Action
  const sendSMSSOS = async () => {
    const message = getSOSMessage();
    const encoded = encodeURIComponent(message);
    const recipient = profile?.doctor_phone ? profile.doctor_phone.replace(/\s+/g, "") : "";
    const smsUrl = Platform.OS === "ios" ? `sms:${recipient}&body=${encoded}` : `sms:${recipient}?body=${encoded}`;

    if (Platform.OS === "web") {
      window.open(smsUrl, "_self");
      return;
    }

    try {
      await Linking.openURL(smsUrl);
    } catch {
      Alert.alert("SMS Unavailable", "Could not launch SMS messaging app.");
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <ArrowLeft size={20} color={colors.charcoal} />
        </Pressable>

        <View style={styles.headerTitles}>
          <View style={styles.emergencyTag}>
            <View style={styles.pulsingDot} />
            <Text style={styles.emergencyTagText}>EMERGENCY SOS HUB</Text>
          </View>
          <Text style={styles.headerSub}>Instant Hotlines & Medical SOS Dispatch</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Segment Switcher */}
        <View style={styles.segmentRow}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === "actions" && styles.segmentBtnActive]}
            onPress={() => setActiveTab("actions")}
            activeOpacity={0.8}
          >
            <ShieldAlert size={16} color={activeTab === "actions" ? colors.white : colors.textSecondary} />
            <Text style={[styles.segmentBtnText, activeTab === "actions" && styles.segmentBtnTextActive]}>
              Hotlines & SOS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === "symptoms" && styles.segmentBtnActive]}
            onPress={() => setActiveTab("symptoms")}
            activeOpacity={0.8}
          >
            <AlertCircle size={16} color={activeTab === "symptoms" ? colors.white : colors.textSecondary} />
            <Text style={[styles.segmentBtnText, activeTab === "symptoms" && styles.segmentBtnTextActive]}>
              Red Flags & First Aid
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: EMERGENCY ACTIONS & SOS */}
        {activeTab === "actions" && (
          <>
            {/* Primary Ambulance 108 Banner */}
            <TouchableOpacity
              style={styles.ambulanceCard}
              onPress={() => callNumber("108")}
              activeOpacity={0.85}
            >
              <View style={styles.ambulanceCardLeft}>
                <View style={styles.ambulanceIconBg}>
                  <Ambulance size={32} color={colors.white} />
                </View>
                <View>
                  <Text style={styles.ambulanceTitle}>CALL 108 AMBULANCE</Text>
                  <Text style={styles.ambulanceSub}>National Emergency Medical Dispatch • Free 24/7</Text>
                </View>
              </View>
              <View style={styles.callCircleBtn}>
                <PhoneCall size={20} color="#DC2626" />
              </View>
            </TouchableOpacity>

            {/* Registered Doctor Card (If exists) */}
            {profile?.doctor_phone ? (
              <TouchableOpacity
                style={styles.doctorCard}
                onPress={() => callNumber(profile.doctor_phone!)}
                activeOpacity={0.85}
              >
                <View style={styles.doctorCardLeft}>
                  <View style={styles.doctorIconBg}>
                    <Stethoscope size={24} color={colors.white} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.doctorCardTitle}>
                      Call Doctor: {profile.doctor_name || "Primary Gynecologist"}
                    </Text>
                    <Text style={styles.doctorCardSub}>{profile.doctor_phone} • Direct Clinician Hotline</Text>
                  </View>
                </View>
                <View style={styles.doctorCallBtn}>
                  <PhoneCall size={18} color={colors.skyBlueDeep} />
                </View>
              </TouchableOpacity>
            ) : null}

            {/* Grid for Secondary Hotlines */}
            <View style={styles.hotlineGrid}>
              <TouchableOpacity
                style={[styles.hotlineGridItem, styles.jananiItem]}
                onPress={() => callNumber("102")}
                activeOpacity={0.8}
              >
                <View style={styles.hotlineTop}>
                  <Text style={styles.hotlineNumber}>102</Text>
                  <PhoneCall size={16} color="#BE185D" />
                </View>
                <Text style={styles.hotlineLabel}>Maternal & Infant Line</Text>
                <Text style={styles.hotlineDesc}>Janani Shishu Suraksha</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.hotlineGridItem, styles.policeItem]}
                onPress={() => callNumber("112")}
                activeOpacity={0.8}
              >
                <View style={styles.hotlineTop}>
                  <Text style={styles.hotlineNumber}>112</Text>
                  <PhoneCall size={16} color="#1E40AF" />
                </View>
                <Text style={styles.hotlineLabel}>National Emergency</Text>
                <Text style={styles.hotlineDesc}>All-India Unified Response</Text>
              </TouchableOpacity>
            </View>

            {/* MATERNAL SOS ALERT DISPATCH CARD */}
            <View style={styles.sosShareCard}>
              <View style={styles.sosLocationHeader}>
                <ShieldAlert size={20} color={colors.brand} />
                <Text style={styles.sosLocationTitle}>Instant SOS Alert Dispatch</Text>
              </View>

              <Text style={styles.sosExplanation}>
                1-Tap dispatch of your medical details (Name, Pregnancy Week, Blood Group, Doctor) to family, caregivers, or emergency contacts:
              </Text>

              {/* Action Buttons for WhatsApp and SMS */}
              <View style={styles.shareActionButtonsRow}>
                <TouchableOpacity
                  style={styles.whatsAppButton}
                  onPress={sendWhatsAppSOS}
                  activeOpacity={0.85}
                >
                  <MessageCircle size={20} color={colors.white} />
                  <Text style={styles.whatsAppButtonText}>Send SOS via WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.smsButton}
                  onPress={sendSMSSOS}
                  activeOpacity={0.85}
                >
                  <MessageSquare size={18} color={colors.white} />
                  <Text style={styles.smsButtonText}>Send SOS via SMS</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Medical Emergency Passport Card */}
            <View style={styles.medicalIdCard}>
              <View style={styles.medicalIdHeader}>
                <UserCheck size={18} color={colors.skyBlueDeep} />
                <Text style={styles.medicalIdTitle}>Maa Emergency Medical ID</Text>
              </View>
              <View style={styles.medicalIdDivider} />

              <View style={styles.medicalIdRow}>
                <View style={styles.medicalIdCol}>
                  <Text style={styles.medicalIdLabel}>MOTHER'S NAME</Text>
                  <Text style={styles.medicalIdVal}>{profile?.name || "Registered Patient"}</Text>
                </View>
                <View style={styles.medicalIdCol}>
                  <Text style={styles.medicalIdLabel}>PREGNANCY STAGE</Text>
                  <Text style={styles.medicalIdVal}>{currentWeek ? `Week ${currentWeek}` : "Active"}</Text>
                </View>
              </View>

              <View style={styles.medicalIdRow}>
                <View style={styles.medicalIdCol}>
                  <Text style={styles.medicalIdLabel}>BLOOD GROUP</Text>
                  <Text style={[styles.medicalIdVal, { color: colors.brand, fontWeight: "800" }]}>
                    {profile?.blood_type || "Not specified"}
                  </Text>
                </View>
                <View style={styles.medicalIdCol}>
                  <Text style={styles.medicalIdLabel}>EMERGENCY DOCTOR</Text>
                  <Text style={styles.medicalIdVal}>{profile?.doctor_name || "Local Clinician"}</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* TAB 2: URGENT RED FLAGS & FIRST AID */}
        {activeTab === "symptoms" && (
          <View style={styles.symptomsSection}>
            <View style={styles.redFlagAlertBanner}>
              <AlertTriangle size={20} color="#DC2626" />
              <Text style={styles.redFlagAlertText}>
                If you experience any of these symptoms, call <Text style={{ fontWeight: "900" }}>108</Text> or go to the nearest maternity ER immediately.
              </Text>
            </View>

            {redFlagSymptoms.map((symptom) => {
              const isExpanded = expandedSymptom === symptom.id;
              return (
                <TouchableOpacity
                  key={symptom.id}
                  style={[styles.symptomCard, isExpanded && styles.symptomCardExpanded]}
                  onPress={() => setExpandedSymptom(isExpanded ? null : symptom.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.symptomHeaderRow}>
                    <Text style={styles.symptomEmoji}>{symptom.icon}</Text>
                    <View style={styles.symptomTitleWrap}>
                      <Text style={styles.symptomTitle}>{symptom.title}</Text>
                      <View
                        style={[
                          styles.urgencyPill,
                          symptom.urgency === "CRITICAL"
                            ? styles.urgencyCritical
                            : styles.urgencyHigh,
                        ]}
                      >
                        <Text style={styles.urgencyText}>{symptom.urgency}</Text>
                      </View>
                    </View>
                    {isExpanded ? (
                      <ChevronUp size={18} color={colors.charcoal} />
                    ) : (
                      <ChevronDown size={18} color={colors.textMuted} />
                    )}
                  </View>

                  {isExpanded && (
                    <View style={styles.symptomExpandedBody}>
                      <Text style={styles.symptomDesc}>{symptom.desc}</Text>
                      <View style={styles.symptomActionBox}>
                        <CheckCircle2 size={16} color="#059669" style={{ marginTop: 2 }} />
                        <Text style={styles.symptomActionText}>
                          <Text style={{ fontWeight: "700" }}>Immediate Action: </Text>
                          {symptom.action}
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* First Aid Calming Guidance */}
            <View style={styles.calmGuidanceCard}>
              <Heart size={20} color={colors.brand} />
              <View style={{ flex: 1 }}>
                <Text style={styles.calmGuidanceTitle}>First-Aid Calming Position</Text>
                <Text style={styles.calmGuidanceText}>
                  • Lie on your <Text style={{ fontWeight: "700" }}>Left Side</Text> with a pillow between knees to maximize blood and oxygen flow to the baby.
                  {"\n"}• Take slow, steady breaths (Inhale for 4 seconds, Exhale for 6 seconds).
                  {"\n"}• Stay calm; medical assistance is on the way.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgFaint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    ...shadows.sm,
  },
  headerTitles: {
    flex: 1,
  },
  emergencyTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DC2626",
  },
  emergencyTagText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#DC2626",
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl * 2,
  },
  segmentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.skyBlueSoft,
    borderColor: colors.skyBlueBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 3,
    marginBottom: spacing.lg,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: radius.sm,
  },
  segmentBtnActive: {
    backgroundColor: colors.skyBlueDeep,
    ...shadows.sm,
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  segmentBtnTextActive: {
    color: colors.white,
  },
  ambulanceCard: {
    backgroundColor: "#DC2626",
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  ambulanceCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  ambulanceIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  ambulanceTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  ambulanceSub: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 11,
    marginTop: 3,
    maxWidth: width * 0.55,
  },
  callCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.default,
  },
  doctorCard: {
    backgroundColor: colors.white,
    borderColor: colors.skyBlueBorder,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  doctorCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  doctorIconBg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.skyBlueDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  doctorCardTitle: {
    color: colors.charcoal,
    fontSize: 14,
    fontWeight: "800",
  },
  doctorCardSub: {
    color: colors.skyBlueDeep,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  doctorCallBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.skyBlueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  hotlineGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  hotlineGridItem: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    ...shadows.sm,
  },
  jananiItem: {
    borderColor: "#FBCFE8",
  },
  policeItem: {
    borderColor: "#BFDBFE",
  },
  hotlineTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  hotlineNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.charcoal,
  },
  hotlineLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.charcoal,
  },
  hotlineDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sosShareCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderColor: colors.border,
    borderWidth: 1,
    marginBottom: spacing.md,
    ...shadows.default,
  },
  sosLocationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  sosLocationTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.charcoal,
  },
  sosExplanation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  shareActionButtonsRow: {
    gap: 10,
  },
  whatsAppButton: {
    backgroundColor: "#25D366", // WhatsApp Green
    borderRadius: radius.md,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...shadows.sm,
  },
  whatsAppButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  smsButton: {
    backgroundColor: colors.skyBlueDeep,
    borderRadius: radius.md,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...shadows.sm,
  },
  smsButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  medicalIdCard: {
    backgroundColor: colors.skyBlueSoft,
    borderColor: colors.skyBlueBorder,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  medicalIdHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  medicalIdTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.skyBlueDeep,
  },
  medicalIdDivider: {
    height: 1,
    backgroundColor: colors.skyBlueBorder,
    marginVertical: spacing.md,
  },
  medicalIdRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  medicalIdCol: {
    flex: 1,
  },
  medicalIdLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  medicalIdVal: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.charcoal,
    marginTop: 2,
  },
  symptomsSection: {
    gap: spacing.md,
  },
  redFlagAlertBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  redFlagAlertText: {
    flex: 1,
    fontSize: 12,
    color: "#991B1B",
    lineHeight: 17,
  },
  symptomCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderColor: colors.border,
    borderWidth: 1,
    ...shadows.sm,
  },
  symptomCardExpanded: {
    borderColor: "#FDA4AF",
  },
  symptomHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  symptomEmoji: {
    fontSize: 22,
    marginRight: 10,
  },
  symptomTitleWrap: {
    flex: 1,
  },
  symptomTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.charcoal,
  },
  urgencyPill: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  urgencyCritical: {
    backgroundColor: "#FEE2E2",
  },
  urgencyHigh: {
    backgroundColor: "#FEF3C7",
  },
  urgencyText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#991B1B",
  },
  symptomExpandedBody: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
  },
  symptomDesc: {
    fontSize: 13,
    color: colors.charcoal,
    lineHeight: 19,
    marginBottom: spacing.md,
  },
  symptomActionBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  symptomActionText: {
    flex: 1,
    fontSize: 12,
    color: "#166534",
    lineHeight: 18,
  },
  calmGuidanceCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: colors.roseSoft,
    borderColor: "#FDA4AF",
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: 6,
  },
  calmGuidanceTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.roseDeep,
    marginBottom: 4,
  },
  calmGuidanceText: {
    fontSize: 12,
    color: colors.charcoal,
    lineHeight: 19,
  },
});
