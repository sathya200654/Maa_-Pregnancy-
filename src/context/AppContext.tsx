import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  authenticateUser,
  deleteReminder,
  getActiveSession,
  getFeedActivity,
  getProfile,
  getReminders,
  logoutUser,
  registerUser,
  saveProfile,
  saveReminder,
  setFeedLike,
  setFeedSave,
} from "@/db/helpers";
import { FeedActivity, Profile, Reminder, UserAccount } from "@/types";
import { SUPPORTED_LANGUAGES, SupportedLanguage, translations } from "@/data/translations";

export const supportedLanguages = SUPPORTED_LANGUAGES;
export type { SupportedLanguage };

type TranslationKey = string;

type AppState = {
  db: SQLiteDatabase;
  currentUser: UserAccount | null;
  profile: Profile | null;
  reminders: Reminder[];
  feedActivity: FeedActivity[];
  loadingProfile: boolean;
  signIn: (email: string, password: string) => Promise<UserAccount>;
  signUp: (payload: { email: string; password: string; name: string; dueDate: string; lmpDate?: string }) => Promise<UserAccount>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  upsertProfile: (payload: {
    name: string;
    dueDate: string;
    lmpDate?: string | null;
    bloodType?: string;
    doctorName?: string;
    doctorPhone?: string;
    preferredVoice?: string;
    email?: string;
  }) => Promise<void>;
  refreshReminders: () => Promise<void>;
  refreshFeedActivity: () => Promise<void>;
  upsertReminder: (payload: { id?: number; title: string; remindAt: string; repeat: "none" | "daily" | "weekly" }) => Promise<void>;
  removeReminder: (id: number) => Promise<void>;
  toggleFeedLike: (slug: string) => Promise<void>;
  toggleFeedSave: (slug: string) => Promise<void>;
  selectedLanguage: SupportedLanguage;
  setSelectedLanguage: (language: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [feedActivity, setFeedActivity] = useState<FeedActivity[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("English");

  useEffect(() => {
    Notifications.requestPermissionsAsync().catch(() => undefined);
    AsyncStorage.getItem("@maa_selected_language")
      .then((stored) => {
        if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
          setSelectedLanguage(stored as SupportedLanguage);
        }
      })
      .catch(() => undefined);
  }, []);

  const handleSetLanguage = useCallback((lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    AsyncStorage.setItem("@maa_selected_language", lang).catch(() => undefined);
  }, []);

  const refreshProfile = useCallback(async () => {
    const next = await getProfile(db);
    setProfile(next);
  }, [db]);

  const refreshReminders = useCallback(async () => {
    const next = await getReminders(db);
    setReminders(next);
  }, [db]);

  const refreshFeedActivity = useCallback(async () => {
    const next = await getFeedActivity(db);
    setFeedActivity(next);
  }, [db]);

  const refreshSession = useCallback(async () => {
    const session = await getActiveSession(db);
    setCurrentUser(session);
    return session;
  }, [db]);

  useEffect(() => {
    const load = async () => {
      setLoadingProfile(true);
      await Promise.all([refreshSession(), refreshProfile(), refreshReminders(), refreshFeedActivity()]);
      setLoadingProfile(false);
    };

    load().catch(() => setLoadingProfile(false));
  }, [db]);

  const signIn = async (email: string, password: string) => {
    const user = await authenticateUser(db, email, password);
    setCurrentUser(user);
    await refreshProfile();
    return user;
  };

  const signUp = async (payload: { email: string; password: string; name: string; dueDate: string; lmpDate?: string }) => {
    const user = await registerUser(db, payload);
    setCurrentUser(user);
    await refreshProfile();
    return user;
  };

  const signOut = async () => {
    await logoutUser(db);
    setCurrentUser(null);
    setProfile(null);
    setReminders([]);
    setFeedActivity([]);
  };

  const upsertProfile = async (payload: {
    name: string;
    dueDate: string;
    lmpDate?: string | null;
    bloodType?: string;
    doctorName?: string;
    doctorPhone?: string;
    preferredVoice?: string;
    email?: string;
  }) => {
    await saveProfile(db, payload);
    await refreshProfile();
  };

  const scheduleReminderNotification = async (reminder: { title: string; remindAt: string; repeat: "none" | "daily" | "weekly" }) => {
    const triggerDate = new Date(reminder.remindAt);
    if (Number.isNaN(triggerDate.getTime())) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Maa Reminder",
        body: reminder.title
      },
      trigger:
        reminder.repeat === "none"
          ? {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: triggerDate
            }
          : {
              type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
              hour: triggerDate.getHours(),
              minute: triggerDate.getMinutes(),
              weekday: reminder.repeat === "weekly" ? triggerDate.getDay() + 1 : undefined,
              repeats: true
            }
    });
  };

  const upsertReminder = async (payload: { id?: number; title: string; remindAt: string; repeat: "none" | "daily" | "weekly" }) => {
    await saveReminder(db, payload);
    await scheduleReminderNotification(payload);
    await refreshReminders();
  };

  const removeReminder = async (id: number) => {
    await deleteReminder(db, id);
    await refreshReminders();
  };

  const toggleFeedLike = async (slug: string) => {
    const current = feedActivity.find((item) => item.slug === slug)?.liked === 1;
    await setFeedLike(db, slug, !current);
    await refreshFeedActivity();
  };

  const toggleFeedSave = async (slug: string) => {
    const current = feedActivity.find((item) => item.slug === slug)?.saved === 1;
    await setFeedSave(db, slug, !current);
    await refreshFeedActivity();
  };

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const langDict = translations[selectedLanguage] || translations.English;
      return langDict?.[key] ?? translations.English?.[key] ?? fallback ?? key;
    },
    [selectedLanguage]
  );

  const value = useMemo<AppState>(
    () => ({
      db,
      currentUser,
      profile,
      reminders,
      feedActivity,
      loadingProfile,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      upsertProfile,
      refreshReminders,
      refreshFeedActivity,
      upsertReminder,
      removeReminder,
      toggleFeedLike,
      toggleFeedSave,
      selectedLanguage,
      setSelectedLanguage: handleSetLanguage,
      t,
    }),
    [
      db,
      currentUser,
      profile,
      reminders,
      feedActivity,
      loadingProfile,
      refreshProfile,
      refreshReminders,
      refreshFeedActivity,
      selectedLanguage,
      handleSetLanguage,
      t,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}
