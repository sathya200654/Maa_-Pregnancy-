import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  HelpCircle,
  Lock,
  RotateCcw,
  Sparkles,
  Unlock,
  X,
} from "lucide-react-native";

import { colors, fonts as baseFonts, shadows as baseShadows } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import {
  DiaryEntry,
  formatToday,
  getDateForPregnancyDay,
  getDiaryEntryForDate,
  getDiarySecurityConfig,
  getPregnancyDayInfo,
  getTodayPregnancyDay,
  resetDiaryPin,
  saveDiaryEntry,
  setupDiarySecurity,
  verifyDiaryPin,
  verifySecurityQuestions,
} from "@/services/diary";

const fonts = {
  serif: baseFonts.serif,
  serifBold: baseFonts.serif,
  sans: baseFonts.sans,
  sansMedium: baseFonts.sansMedium,
  sansBold: baseFonts.sansMedium,
};

const shadows = {
  ...baseShadows,
  md: baseShadows.default,
  lg: baseShadows.soft,
  xl: baseShadows.soft,
};

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

// Palette
const PINK = {
  coverBg: "#F7A8BE",
  coverDeep: "#DE6B8B",
  coverShine: "#FFD3DF",
  leatherBorder: "#C05273",
  stitch: "#FFDEE7",
  spine: "#B34364",
  strap: "#E8829F",
  strapBorder: "#A83C5B",
  gold: "#D4AF37",
  goldLight: "#FDE68A",
  goldDark: "#997300",
  roseDeep: "#880E4F",
  parchment: "#FFFDF6",
  pageLine: "#F3D5DE",
  pageMargin: "#F06292",
  textDark: "#3E1724",
  textMuted: "#7D3D52",
};

const MOODS = [
  { id: "happy", label: "Happy", emoji: "🌸" },
  { id: "glowing", label: "Glowing", emoji: "✨" },
  { id: "peaceful", label: "Peaceful", emoji: "🌿" },
  { id: "tired", label: "Tired", emoji: "😴" },
  { id: "emotional", label: "Emotional", emoji: "🥺" },
  { id: "anxious", label: "Anxious", emoji: "🕊️" },
];

interface PersonalDiaryModalProps {
  visible: boolean;
  onClose: () => void;
  dueDateStr?: string | null;
}

export function PersonalDiaryModal({ visible, onClose, dueDateStr }: PersonalDiaryModalProps) {
  const { currentUser, profile, t } = useApp();
  const insets = useSafeAreaInsets();
  const userEmail = currentUser?.email || profile?.email || null;

  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  // Setup State
  const [setupPin, setSetupPin] = useState("");
  const [setupConfirmPin, setSetupConfirmPin] = useState("");
  const [setupSchool, setSetupSchool] = useState("");
  const [setupNickname, setSetupNickname] = useState("");
  const [setupError, setSetupError] = useState("");

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotSchool, setForgotSchool] = useState("");
  const [forgotNickname, setForgotNickname] = useState("");
  const [newResetPin, setNewResetPin] = useState("");
  const [newResetConfirmPin, setNewResetConfirmPin] = useState("");
  const [recoveryStep, setRecoveryStep] = useState<"questions" | "new_pin">("questions");
  const [recoveryError, setRecoveryError] = useState("");

  // Timeline State
  const todayDayNumber = useMemo(() => getTodayPregnancyDay(dueDateStr), [dueDateStr]);
  const [currentDayNumber, setCurrentDayNumber] = useState<number>(todayDayNumber);
  const [currentDateIso, setCurrentDateIso] = useState<string>(formatToday());
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);

  // Diary page input fields
  const [thoughtsText, setThoughtsText] = useState("");
  const [strugglesText, setStrugglesText] = useState("");
  const [activitiesText, setActivitiesText] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("happy");
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Jump to day modal
  const [showDayJumpModal, setShowDayJumpModal] = useState(false);
  const [jumpDayInput, setJumpDayInput] = useState("");

  // ─── Flow Animations ────────────────────────────────────────────────────────
  // Floating book animation
  const bookFloatAnim = useRef(new Animated.Value(0)).current;
  // Key animations (resting position sits slightly to side, translates directly into keyhole center)
  const keyTranslateX = useRef(new Animated.Value(36)).current;
  const keyTranslateY = useRef(new Animated.Value(22)).current;
  const keyRotate = useRef(new Animated.Value(0)).current;
  // Lock shackle pop
  const shacklePop = useRef(new Animated.Value(0)).current;
  // Strap slide
  const strapSlide = useRef(new Animated.Value(0)).current;
  // Book open transition (3D flip / fold)
  const bookFlipAnim = useRef(new Animated.Value(0)).current;
  // Page turn animation
  const pageTurnAnim = useRef(new Animated.Value(1)).current;
  const [isUnlockingAnimation, setIsUnlockingAnimation] = useState(false);

  const dayInfo = useMemo(
    () => getPregnancyDayInfo(currentDateIso, dueDateStr),
    [currentDateIso, dueDateStr]
  );

  // Ambient floating animation for the closed diary
  useEffect(() => {
    let loopAnimation: Animated.CompositeAnimation | null = null;
    if (visible && !isUnlocked) {
      loopAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bookFloatAnim, {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(bookFloatAnim, {
            toValue: 0,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      loopAnimation.start();
    }
    return () => {
      loopAnimation?.stop();
    };
  }, [visible, isUnlocked]);

  // Reset state on open
  useEffect(() => {
    if (visible) {
      setIsUnlocked(false);
      setPinInput("");
      setPinError("");
      setIsUnlockingAnimation(false);
      keyTranslateX.setValue(36);
      keyTranslateY.setValue(22);
      keyRotate.setValue(0);
      shacklePop.setValue(0);
      strapSlide.setValue(0);
      bookFlipAnim.setValue(0);
      pageTurnAnim.setValue(1);

      const checkSecurity = async () => {
        const config = await getDiarySecurityConfig(userEmail);
        setIsConfigured(Boolean(config && config.isConfigured));
      };
      checkSecurity().catch(() => setIsConfigured(false));
    }
  }, [visible, userEmail]);

  // Load entry for selected day
  useEffect(() => {
    const iso = getDateForPregnancyDay(currentDayNumber, dueDateStr);
    setCurrentDateIso(iso);

    const load = async () => {
      const entry = await getDiaryEntryForDate(iso, userEmail);
      setCurrentEntry(entry);
      if (entry) {
        setThoughtsText(entry.thoughts || "");
        setStrugglesText(entry.struggles || "");
        setActivitiesText(entry.activities || "");
        setSelectedMood(entry.mood || "happy");
      } else {
        setThoughtsText("");
        setStrugglesText("");
        setActivitiesText("");
        setSelectedMood("happy");
      }
    };

    if (isUnlocked) {
      load().catch(() => undefined);
    }
  }, [currentDayNumber, dueDateStr, isUnlocked, userEmail]);

  // Trigger page-turn animation on day switch
  const triggerPageTurn = (direction: "next" | "prev", action: () => void) => {
    Animated.timing(pageTurnAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      action();
      Animated.timing(pageTurnAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePrevDay = () => {
    if (currentDayNumber > 1) {
      triggerPageTurn("prev", () => setCurrentDayNumber((d) => d - 1));
    }
  };

  const handleNextDay = () => {
    if (currentDayNumber < 280) {
      triggerPageTurn("next", () => setCurrentDayNumber((d) => d + 1));
    }
  };

  const handleJumpToToday = () => {
    if (currentDayNumber !== todayDayNumber) {
      triggerPageTurn("next", () => setCurrentDayNumber(todayDayNumber));
    }
  };

  // PIN Keypad handler
  const onPinDigit = (digit: string) => {
    if (pinInput.length >= 4) return;
    const next = pinInput + digit;
    setPinInput(next);
    setPinError("");

    if (next.length === 4) {
      verifyAndAnimateUnlock(next);
    }
  };

  const onPinBackspace = () => {
    if (pinInput.length > 0) {
      setPinInput((prev) => prev.slice(0, -1));
      setPinError("");
    }
  };

  // Flow animation unlock sequence
  const verifyAndAnimateUnlock = async (enteredPin: string) => {
    const isValid = await verifyDiaryPin(enteredPin, userEmail);
    if (!isValid) {
      setPinError(t("incorrect_password", "Incorrect password. Please try again."));
      setPinInput("");
      return;
    }

    // Begin the continuous flow animation:
    setIsUnlockingAnimation(true);
    Animated.sequence([
      // 1. Pink Heart Key glides directly into keyhole center
      Animated.parallel([
        Animated.timing(keyTranslateX, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(keyTranslateY, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(keyRotate, {
          toValue: 0,
          duration: 380,
          useNativeDriver: true,
        }),
      ]),
      // 2. Key turns 90 degrees inside keyhole
      Animated.timing(keyRotate, {
        toValue: 2, // 90 deg rotation
        duration: 320,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      // 3. Heart padlock snaps open (shackle pops)
      Animated.spring(shacklePop, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
      // 4. Leather strap unclips & slides to the right
      Animated.timing(strapSlide, {
        toValue: 32,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // 5. Book cover flips/unfolds smoothly into interior page
      Animated.timing(bookFlipAnim, {
        toValue: 1,
        duration: 450,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsUnlockingAnimation(false);
      setIsUnlocked(true);
      setCurrentDayNumber(todayDayNumber);
    });
  };

  // Initial Setup Submit
  const handleSetupSubmit = async () => {
    setSetupError("");
    if (setupPin.length < 4) {
      setSetupError(t("choose_4digit_passcode", "Please choose a 4-digit passcode."));
      return;
    }
    if (setupPin !== setupConfirmPin) {
      setSetupError(t("passcodes_do_not_match", "Passcodes do not match."));
      return;
    }
    if (!setupSchool.trim()) {
      setSetupError(t("answer_school_question", "Please answer the primary school question."));
      return;
    }
    if (!setupNickname.trim()) {
      setSetupError(t("answer_nickname_question", "Please answer the childhood nickname question."));
      return;
    }

    const success = await setupDiarySecurity(setupPin, setupSchool, setupNickname, userEmail);
    if (success) {
      setIsConfigured(true);
      setIsUnlocked(true);
      setCurrentDayNumber(todayDayNumber);
      Alert.alert(
        t("diary_protected_title", "Diary Protected 🌸"),
        t("diary_protected_desc", "Your secret diary is now password protected with heart key recovery questions.")
      );
    } else {
      setSetupError(t("setup_save_error", "Could not save setup. Please try again."));
    }
  };

  // Forgot Password verify
  const handleVerifyRecovery = async () => {
    setRecoveryError("");
    if (!forgotSchool.trim() || !forgotNickname.trim()) {
      setRecoveryError(t("answer_both_questions", "Please answer both questions."));
      return;
    }
    const match = await verifySecurityQuestions(forgotSchool, forgotNickname, userEmail);
    if (match) {
      setRecoveryStep("new_pin");
    } else {
      setRecoveryError(t("answers_do_not_match", "Answers do not match. Please try again."));
    }
  };

  const handleResetPinSubmit = async () => {
    setRecoveryError("");
    if (newResetPin.length < 4) {
      setRecoveryError(t("enter_4digit_passcode", "Please enter a 4-digit passcode."));
      return;
    }
    if (newResetPin !== newResetConfirmPin) {
      setRecoveryError("Passcodes do not match.");
      return;
    }
    const success = await resetDiaryPin(newResetPin, userEmail);
    if (success) {
      setShowForgotModal(false);
      setRecoveryStep("questions");
      setForgotSchool("");
      setForgotNickname("");
      setNewResetPin("");
      setNewResetConfirmPin("");
      setPinInput("");
      setPinError("");
      Alert.alert(t("passcode_reset_title", "Passcode Reset ✨"), t("passcode_reset_desc", "You can now unlock with your new passcode."));
    } else {
      setRecoveryError(t("reset_passcode_error", "Could not reset passcode."));
    }
  };

  // Save Today's page
  const handleSavePage = async () => {
    if (!dayInfo.isToday) {
      Alert.alert(t("sealed_page_title", "Sealed Page"), t("sealed_page_desc", "Only today's page can be written or modified."));
      return;
    }

    setIsSaving(true);
    const success = await saveDiaryEntry(
      currentDateIso,
      {
        dayNumber: dayInfo.dayNumber,
        weekNumber: dayInfo.weekNumber,
        thoughts: thoughtsText,
        struggles: strugglesText,
        activities: activitiesText,
        mood: selectedMood,
      },
      userEmail
    );
    setIsSaving(false);

    if (success) {
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    } else {
      Alert.alert(t("save_error_title", "Save Error"), t("save_page_error", "Could not save your diary page right now."));
    }
  };

  const handleCloseAndLock = () => {
    setIsUnlocked(false);
    setPinInput("");
    onClose();
  };

  // ─── Interpolated Animations ───────────────────────────────────────────────
  const bookTranslateY = bookFloatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const keyRotationStr = keyRotate.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["0deg", "45deg", "90deg"],
  });

  const shackleTranslateY = shacklePop.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  const coverFlipScale = bookFlipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const coverOpacity = bookFlipAnim.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 0.5, 0],
  });

  const pageCurlTranslateX = pageTurnAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 0],
  });

  const pageCurlOpacity = pageTurnAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={handleCloseAndLock}
    >
      <View style={[styles.safeArea, { paddingTop: Math.max(insets.top, 12), paddingBottom: Math.max(insets.bottom, 12) }]}>
        {/* SETUP SCREEN */}
        {isConfigured === false ? (
          <ScrollView contentContainerStyle={styles.setupScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.setupIconCircle}>
              <Heart size={32} color={PINK.coverDeep} fill={PINK.coverBg} />
            </View>
            <Text style={styles.setupTitle}>{t("setup_diary_title", "Set Up Your Secret Diary")}</Text>
            <Text style={styles.setupSubtitle}>
              {t("setup_diary_desc", "Create a 4-digit passcode and configure recovery questions to keep your intimate daily pregnancy thoughts private.")}
            </Text>

            <View style={styles.setupCard}>
              <Text style={styles.setupSectionLabel}>{t("choose_passcode_step", "1. CHOOSE A 4-DIGIT PASSCODE")}</Text>
              <TextInput
                value={setupPin}
                onChangeText={setSetupPin}
                placeholder={t("secret_pin_placeholder", "4-digit secret PIN")}
                placeholderTextColor="#A07283"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                style={styles.setupInput}
              />
              <TextInput
                value={setupConfirmPin}
                onChangeText={setSetupConfirmPin}
                placeholder={t("confirm_pin_placeholder", "Confirm 4-digit PIN")}
                placeholderTextColor="#A07283"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                style={styles.setupInput}
              />

              <Text style={[styles.setupSectionLabel, { marginTop: 14 }]}>
                {t("security_questions_step", "2. SECURITY QUESTIONS (FOR RECOVERY)")}
              </Text>
              <Text style={styles.questionLabel}>{t("primary_school_question", "What is your primary school name?")}</Text>
              <TextInput
                value={setupSchool}
                onChangeText={setSetupSchool}
                placeholder={t("school_placeholder", "e.g. St. Anne's Primary School")}
                placeholderTextColor="#A07283"
                style={styles.setupInput}
              />

              <Text style={styles.questionLabel}>{t("nickname_question", "What is your nickname during your childhood?")}</Text>
              <TextInput
                value={setupNickname}
                onChangeText={setSetupNickname}
                placeholder={t("nickname_placeholder", "e.g. Sweety, Golu, Mimi")}
                placeholderTextColor="#A07283"
                style={styles.setupInput}
              />

              {setupError ? <Text style={styles.setupErrorText}>{setupError}</Text> : null}

              <TouchableOpacity style={styles.setupSaveBtn} onPress={handleSetupSubmit}>
                <Sparkles size={18} color="#FFF" />
                <Text style={styles.setupSaveBtnText}>{t("save_lock_diary", "Save & Lock My Diary 🔒")}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={handleCloseAndLock}>
                <Text style={styles.cancelBtnText}>{t("back_to_profile", "Back to Profile")}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : !isUnlocked ? (
          /* LOCKED COVER VIEW WITH 100% VISIBLE SCREEN-FITTING KEYPAD & PURE ANIMATED DIARY */
          <View style={styles.lockedScreen}>
            {/* Top Bar */}
            <View style={styles.lockTopBar}>
              <TouchableOpacity style={styles.lockCloseBtn} onPress={handleCloseAndLock} hitSlop={12}>
                <X size={18} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.lockHeaderTag}>
                <Lock size={12} color={PINK.goldLight} />
                <Text style={styles.lockHeaderTagText}>{t("personal_diary", "SECRET PREGNANCY DIARY")}</Text>
              </View>
              <View style={{ width: 34 }} />
            </View>

            {/* Centered Animated Stage */}
            <View style={styles.stageContainer}>
              {/* ANIMATED VINTAGE PINK LEATHER BOOK */}
              <Animated.View
                style={[
                  styles.animatedBook,
                  {
                    transform: [
                      { translateY: bookTranslateY },
                      { scale: coverFlipScale },
                    ],
                    opacity: coverOpacity,
                  },
                ]}
              >
                {/* Book Spine (Left 3D Edge) */}
                <View style={styles.bookSpine} />

                {/* Book Pages Edge (Right 3D Layers) */}
                <View style={styles.bookPagesLayer} />

                {/* Front Leather Cover */}
                <View style={styles.leatherCoverFront}>
                  {/* Embossed Stitching Border */}
                  <View style={styles.coverStitchBorder}>
                    {/* SVG Victorian Filigree Corners & Center Seal */}
                    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                      <Defs>
                        <LinearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                          <Stop offset="0" stopColor="#FEE685" stopOpacity="0.85" />
                          <Stop offset="1" stopColor="#D4AF37" stopOpacity="0.75" />
                        </LinearGradient>
                      </Defs>
                      {/* Top-Left Filigree */}
                      <Path
                        d="M 16 38 C 16 22 22 16 38 16 C 28 20 20 28 16 38 Z M 24 24 C 28 18 36 20 34 26 C 30 24 26 28 24 24 Z"
                        fill="url(#goldGrad)"
                      />
                      {/* Top-Right Filigree */}
                      <Path
                        d="M 194 38 C 194 22 188 16 172 16 C 182 20 190 28 194 38 Z"
                        fill="url(#goldGrad)"
                      />
                      {/* Bottom-Left Filigree */}
                      <Path
                        d="M 16 232 C 16 248 22 254 38 254 C 28 250 20 242 16 232 Z"
                        fill="url(#goldGrad)"
                      />
                      {/* Bottom-Right Filigree */}
                      <Path
                        d="M 194 232 C 194 248 188 254 172 254 C 182 250 190 242 194 232 Z"
                        fill="url(#goldGrad)"
                      />
                    </Svg>

                    {/* Foil Embossed Titles */}
                    <View style={styles.coverHeaderArea}>
                      <Text style={styles.coverEmbossSub}>{t("vintage_style", "Vintage Style")}</Text>
                      <View style={styles.coverEmbossDivider}>
                        <View style={styles.dividerLine} />
                        <Heart size={10} color={PINK.goldLight} fill={PINK.goldLight} />
                        <View style={styles.dividerLine} />
                      </View>
                      <Text style={styles.coverEmbossMain}>{t("maa_diary", "Maa Diary")}</Text>
                      <Text style={styles.coverEmbossFooter}>{t("day_1_to_delivery", "Day 1 to Delivery")}</Text>
                    </View>
                  </View>

                  {/* Leather Clasp & Golden Heart Padlock on Right Edge */}
                  <Animated.View
                    style={[
                      styles.claspAssembly,
                      { transform: [{ translateX: strapSlide }] },
                    ]}
                  >
                    {/* Pink Leather Clasp Strap */}
                    <View style={styles.claspStrap}>
                      <View style={styles.claspStitch} />
                    </View>

                    {/* Gold Padlock Base */}
                    <View style={styles.lockContainer}>
                      {/* Shackle that pops open */}
                      <Animated.View
                        style={[
                          styles.goldShackle,
                          { transform: [{ translateY: shackleTranslateY }] },
                        ]}
                      />

                      {/* Heart Padlock Body */}
                      <View style={styles.goldHeartPadlock}>
                        <Heart size={38} color={PINK.gold} fill={PINK.gold} />
                        {/* Keyhole */}
                        <View style={styles.keyholeShape}>
                          <View style={styles.keyholeTop} />
                          <View style={styles.keyholeBottom} />
                        </View>
                      </View>

                      {/* Dangling Pink Heart Key on Gold Chain */}
                      <Animated.View
                        style={[
                          styles.animatedHeartKey,
                          {
                            transform: [
                              { translateX: keyTranslateX },
                              { translateY: keyTranslateY },
                              { rotate: keyRotationStr },
                            ],
                          },
                        ]}
                      >
                        <View style={styles.chainLink} />
                        <View style={styles.keyHeartBow}>
                          <Heart size={18} color={PINK.gold} fill={PINK.coverBg} />
                        </View>
                        <View style={styles.keyShaft} />
                        <View style={styles.keyBit} />
                      </Animated.View>
                    </View>
                  </Animated.View>
                </View>
              </Animated.View>

              {/* COMPACT KEYPAD (Guaranteed within viewport, never out of range) */}
              <View style={styles.keypadWrapper}>
                <Text style={styles.keypadInstruction}>
                  {isUnlockingAnimation ? t("unlocking_with_key", "UNLOCKING WITH HEART KEY... ✨") : t("enter_passcode", "ENTER 4-DIGIT SECRET PASSCODE")}
                </Text>

                {/* 4 Heart Bullets */}
                <View style={styles.heartBulletsRow}>
                  {[0, 1, 2, 3].map((idx) => {
                    const isFilled = pinInput.length > idx;
                    return (
                      <View key={idx} style={styles.bulletItem}>
                        <Heart
                          size={18}
                          color={isFilled ? PINK.coverDeep : "#884055"}
                          fill={isFilled ? PINK.coverDeep : "transparent"}
                        />
                      </View>
                    );
                  })}
                </View>

                {pinError ? <Text style={styles.pinErrorPrompt}>{pinError}</Text> : null}

                {/* 3x4 Compact Grid */}
                <View style={styles.compactGrid}>
                  {[
                    ["1", "2", "3"],
                    ["4", "5", "6"],
                    ["7", "8", "9"],
                    ["forgot", "0", "back"],
                  ].map((row, rIdx) => (
                    <View key={rIdx} style={styles.gridRow}>
                      {row.map((item) => {
                        if (item === "forgot") {
                          return (
                            <TouchableOpacity
                              key={item}
                              style={styles.keyAuxBtn}
                              onPress={() => {
                                setShowForgotModal(true);
                                setRecoveryStep("questions");
                                setRecoveryError("");
                              }}
                            >
                              <HelpCircle size={14} color={PINK.goldLight} />
                              <Text style={styles.keyAuxText}>{t("forgot_passcode", "Forgot?")}</Text>
                            </TouchableOpacity>
                          );
                        }
                        if (item === "back") {
                          return (
                            <TouchableOpacity
                              key={item}
                              style={styles.keyAuxBtn}
                              onPress={onPinBackspace}
                            >
                              <RotateCcw size={16} color="#FFF" />
                            </TouchableOpacity>
                          );
                        }
                        return (
                          <TouchableOpacity
                            key={item}
                            style={styles.keyNumBtn}
                            onPress={() => onPinDigit(item)}
                            activeOpacity={0.75}
                          >
                            <Text style={styles.keyNumText}>{item}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        ) : (
          /* UNLOCKED: AUTHENTIC VINTAGE LINED NOTEBOOK DIARY PAGE */
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.journalContainer}
          >
            {/* Top Toolbar */}
            <View style={styles.pageTopBar}>
              <TouchableOpacity
                style={styles.lockClosePill}
                onPress={handleCloseAndLock}
                activeOpacity={0.8}
              >
                <Lock size={14} color="#FFF" />
                <Text style={styles.lockClosePillText}>{t("lock_and_exit", "Lock & Exit")}</Text>
              </TouchableOpacity>

              {/* Today Pill */}
              <TouchableOpacity
                style={[styles.todayJumpBtn, dayInfo.isToday && styles.todayJumpBtnActive]}
                onPress={handleJumpToToday}
                activeOpacity={0.8}
              >
                <Heart size={13} color={dayInfo.isToday ? "#FFF" : PINK.coverDeep} fill={dayInfo.isToday ? "#FFF" : "transparent"} />
                <Text style={[styles.todayJumpBtnText, dayInfo.isToday && styles.todayJumpBtnTextActive]}>
                  {dayInfo.isToday ? t("todays_page", "Today's Page") : t("go_to_today", "Go to Today")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Vintage Page Header / Day Navigator */}
            <View style={styles.pageHeaderBanner}>
              <TouchableOpacity
                style={[styles.pageNavBtn, currentDayNumber <= 1 && styles.pageNavBtnDisabled]}
                onPress={handlePrevDay}
                disabled={currentDayNumber <= 1}
              >
                <ChevronLeft size={22} color={currentDayNumber <= 1 ? "#CCA" : PINK.coverDeep} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pageHeaderCenter}
                onPress={() => {
                  setJumpDayInput(String(currentDayNumber));
                  setShowDayJumpModal(true);
                }}
              >
                <View style={styles.dayRibbon}>
                  <Text style={styles.dayRibbonText}>{t("day_prefix", "DAY")} {dayInfo.dayNumber} {t("of_280", "OF 280")}</Text>
                </View>
                <Text style={styles.pageDateText}>{dayInfo.displayDate}</Text>
                <Text style={styles.pageMetaText}>
                  {t("week_prefix", "Week")} {dayInfo.weekNumber} • {dayInfo.trimester} ({t("tap_to_jump", "Tap to Jump")})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.pageNavBtn, currentDayNumber >= 280 && styles.pageNavBtnDisabled]}
                onPress={handleNextDay}
                disabled={currentDayNumber >= 280}
              >
                <ChevronRight size={22} color={currentDayNumber >= 280 ? "#CCA" : PINK.coverDeep} />
              </TouchableOpacity>
            </View>

            {/* Page State Badge */}
            <View style={styles.pageStatusRow}>
              {dayInfo.isToday ? (
                <View style={[styles.statusPill, styles.statusPillToday]}>
                  <Sparkles size={13} color={PINK.coverDeep} />
                  <Text style={styles.statusPillTodayText}>
                    {t("open_for_writing", "🌸 Today's Page — Open for Writing & Reflection")}
                  </Text>
                </View>
              ) : dayInfo.isPast ? (
                <View style={[styles.statusPill, styles.statusPillPast]}>
                  <Lock size={13} color="#6C3E4F" />
                  <Text style={styles.statusPillPastText}>
                    {t("sealed_memory", "🔒 Sealed Memory — View Only")}
                  </Text>
                </View>
              ) : (
                <View style={[styles.statusPill, styles.statusPillFuture]}>
                  <Sparkles size={13} color="#9A6B2F" />
                  <Text style={styles.statusPillFutureText}>
                    {t("future_page", "✨ Future Page — Unlocks on arrival")}
                  </Text>
                </View>
              )}
            </View>

            {/* REALISTIC LINED DIARY PAGE (Animated Page Turn) */}
            <Animated.View
              style={[
                styles.pageOuterLeatherFrame,
                {
                  transform: [{ translateX: pageCurlTranslateX }],
                  opacity: pageCurlOpacity,
                },
              ]}
            >
              <ScrollView
                style={styles.realParchmentPage}
                contentContainerStyle={styles.parchmentContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Red/Pink Margin Line along the left */}
                <View style={styles.notebookMarginRule} />

                {/* Mood Ribbon on Page Header */}
                <View style={styles.pageMoodRow}>
                  <Text style={styles.pagePromptLabel}>{t("daily_vibe", "DAILY VIBE:")}</Text>
                  <View style={styles.moodPillsInline}>
                    {MOODS.map((m) => {
                      const isSelected = selectedMood === m.id;
                      return (
                        <TouchableOpacity
                          key={m.id}
                          style={[
                            styles.moodPillSmall,
                            isSelected && styles.moodPillSmallActive,
                            !dayInfo.isToday && styles.moodPillDisabled,
                          ]}
                          disabled={!dayInfo.isToday}
                          onPress={() => setSelectedMood(m.id)}
                        >
                          <Text style={styles.moodSmallEmoji}>{m.emoji}</Text>
                          <Text
                            style={[
                              styles.moodSmallLabel,
                              isSelected && styles.moodSmallLabelActive,
                            ]}
                          >
                            {t(`mood_${m.id}`, m.label)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 1. Thoughts & Feelings Section on Lined Page */}
                <View style={styles.linedPromptBlock}>
                  <View style={styles.linedPromptHeader}>
                    <Text style={styles.linedPromptTitle}>{t("thoughts_feelings", "💭 Thoughts & Feelings")}</Text>
                    <Text style={styles.linedPromptSub}>
                      {t("thoughts_sub", "Your innermost thoughts, hopes, fears, and letters to your baby")}
                    </Text>
                  </View>

                  {dayInfo.isToday ? (
                    <TextInput
                      value={thoughtsText}
                      onChangeText={setThoughtsText}
                      placeholder={t("thoughts_placeholder", "Write your thoughts here... Dear baby, today I felt...")}
                      placeholderTextColor="#BA8595"
                      multiline
                      style={styles.notebookLinedInput}
                    />
                  ) : (
                    <View style={styles.sealedLinedTextWrap}>
                      <Text style={styles.sealedLinedText}>
                        {currentEntry?.thoughts?.trim() || t("no_thoughts_recorded", "(No thoughts recorded on this day.)")}
                      </Text>
                    </View>
                  )}
                </View>

                {/* 2. Struggles & Challenges Section on Lined Page */}
                <View style={styles.linedPromptBlock}>
                  <View style={styles.linedPromptHeader}>
                    <Text style={styles.linedPromptTitle}>{t("struggles_symptoms", "🌿 Struggles & Physical Changes")}</Text>
                    <Text style={styles.linedPromptSub}>
                      {t("struggles_sub", "Morning sickness, backaches, tiredness, mood swings, or worries")}
                    </Text>
                  </View>

                  {dayInfo.isToday ? (
                    <TextInput
                      value={strugglesText}
                      onChangeText={setStrugglesText}
                      placeholder={t("struggles_placeholder", "Note physical symptoms, struggles, or challenges...")}
                      placeholderTextColor="#BA8595"
                      multiline
                      style={styles.notebookLinedInput}
                    />
                  ) : (
                    <View style={styles.sealedLinedTextWrap}>
                      <Text style={styles.sealedLinedText}>
                        {currentEntry?.struggles?.trim() || t("no_struggles_recorded", "(No struggles recorded on this day.)")}
                      </Text>
                    </View>
                  )}
                </View>

                {/* 3. Activities & Moments Section on Lined Page */}
                <View style={styles.linedPromptBlock}>
                  <View style={styles.linedPromptHeader}>
                    <Text style={styles.linedPromptTitle}>{t("activities_moments", "✨ Activities & Special Moments")}</Text>
                    <Text style={styles.linedPromptSub}>
                      {t("activities_sub", "Prenatal yoga, baby shopping, doctor scans, family walks, gentle kicks")}
                    </Text>
                  </View>

                  {dayInfo.isToday ? (
                    <TextInput
                      value={activitiesText}
                      onChangeText={setActivitiesText}
                      placeholder={t("activities_placeholder", "Doctor visits, walks, exercises, nursery prep...")}
                      placeholderTextColor="#BA8595"
                      multiline
                      style={styles.notebookLinedInput}
                    />
                  ) : (
                    <View style={styles.sealedLinedTextWrap}>
                      <Text style={styles.sealedLinedText}>
                        {currentEntry?.activities?.trim() || t("no_activities_recorded", "(No activities recorded on this day.)")}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Bottom Signature / Save Seal */}
                {dayInfo.isToday ? (
                  <View style={styles.pageSealFooter}>
                    {saveToast ? (
                      <View style={styles.pageSaveToast}>
                        <Check size={16} color="#FFF" />
                        <Text style={styles.pageSaveToastText}>{t("page_saved_toast", "Page Saved to Journal! 💖")}</Text>
                      </View>
                    ) : null}

                    <TouchableOpacity
                      style={styles.savePageBtn}
                      onPress={handleSavePage}
                      disabled={isSaving}
                      activeOpacity={0.85}
                    >
                      <Heart size={18} color="#FFF" fill="#FFF" />
                      <Text style={styles.savePageBtnText}>
                        {isSaving ? t("inscribing_page", "Inscribing Page...") : t("save_diary_page", "Sign & Save Today's Page 💖")}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.pageSealHint}>
                      {t("page_seal_hint", "🔒 At midnight, today's entry permanently seals into your pregnancy chronicle.")}
                    </Text>
                  </View>
                ) : dayInfo.isPast ? (
                  <View style={styles.archivalSealWrap}>
                    <View style={styles.waxSealEmblem}>
                      <Lock size={16} color={PINK.gold} />
                    </View>
                    <Text style={styles.archivalSealText}>
                      {t("sealed_keepsake", "SEALED KEEPSAKE")} • {t("day_prefix", "DAY")} {dayInfo.dayNumber} {t("of_280", "OF 280")}
                    </Text>
                    <Text style={styles.archivalSealSub}>
                      {t("sealed_keepsake_sub", "Preserved in your private archives. Authentic moments cannot be rewritten.")}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.futurePageSealWrap}>
                    <Sparkles size={20} color={PINK.gold} />
                    <Text style={styles.futurePageTitle}>{t("page_awaits_you", "This Page Awaits You")}</Text>
                    <Text style={styles.futurePageSub}>
                      {t("future_page_sub_prefix", "Take deep breaths and rest today, mama. This page unlocks on")} {dayInfo.displayDate}.
                    </Text>
                  </View>
                )}

                <View style={{ height: 40 }} />
              </ScrollView>
            </Animated.View>
          </KeyboardAvoidingView>
        )}

        {/* FORGOT PASSWORD MODAL */}
        <Modal
          visible={showForgotModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowForgotModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.recoveryCard}>
              <View style={styles.recoveryHeader}>
                <Text style={styles.recoveryTitle}>
                  {recoveryStep === "questions" ? t("heart_key_recovery", "Heart Key Recovery") : t("new_secret_passcode", "New Secret Passcode")}
                </Text>
                <TouchableOpacity onPress={() => setShowForgotModal(false)}>
                  <X size={20} color="#888" />
                </TouchableOpacity>
              </View>

              {recoveryStep === "questions" ? (
                <ScrollView>
                  <Text style={styles.recoveryDesc}>
                    {t("recovery_desc", "Answer your two security questions to unlock and reset your passcode:")}
                  </Text>
                  <Text style={styles.recoveryQuestion}>{t("recovery_q1", "1. What is your primary school name?")}</Text>
                  <TextInput
                    value={forgotSchool}
                    onChangeText={setForgotSchool}
                    placeholder={t("school_name_placeholder", "Enter school name")}
                    placeholderTextColor="#A07283"
                    style={styles.setupInput}
                  />

                  <Text style={styles.recoveryQuestion}>{t("recovery_q2", "2. What is your nickname during your childhood?")}</Text>
                  <TextInput
                    value={forgotNickname}
                    onChangeText={setForgotNickname}
                    placeholder={t("nickname_name_placeholder", "Enter childhood nickname")}
                    placeholderTextColor="#A07283"
                    style={styles.setupInput}
                  />

                  {recoveryError ? <Text style={styles.setupErrorText}>{recoveryError}</Text> : null}

                  <TouchableOpacity style={styles.setupSaveBtn} onPress={handleVerifyRecovery}>
                    <Text style={styles.setupSaveBtnText}>{t("verify_answers", "Verify Answers")}</Text>
                  </TouchableOpacity>
                </ScrollView>
              ) : (
                <ScrollView>
                  <Text style={styles.recoveryDesc}>
                    {t("identity_verified", "Identity verified! Choose a new 4-digit passcode for your diary.")}
                  </Text>
                  <TextInput
                    value={newResetPin}
                    onChangeText={setNewResetPin}
                    placeholder={t("new_pin_placeholder", "New 4-digit PIN")}
                    placeholderTextColor="#A07283"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    style={styles.setupInput}
                  />
                  <TextInput
                    value={newResetConfirmPin}
                    onChangeText={setNewResetConfirmPin}
                    placeholder={t("confirm_new_pin_placeholder", "Confirm new 4-digit PIN")}
                    placeholderTextColor="#A07283"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    style={styles.setupInput}
                  />

                  {recoveryError ? <Text style={styles.setupErrorText}>{recoveryError}</Text> : null}

                  <TouchableOpacity style={styles.setupSaveBtn} onPress={handleResetPinSubmit}>
                    <Text style={styles.setupSaveBtnText}>{t("save_new_passcode", "Save New Passcode")}</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>

        {/* JUMP TO SPECIFIC DAY MODAL */}
        <Modal
          visible={showDayJumpModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDayJumpModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.jumpCard}>
              <Text style={styles.jumpTitle}>{t("jump_to_day_title", "Jump to Pregnancy Day")}</Text>
              <Text style={styles.jumpSubtitle}>
                {t("jump_to_day_desc", "Enter any day from Day 1 (Conception) to Day 280 (End of labor):")}
              </Text>
              <TextInput
                value={jumpDayInput}
                onChangeText={setJumpDayInput}
                placeholder="1 - 280"
                placeholderTextColor="#A07283"
                keyboardType="numeric"
                style={styles.jumpInput}
              />
              <View style={styles.jumpButtonsRow}>
                <TouchableOpacity style={styles.jumpCancelBtn} onPress={() => setShowDayJumpModal(false)}>
                  <Text style={styles.jumpCancelText}>{t("cancel", "Cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.jumpSubmitBtn}
                  onPress={() => {
                    const d = parseInt(jumpDayInput, 10);
                    if (!isNaN(d) && d >= 1 && d <= 280) {
                      setCurrentDayNumber(d);
                      setShowDayJumpModal(false);
                      setJumpDayInput("");
                    } else {
                      Alert.alert(
                        t("invalid_day_title", "Invalid Day"),
                        t("invalid_day_desc", "Please enter a day between 1 and 280.")
                      );
                    }
                  }}
                >
                  <Text style={styles.jumpSubmitText}>{t("turn_to_day", "Turn to Day")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#2B1119",
  },

  // ─── Setup Screen ──────────────────────────────────────────────────────────
  setupScroll: {
    padding: 24,
    paddingTop: 36,
    alignItems: "center",
    backgroundColor: "#FCE4EC",
    minHeight: "100%",
  },
  setupIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    ...shadows.default,
  },
  setupTitle: {
    fontSize: 22,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: PINK.textDark,
    textAlign: "center",
    marginBottom: 6,
  },
  setupSubtitle: {
    fontSize: 13,
    fontFamily: fonts.sans,
    color: PINK.textMuted,
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  setupCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 22,
    ...shadows.soft,
  },
  setupSectionLabel: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
    color: PINK.coverDeep,
    letterSpacing: 1,
    marginBottom: 8,
  },
  questionLabel: {
    fontSize: 13,
    fontFamily: fonts.sansMedium,
    color: PINK.textDark,
    marginTop: 8,
    marginBottom: 4,
  },
  setupInput: {
    backgroundColor: "#FFF0F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F8BBD0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: fonts.sans,
    color: PINK.textDark,
    marginBottom: 8,
  },
  setupErrorText: {
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    color: "#D32F2F",
    marginVertical: 6,
    textAlign: "center",
  },
  setupSaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: PINK.coverDeep,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 14,
    ...shadows.sm,
  },
  setupSaveBtnText: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 6,
  },
  cancelBtnText: {
    color: PINK.textMuted,
    fontSize: 13,
    fontFamily: fonts.sansMedium,
  },

  // ─── Locked Screen: Perfectly Responsive & Integrated Keypad ───────────────
  lockedScreen: {
    flex: 1,
    backgroundColor: "#2E101B",
    justifyContent: "space-between",
  },
  lockTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 4,
  },
  lockCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  lockHeaderTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.4)",
  },
  lockHeaderTagText: {
    fontSize: 10,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
    color: PINK.goldLight,
    letterSpacing: 1,
  },

  stageContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  // Pure Animated Diary Cover
  animatedBook: {
    width: Math.min(230, WINDOW_WIDTH * 0.58),
    height: Math.min(270, WINDOW_HEIGHT * 0.32),
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  bookSpine: {
    position: "absolute",
    left: -8,
    top: 4,
    bottom: 4,
    width: 14,
    backgroundColor: PINK.spine,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  bookPagesLayer: {
    position: "absolute",
    right: -7,
    top: 6,
    bottom: 6,
    width: 10,
    backgroundColor: "#FFF8EA",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: "#EADDC7",
    zIndex: 1,
  },
  leatherCoverFront: {
    width: "100%",
    height: "100%",
    backgroundColor: PINK.coverBg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: PINK.leatherBorder,
    padding: 8,
    justifyContent: "center",
    zIndex: 2,
    ...shadows.soft,
  },
  coverStitchBorder: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: PINK.stitch,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  coverHeaderArea: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  coverEmbossSub: {
    fontSize: 14,
    fontFamily: fonts.serif,
    color: PINK.goldLight,
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
  coverEmbossDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 4,
  },
  dividerLine: {
    width: 24,
    height: 1,
    backgroundColor: PINK.goldLight,
  },
  coverEmbossMain: {
    fontSize: 20,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 1.5,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  coverEmbossFooter: {
    fontSize: 9,
    fontFamily: fonts.sansMedium,
    color: PINK.stitch,
    letterSpacing: 1,
    marginTop: 4,
  },

  // Clasp & Heart Lock Assembly
  claspAssembly: {
    position: "absolute",
    right: -18,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  claspStrap: {
    width: 32,
    height: 24,
    backgroundColor: PINK.strap,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: PINK.strapBorder,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  claspStitch: {
    height: 1,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.7)",
  },
  lockContainer: {
    marginLeft: -8,
    alignItems: "center",
    position: "relative",
  },
  goldShackle: {
    width: 18,
    height: 16,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderWidth: 3.5,
    borderColor: PINK.goldLight,
    borderBottomWidth: 0,
    marginBottom: -8,
    zIndex: 1,
  },
  goldHeartPadlock: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  keyholeShape: {
    position: "absolute",
    alignItems: "center",
  },
  keyholeTop: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3A2100",
  },
  keyholeBottom: {
    width: 3,
    height: 6,
    backgroundColor: "#3A2100",
    marginTop: -1,
  },
  animatedHeartKey: {
    position: "absolute",
    top: -13,
    alignSelf: "center",
    alignItems: "center",
    zIndex: 5,
  },
  chainLink: {
    width: 1.5,
    height: 12,
    backgroundColor: PINK.gold,
  },
  keyHeartBow: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  keyShaft: {
    width: 2.5,
    height: 10,
    backgroundColor: PINK.gold,
    marginTop: -2,
  },
  keyBit: {
    width: 5,
    height: 3,
    backgroundColor: PINK.gold,
    alignSelf: "flex-end",
    marginRight: 6,
    marginTop: -4,
  },

  // Compact Keypad (Fits screen perfectly without scroll)
  keypadWrapper: {
    width: "100%",
    maxWidth: 280,
    backgroundColor: "rgba(255,240,245,0.96)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    ...shadows.default,
  },
  keypadInstruction: {
    fontSize: 9.5,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
    color: PINK.coverDeep,
    letterSpacing: 1,
    marginBottom: 5,
  },
  heartBulletsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 5,
  },
  bulletItem: {
    padding: 2,
  },
  pinErrorPrompt: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    color: "#D32F2F",
    marginBottom: 4,
  },
  compactGrid: {
    width: "100%",
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 5,
  },
  keyNumBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F8BBD0",
    ...shadows.sm,
  },
  keyNumText: {
    fontSize: 18,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
    color: PINK.textDark,
  },
  keyAuxBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  keyAuxText: {
    fontSize: 9,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
    color: PINK.coverDeep,
    marginTop: 2,
  },

  // ─── UNLOCKED: AUTHENTIC VINTAGE LINED NOTEBOOK DIARY PAGE ───────────────────
  journalContainer: {
    flex: 1,
    backgroundColor: "#FCE4EC",
  },
  pageTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F8BBD0",
  },
  lockClosePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: PINK.coverDeep,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    ...shadows.sm,
  },
  lockClosePillText: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
  },
  todayJumpBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF0F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PINK.coverBg,
  },
  todayJumpBtnActive: {
    backgroundColor: PINK.coverDeep,
    borderColor: PINK.coverDeep,
  },
  todayJumpBtnText: {
    color: PINK.textDark,
    fontSize: 12,
    fontFamily: fonts.sansMedium,
  },
  todayJumpBtnTextActive: {
    color: "#FFF",
    fontWeight: "700",
  },

  // Page Header
  pageHeaderBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F8BBD0",
  },
  pageNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF0F5",
    alignItems: "center",
    justifyContent: "center",
  },
  pageNavBtnDisabled: {
    opacity: 0.3,
  },
  pageHeaderCenter: {
    alignItems: "center",
  },
  dayRibbon: {
    backgroundColor: PINK.coverDeep,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 2,
  },
  dayRibbonText: {
    color: "#FFF",
    fontSize: 10,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
    letterSpacing: 1,
  },
  pageDateText: {
    fontSize: 15,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: PINK.textDark,
  },
  pageMetaText: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: PINK.textMuted,
  },

  pageStatusRow: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#FFF",
  },
  statusPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusPillToday: {
    backgroundColor: "#FCE4EC",
    borderWidth: 1,
    borderColor: "#F48FB1",
  },
  statusPillTodayText: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    color: PINK.coverDeep,
    textAlign: "center",
  },
  statusPillPast: {
    backgroundColor: "#F5EFF2",
    borderWidth: 1,
    borderColor: "#D9C9D0",
  },
  statusPillPastText: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    color: "#6D4C56",
    textAlign: "center",
  },
  statusPillFuture: {
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  statusPillFutureText: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    color: "#8D6E63",
    textAlign: "center",
  },

  // REALISTIC NOTEBOOK LINED PAGE CONTAINER
  pageOuterLeatherFrame: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#F48FB1",
    overflow: "hidden",
    ...shadows.default,
  },
  realParchmentPage: {
    flex: 1,
    backgroundColor: PINK.parchment,
  },
  parchmentContent: {
    padding: 18,
    paddingLeft: 28,
    position: "relative",
  },
  notebookMarginRule: {
    position: "absolute",
    left: 20,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: PINK.pageMargin,
    opacity: 0.35,
  },

  // Page Mood
  pageMoodRow: {
    marginBottom: 14,
  },
  pagePromptLabel: {
    fontSize: 10,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
    color: PINK.coverDeep,
    letterSpacing: 1,
    marginBottom: 6,
  },
  moodPillsInline: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodPillSmall: {
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F8BBD0",
    minWidth: 42,
  },
  moodPillSmallActive: {
    backgroundColor: "#FCE4EC",
    borderColor: PINK.coverDeep,
    borderWidth: 1.5,
  },
  moodPillDisabled: {
    opacity: 0.75,
  },
  moodSmallEmoji: {
    fontSize: 16,
  },
  moodSmallLabel: {
    fontSize: 9,
    fontFamily: fonts.sansMedium,
    color: PINK.textMuted,
  },
  moodSmallLabelActive: {
    color: PINK.coverDeep,
    fontWeight: "700",
  },

  // Lined Page Blocks (Seamless continuous lined notebook page layout)
  linedPromptBlock: {
    marginBottom: 16,
    backgroundColor: "transparent",
    paddingHorizontal: 2,
  },
  linedPromptHeader: {
    marginBottom: 4,
  },
  linedPromptTitle: {
    fontSize: 14.5,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: PINK.textDark,
  },
  linedPromptSub: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: PINK.textMuted,
    marginTop: 1,
    fontStyle: "italic",
  },

  // Notebook Lined Input
  notebookLinedInput: {
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14.5,
    fontFamily: fonts.serif,
    color: PINK.textDark,
    minHeight: 75,
    textAlignVertical: "top",
    lineHeight: 24,
    borderBottomWidth: 1.5,
    borderBottomColor: "rgba(240, 98, 146, 0.35)",
  },
  sealedLinedTextWrap: {
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    borderRadius: 10,
    padding: 10,
    minHeight: 50,
  },
  sealedLinedText: {
    fontSize: 13.5,
    fontFamily: fonts.serif,
    color: "#5C2938",
    lineHeight: 21,
    fontStyle: "italic",
  },

  // Page Seal / Save Area
  pageSealFooter: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  pageSaveToast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#388E3C",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 10,
    ...shadows.sm,
  },
  pageSaveToastText: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
  },
  savePageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: PINK.coverDeep,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    ...shadows.default,
  },
  savePageBtnText: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
  },
  pageSealHint: {
    fontSize: 10.5,
    fontFamily: fonts.sans,
    color: PINK.textMuted,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 15,
  },
  archivalSealWrap: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6C5D0",
  },
  waxSealEmblem: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FCE4EC",
    borderWidth: 2,
    borderColor: PINK.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  archivalSealText: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
    color: PINK.coverDeep,
    letterSpacing: 1,
  },
  archivalSealSub: {
    fontSize: 10,
    fontFamily: fonts.sans,
    color: PINK.textMuted,
    textAlign: "center",
    marginTop: 3,
  },
  futurePageSealWrap: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FFF8E1",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  futurePageTitle: {
    fontSize: 14,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: "#8D6E63",
    marginTop: 6,
  },
  futurePageSub: {
    fontSize: 11,
    fontFamily: fonts.sans,
    color: "#8D6E63",
    textAlign: "center",
    marginTop: 3,
  },

  // ─── Modal Backdrops ───────────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  recoveryCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 22,
    maxHeight: WINDOW_HEIGHT * 0.8,
    ...shadows.soft,
  },
  recoveryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  recoveryTitle: {
    fontSize: 17,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: PINK.textDark,
  },
  recoveryDesc: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: PINK.textMuted,
    lineHeight: 17,
    marginBottom: 12,
  },
  recoveryQuestion: {
    fontSize: 12,
    fontFamily: fonts.sansMedium,
    color: PINK.textDark,
    marginTop: 6,
    marginBottom: 3,
  },

  jumpCard: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    ...shadows.soft,
  },
  jumpTitle: {
    fontSize: 17,
    fontFamily: fonts.serif,
    fontWeight: "700",
    color: PINK.textDark,
    marginBottom: 4,
  },
  jumpSubtitle: {
    fontSize: 12,
    fontFamily: fonts.sans,
    color: PINK.textMuted,
    textAlign: "center",
    marginBottom: 14,
  },
  jumpInput: {
    width: "100%",
    backgroundColor: "#FFF0F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F8BBD0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
    color: PINK.textDark,
    textAlign: "center",
    marginBottom: 14,
  },
  jumpButtonsRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  jumpCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFF0F5",
    alignItems: "center",
  },
  jumpCancelText: {
    fontSize: 13,
    fontFamily: fonts.sansMedium,
    color: PINK.textMuted,
  },
  jumpSubmitBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: PINK.coverDeep,
    alignItems: "center",
  },
  jumpSubmitText: {
    fontSize: 13,
    fontFamily: fonts.sansMedium,
    fontWeight: "700",
    color: "#FFF",
  },
});
