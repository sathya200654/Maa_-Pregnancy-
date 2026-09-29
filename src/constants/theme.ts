export const colors = {
  white: "#FFFFFF",
  ivory: "#FAFBFD",
  bgLight: "#FAFBFD",
  bgFaint: "#FAFBFD",

  // Core Baby Pink & Soft Pink
  babyPink: "#F8C8D8",
  softPink: "#FDE7EF",
  brand: "#E05D82",         // Readable modern baby-pink active tone
  brandLight: "#F8C8D8",
  brandSoft: "#FDE7EF",
  brandDeep: "#D84C72",

  // Core Baby Blue & Soft Blue
  babyBlue: "#BFDFF5",
  softBlue: "#E6F4FC",
  skyBlue: "#6CAEE0",       // Readable modern baby-blue primary tone
  skyBlueSoft: "#E6F4FC",
  skyBlueBorder: "#BFDFF5",
  skyBlueDeep: "#3B82C4",
  oceanBlue: "#2F73B8",

  // Gradients (Very soft & elegant)
  brandGradient: ["#FDE7EF", "#E6F4FC"] as const,
  pinkGradient: ["#F8C8D8", "#FDE7EF"] as const,
  blueGradient: ["#BFDFF5", "#E6F4FC"] as const,
  dualGradient: ["#F8C8D8", "#BFDFF5"] as const,
  heroGradient: ["#FDE7EF", "#E6F4FC"] as const,
  pinkToWhiteGradient: ["#F8C8D8", "#FFFFFF"] as const,
  blueToWhiteGradient: ["#BFDFF5", "#FFFFFF"] as const,
  softPinkGradient: ["#FDE7EF", "#FFFFFF"] as const,
  softBlueGradient: ["#E6F4FC", "#FFFFFF"] as const,

  // Maternal Rose & Pastels
  rose: "#E05D82",
  roseSoft: "#FDE7EF",
  roseDeep: "#C03960",
  blush: "#FDE7EF",
  blushDeep: "#F8C8D8",
  lavender: "#F2ECFB",
  lavenderDeep: "#8A63D2",

  // High-Contrast Readability Neutrals
  textPrimary: "#30343B",
  textSecondary: "#6F7480",
  textMuted: "#9CA3AF",
  surfaceCard: "#FFFFFF",
  border: "#EAF1F8",
  borderLight: "#F3F7FB",

  // Semantic
  success: "#34D399",
  warning: "#FBBF24",
  danger: "#F43F5E",

  // Legacy mappings for safe backwards compatibility
  sage: "#E6F4FC",
  sageDeep: "#3B82C4",
  charcoal: "#30343B",
  charcoalSoft: "#4B5563",
  charcoalMuted: "#6F7480",
};

export const shadows = {
  default: {
    shadowColor: "#30343B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  sm: {
    shadowColor: "#30343B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  soft: {
    shadowColor: "#F8C8D8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 3,
  },
  blueSoft: {
    shadowColor: "#BFDFF5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 3,
  },
  inner: {
    shadowColor: "#30343B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
};

export const borders = {
  default: {
    borderWidth: 1,
    borderColor: "#EAF1F8",
  },
  softBlue: {
    borderWidth: 1,
    borderColor: "#BFDFF5",
  },
  softPink: {
    borderWidth: 1,
    borderColor: "#F8C8D8",
  },
  none: {
    borderWidth: 0,
  },
};

export const fonts = {
  serif: "PlayfairDisplay_600SemiBold",
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
  xxxl: 32,
};

export const radius = {
  sm: 12,
  md: 20,
  lg: 24,
  xl: 28,
  pill: 999,
};

export const cardStyle = {
  backgroundColor: colors.white,
  borderRadius: radius.lg,
  ...borders.default,
  ...shadows.default,
} as const;

import { Platform } from "react-native";
import Constants from "expo-constants";
const ip = Platform.OS === "web" ? "localhost" : (Constants.expoConfig?.hostUri?.split(":")[0] || "10.0.2.2");
export const apiBaseUrl = `http://${ip}:8000`;
