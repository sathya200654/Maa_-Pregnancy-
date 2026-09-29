import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Check, Globe, X } from "lucide-react-native";

import { colors } from "@/constants/theme";
import { supportedLanguages, useApp } from "@/context/AppContext";
import { SupportedLanguage } from "@/data/translations";

const LANGUAGE_METADATA: Record<SupportedLanguage, { native: string; subtitle: string }> = {
  English: { native: "English", subtitle: "English" },
  "தமிழ்": { native: "தமிழ்", subtitle: "Tamil" },
  "हिन्दी": { native: "हिन्दी", subtitle: "Hindi" },
  "ಕನ್ನಡ": { native: "ಕನ್ನಡ", subtitle: "Kannada" },
  "मराठी": { native: "मराठी", subtitle: "Marathi" },
  "മലയാളം": { native: "മലയാളം", subtitle: "Malayalam" },
  "తెలుగు": { native: "తెలుగు", subtitle: "Telugu" },
};

export function LanguageSelector() {
  const { selectedLanguage, setSelectedLanguage, t } = useApp();
  const [open, setOpen] = useState(false);

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Trigger Pill Button */}
      <TouchableOpacity
        style={styles.pillBtn}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <View style={styles.globeWrap}>
          <Globe size={13} color="#D64A73" />
        </View>
        <Text style={styles.pillBtnText} numberOfLines={1}>
          {selectedLanguage}
        </Text>
      </TouchableOpacity>

      {/* Fullscreen Native Modal to eliminate any overlap or clipping */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <TouchableOpacity
            style={styles.dialogCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.dialogHeader}>
              <View style={styles.dialogHeaderTitleRow}>
                <View style={styles.dialogIconWrap}>
                  <Globe size={18} color="#D64A73" />
                </View>
                <View style={styles.flexOne}>
                  <Text style={styles.dialogTitle}>
                    {t("choose_language", "Choose Language")}
                  </Text>
                  <Text style={styles.dialogSub}>
                    {t("select_language_sub", "Select your preferred language")}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setOpen(false)}
                  activeOpacity={0.7}
                >
                  <X size={18} color="#6F7480" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Language Options List */}
            <ScrollView
              style={styles.optionsList}
              contentContainerStyle={styles.optionsListContent}
              showsVerticalScrollIndicator={false}
            >
              {supportedLanguages.map((language) => {
                const active = language === selectedLanguage;
                const meta = LANGUAGE_METADATA[language] || {
                  native: language,
                  subtitle: language,
                };

                return (
                  <TouchableOpacity
                    key={language}
                    style={[
                      styles.langOptionCard,
                      active && styles.langOptionCardActive,
                    ]}
                    onPress={() => handleSelectLanguage(language)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.flexOne}>
                      <Text
                        style={[
                          styles.langNativeText,
                          active && styles.langNativeTextActive,
                        ]}
                      >
                        {meta.native}
                      </Text>
                      <Text
                        style={[
                          styles.langSubText,
                          active && styles.langSubTextActive,
                        ]}
                      >
                        {meta.subtitle}
                      </Text>
                    </View>

                    {active ? (
                      <View style={styles.checkCircleActive}>
                        <Check size={14} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    ) : (
                      <View style={styles.checkCircleInactive} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  pillBtn: {
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "#F8C8D8",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: 120,
    shadowColor: "#D64A73",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  globeWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FDE7EF",
    alignItems: "center",
    justifyContent: "center",
  },
  pillBtnText: {
    color: "#30343B",
    fontSize: 12,
    fontWeight: "700",
    flexShrink: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  dialogCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 25,
    maxHeight: "80%",
  },
  dialogHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 14,
    marginBottom: 12,
  },
  dialogHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dialogIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FDE7EF",
    alignItems: "center",
    justifyContent: "center",
  },
  flexOne: {
    flex: 1,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#30343B",
  },
  dialogSub: {
    fontSize: 12,
    color: "#6F7480",
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  optionsList: {
    flexGrow: 0,
  },
  optionsListContent: {
    gap: 8,
    paddingVertical: 4,
  },
  langOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: "#F1F5F9",
    backgroundColor: "#FAFBFD",
  },
  langOptionCardActive: {
    backgroundColor: "#FDE7EF",
    borderColor: "#F8C8D8",
  },
  langNativeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#30343B",
  },
  langNativeTextActive: {
    color: "#D64A73",
    fontWeight: "800",
  },
  langSubText: {
    fontSize: 11,
    color: "#6F7480",
    marginTop: 1,
  },
  langSubTextActive: {
    color: "#D64A73",
  },
  checkCircleActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#D64A73",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleInactive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
});
