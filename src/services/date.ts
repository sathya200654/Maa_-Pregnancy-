export function formatToday() {
  return new Date().toISOString().slice(0, 10);
}

export function displayDate(isoDate: string) {
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

export function isValidProfileName(value: string) {
  return /^[a-zA-Z\s\-'.]+$/.test(value.trim());
}

export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDueDateInput(value: string): Date | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();

  // Match YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD (allowing 1 or 2 digit month/day)
  let match = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (
      !Number.isNaN(date.getTime()) &&
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }
  }

  // Match DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY (allowing 1 or 2 digit day/month)
  match = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (
      !Number.isNaN(date.getTime()) &&
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }
  }

  // Fallback to standard date parse if valid
  const fallback = new Date(trimmed);
  if (!Number.isNaN(fallback.getTime())) {
    return fallback;
  }

  return null;
}

export type DueDateValidationResult = {
  isValid: boolean;
  date: Date | null;
  isoDate?: string;
  error?: string;
};

export function validateDueDate(value: string): DueDateValidationResult {
  const date = parseDueDateInput(value);
  if (!date) {
    return {
      isValid: false,
      date: null,
      error: "Please enter a valid date in YYYY-MM-DD or DD-MM-YYYY format.",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const enteredDate = new Date(date);
  enteredDate.setHours(0, 0, 0, 0);

  // Must not be in the past
  if (enteredDate.getTime() < today.getTime()) {
    return {
      isValid: false,
      date: null,
      error: "Due date must be today or a future date for active pregnancy tracking.",
    };
  }

  // Allow up to ~400 days (~13 months) into the future
  const maxFutureDate = new Date(today);
  maxFutureDate.setDate(maxFutureDate.getDate() + 400);

  if (enteredDate.getTime() > maxFutureDate.getTime()) {
    return {
      isValid: false,
      date: null,
      error: "Due date cannot be more than 42 weeks (~10 months) in the future.",
    };
  }

  return { isValid: true, date, isoDate: formatDateToISO(date) };
}

export function pregnancyWeek(dueDate: string) {
  const due = parseDueDateInput(dueDate);
  if (!due) {
    return 0;
  }

  const conception = new Date(due);
  conception.setDate(conception.getDate() - 280);
  const now = new Date();
  const diffDays = Math.max(0, Math.floor((now.getTime() - conception.getTime()) / (1000 * 60 * 60 * 24)));
  return Math.max(1, Math.min(42, Math.floor(diffDays / 7) + 1));
}

export function trimesterFromWeek(week: number) {
  if (week <= 13) return "First Trimester";
  if (week <= 27) return "Second Trimester";
  return "Third Trimester";
}

export function formatDateTimeLocal(date: string, time: string) {
  return `${date}T${time}:00`;
}

export function calculateDueDateFromLmp(lmpInput: Date | string): { dueDate: Date; isoDueDate: string } {
  const lmp = typeof lmpInput === "string" ? parseDueDateInput(lmpInput) ?? new Date(lmpInput) : lmpInput;
  const due = new Date(lmp.getTime());
  due.setDate(due.getDate() + 280);
  return {
    dueDate: due,
    isoDueDate: formatDateToISO(due),
  };
}

export type LmpValidationResult = {
  isValid: boolean;
  date: Date | null;
  isoDate?: string;
  calculatedDueDate?: string;
  gestationalWeek?: number;
  error?: string;
};

export function validateLmpDate(value: string): LmpValidationResult {
  const date = parseDueDateInput(value);
  if (!date) {
    return {
      isValid: false,
      date: null,
      error: "Please enter a valid date in YYYY-MM-DD or DD-MM-YYYY format.",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const enteredDate = new Date(date);
  enteredDate.setHours(0, 0, 0, 0);

  // LMP cannot be in the future
  if (enteredDate.getTime() > today.getTime()) {
    return {
      isValid: false,
      date: null,
      error: "LMP date cannot be in the future. Please enter the first day of your last menstrual period.",
    };
  }

  // LMP cannot be more than 300 days in the past (approx 42-43 weeks ago)
  const earliestLmp = new Date(today);
  earliestLmp.setDate(earliestLmp.getDate() - 300);

  if (enteredDate.getTime() < earliestLmp.getTime()) {
    return {
      isValid: false,
      date: null,
      error: "LMP date cannot be more than 42 weeks ago. If your pregnancy is full-term, please check the date.",
    };
  }

  const { isoDueDate } = calculateDueDateFromLmp(enteredDate);
  const week = pregnancyWeek(isoDueDate);

  return {
    isValid: true,
    date: enteredDate,
    isoDate: formatDateToISO(enteredDate),
    calculatedDueDate: isoDueDate,
    gestationalWeek: week,
  };
}
