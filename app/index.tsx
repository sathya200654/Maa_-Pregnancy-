import { useEffect, useRef, useState } from "react";
import { Redirect } from "expo-router";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Heart, Sparkles, ShieldCheck } from "lucide-react-native";

import { colors, fonts, shadows } from "@/constants/theme";
import { useApp } from "@/context/AppContext";

const { width } = Dimensions.get("window");

export default function IndexRoute() {
  const { loadingProfile, profile, currentUser } = useApp();
  const [splashFinished, setSplashFinished] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const tagFadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(tagFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous gentle pulse loop
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Splash display duration: exactly 4 seconds
    const timer = setTimeout(() => {
      setSplashFinished(true);
    }, 4000);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, []);

  if (!splashFinished || loadingProfile) {
    return (
      <View style={styles.container}>
        {/* Soft Background Decor Circles */}
        <View style={styles.circleTopRight} />
        <View style={styles.circleBottomLeft} />

        <Animated.View
          style={[
            styles.centerContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo Emblem Container */}
          <Animated.View style={[styles.logoWrap, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.logoOuterGlow}>
              <View style={styles.logoCircle}>
                <Heart size={54} color={colors.brand} fill={colors.brand} />
                <View style={styles.sparkleBadge}>
                  <Sparkles size={20} color={colors.skyBlue} />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* App Brand Name */}
          <Text style={styles.appName}>Maa</Text>

          {/* Tagline */}
          <Animated.View style={{ opacity: tagFadeAnim, alignItems: "center" }}>
            <Text style={styles.tagline}>Maternal Health & Care Companion</Text>
            <View style={styles.pillRow}>
              <View style={styles.pillBadge}>
                <ShieldCheck size={12} color={colors.skyBlueDeep} />
                <Text style={styles.pillText}>Safe • Offline-First • AI Assisted</Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Footer loading message */}
        <Animated.View style={[styles.footer, { opacity: tagFadeAnim }]}>
          <View style={styles.loadingDotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.footerText}>Preparing your personalized space...</Text>
        </Animated.View>
      </View>
    );
  }

  // Routing: If no active user session, go to login/onboarding, else tabs
  if (!currentUser) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFE",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  circleTopRight: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255, 94, 126, 0.08)",
  },
  circleBottomLeft: {
    position: "absolute",
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(58, 134, 255, 0.07)",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: {
    marginBottom: 20,
  },
  logoOuterGlow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 94, 126, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 94, 126, 0.25)",
    ...shadows.soft,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...shadows.default,
  },
  sparkleBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: colors.skyBlueSoft,
    borderRadius: 12,
    padding: 3,
  },
  appName: {
    fontSize: 42,
    fontWeight: "800",
    fontFamily: "PlayfairDisplay_600SemiBold",
    color: colors.charcoal,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  pillRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pillBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.skyBlueSoft,
    borderColor: colors.skyBlueBorder,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pillText: {
    color: colors.skyBlueDeep,
    fontSize: 11,
    fontWeight: "700",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
  },
  loadingDotsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.brand,
    width: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },
});
