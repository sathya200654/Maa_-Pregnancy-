import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import {
  Heart,
  Volume2,
  VolumeX,
  CalendarDays,
  Sparkles,
  ChevronRight,
  Baby,
  Apple,
  Flower2,
  Activity,
  Pill,
  Clock,
  Footprints,
  MessageSquare,
  Stethoscope,
} from "lucide-react-native";
import Svg, { Circle, Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { LanguageSelector } from "@/components/LanguageSelector";
import { EmergencySupportButton } from "@/components/EmergencySupportButton";
import { speakText, stopSpeaking, localeForLanguage } from "../../src/utils/tts";

import { useApp } from "@/context/AppContext";
import { cacheAffirmation, getCachedAffirmation, getKickCount, getSymptomLogsByDate, getTodayEntry, upsertEntry } from "@/db/helpers";
import { PlanSection } from "@/components/PlanSection";
import { AppointmentsModal } from "@/components/AppointmentsModal";
import pregnancyInsightsData from "@/data/pregnancy_insights.json";
import localizedInsightsData from "@/data/localized_insights.json";
import { colors, fonts } from "@/constants/theme";
import { displayDate, formatToday, pregnancyWeek, trimesterFromWeek, validateDueDate } from "@/services/date";
import { fetchAffirmation } from "@/services/api";

type HomeCopy = {
  heroKicker: string;
  welcomeTitle: string;
  dueWeekTitle: (week: number) => string;
  heroSubtitle: string;
  datePlaceholder: string;
  startChat: string;
  howAreYouFeeling: string;
  lastMoodPrefix: string;
  dailyInsight: string;
  nextAppointment: string;
  noUpcomingVisits: string;
  healthFeed: string;
  readMore: string;
  pregnancy: string;
  setDueDate: string;
  babySizePrefix: string;
  babySizeFallback: string;
  filterLabels: Record<string, string>;
  moodLabels: Record<string, string>;
  trimesterLabel: (week: number) => string;
};

const homeCopy: Record<string, HomeCopy> = {
  English: {
    heroKicker: "PREGNANCY JOURNEY",
    welcomeTitle: "Good Morning, Mom",
    dueWeekTitle: (week: number) => `Week ${week}`,
    heroSubtitle: "Set your due date to track your pregnancy journey.",
    datePlaceholder: "mm/dd/yyyy",
    startChat: "Start Chat",
    howAreYouFeeling: "HOW ARE YOU FEELING?",
    lastMoodPrefix: "Last:",
    dailyInsight: "DAILY INSIGHT",
    nextAppointment: "NEXT APPOINTMENT",
    noUpcomingVisits: "No upcoming visits scheduled",
    healthFeed: "HEALTH FEED",
    readMore: "Read More",
    pregnancy: "PREGNANCY",
    setDueDate: "Set Due Date",
    babySizePrefix: "Baby is the size of a",
    babySizeFallback: "Baby is growing beautifully...",
    filterLabels: {
      All: "All",
      Nutrition: "Nutrition",
      Exercise: "Exercise",
      Menth: "Mental",
    },
    moodLabels: {
      HAPPY: "HAPPY",
      CALM: "CALM",
      TIRED: "TIRED",
      ANXIOUS: "ANXIOUS",
      EXCITED: "EXCITED",
    },
    trimesterLabel: (week: number) => trimesterFromWeek(week).toUpperCase(),
  },
  தமிழ்: {
    heroKicker: "கர்ப்ப பயணம்",
    welcomeTitle: "காலை வணக்கம், அம்மா",
    dueWeekTitle: (week: number) => `வாரம் ${week}`,
    heroSubtitle: "உங்கள் கர்ப்ப முன்னேற்றத்தை கண்காணிக்க due date-ஐ அமைக்கவும்.",
    datePlaceholder: "mm/dd/yyyy",
    startChat: "உரையாடல் தொடங்கு",
    howAreYouFeeling: "நீங்கள் எப்படி உணர்கிறீர்கள்?",
    lastMoodPrefix: "கடைசி:",
    dailyInsight: "இன்றைய குறிப்புரை",
    nextAppointment: "அடுத்த சந்திப்பு",
    noUpcomingVisits: "வரவிருக்கும் சந்திப்புகள் இல்லை",
    healthFeed: "ஆரோக்கிய செய்தி",
    readMore: "மேலும் படிக்க",
    pregnancy: "கர்ப்பம்",
    setDueDate: "Due date அமைக்கவும்",
    babySizePrefix: "குழந்தையின் அளவு போல",
    babySizeFallback: "குழந்தையின் அளவு போல ...",
    filterLabels: {
      All: "அனைத்தும்",
      Nutrition: "உணவு",
      Exercise: "உடற்பயிற்சி",
      Menth: "மனம்",
    },
    moodLabels: {
      HAPPY: "மகிழ்ச்சி",
      CALM: "அமைதி",
      TIRED: "சோர்வு",
      ANXIOUS: "கவலை",
      EXCITED: "உற்சாகம்",
    },
    trimesterLabel: (week: number) => trimesterFromWeek(week).toUpperCase(),
  },
  हिन्दी: {
    heroKicker: "गर्भावस्था यात्रा",
    welcomeTitle: "शुभ प्रभात, माँ",
    dueWeekTitle: (week: number) => `सप्ताह ${week}`,
    heroSubtitle: "अपनी गर्भावस्था की प्रगति ट्रैक करने के लिए due date सेट करें।",
    datePlaceholder: "mm/dd/yyyy",
    startChat: "चैट शुरू करें",
    howAreYouFeeling: "आप कैसा महसूस कर रही हैं?",
    lastMoodPrefix: "अंतिम:",
    dailyInsight: "दैनिक अंतर्दृष्टि",
    nextAppointment: "अगली अपॉइंटमेंट",
    noUpcomingVisits: "कोई आगामी विज़िट निर्धारित नहीं है",
    healthFeed: "स्वास्थ्य फ़ीड",
    readMore: "और पढ़ें",
    pregnancy: "गर्भावस्था",
    setDueDate: "Due date सेट करें",
    babySizePrefix: "शिशु का आकार",
    babySizeFallback: "शिशु का आकार ...",
    filterLabels: {
      All: "सभी",
      Nutrition: "पोषण",
      Exercise: "व्यायाम",
      Menth: "मानसिक",
    },
    moodLabels: {
      HAPPY: "प्रसन्न",
      CALM: "शांत",
      TIRED: "थका हुआ",
      ANXIOUS: "चिंतित",
      EXCITED: "उत्साहित",
    },
    trimesterLabel: (week: number) => trimesterFromWeek(week),
  },
  ಕನ್ನಡ: {
    heroKicker: "ಗರ್ಭಧಾರಣೆಯ ಪ್ರಯಾಣ",
    welcomeTitle: "ಶುಭೋದಯ, ತಾಯಿ",
    dueWeekTitle: (week: number) => `ವಾರ ${week}`,
    heroSubtitle: "ನಿಮ್ಮ ಗರ್ಭಧಾರಣೆಯ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು due date ಅನ್ನು ಹೊಂದಿಸಿ.",
    datePlaceholder: "mm/dd/yyyy",
    startChat: "ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ",
    howAreYouFeeling: "ನೀವು ಹೇಗೆ ಭಾವಿಸುತ್ತಿದ್ದೀರಿ?",
    lastMoodPrefix: "ಕೊನೆಯ:",
    dailyInsight: "ದೈನಂದಿನ ಒಳನೋಟ",
    nextAppointment: "ಮುಂದಿನ ಅಪಾಯಿಂಟ್ಮೆಂಟ್",
    noUpcomingVisits: "ಯಾವುದೇ ಭೇಟಿಗಳು ನಿಗದಿಯಾಗಿಲ್ಲ",
    healthFeed: "ಆರೋಗ್ಯ ಫೀಡ್",
    readMore: "ಇನ್ನಷ್ಟು ಓದಿ",
    pregnancy: "ಗರ್ಭಧಾರಣೆ",
    setDueDate: "Due date ಹೊಂದಿಸಿ",
    babySizePrefix: "ಮಗುವಿನ ಗಾತ್ರ",
    babySizeFallback: "ಮಗುವಿನ ಗಾತ್ರ ...",
    filterLabels: {
      All: "ಎಲ್ಲಾ",
      Nutrition: "ಪೋಷಣೆ",
      Exercise: "ವ್ಯಾಯಾಮ",
      Menth: "ಮಾನಸಿಕ",
    },
    moodLabels: {
      HAPPY: "ಸಂತೋಷ",
      CALM: "ಶಾಂತ",
      TIRED: "ದಣಿದ",
      ANXIOUS: "ಆತಂಕ",
      EXCITED: "ಉತ್ಸಾಹ",
    },
    trimesterLabel: (week: number) => trimesterFromWeek(week),
  },
  मराठी: {
    heroKicker: "गर्भधारणा प्रवास",
    welcomeTitle: "शुभ प्रभात, आई",
    dueWeekTitle: (week: number) => `आठवडा ${week}`,
    heroSubtitle: "तुमच्या गर्भधारणेचा मागोवा घेण्यासाठी due date सेट करा.",
    datePlaceholder: "mm/dd/yyyy",
    startChat: "गप्पा सुरू करा",
    howAreYouFeeling: "तुम्हाला कसे वाटत आहे?",
    lastMoodPrefix: "शेवटचे:",
    dailyInsight: "दैनिक माहिती",
    nextAppointment: "पुढील अपॉइंटमेंट",
    noUpcomingVisits: "कोणतीही आगामी भेट शेड्यूल केलेली नाही",
    healthFeed: "आरोग्य फीड",
    readMore: "अधिक वाचा",
    pregnancy: "गर्भावस्था",
    setDueDate: "Due date सेट करा",
    babySizePrefix: "बाळाचा आकार",
    babySizeFallback: "बाळाचा आकार ...",
    filterLabels: {
      All: "सर्व",
      Nutrition: "पोषण",
      Exercise: "व्यायाम",
      Menth: "मानसिक",
    },
    moodLabels: {
      HAPPY: "आनंदी",
      CALM: "शांत",
      TIRED: "थकलेले",
      ANXIOUS: "चिंताग्रस्त",
      EXCITED: "उत्साही",
    },
    trimesterLabel: (week: number) => trimesterFromWeek(week),
  },
  മലയാളം: {
    heroKicker: "ഗർഭധാരണ യാത്ര",
    welcomeTitle: "സുപ്രഭാതം, അമ്മ",
    dueWeekTitle: (week: number) => `ആഴ്ച ${week}`,
    heroSubtitle: "നിങ്ങളുടെ ഗർഭധാരണ യാത്ര ട്രാക്ക് ചെയ്യാൻ due date സജ്ജമാക്കുക.",
    datePlaceholder: "mm/dd/yyyy",
    startChat: "ചാറ്റ് ആരംഭിക്കുക",
    howAreYouFeeling: "നിങ്ങൾക്ക് എങ്ങനെയുണ്ട്?",
    lastMoodPrefix: "അവസാനം:",
    dailyInsight: "ദൈനംദിന സൂചന",
    nextAppointment: "അടുത്ത അപ്പോയിന്റ്മെന്റ്",
    noUpcomingVisits: "വരാനിരിക്കുന്ന സന്ദർശനങ്ങൾ ഇല്ല",
    healthFeed: "ആരോഗ്യ ഫീഡ്",
    readMore: "കൂടുതൽ വായിക്കുക",
    pregnancy: "ഗർഭധാരണം",
    setDueDate: "Due date സജ്ജമാക്കുക",
    babySizePrefix: "കുഞ്ഞിന്റെ വലുപ്പം",
    babySizeFallback: "കുഞ്ഞിന്റെ വലുപ്പം ...",
    filterLabels: {
      All: "എല്ലാം",
      Nutrition: "പോഷണം",
      Exercise: "വ്യായാമം",
      Menth: "മാനസികം",
    },
    moodLabels: {
      HAPPY: "സന്തോഷം",
      CALM: "ശാന്തം",
      TIRED: "ക്ലാന്തി",
      ANXIOUS: "ആശങ്ക",
      EXCITED: "ആവേശം",
    },
    trimesterLabel: (week: number) => trimesterFromWeek(week),
  },
};

const moods = [
  { emoji: "😊", label: "HAPPY" },
  { emoji: "😌", label: "CALM" },
  { emoji: "😴", label: "TIRED" },
  { emoji: "😰", label: "ANXIOUS" },
  { emoji: "🤩", label: "EXCITED" },
] as const;

const journeyImages = {
  week_1_3: require('../../assets/journey/week_1_3.jpg'),
  week_4_8: require('../../assets/journey/week_4_8.jpg'),
  week_9_12: require('../../assets/journey/week_9_12.jpg'),
  week_13_16: require('../../assets/journey/week_13_16.jpg'),
  week_17_20: require('../../assets/journey/week_17_20.jpg'),
  week_21_24: require('../../assets/journey/week_21_24.jpg'),
  week_25_28: require('../../assets/journey/week_25_28.jpg'),
  week_29_32: require('../../assets/journey/week_29_32.jpg'),
  week_33_36: require('../../assets/journey/week_33_36.jpg'),
  week_37_40: require('../../assets/journey/week_37_40.jpg'),
  week_40_plus: require('../../assets/journey/week_40_plus.jpg'),
};

function getJourneyImage(week: number) {
  if (week <= 3) return journeyImages.week_1_3;
  if (week <= 8) return journeyImages.week_4_8;
  if (week <= 12) return journeyImages.week_9_12;
  if (week <= 16) return journeyImages.week_13_16;
  if (week <= 20) return journeyImages.week_17_20;
  if (week <= 24) return journeyImages.week_21_24;
  if (week <= 28) return journeyImages.week_25_28;
  if (week <= 32) return journeyImages.week_29_32;
  if (week <= 36) return journeyImages.week_33_36;
  if (week <= 40) return journeyImages.week_37_40;
  return journeyImages.week_40_plus;
}

function formatDateForInput(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function formatDateForStorage(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

function parseDueDateInput(value: string) {
  const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function getBabySizeLabel(week: number, t?: (k: string, f: string) => string) {
  const trans = t || ((_k: string, f: string) => f);
  if (week <= 8) return trans("baby_blueberry", "Blueberry");
  if (week <= 12) return trans("baby_lime", "Lime");
  if (week <= 16) return trans("baby_avocado", "Avocado");
  if (week <= 20) return trans("baby_banana", "Banana");
  if (week <= 24) return trans("baby_corn", "Sweet Corn");
  if (week <= 28) return trans("baby_eggplant", "Eggplant");
  if (week <= 32) return trans("baby_pineapple", "Pineapple");
  if (week <= 36) return trans("baby_papaya", "Papaya");
  if (week <= 40) return trans("baby_pumpkin", "Pumpkin");
  return trans("baby_watermelon", "Watermelon");
}

export default function HomeScreen() {
  const router = useRouter();
  const { db, profile, reminders, refreshProfile, refreshReminders, upsertProfile, selectedLanguage, t } = useApp();

  const [todayMood, setTodayMood] = useState<(typeof moods)[number]["emoji"]>("😊");
  const [dueDateInput, setDueDateInput] = useState("");
  const [dueDateValue, setDueDateValue] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [affirmation, setAffirmation] = useState("");
  const [loadingAffirmation, setLoadingAffirmation] = useState(false);
  const [todayKicks, setTodayKicks] = useState(0);
  const [todaySymptomsCount, setTodaySymptomsCount] = useState(0);

  const copy = homeCopy[selectedLanguage] ?? homeCopy.English;
  const todayStr = formatToday();

  const nextAppointment = useMemo(() => {
    const now = new Date();
    const upcoming = reminders
      .map((r) => ({ ...r, remindDate: new Date(r.remind_at) }))
      .filter((r) => r.remindDate >= now)
      .sort((a, b) => a.remindDate.getTime() - b.remindDate.getTime());
    return upcoming[0] ?? null;
  }, [reminders]);

  const todayMedications = useMemo(() => {
    return reminders
      .filter((r) => r.repeat === "daily")
      .map((r) => {
        const date = new Date(r.remind_at);
        const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        return {
          id: r.id,
          title: r.title,
          time: timeStr,
        };
      })
      .slice(0, 3);
  }, [reminders]);

  const load = useCallback(async () => {
    try {
      await Promise.all([refreshReminders(), refreshProfile()]);
      const [entry, kicksCount, symptomLogs] = await Promise.all([
        getTodayEntry(db, todayStr),
        getKickCount(db, todayStr),
        getSymptomLogsByDate(db, todayStr),
      ]);

      setTodayKicks(kicksCount);
      setTodaySymptomsCount(symptomLogs.length);

      if (entry?.mood) {
        setTodayMood(entry.mood as (typeof moods)[number]["emoji"]);
      }

      const cached = await getCachedAffirmation(db, todayStr);
      if (cached) {
        setAffirmation(cached);
        return;
      }

      setLoadingAffirmation(true);
      const response = await fetchAffirmation();
      setAffirmation(response.text);
      await cacheAffirmation(db, todayStr, response.text);
    } finally {
      setLoadingAffirmation(false);
    }
  }, [db, refreshProfile, refreshReminders, todayStr]);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => undefined);
    }, [load])
  );

  const persistMood = async (mood: string) => {
    const existing = await getTodayEntry(db, todayStr);
    await upsertEntry(db, {
      date: todayStr,
      mood,
      energy: existing?.energy ?? 3,
      symptoms: existing ? JSON.parse(existing.symptoms) : [],
      notes: existing?.notes ?? "",
      waterGlasses: existing?.water_glasses ?? 0,
      weight: existing?.weight ?? null,
    });
    setTodayMood(mood as (typeof moods)[number]["emoji"]);
  };

  useEffect(() => {
    if (!profile?.due_date) return;

    const existingDate = new Date(profile.due_date);
    if (Number.isNaN(existingDate.getTime())) return;

    setDueDateValue(existingDate);
    setDueDateInput(formatDateForInput(existingDate));
  }, [profile?.due_date]);

  const persistDueDate = async (date: Date) => {
    const formatted = formatDateForStorage(date);
    const check = validateDueDate(formatted);
    if (!check.isValid) {
      Alert.alert("Invalid Due Date", check.error || "Due date must be in the future.");
      if (dueDateValue) {
        setDueDateInput(formatDateForInput(dueDateValue));
      }
      return;
    }

    setDueDateValue(date);
    setDueDateInput(formatDateForInput(date));

    await upsertProfile({
      name: profile?.name?.trim() || "Mama",
      dueDate: formatted,
      bloodType: profile?.blood_type ?? undefined,
      doctorName: profile?.doctor_name ?? undefined,
      doctorPhone: profile?.doctor_phone ?? undefined,
      preferredVoice: profile?.preferred_voice ?? undefined,
    });
  };

  const onDueDateInputSubmit = () => {
    const parsed = parseDueDateInput(dueDateInput);
    if (!parsed) {
      Alert.alert("Invalid Format", "Please enter a valid date in MM/DD/YYYY format.");
      return;
    }
    persistDueDate(parsed).catch(() => undefined);
  };

  const onDatePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (!selectedDate || event.type === "dismissed") return;
    persistDueDate(selectedDate).catch(() => undefined);
  };

  const hasDueDate = !!dueDateValue;
  const journeyWeek = hasDueDate ? pregnancyWeek(formatDateForStorage(dueDateValue)) : 0;
  const journeyTrimester = hasDueDate
    ? (journeyWeek <= 13
        ? t("trimester_1", "First Trimester")
        : journeyWeek <= 27
        ? t("trimester_2", "Second Trimester")
        : t("trimester_3", "Third Trimester"))
    : "";
  const babySize = hasDueDate ? getBabySizeLabel(journeyWeek, t) : "";
  const daysToGo = hasDueDate
    ? Math.max(
        0,
        Math.ceil((dueDateValue.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      )
    : null;
  const journeyProgress = hasDueDate ? Math.max(2, Math.min(100, Math.round((journeyWeek / 40) * 100))) : 0;

  const currentTrimesterInt = journeyWeek <= 13 ? 1 : journeyWeek <= 27 ? 2 : 3;
  const dailyPregnancyInsight = useMemo(() => {
    if (!hasDueDate) return null;
    let validInsights = pregnancyInsightsData.insights.filter((i: any) => i.week === journeyWeek);
    if (validInsights.length === 0) {
      validInsights = pregnancyInsightsData.insights.filter((i: any) => i.trimester === currentTrimesterInt);
    }
    if (validInsights.length === 0) return null;
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return validInsights[dayOfYear % validInsights.length];
  }, [hasDueDate, journeyWeek, currentTrimesterInt]);

  const localizedPregnancyInsight = useMemo(() => {
    if (!dailyPregnancyInsight) return null;
    const item = (localizedInsightsData as any)[dailyPregnancyInsight.id];
    if (item && item[selectedLanguage]) {
      return item[selectedLanguage];
    }
    return {
      title: dailyPregnancyInsight.title,
      insight: dailyPregnancyInsight.insight,
    };
  }, [dailyPregnancyInsight, selectedLanguage]);

  const localizedCategoryLabel = useMemo(() => {
    if (!dailyPregnancyInsight) return "";
    const catMap: Record<string, Record<string, string>> = {
      baby_development: {
        English: "Baby Development",
        "தமிழ்": "குழந்தை வளர்ச்சி",
        "हिन्दी": "शिशु विकास",
        "ಕನ್ನಡ": "ಮಗುವಿನ ಬೆಳವಣಿಗೆ",
        "मराठी": "बाळाचा विकास",
        "മലയാളം": "കുഞ്ഞിന്റെ വളർച്ച",
      },
      nutrition: {
        English: "Nutrition",
        "தமிழ்": "ஊட்டச்சத்து",
        "हिन्दी": "पोषण",
        "ಕನ್ನಡ": "ಪೋಷಣೆ",
        "मराठी": "पोषण",
        "മലയാളം": "പോഷകാഹാരം",
      },
      wellness: {
        English: "Wellness",
        "தமிழ்": "உடல்நலம்",
        "हिन्दी": "कल्याण",
        "ಕನ್ನಡ": "ಕ್ಷೇಮ",
        "मराठी": "आरोग्य",
        "മലയാളം": "ಆರೋಗ್ಯ",
      },
      safety: {
        English: "Safety",
        "தமிழ்": "பாதுகாப்பு",
        "हिन्दी": "सुरक्षा",
        "ಕನ್ನಡ": "ಸುರಕ್ಷತೆ",
        "मराठी": "सुरक्षितता",
        "മലയാളം": "സുരക്ഷ",
      },
      appointments: {
        English: "Appointments",
        "தமிழ்": "சந்திப்புகள்",
        "हिन्दी": "विज़िट",
        "ಕನ್ನಡ": "ಭೇಟಿ",
        "मराठी": "भेट",
        "മലയാളം": "സന്ദർശനം",
      },
    };
    const cat = dailyPregnancyInsight.category;
    return catMap[cat]?.[selectedLanguage] || dailyPregnancyInsight.category_label;
  }, [dailyPregnancyInsight, selectedLanguage]);

  const lastMoodKey = moods.find((m) => m.emoji === todayMood)?.label ?? "HAPPY";
  const lastMoodLabel = copy.moodLabels[lastMoodKey] ?? lastMoodKey;
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakHomeSummary = async () => {
    const locale = localeForLanguage(selectedLanguage);
    const summary = hasDueDate
      ? `Welcome to Maternal. You are in ${copy.dueWeekTitle(journeyWeek)}, ${journeyTrimester}. ${babySize ? `Baby is about the size of a ${babySize}.` : ""} You have ${daysToGo} days remaining.`
      : `Welcome to Maternal. Set your due date to track your pregnancy journey.`;

    if (isSpeaking) {
      await stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      await speakText(summary, locale);
    } catch (err) {
      console.debug("TTS failed on Home", err);
    } finally {
      setIsSpeaking(false);
    }
  };

  // Circular progress calculations for the SVG ring
  const circleRadius = 72;
  const strokeWidth = 7;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (circleCircumference * journeyProgress) / 100;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Top Header Bar */}
      <View style={styles.headerWrap}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Heart size={16} color="#E05D82" fill="#F8C8D8" />
          </View>
          <View>
            <Text style={styles.logoText}>Maternal</Text>
            <View style={styles.aiRow}>
              <View style={styles.aiDot} />
              <Text style={styles.aiText}>AI CARE COMPANION</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <LanguageSelector />
          <EmergencySupportButton onPress={() => router.push("/emergency")} />
          <TouchableOpacity
            style={styles.iconPillBtn}
            onPress={() => speakHomeSummary().catch(() => undefined)}
            accessibilityLabel="Read aloud summary"
          >
            {isSpeaking ? <VolumeX size={16} color="#4A90E2" /> : <Volume2 size={16} color="#4A90E2" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Pregnancy Hero Section (Soft Baby Pink -> Baby Blue Gradient) */}
      <View style={styles.heroCard}>
        {/* Soft elegant gradient background */}
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
          <Defs>
            <LinearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FDE7EF" stopOpacity={0.95} />
              <Stop offset="55%" stopColor="#FFFFFF" stopOpacity={0.9} />
              <Stop offset="100%" stopColor="#E6F4FC" stopOpacity={0.95} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#heroGradient)" />
        </Svg>

        <View style={styles.heroContentWrap}>
          {/* Greeting & Week */}
          <Text style={styles.heroKicker}>{hasDueDate ? copy.welcomeTitle : copy.heroKicker}</Text>
          <Text style={styles.heroTitle}>{hasDueDate ? copy.dueWeekTitle(journeyWeek) : copy.welcomeTitle}</Text>

          {hasDueDate ? (
            <>
              <Text style={styles.heroSubtitle}>
                {t("baby_growing_beautifully", "Your little one is growing beautifully.")}
              </Text>

              {/* Circular Progress Gauge with Journey Image */}
              <View style={styles.progressRingWrapper}>
                <Svg width={160} height={160} viewBox="0 0 160 160">
                  <Defs>
                    <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#F8C8D8" />
                      <Stop offset="100%" stopColor="#BFDFF5" />
                    </LinearGradient>
                  </Defs>
                  {/* Background Track */}
                  <Circle
                    cx={80}
                    cy={80}
                    r={circleRadius}
                    stroke="#E6EEF8"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {/* Dynamic Progress Stroke */}
                  <Circle
                    cx={80}
                    cy={80}
                    r={circleRadius}
                    stroke="url(#ringGrad)"
                    strokeWidth={strokeWidth + 1}
                    strokeDasharray={`${circleCircumference} ${circleCircumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    transform="rotate(-90 80 80)"
                  />
                </Svg>
                <View style={styles.progressImageFrame}>
                  <Image source={getJourneyImage(journeyWeek)} style={styles.heroJourneyImage} resizeMode="cover" />
                </View>
              </View>

              {/* Badges Row: Trimester & Days Remaining */}
              <View style={styles.heroBadgesRow}>
                <View style={styles.trimesterBadge}>
                  <Text style={styles.trimesterBadgeText}>{journeyTrimester}</Text>
                </View>
                <View style={styles.daysBadge}>
                  <Text style={styles.daysBadgeText}>
                    {daysToGo} {t("days_to_go", "DAYS TO GO")}
                  </Text>
                </View>
              </View>

              {/* Baby Size Visual Highlight */}
              <View style={styles.babySizePill}>
                <Baby size={16} color="#30343B" />
                <Text style={styles.babySizeText}>
                  {t("baby_size_is", copy.babySizePrefix)}{" "}
                  <Text style={styles.babySizeAccent}>{babySize}</Text>
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.heroSubtitleUnset}>{copy.heroSubtitle}</Text>
          )}

          {/* Quick Due Date & Start Chat Actions */}
          <View style={styles.heroActionsRow}>
            <View style={styles.dateInputWrap}>
              <TextInput
                value={dueDateInput}
                onChangeText={setDueDateInput}
                onSubmitEditing={onDueDateInputSubmit}
                onEndEditing={onDueDateInputSubmit}
                placeholder={copy.datePlaceholder}
                placeholderTextColor="#8E94A0"
                style={styles.dateInput}
              />
              <TouchableOpacity
                style={styles.dateCalendarBtn}
                onPress={() => setShowDatePicker(true)}
                accessibilityLabel="Pick due date"
              >
                <CalendarDays size={16} color="#30343B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.startChatBtn}
              onPress={() => router.push("/(tabs)/chat")}
              accessibilityLabel="Start chat"
            >
              <MessageSquare size={16} color="#30343B" />
              <Text style={styles.startChatText}>{copy.startChat}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* QUICK ACTIONS (4x2 Grid with Alternating Baby Pink & Baby Blue Accents) */}
      <View style={styles.sectionHeadRow}>
        <Text style={styles.sectionHeadText}>{t("quick_actions", "QUICK ACTIONS")}</Text>
      </View>
      <View style={styles.quickActionsGrid}>
        {/* 1. Pregnancy Tracker */}
        <TouchableOpacity
          style={[styles.quickActionCard, styles.bgSoftPink]}
          onPress={() => router.push("/(tabs)/articles")}
          activeOpacity={0.85}
        >
          <View style={[styles.actionIconCircle, styles.iconBgPink]}>
            <Footprints size={18} color="#D64A73" />
          </View>
          <Text style={styles.quickActionLabel} numberOfLines={2}>{t("pregnancy_tracker", "Tracker")}</Text>
        </TouchableOpacity>

        {/* 2. Baby Development */}
        <TouchableOpacity
          style={[styles.quickActionCard, styles.bgSoftBlue]}
          onPress={() => router.push("/(tabs)/articles")}
          activeOpacity={0.85}
        >
          <View style={[styles.actionIconCircle, styles.iconBgBlue]}>
            <Baby size={18} color="#2563EB" />
          </View>
          <Text style={styles.quickActionLabel} numberOfLines={2}>{t("baby_development", "Baby Dev")}</Text>
        </TouchableOpacity>

        {/* 3. Yoga */}
        <TouchableOpacity
          style={[styles.quickActionCard, styles.bgSoftPink]}
          onPress={() => router.push("/(tabs)/yoga")}
          activeOpacity={0.85}
        >
          <View style={[styles.actionIconCircle, styles.iconBgPink]}>
            <Flower2 size={18} color="#D64A73" />
          </View>
          <Text style={styles.quickActionLabel} numberOfLines={2}>{t("tab_yoga", "Yoga")}</Text>
        </TouchableOpacity>

        {/* 4. Nutrition */}
        <TouchableOpacity
          style={[styles.quickActionCard, styles.bgSoftBlue]}
          onPress={() => router.push("/(tabs)/articles")}
          activeOpacity={0.85}
        >
          <View style={[styles.actionIconCircle, styles.iconBgBlue]}>
            <Apple size={18} color="#2563EB" />
          </View>
          <Text style={styles.quickActionLabel} numberOfLines={2}>{t("nutrition", "Nutrition")}</Text>
        </TouchableOpacity>

        {/* 5. Symptoms */}
        <TouchableOpacity
          style={[styles.quickActionCard, styles.bgSoftPink]}
          onPress={() => router.push("/(tabs)/health")}
          activeOpacity={0.85}
        >
          <View style={[styles.actionIconCircle, styles.iconBgPink]}>
            <Activity size={18} color="#D64A73" />
          </View>
          <Text style={styles.quickActionLabel} numberOfLines={2}>{t("symptoms", "Symptoms")}</Text>
        </TouchableOpacity>

        {/* 6. Appointments */}
        <TouchableOpacity
          style={[styles.quickActionCard, styles.bgSoftBlue]}
          onPress={() => setShowAppointmentsModal(true)}
          activeOpacity={0.85}
        >
          <View style={[styles.actionIconCircle, styles.iconBgBlue]}>
            <CalendarDays size={18} color="#2563EB" />
          </View>
          <Text style={styles.quickActionLabel} numberOfLines={2}>{t("appointments", "Visits")}</Text>
        </TouchableOpacity>

        {/* 7. Health */}
        <TouchableOpacity
          style={[styles.quickActionCard, styles.bgSoftPink]}
          onPress={() => router.push("/(tabs)/health")}
          activeOpacity={0.85}
        >
          <View style={[styles.actionIconCircle, styles.iconBgPink]}>
            <Heart size={18} color="#D64A73" />
          </View>
          <Text style={styles.quickActionLabel} numberOfLines={2}>{t("tab_health", "Health")}</Text>
        </TouchableOpacity>

        {/* 8. Chatbot */}
        <TouchableOpacity
          style={[styles.quickActionCard, styles.bgSoftBlue]}
          onPress={() => router.push("/(tabs)/chat")}
          activeOpacity={0.85}
        >
          <View style={[styles.actionIconCircle, styles.iconBgBlue]}>
            <MessageSquare size={18} color="#2563EB" />
          </View>
          <Text style={styles.quickActionLabel} numberOfLines={2}>{t("chatbot", "Chatbot")}</Text>
        </TouchableOpacity>
      </View>


      {/* DISTINCT CARD: Today's Pregnancy Insight */}
      <View style={styles.cardPregnancyInsight}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.cardHeaderIconWrap, styles.iconBgPink]}>
            <Sparkles size={18} color="#D64A73" />
          </View>
          <View style={styles.flexOne}>
            <Text style={styles.cardHeaderTagPink}>
              {t("pregnancy_insight", copy.dailyInsight)} {localizedCategoryLabel ? `• ${localizedCategoryLabel.toUpperCase()}` : ""}
            </Text>
            <Text style={styles.cardMainTitle}>
              {localizedPregnancyInsight?.title || dailyPregnancyInsight?.title || t("daily_inspiration", "Daily Maternal Care")}
            </Text>
          </View>
        </View>
        {loadingAffirmation ? (
          <ActivityIndicator size="small" color="#D64A73" style={{ marginVertical: 12 }} />
        ) : (
          <Text style={styles.insightQuoteText}>
            "{localizedPregnancyInsight?.insight || dailyPregnancyInsight?.insight || affirmation || t("affirmation_fallback", "Trust your body, it knows exactly how to nurture your little one.")}"
          </Text>
        )}
      </View>

      {/* DISTINCT CARD: Upcoming Appointments */}
      <TouchableOpacity
        style={styles.cardAppointment}
        onPress={() => setShowAppointmentsModal(true)}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeaderRow}>
          <View style={[styles.cardHeaderIconWrap, styles.iconBgBlue]}>
            <CalendarDays size={18} color="#2563EB" />
          </View>
          <View style={styles.flexOne}>
            <Text style={styles.cardHeaderTagBlue}>{t("next_appointment", copy.nextAppointment)}</Text>
            <Text style={styles.cardMainTitle}>
              {nextAppointment ? nextAppointment.title : t("no_upcoming_visits", copy.noUpcomingVisits)}
            </Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </View>
        {nextAppointment ? (
          <View style={styles.appointmentDetailsRow}>
            <View style={styles.appointmentMetaPill}>
              <Clock size={13} color="#2563EB" />
              <Text style={styles.appointmentMetaText}>{displayDate(nextAppointment.remind_at)}</Text>
            </View>
            <View style={styles.appointmentMetaPill}>
              <Stethoscope size={13} color="#2563EB" />
              <Text style={styles.appointmentMetaText}>{profile?.doctor_name || t("prenatal_doctor", "Prenatal Care")}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.appointmentPromptText}>
            {t("tap_to_schedule_visit", "Tap to schedule your prenatal visits, ultrasounds, and lab tests.")}
          </Text>
        )}
      </TouchableOpacity>

      {/* DISTINCT CARD: Medications / Tablets Today */}
      <View style={styles.cardMedications}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.cardHeaderIconWrap, styles.iconBgPink]}>
            <Pill size={18} color="#D64A73" />
          </View>
          <View style={styles.flexOne}>
            <Text style={styles.cardHeaderTagPink}>{t("daily_medications", "MEDICATIONS / TABLETS")}</Text>
            <Text style={styles.cardMainTitle}>{t("today_schedule", "Today's Schedule")}</Text>
          </View>
        </View>
        {todayMedications.length > 0 ? (
          <View style={styles.medicationsList}>
            {todayMedications.map((med) => (
              <View key={med.id} style={styles.medicationItemRow}>
                <View style={styles.medicationCheckDot} />
                <Text style={styles.medicationTitleText} numberOfLines={1}>{med.title}</Text>
                <Text style={styles.medicationTimeText}>{med.time}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.medicationEmptyText}>
            {t("no_meds_scheduled", "No daily tablets scheduled. Use the calendar below to add your supplements.")}
          </Text>
        )}
      </View>

      {/* HOW ARE YOU FEELING? (Mood Tracker) */}
      <View style={styles.sectionHeadRow}>
        <Text style={styles.sectionHeadText}>{copy.howAreYouFeeling}</Text>
        <Text style={styles.sectionHeadLast}>
          {copy.lastMoodPrefix} <Text style={styles.sectionHeadLastValue}>{lastMoodLabel}</Text>
        </Text>
      </View>

      <View style={styles.moodRow}>
        {moods.map((m) => {
          const active = m.emoji === todayMood;
          const moodLabel = copy.moodLabels[m.label] ?? m.label;
          return (
            <View key={m.label} style={styles.moodItem}>
              <TouchableOpacity
                style={[styles.moodButton, active && styles.moodButtonActive]}
                onPress={() => persistMood(m.emoji)}
                activeOpacity={0.8}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
              </TouchableOpacity>
              <Text style={[styles.moodLabel, active && styles.moodLabelActive]}>{moodLabel}</Text>
            </View>
          );
        })}
      </View>

      {/* QUICK STATS ROW: Due Date & Kick Counter */}
      <View style={styles.statsRow}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.dueDateCard}
          onPress={() => router.push("/(tabs)/profile")}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <View style={styles.statCardHeaderRow}>
            <View style={[styles.statIconWrap, styles.iconBgPink]}>
              <CalendarDays size={16} color="#D64A73" />
            </View>
            <View style={styles.statPillPink}>
              <Text style={styles.statPillPinkText} numberOfLines={1}>
                {t("pregnancy_journey", copy.pregnancy)}
              </Text>
            </View>
          </View>
          <Text style={styles.statCardTitle} numberOfLines={1}>
            {hasDueDate ? copy.dueWeekTitle(journeyWeek) : t("set_due_date", copy.setDueDate)}
          </Text>
          <Text style={styles.statCardSub} numberOfLines={1}>
            {hasDueDate ? `${daysToGo} ${t("days_to_go", "days to go")}` : t("track_journey_desc", "Set your due date")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.kickCard}
          onPress={() => router.push("/(tabs)/health")}
          accessibilityRole="button"
          accessibilityLabel="Open kick counter"
        >
          <View style={styles.statCardHeaderRow}>
            <View style={[styles.statIconWrap, styles.iconBgBlue]}>
              <Activity size={16} color="#2563EB" />
            </View>
            <View style={styles.statPillBlue}>
              <Text style={styles.statPillBlueText} numberOfLines={1}>
                {todayKicks} {t("kicks_label", "Kicks")}
              </Text>
            </View>
          </View>
          <Text style={styles.statCardTitle} numberOfLines={1}>
            {t("kick_counter", "Kick Counter")}
          </Text>
          <Text style={styles.statCardSub} numberOfLines={1}>
            {t("track_baby_movement", "Track movement today.")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* DATE PICKER (if modal open) */}
      {showDatePicker ? (
        <DateTimePicker
          value={dueDateValue ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDatePickerChange}
        />
      ) : null}

      {/* APPOINTMENTS MODAL */}
      <AppointmentsModal
        visible={showAppointmentsModal}
        onClose={() => {
          setShowAppointmentsModal(false);
          refreshReminders();
        }}
      />

      {/* CALENDAR & TABLET PLAN SECTION */}
      <PlanSection />

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
    gap: 16,
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

  /* Hero Section (Soft Pink -> Blue Gradient) */
  heroCard: {
    borderRadius: 28,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#F0F4F9",
    overflow: "hidden",
    shadowColor: "#334155",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  heroContentWrap: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 22,
    alignItems: "center",
  },
  heroKicker: {
    color: "#D64A73",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontFamily: fonts.serif,
    color: "#30343B",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  heroSubtitle: {
    color: "#6F7480",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
  },
  heroSubtitleUnset: {
    color: "#6F7480",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 20,
    maxWidth: 260,
  },

  /* Progress Ring & Image */
  progressRingWrapper: {
    position: "relative",
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  progressImageFrame: {
    position: "absolute",
    width: 124,
    height: 124,
    borderRadius: 62,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroJourneyImage: {
    width: "100%",
    height: "100%",
  },

  /* Badges Row */
  heroBadgesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
    marginBottom: 12,
  },
  trimesterBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E6F4FC",
    borderWidth: 1,
    borderColor: "#BFDFF5",
  },
  trimesterBadgeText: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  daysBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FDE7EF",
    borderWidth: 1,
    borderColor: "#F8C8D8",
  },
  daysBadgeText: {
    color: "#D64A73",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  /* Baby Size Pill */
  babySizePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 18,
  },
  babySizeText: {
    color: "#6F7480",
    fontSize: 13,
    fontWeight: "600",
  },
  babySizeAccent: {
    color: "#30343B",
    fontWeight: "800",
  },

  /* Actions Row (Date + Start Chat) */
  heroActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    marginTop: 4,
  },
  dateInputWrap: {
    flex: 1,
    height: 46,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInput: {
    color: "#30343B",
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  dateCalendarBtn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6F4FC",
  },
  startChatBtn: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#F8C8D8",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#F3A9C1",
    shadowColor: "#F8C8D8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  startChatText: {
    color: "#30343B",
    fontSize: 13,
    fontWeight: "800",
  },

  /* Section Headings */
  sectionHeadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  sectionHeadText: {
    color: "#6F7480",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  sectionHeadLast: {
    color: "#6F7480",
    fontSize: 11,
    fontWeight: "700",
  },
  sectionHeadLastValue: {
    color: "#D64A73",
    fontWeight: "800",
  },

  /* Quick Actions (4x2 Grid) */
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "22.5%",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  bgSoftPink: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FCE4EC",
  },
  bgSoftBlue: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E0F2FE",
  },
  actionIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBgPink: {
    backgroundColor: "#FDE7EF",
  },
  iconBgBlue: {
    backgroundColor: "#E6F4FC",
  },
  quickActionLabel: {
    color: "#30343B",
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "700",
    textAlign: "center",
    flexShrink: 1,
  },

  /* Distinct Cards Common */
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  cardHeaderIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardHeaderTagBlue: {
    color: "#2563EB",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardHeaderTagPink: {
    color: "#D64A73",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardMainTitle: {
    color: "#30343B",
    fontSize: 15,
    fontWeight: "800",
  },
  cardBodyText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
  },

  /* Card 1: Baby Development */
  cardBabyDevelopment: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#BFDFF5",
    shadowColor: "#BFDFF5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 3,
  },
  cardFooterHighlightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  miniBadgeSoftBlue: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#E6F4FC",
  },
  miniBadgeTextBlue: {
    color: "#2563EB",
    fontSize: 10,
    fontWeight: "800",
  },
  learnMoreBlue: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "800",
  },

  /* Card 2: Today's Pregnancy Insight */
  cardPregnancyInsight: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F8C8D8",
    shadowColor: "#F8C8D8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 3,
  },
  insightQuoteText: {
    color: "#30343B",
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
    fontWeight: "500",
    marginTop: 4,
  },

  /* Card 3: Upcoming Appointments */
  cardAppointment: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  appointmentDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  appointmentMetaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#E6F4FC",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  appointmentMetaText: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "700",
  },
  appointmentPromptText: {
    color: "#6F7480",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  /* Card 4: Medications / Tablets */
  cardMedications: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  medicationsList: {
    gap: 8,
    marginTop: 6,
  },
  medicationItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FAFBFD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  medicationCheckDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D64A73",
  },
  medicationTitleText: {
    flex: 1,
    color: "#30343B",
    fontSize: 13,
    fontWeight: "700",
  },
  medicationTimeText: {
    color: "#6F7480",
    fontSize: 11,
    fontWeight: "600",
  },
  medicationEmptyText: {
    color: "#6F7480",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  /* Mood Row */
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 2,
  },
  moodItem: {
    alignItems: "center",
    gap: 6,
    width: 60,
  },
  moodButton: {
    width: 52,
    height: 52,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  moodButtonActive: {
    borderColor: "#F8C8D8",
    backgroundColor: "#FDE7EF",
    borderWidth: 2,
    shadowColor: "#F8C8D8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  moodEmoji: {
    fontSize: 22,
  },
  moodLabel: {
    color: "#6F7480",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  moodLabelActive: {
    color: "#D64A73",
    fontWeight: "800",
  },

  /* Stats Row (Due Date & Kick Counter) */
  statsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
    marginTop: 2,
  },
  dueDateCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FCE4EC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  kickCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statPillPink: {
    backgroundColor: "#FDE7EF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F8C8D8",
  },
  statPillPinkText: {
    color: "#D64A73",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  statPillBlue: {
    backgroundColor: "#E6F4FC",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BFDFF5",
  },
  statPillBlueText: {
    color: "#2563EB",
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  statCardTitle: {
    color: "#30343B",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 2,
  },
  statCardSub: {
    color: "#6F7480",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "500",
  },

  bottomPad: {
    height: 24,
  },
});
