import { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import {
  Heart,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Activity,
  ShieldCheck,
  Flower2,
  Clock,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react-native";
import { LanguageSelector } from "@/components/LanguageSelector";
import { EmergencySupportButton } from "@/components/EmergencySupportButton";
import { speakText, stopSpeaking, localeForLanguage } from "../../src/utils/tts";

import { addSession } from "@/db/helpers";
import { useApp } from "@/context/AppContext";
import { formatToday, pregnancyWeek } from "@/services/date";
import { colors, fonts } from "@/constants/theme";
import {
  getYogaRoutineForTrimester,
  getLocalizedPoseTitle,
  getLocalizedPoseBenefit,
} from "@/data/yoga_data";

export default function YogaScreen() {
  const router = useRouter();
  const { db, profile, selectedLanguage, t } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const journeyWeek = pregnancyWeek(profile?.due_date ?? "");
  const defaultTrimester = journeyWeek <= 13 ? 1 : journeyWeek <= 27 ? 2 : 3;
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(defaultTrimester);

  const poses = useMemo(() => getYogaRoutineForTrimester(selectedTrimester), [selectedTrimester]);

  const [index, setIndex] = useState(0);
  const pose = poses[index] ?? poses[0];

  const [remaining, setRemaining] = useState(pose.durationSeconds ?? 0);
  const [currentReps, setCurrentReps] = useState(0);
  const [running, setRunning] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);

  const speakYogaSummary = async () => {
    const locale = localeForLanguage(selectedLanguage);
    const summary =
      pose.type === "timer"
        ? `Pregnancy wellness yoga. Current pose: ${getLocalizedPoseTitle(pose.title, selectedLanguage)}. Duration ${pose.durationSeconds} seconds.`
        : `Pregnancy wellness yoga. Current pose: ${getLocalizedPoseTitle(pose.title, selectedLanguage)}. Target ${pose.reps} repetitions.`;

    if (isSpeaking) {
      await stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      await speakText(summary, locale);
    } catch (err) {
      console.debug("TTS failed on Yoga", err);
    } finally {
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    setRemaining(pose.durationSeconds ?? 0);
    setCurrentReps(0);
    setRunning(false);
  }, [pose.id, pose.durationSeconds]);

  useEffect(() => {
    if (pose.type === "reps") return;
    if (!running || remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining((value) => value - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running, remaining, pose.type]);

  useEffect(() => {
    if (pose.type === "timer" && remaining === 0 && running) {
      setRunning(false);
      recordSession();
      if (voiceOn) {
        speakText("Time's up! Exercise complete. Wonderful job, Mama.", localeForLanguage(selectedLanguage));
      }
    }
  }, [remaining, running, pose.type, voiceOn, selectedLanguage]);

  const recordSession = () => {
    addSession(db, {
      date: formatToday(),
      posesCompleted: [pose.title],
      durationSeconds: pose.durationSeconds ?? currentReps * 5,
    }).catch(() => undefined);
  };

  const timerText = useMemo(() => {
    if (pose.type === "timer") {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      return `${m}:${String(s).padStart(2, "0")}`;
    }
    return `${currentReps}/${pose.reps} ${t("reps_label", "Reps")}`;
  }, [remaining, currentReps, pose, t]);

  const onPrimaryAction = () => {
    const locale = localeForLanguage(selectedLanguage);
    if (pose.type === "timer") {
      if (remaining <= 0) {
        setRemaining(pose.durationSeconds ?? 0);
        setRunning(true);
        if (voiceOn) speakText("Starting timer.", locale);
        return;
      }
      const willRun = !running;
      setRunning(willRun);
      if (voiceOn) speakText(willRun ? "Timer started." : "Timer paused.", locale);
    } else {
      const maxReps = pose.reps ?? 10;
      const newReps = Math.min(currentReps + 1, maxReps);
      setCurrentReps(newReps);
      if (newReps === maxReps && currentReps < maxReps) {
        if (voiceOn) speakText("Target reached! Exercise complete.", locale);
        recordSession();
      }
    }
  };

  const onReset = () => {
    setRunning(false);
    setRemaining(pose.durationSeconds ?? 0);
    setCurrentReps(0);
  };

  const onNextPose = () => {
    if (pose.type === "reps" && currentReps > 0) {
      recordSession();
    }
    const next = index + 1;
    if (next >= poses.length) {
      setIndex(0);
      return;
    }
    setIndex(next);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header Bar */}
      <View style={styles.headerWrap}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Flower2 size={18} color="#D64A73" />
          </View>
          <View>
            <Text style={styles.logoText}>Maternal</Text>
            <View style={styles.aiRow}>
              <View style={styles.aiDot} />
              <Text style={styles.aiText}>WELLNESS & YOGA</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <LanguageSelector />
          <EmergencySupportButton onPress={() => router.push("/emergency")} />
          <TouchableOpacity
            style={styles.iconPillBtn}
            onPress={() => speakYogaSummary().catch(() => undefined)}
            accessibilityLabel="Audio summary"
          >
            {isSpeaking ? <VolumeX size={16} color="#2563EB" /> : <Volume2 size={16} color="#2563EB" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Trimester Selector Row */}
      <View style={styles.trimesterRow}>
        {[1, 2, 3].map((tri) => {
          const active = selectedTrimester === tri;
          return (
            <TouchableOpacity
              key={tri}
              style={[styles.trimesterPill, active && styles.trimesterPillActive]}
              onPress={() => {
                setSelectedTrimester(tri as 1 | 2 | 3);
                setIndex(0);
              }}
              activeOpacity={0.85}
            >
              <Text style={[styles.trimesterText, active && styles.trimesterTextActive]}>
                {t("trimester_prefix", "Trimester")} {tri}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Main Pose Featured Card (Soft Blue Background with Pink Accents) */}
      <View style={styles.poseCard}>
        {/* Pose Title & Step */}
        <View style={styles.poseHeadRow}>
          <View style={styles.flexOne}>
            <View style={styles.categoryPillBlue}>
              <Text style={styles.categoryPillTextBlue}>
                {t("step_label", "Step")} {index + 1} of {poses.length}
              </Text>
            </View>
            <Text style={styles.poseTitle}>{getLocalizedPoseTitle(pose.title, selectedLanguage)}</Text>
          </View>

          {/* Timer / Reps Badge */}
          <View style={styles.timerPill}>
            <Clock size={15} color="#2563EB" />
            <Text style={styles.timerPillText}>{timerText}</Text>
          </View>
        </View>

        {/* Large Exercise Illustration */}
        <View style={styles.illustrationWrap}>
          <Image source={pose.image} style={styles.illustrationImage} resizeMode="contain" />
          {pose.type === "timer" && !running && (
            <TouchableOpacity style={styles.playOverlayBtn} onPress={onPrimaryAction} activeOpacity={0.85}>
              <Play size={28} color="#30343B" fill="#30343B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Badges Row: Trimester, Difficulty, Safe Level */}
        <View style={styles.metaBadgesRow}>
          <View style={styles.metaBadgeBlue}>
            <Text style={styles.metaBadgeTextBlue}>
              {t("trimester_prefix", "Trimester")} {selectedTrimester}
            </Text>
          </View>
          <View style={styles.metaBadgePink}>
            <Text style={styles.metaBadgeTextPink}>{t("gentle_difficulty", "Gentle Difficulty")}</Text>
          </View>
          <View style={styles.metaBadgeGreen}>
            <ShieldCheck size={12} color="#10B981" />
            <Text style={styles.metaBadgeTextGreen}>{t("pregnancy_safe", "Doctor Verified")}</Text>
          </View>
        </View>

        {/* Instructions & Clinical Benefits */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHead}>
            <Sparkles size={16} color="#2563EB" />
            <Text style={styles.instructionsHeadText}>{t("pose_instructions", "Guidance & Benefits")}</Text>
          </View>
          <Text style={styles.instructionsText}>
            {getLocalizedPoseBenefit(pose.title, pose.benefit, selectedLanguage)}
          </Text>
        </View>

        {/* Safety Information Box */}
        <View style={styles.safetyCard}>
          <Info size={16} color="#2563EB" />
          <Text style={styles.safetyText}>
            <Text style={styles.safetyBold}>{t("safety_label", "Safety Notice:")}</Text>{" "}
            {t(
              "safety_notice_desc",
              "Never hold your breath or strain. Use wall or chair support for balance and hydrate continuously."
            )}
          </Text>
        </View>

        {/* Interactive Controls Row */}
        <View style={styles.controlsRow}>
          {pose.type === "timer" ? (
            <TouchableOpacity style={styles.primaryActionBtn} onPress={onPrimaryAction} activeOpacity={0.85}>
              {running ? (
                <VolumeX size={18} color="#30343B" />
              ) : (
                <Play size={18} color="#30343B" fill="#30343B" />
              )}
              <Text style={styles.primaryActionBtnText}>{running ? t("pause", "Pause") : t("start", "Start")}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={onPrimaryAction}
              disabled={currentReps >= (pose.reps ?? 10)}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryActionBtnText}>
                {currentReps >= (pose.reps ?? 10) ? t("completed", "Completed") : t("add_rep", "+ Add Rep")}
              </Text>
            </TouchableOpacity>
          )}

          {/* Reset Button */}
          <TouchableOpacity style={styles.secondaryActionBtn} onPress={onReset} activeOpacity={0.85}>
            <RotateCcw size={16} color="#6F7480" />
            <Text style={styles.secondaryActionBtnText}>{t("reset", "Reset")}</Text>
          </TouchableOpacity>

          {/* Voice Coach Button */}
          <TouchableOpacity
            style={[styles.secondaryActionBtn, voiceOn && styles.voiceActiveBtn]}
            onPress={() => setVoiceOn((v) => !v)}
            activeOpacity={0.85}
          >
            <Volume2 size={16} color={voiceOn ? "#2563EB" : "#6F7480"} />
            <Text style={[styles.secondaryActionBtnText, voiceOn && styles.voiceActiveText]}>
              {t("voice", "Voice")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Next Pose Button */}
        <TouchableOpacity style={styles.nextPoseBtn} onPress={onNextPose} activeOpacity={0.85}>
          <Text style={styles.nextPoseBtnText}>{t("next_pose", "Next Exercise")}</Text>
          <ChevronRight size={16} color="#30343B" />
        </TouchableOpacity>
      </View>

      {/* Routine Quick Switcher (All Poses in Trimester) */}
      <View style={styles.routineSection}>
        <Text style={styles.routineSectionTitle}>
          {t("routine_title", "Trimester")} {selectedTrimester} {t("all_exercises", "Exercises")}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.routineList}>
          {poses.map((p, idx) => {
            const isCurrent = idx === index;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.routineCard, isCurrent && styles.routineCardActive]}
                onPress={() => setIndex(idx)}
                activeOpacity={0.85}
              >
                <Image source={p.image} style={styles.routineThumb} resizeMode="contain" />
                <Text style={[styles.routineTitle, isCurrent && styles.routineTitleActive]} numberOfLines={1}>
                  {getLocalizedPoseTitle(p.title, selectedLanguage)}
                </Text>
                <Text style={styles.routineDuration}>
                  {p.type === "timer" ? `${p.durationSeconds}s` : `${p.reps} reps`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAFBFD",
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  flexOne: {
    flex: 1,
  },

  /* Header Bar */
  headerWrap: {
    marginTop: 12,
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F0F4F8",
    shadowColor: "#2F3B52",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FDE7EF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F8C8D8",
  },
  logoText: {
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: "700",
    color: "#30343B",
  },
  aiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 1,
  },
  aiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  aiText: {
    color: "#6F7480",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconPillBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E6F4FC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFDFF5",
  },

  /* Trimester Selector Row */
  trimesterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trimesterPill: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  trimesterPillActive: {
    backgroundColor: "#E6F4FC",
    borderColor: "#BFDFF5",
  },
  trimesterText: {
    color: "#6F7480",
    fontSize: 12,
    fontWeight: "700",
  },
  trimesterTextActive: {
    color: "#2563EB",
    fontWeight: "800",
  },

  /* Main Featured Pose Card */
  poseCard: {
    backgroundColor: colors.white,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: "#BFDFF5",
    shadowColor: "#BFDFF5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 3,
    gap: 14,
  },
  poseHeadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  categoryPillBlue: {
    backgroundColor: "#E6F4FC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  categoryPillTextBlue: {
    color: "#2563EB",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  poseTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: "800",
    color: "#30343B",
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E6F4FC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BFDFF5",
  },
  timerPillText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "800",
  },

  /* Exercise Illustration Frame */
  illustrationWrap: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 20,
    backgroundColor: "#F8FAFD",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  illustrationImage: {
    width: "92%",
    height: "92%",
  },
  playOverlayBtn: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F8C8D8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  /* Meta Badges */
  metaBadgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaBadgeBlue: {
    backgroundColor: "#E6F4FC",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  metaBadgeTextBlue: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "800",
  },
  metaBadgePink: {
    backgroundColor: "#FDE7EF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  metaBadgeTextPink: {
    color: "#D64A73",
    fontSize: 11,
    fontWeight: "800",
  },
  metaBadgeGreen: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  metaBadgeTextGreen: {
    color: "#059669",
    fontSize: 11,
    fontWeight: "800",
  },

  /* Instructions Card */
  instructionsCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  instructionsHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  instructionsHeadText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "800",
  },
  instructionsText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
  },

  /* Safety Card */
  safetyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E6F4FC",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BFDFF5",
  },
  safetyBold: {
    color: "#2563EB",
    fontWeight: "800",
  },
  safetyText: {
    color: "#1E40AF",
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
    fontWeight: "500",
  },

  /* Controls Row */
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  primaryActionBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: 20,
    backgroundColor: "#F8C8D8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#F3A9C1",
    shadowColor: "#F8C8D8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryActionBtnText: {
    color: "#30343B",
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryActionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  secondaryActionBtnText: {
    color: "#6F7480",
    fontSize: 12,
    fontWeight: "700",
  },
  voiceActiveBtn: {
    backgroundColor: "#E6F4FC",
    borderColor: "#BFDFF5",
  },
  voiceActiveText: {
    color: "#2563EB",
    fontWeight: "800",
  },

  /* Next Pose Button */
  nextPoseBtn: {
    height: 44,
    borderRadius: 18,
    backgroundColor: "#F8FAFD",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  nextPoseBtnText: {
    color: "#30343B",
    fontSize: 13,
    fontWeight: "700",
  },

  /* Routine Quick Switcher */
  routineSection: {
    marginTop: 4,
    gap: 10,
  },
  routineSectionTitle: {
    color: "#6F7480",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  routineList: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 2,
  },
  routineCard: {
    width: 110,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  routineCardActive: {
    borderColor: "#F8C8D8",
    backgroundColor: "#FDE7EF",
    borderWidth: 2,
  },
  routineThumb: {
    width: 60,
    height: 50,
    marginBottom: 6,
  },
  routineTitle: {
    color: "#30343B",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  routineTitleActive: {
    color: "#D64A73",
    fontWeight: "800",
  },
  routineDuration: {
    color: "#6F7480",
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
  },

  bottomPad: {
    height: 30,
  },
});
