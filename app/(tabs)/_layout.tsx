import { Tabs } from "expo-router";
import { Text, View, StyleSheet, Platform } from "react-native";
import { colors, shadows } from "@/constants/theme";
import { Home, MessageSquare, Flower2, Activity, User, BookOpen } from "lucide-react-native";
import { useApp } from "@/context/AppContext";

function TabIcon({ label, active, Icon }: { label: string; active: boolean; Icon: any }) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconPill, active && styles.iconPillActive]}>
        <Icon
          size={20}
          color={active ? colors.brand : colors.textSecondary}
          strokeWidth={active ? 2.2 : 1.8}
        />
      </View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.75}
        style={[styles.tabLabel, active && styles.tabLabelActive]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: Platform.OS === "ios" ? 88 : 74,
          paddingBottom: Platform.OS === "ios" ? 24 : 10,
          paddingTop: 8,
          ...shadows.default,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t("nav_home", "HOME")} Icon={Home} active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t("nav_chat", "CHAT")} Icon={MessageSquare} active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="articles"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t("nav_articles", "ARTICLES")} Icon={BookOpen} active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="yoga"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t("nav_yoga", "YOGA")} Icon={Flower2} active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t("nav_health", "HEALTH")} Icon={Activity} active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label={t("nav_profile", "PROFILE")} Icon={User} active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed/[slug]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="nutrition-scanner"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    minHeight: 52,
  },
  iconPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  iconPillActive: {
    backgroundColor: colors.softPink,
  },
  tabLabel: {
    width: 60,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: colors.brand,
    fontWeight: "700",
  },
});
