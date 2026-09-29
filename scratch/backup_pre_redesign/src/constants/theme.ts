export const colors = {
  white: "#FFFFFF",
  ivory: "#FBFBFE",
  brand: "#FF5E7E",
  brandSoft: "#FFF0F3",
  brandDeep: "#E11D48",
  brandGradient: ["#FF6B8B", "#3A86FF"] as const,
  pinkGradient: ["#FF758C", "#FF5E7E"] as const,
  blueGradient: ["#60A5FA", "#3A86FF"] as const,
  dualGradient: ["#FF85A2", "#60A5FA"] as const,

  // Serenity & Medical Blue Accents
  skyBlue: "#3A86FF",
  skyBlueSoft: "#EFF6FF",
  skyBlueBorder: "#BFDBFE",
  skyBlueDeep: "#1D4ED8",
  oceanBlue: "#2563EB",

  // Soft Maternal Rose & Pink
  rose: "#FF5E7E",
  roseSoft: "#FFF1F2",
  roseDeep: "#BE123C",
  blush: "#FFE4E6",
  blushDeep: "#FDA4AF",
  lavender: "#F3E8FF",
  lavenderDeep: "#9333EA",

  // Neutrals & Surfaces
  textPrimary: "#1E293B",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  bgFaint: "#F8FAFC",
  surfaceCard: "#FFFFFF",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",

  // Legacy tokens kept for existing screens
  sage: "#D1FAE5",
  sageDeep: "#059669",
  charcoal: "#1E293B",
  charcoalSoft: "#334155",
  charcoalMuted: "#64748B",
};

export const shadows = {
  default: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  soft: {
    shadowColor: "#F92B5F",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  inner: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  }
};

export const borders = {
  default: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  none: {
    borderWidth: 0,
  }
};

export const fonts = {
  serif: "PlayfairDisplay_600SemiBold", // Assuming these are loaded
  sans: "DMSans_400Regular",
  sansMedium: "DMSans_500Medium",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 100
};

export const cardStyle = {
  backgroundColor: colors.white,
  borderRadius: radius.md,
  ...borders.default,
  ...shadows.default,
} as const;

import { Platform } from "react-native";
import Constants from "expo-constants";
const ip = Platform.OS === 'web' ? 'localhost' : (Constants.expoConfig?.hostUri?.split(":")[0] || "10.0.2.2");
export const apiBaseUrl = `http://${ip}:8000`;
