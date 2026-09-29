import { useMemo, useState } from "react";
import { router } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Lock, Mail, User, Calendar, Heart, ShieldCheck, ArrowRight, Sparkles } from "lucide-react-native";
import { useApp } from "@/context/AppContext";
import { InlineToast } from "@/components/InlineToast";
import { PregnancyIllustration } from "@/components/PregnancyIllustration";
import { colors, borders, shadows, radius, spacing } from "@/constants/theme";
import { isValidProfileName, validateDueDate, validateLmpDate, calculateDueDateFromLmp, displayDate } from "@/services/date";

export default function OnboardingScreen() {
  const { signIn, signUp } = useApp();
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pregnancyInputMethod, setPregnancyInputMethod] = useState<"lmp" | "duedate">("lmp");
  const [lmpDate, setLmpDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const lmpCheck = useMemo(() => {
    if (!lmpDate.trim()) return null;
    return validateLmpDate(lmpDate.trim());
  }, [lmpDate]);

  const handleAuth = async () => {
    setError("");
    setSuccessMsg("");
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!trimmedPassword || trimmedPassword.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    if (authMode === "signin") {
      setLoading(true);
      try {
        await signIn(trimmedEmail, trimmedPassword);
        setSuccessMsg("Welcome back! Loading your journey...");
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 300);
      } catch (err: any) {
        setError(err.message || "Failed to sign in. Please check your credentials.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Sign Up Mode Validations
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (!isValidProfileName(trimmedName)) {
      setError("Please enter a valid name using letters and spaces only.");
      return;
    }

    let finalDueDate = "";
    let finalLmpDate: string | undefined = undefined;

    if (pregnancyInputMethod === "lmp") {
      const trimmedLmp = lmpDate.trim();
      if (!trimmedLmp) {
        setError("Please enter the first day of your Last Menstrual Period (LMP).");
        return;
      }
      const lmpVal = validateLmpDate(trimmedLmp);
      if (!lmpVal.isValid || !lmpVal.calculatedDueDate) {
        setError(lmpVal.error || "Please enter a valid LMP date in YYYY-MM-DD or DD-MM-YYYY format.");
        return;
      }
      finalDueDate = lmpVal.calculatedDueDate;
      finalLmpDate = lmpVal.isoDate;
    } else {
      const trimmedDueDate = dueDate.trim();
      if (!trimmedDueDate) {
        setError("Please enter your expected due date (YYYY-MM-DD or DD-MM-YYYY).");
        return;
      }
      const dateCheck = validateDueDate(trimmedDueDate);
      if (!dateCheck.isValid) {
        setError(dateCheck.error || "Please enter a valid future due date.");
        return;
      }
      finalDueDate = dateCheck.isoDate || trimmedDueDate;
    }

    setLoading(true);
    try {
      await signUp({
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        dueDate: finalDueDate,
        lmpDate: finalLmpDate,
      });
      setSuccessMsg("Account created successfully! Welcome to Maa.");
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 300);
    } catch (err: any) {
      setError(err.message || "Could not complete registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Top Branding Pill */}
        <View style={styles.topHeader}>
          <View style={styles.brandPill}>
            <Heart size={14} color={colors.white} fill={colors.white} />
            <Text style={styles.brandPillText}>Maa Maternal Care</Text>
          </View>
          <View style={styles.secureBadge}>
            <ShieldCheck size={13} color={colors.skyBlueDeep} />
            <Text style={styles.secureBadgeText}>Private & Offline-First</Text>
          </View>
        </View>

        <Text style={styles.title}>
          {authMode === "signup" ? "Begin Your Journey" : "Welcome Back"}
        </Text>
        <Text style={styles.subtitle}>
          {authMode === "signup"
            ? "Create your account to unlock personalized daily insights, AI reassurance, and milestone tracking."
            : "Sign in to access your pregnancy profile, daily vitals, and maternal records."}
        </Text>

        {/* Tab Switcher */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, authMode === "signup" && styles.segmentBtnActive]}
            onPress={() => {
              setAuthMode("signup");
              setError("");
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentBtnText,
                authMode === "signup" && styles.segmentBtnTextActive,
              ]}
            >
              Create Account
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, authMode === "signin" && styles.segmentBtnActive]}
            onPress={() => {
              setAuthMode("signin");
              setError("");
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentBtnText,
                authMode === "signin" && styles.segmentBtnTextActive,
              ]}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {/* Illustration Banner */}
        <View style={styles.heroArt}>
          <PregnancyIllustration variant="compact" />
        </View>

        {error ? <InlineToast type="error" message={error} /> : null}
        {successMsg ? <InlineToast type="success" message={successMsg} /> : null}

        {/* Form Card */}
        <View style={styles.formCard}>
          {authMode === "signup" && (
            <>
              <Text style={styles.label}>Your Name</Text>
              <View style={styles.inputWrap}>
                <User size={18} color={colors.skyBlue} style={styles.inputIcon} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Priya Sharma"
                  placeholderTextColor="#94A3B8"
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>
            </>
          )}

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrap}>
            <Mail size={18} color={colors.skyBlue} style={styles.inputIcon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. mama@example.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Lock size={18} color={colors.skyBlue} style={styles.inputIcon} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 4 characters"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              style={styles.input}
            />
          </View>

          {authMode === "signup" && (
            <>
              <Text style={styles.sectionDividerText}>PREGNANCY TIMELINE CALCULATION</Text>
              
              {/* Method Switcher */}
              <View style={styles.calcMethodRow}>
                <TouchableOpacity
                  style={[styles.calcMethodBtn, pregnancyInputMethod === "lmp" && styles.calcMethodBtnActive]}
                  onPress={() => {
                    setPregnancyInputMethod("lmp");
                    setError("");
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.calcMethodText, pregnancyInputMethod === "lmp" && styles.calcMethodTextActive]}>
                    Last Period (LMP) ★
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.calcMethodBtn, pregnancyInputMethod === "duedate" && styles.calcMethodBtnActive]}
                  onPress={() => {
                    setPregnancyInputMethod("duedate");
                    setError("");
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.calcMethodText, pregnancyInputMethod === "duedate" && styles.calcMethodTextActive]}>
                    Due Date Directly
                  </Text>
                </TouchableOpacity>
              </View>

              {pregnancyInputMethod === "lmp" ? (
                <>
                  <View style={styles.dueDateHeader}>
                    <Text style={styles.label}>First Day of Last Period (LMP)</Text>
                    <Text style={styles.dueDateHelper}>(Primary calculation)</Text>
                  </View>
                  <View style={styles.inputWrap}>
                    <Calendar size={18} color={colors.brand} style={styles.inputIcon} />
                    <TextInput
                      value={lmpDate}
                      onChangeText={setLmpDate}
                      placeholder="YYYY-MM-DD or DD-MM-YYYY"
                      placeholderTextColor="#94A3B8"
                      style={styles.input}
                      maxLength={10}
                    />
                  </View>
                  {lmpCheck?.isValid && lmpCheck.calculatedDueDate ? (
                    <View style={styles.calculatedBanner}>
                      <Sparkles size={18} color="#2563EB" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.calculatedBannerTitle}>
                          Estimated Due Date: {displayDate(lmpCheck.calculatedDueDate)}
                        </Text>
                        <Text style={styles.calculatedBannerSub}>
                          Gestational Age: Week {lmpCheck.gestationalWeek || 1} • Based on 280-day cycle (+40 wks)
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.infoHint}>
                      💡 We automatically add 280 days (40 weeks) to your LMP date to predict your delivery date and weekly milestones.
                    </Text>
                  )}
                </>
              ) : (
                <>
                  <View style={styles.dueDateHeader}>
                    <Text style={styles.label}>Expected Labour / Due Date</Text>
                    <Text style={styles.dueDateHelper}>(Upcoming delivery date)</Text>
                  </View>
                  <View style={styles.inputWrap}>
                    <Calendar size={18} color={colors.skyBlueDeep} style={styles.inputIcon} />
                    <TextInput
                      value={dueDate}
                      onChangeText={setDueDate}
                      placeholder="YYYY-MM-DD or DD-MM-YYYY"
                      placeholderTextColor="#94A3B8"
                      style={styles.input}
                      maxLength={10}
                    />
                  </View>
                  <Text style={styles.infoHint}>
                    💡 For mothers who don't recall their LMP or have an established ultrasound EDD from their doctor.
                  </Text>
                </>
              )}
            </>
          )}

          {/* Submit Action */}
          <TouchableOpacity
            onPress={handleAuth}
            disabled={loading}
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>
                  {authMode === "signup" ? "Create Account & Start" : "Sign In to Account"}
                </Text>
                <ArrowRight size={18} color={colors.white} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Switch mode footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            {authMode === "signup"
              ? "Already have an account?"
              : "New to Maa?"}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setAuthMode(authMode === "signup" ? "signin" : "signup");
              setError("");
            }}
          >
            <Text style={styles.footerLink}>
              {authMode === "signup" ? " Sign In" : " Create Account"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ivory,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingVertical: spacing.xxl,
    paddingBottom: spacing.xxxl * 1.5,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  brandPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    ...shadows.sm,
  },
  brandPillText: {
    color: colors.white,
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 0.5,
    fontWeight: "700",
  },
  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.skyBlueSoft,
    borderColor: colors.skyBlueBorder,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  secureBadgeText: {
    color: colors.skyBlueDeep,
    fontSize: 11,
    fontWeight: "600",
  },
  title: {
    color: colors.charcoal,
    fontSize: 28,
    fontFamily: "PlayfairDisplay_600SemiBold",
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: colors.skyBlueSoft,
    borderColor: colors.skyBlueBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 3,
    marginBottom: spacing.lg,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: radius.sm,
  },
  segmentBtnActive: {
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  segmentBtnTextActive: {
    color: colors.skyBlueDeep,
    fontWeight: "700",
  },
  heroArt: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.default,
  },
  label: {
    color: colors.charcoal,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  dueDateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dueDateHelper: {
    fontSize: 11,
    color: colors.brand,
    fontWeight: "600",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgFaint,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.charcoal,
  },
  infoHint: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.md,
    backgroundColor: colors.roseSoft,
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  primaryButton: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xs,
    ...shadows.soft,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: colors.skyBlueDeep,
    fontSize: 14,
    fontWeight: "700",
  },
  sectionDividerText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#6F7480",
    marginBottom: 8,
    marginTop: 4,
  },
  calcMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 3,
    marginBottom: 14,
  },
  calcMethodBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  calcMethodBtnActive: {
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  calcMethodText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  calcMethodTextActive: {
    color: colors.brand,
    fontWeight: "800",
  },
  calculatedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  calculatedBannerTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1D4ED8",
  },
  calculatedBannerSub: {
    fontSize: 11,
    color: "#3B82F6",
    fontWeight: "600",
    marginTop: 2,
  },
});
