import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDateToISO, formatToday, parseDueDateInput } from "./date";

export { formatToday };

// Storage Keys
const LEGACY_DIARY_SECURITY_KEY = "@maa_diary_security";
const LEGACY_DIARY_ENTRIES_KEY = "@maa_diary_entries";

export function getSecurityKey(userEmail?: string | null): string {
  const clean = (userEmail || "guest").trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
  return `@maa_diary_security_${clean}`;
}

export function getEntriesKey(userEmail?: string | null): string {
  const clean = (userEmail || "guest").trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
  return `@maa_diary_entries_${clean}`;
}

export interface DiarySecurityConfig {
  isConfigured: boolean;
  pinHash: string;
  schoolAnswerHash: string;
  nicknameAnswerHash: string;
  createdAt: string;
}

export interface DiaryEntry {
  date: string; // ISO date YYYY-MM-DD
  dayNumber: number; // Day 1 to 280+
  weekNumber: number;
  thoughts: string;
  struggles: string;
  activities: string;
  mood?: string;
  updatedAt: string;
}

export interface PregnancyDayInfo {
  dateIso: string;
  displayDate: string;
  dayNumber: number;
  totalDays: number;
  weekNumber: number;
  trimester: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

// Case-insensitive, whitespace-trimmed simple secure hash
export function hashText(input: string): string {
  const normalized = input.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(36)}_${normalized.length}`;
}

// ─── Security Service ────────────────────────────────────────────────────────

export async function getDiarySecurityConfig(userEmail?: string | null): Promise<DiarySecurityConfig | null> {
  try {
    const key = getSecurityKey(userEmail);
    let data = await AsyncStorage.getItem(key);
    if (!data) {
      // Check legacy global key for seamless migration
      const legacyData = await AsyncStorage.getItem(LEGACY_DIARY_SECURITY_KEY);
      if (legacyData) {
        data = legacyData;
        await AsyncStorage.setItem(key, legacyData).catch(() => undefined);
      }
    }
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error("Error fetching diary security config:", error);
    return null;
  }
}

export async function setupDiarySecurity(
  pin: string,
  schoolAnswer: string,
  nicknameAnswer: string,
  userEmail?: string | null
): Promise<boolean> {
  try {
    const config: DiarySecurityConfig = {
      isConfigured: true,
      pinHash: hashText(pin),
      schoolAnswerHash: hashText(schoolAnswer),
      nicknameAnswerHash: hashText(nicknameAnswer),
      createdAt: new Date().toISOString(),
    };
    const key = getSecurityKey(userEmail);
    await AsyncStorage.setItem(key, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error("Error setting up diary security:", error);
    return false;
  }
}

export async function verifyDiaryPin(pin: string, userEmail?: string | null): Promise<boolean> {
  const config = await getDiarySecurityConfig(userEmail);
  if (!config || !config.isConfigured) return false;
  return config.pinHash === hashText(pin);
}

export async function verifySecurityQuestions(
  schoolAnswer: string,
  nicknameAnswer: string,
  userEmail?: string | null
): Promise<boolean> {
  const config = await getDiarySecurityConfig(userEmail);
  if (!config || !config.isConfigured) return false;
  const matchSchool = config.schoolAnswerHash === hashText(schoolAnswer);
  const matchNickname = config.nicknameAnswerHash === hashText(nicknameAnswer);
  return matchSchool && matchNickname;
}

export async function resetDiaryPin(newPin: string, userEmail?: string | null): Promise<boolean> {
  const config = await getDiarySecurityConfig(userEmail);
  if (!config || !config.isConfigured) return false;
  config.pinHash = hashText(newPin);
  const key = getSecurityKey(userEmail);
  await AsyncStorage.setItem(key, JSON.stringify(config));
  return true;
}

// ─── Diary Entries Service ───────────────────────────────────────────────────

export async function getAllDiaryEntries(userEmail?: string | null): Promise<Record<string, DiaryEntry>> {
  try {
    const key = getEntriesKey(userEmail);
    let raw = await AsyncStorage.getItem(key);
    if (!raw) {
      const legacyRaw = await AsyncStorage.getItem(LEGACY_DIARY_ENTRIES_KEY);
      if (legacyRaw) {
        raw = legacyRaw;
        await AsyncStorage.setItem(key, legacyRaw).catch(() => undefined);
      }
    }
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading diary entries:", error);
    return {};
  }
}

export async function getDiaryEntryForDate(dateIso: string, userEmail?: string | null): Promise<DiaryEntry | null> {
  const entries = await getAllDiaryEntries(userEmail);
  return entries[dateIso] || null;
}

export async function saveDiaryEntry(
  dateIso: string,
  data: {
    dayNumber: number;
    weekNumber: number;
    thoughts: string;
    struggles: string;
    activities: string;
    mood?: string;
  },
  userEmail?: string | null
): Promise<boolean> {
  try {
    const today = formatToday();
    // Rule: entries are only editable on the current day!
    if (dateIso !== today) {
      console.warn("Attempted to save diary entry for a non-current date:", dateIso);
      return false;
    }

    const entries = await getAllDiaryEntries(userEmail);
    entries[dateIso] = {
      date: dateIso,
      dayNumber: data.dayNumber,
      weekNumber: data.weekNumber,
      thoughts: data.thoughts,
      struggles: data.struggles,
      activities: data.activities,
      mood: data.mood,
      updatedAt: new Date().toISOString(),
    };

    const key = getEntriesKey(userEmail);
    await AsyncStorage.setItem(key, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error("Error saving diary entry:", error);
    return false;
  }
}

// ─── Timeline & Day Calculation ──────────────────────────────────────────────

/**
 * Calculates pregnancy Day 1 to End of Labor (Day 280) based on due date.
 * If no due date is provided, defaults to a standard 280-day cycle centered around today.
 */
export function getPregnancyDayInfo(dateIso: string, dueDateStr?: string | null): PregnancyDayInfo {
  const targetDate = new Date(dateIso + "T00:00:00");
  const todayIso = formatToday();
  const today = new Date(todayIso + "T00:00:00");

  let dueDate: Date;
  const parsedDue = dueDateStr ? parseDueDateInput(dueDateStr) : null;
  if (parsedDue) {
    dueDate = new Date(parsedDue);
    dueDate.setHours(0, 0, 0, 0);
  } else {
    // Default: due date is 112 days (16 weeks) from today if not set
    dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 112);
  }

  // Conception is 280 days (40 weeks) before due date
  const conceptionDate = new Date(dueDate);
  conceptionDate.setDate(conceptionDate.getDate() - 280);

  const diffMs = targetDate.getTime() - conceptionDate.getTime();
  const dayNumber = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
  const totalDays = 280;
  const weekNumber = Math.max(1, Math.min(42, Math.floor((dayNumber - 1) / 7) + 1));

  let trimester = "First Trimester";
  if (weekNumber > 13 && weekNumber <= 27) {
    trimester = "Second Trimester";
  } else if (weekNumber > 27) {
    trimester = "Third Trimester";
  }

  const isToday = dateIso === todayIso;
  const isPast = targetDate.getTime() < today.getTime();
  const isFuture = targetDate.getTime() > today.getTime();

  const displayDate = targetDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return {
    dateIso,
    displayDate,
    dayNumber,
    totalDays,
    weekNumber,
    trimester,
    isToday,
    isPast,
    isFuture,
  };
}

/**
 * Gets the ISO date string for a specific pregnancy day number (1 to 280)
 */
export function getDateForPregnancyDay(dayNumber: number, dueDateStr?: string | null): string {
  const todayIso = formatToday();
  const today = new Date(todayIso + "T00:00:00");

  let dueDate: Date;
  const parsedDue = dueDateStr ? parseDueDateInput(dueDateStr) : null;
  if (parsedDue) {
    dueDate = new Date(parsedDue);
    dueDate.setHours(0, 0, 0, 0);
  } else {
    dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 112);
  }

  const conceptionDate = new Date(dueDate);
  conceptionDate.setDate(conceptionDate.getDate() - 280);

  const target = new Date(conceptionDate);
  target.setDate(target.getDate() + (dayNumber - 1));
  return formatDateToISO(target);
}

/**
 * Gets today's pregnancy day number (1 to 280)
 */
export function getTodayPregnancyDay(dueDateStr?: string | null): number {
  const info = getPregnancyDayInfo(formatToday(), dueDateStr);
  return Math.min(280, Math.max(1, info.dayNumber));
}
