import { Tabs } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { colors, shadows } from "@/constants/theme";
import { Home, MessageSquare, Flower2, Activity, User, BookOpen } from "lucide-react-native";
import { useApp } from "@/context/AppContext";

function TabIcon({ label, active, Icon }: { label: string; active: boolean; Icon: any }) {
  return (
    <View style={styles.tabItem}>
      <Icon size={24} color={active ? colors.brand : colors.textMuted} fill={active && label === "HOME" ? colors.brand : "transparent"} />
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75} style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      {active && <View style={styles.activeDot} />}
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
          borderTopWidth: 0.5,
          borderTopColor: '#F2F2F7',
          height: 90,
          paddingBottom: 25,
          paddingTop: 15,
          ...shadows.default,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label={t("nav_home", "HOME")} Icon={Home} active={focused} />
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label={t("nav_chat", "CHAT")} Icon={MessageSquare} active={focused} />
        }}
      />
      <Tabs.Screen
        name="articles"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label={t("nav_articles", "ARTICLES")} Icon={BookOpen} active={focused} />
        }}
      />
      <Tabs.Screen
        name="yoga"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label={t("nav_yoga", "YOGA")} Icon={Flower2} active={focused} />
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label={t("nav_health", "HEALTH")} Icon={Activity} active={focused} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label={t("nav_profile", "PROFILE")} Icon={User} active={focused} />
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 50,
  },
  tabLabel: {
    width: 56,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: colors.brand,
  },
  activeDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.brand,
    marginTop: 2,
  }
});

