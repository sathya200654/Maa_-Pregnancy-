import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CornerDownRight,
  Heart,
  HelpCircle,
  Info,
  PhoneCall,
  RotateCcw,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react-native";

import { colors, fonts, shadows } from "@/constants/theme";
import { EmergencySupportButton } from "@/components/EmergencySupportButton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useApp } from "@/context/AppContext";
import { speakText, stopSpeaking, localeForLanguage } from "@/utils/tts";
import {
  FAQItem,
  FollowUpQuestion,
  checkEmergencyText,
  getCategories,
  getEmergencySymptoms,
  getFaqsByCategory,
  getPopularQuestions,
  getRelatedFaqs,
  searchQuestions,
  getLocalizedFaq,
} from "@/services/knowledgeService";
import { getLocalizedCategory } from "@/services/knowledgeLocalization";

interface ChatStep {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  faqItem?: FAQItem;
  followUpQuestion?: FollowUpQuestion;
  availableFollowUps?: FollowUpQuestion[];
  relatedFaqs?: FAQItem[];
  selectedOptionText?: string;
  isEmergencyAlert?: boolean;
}

const POPULAR_CATEGORY_SHORTLIST = [
  "All",
  "Health",
  "Symptoms",
  "Food",
  "Yoga",
  "Baby",
  "Nutrition",
  "Mental Wellness",
  "Medicines",
  "General Pregnancy",
  "Scans & Tests",
  "Labor & Delivery",
];

export default function ChatScreen() {
  const { selectedLanguage, t } = useApp();
  const searchParams = useLocalSearchParams<{ initialPrompt?: string; category?: string; q?: string }>();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [conversation, setConversation] = useState<ChatStep[]>([]);
  const [speakingStepId, setSpeakingStepId] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const searchInputRef = useRef<TextInput>(null);

  // All categories from dataset
  const allCategories = useMemo(() => {
    const list = getCategories();
    return ["All", ...list.filter((c) => c !== "All")];
  }, []);

  // Filtered categories for top horizontal chips
  const displayCategories = useMemo(() => {
    const set = new Set(POPULAR_CATEGORY_SHORTLIST);
    const rest = allCategories.filter((c) => !set.has(c));
    return [...POPULAR_CATEGORY_SHORTLIST, ...rest.slice(0, 15)];
  }, [allCategories]);

  // Live search results matching user typed input
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      if (selectedCategory && selectedCategory !== "All") {
        return getFaqsByCategory(selectedCategory, 12);
      }
      return [];
    }
    return searchQuestions(searchQuery, 15, selectedLanguage);
  }, [searchQuery, selectedCategory, selectedLanguage]);

  // Popular curated starter questions
  const starterQuestions = useMemo(() => {
    if (selectedCategory && selectedCategory !== "All") {
      return getFaqsByCategory(selectedCategory, 6);
    }
    return getPopularQuestions(6);
  }, [selectedCategory]);

  // Handle incoming route params (e.g. from search / articles / home quick support)
  useEffect(() => {
    const prompt = searchParams.initialPrompt || searchParams.q;
    if (searchParams.category) {
      setSelectedCategory(searchParams.category);
    }
    if (prompt) {
      setSearchQuery(prompt);
      const matches = searchQuestions(prompt, 1, selectedLanguage);
      if (matches.length > 0) {
        handleSelectQuestion(matches[0]);
      }
    }
  }, [searchParams.initialPrompt, searchParams.category, searchParams.q]);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const scrollToBottom = useCallback((delay = 120) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, delay);
  }, []);

  const handleSelectQuestion = (faq: FAQItem) => {
    Keyboard.dismiss();
    setIsSearchFocused(false);
    setSearchQuery("");

    const locFaq = getLocalizedFaq(faq, selectedLanguage);
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userStepId = `user-${Date.now()}`;
    const botStepId = `bot-${Date.now() + 1}`;

    const userStep: ChatStep = {
      id: userStepId,
      sender: "user",
      text: locFaq.question,
      timestamp: now,
    };

    const isEmergency =
      locFaq.severity === "warning" ||
      checkEmergencyText(faq.question + " " + faq.answer);

    const related = getRelatedFaqs(faq);

    const botStep: ChatStep = {
      id: botStepId,
      sender: "assistant",
      text: locFaq.answer,
      timestamp: now,
      faqItem: locFaq,
      availableFollowUps: locFaq.follow_up_questions || [],
      relatedFaqs: related,
      isEmergencyAlert: isEmergency,
    };

    setConversation((prev) => [...prev, userStep, botStep]);
    scrollToBottom(150);
  };

  const handleSelectFollowUp = (
    parentStepIndex: number,
    followUp: FollowUpQuestion,
    parentFaq: FAQItem
  ) => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userStepId = `user-fu-${Date.now()}`;
    const botStepId = `bot-fu-${Date.now() + 1}`;

    // Mark previous option as selected
    setConversation((prev) => {
      const updated = [...prev];
      if (updated[parentStepIndex]) {
        updated[parentStepIndex] = {
          ...updated[parentStepIndex],
          selectedOptionText: followUp.question,
        };
      }

      const userStep: ChatStep = {
        id: userStepId,
        sender: "user",
        text: followUp.question,
        timestamp: now,
      };

      // Remaining follow up questions the user has not asked yet
      const remainingFollowUps = (parentFaq.follow_up_questions || []).filter(
        (fu) => fu.question !== followUp.question
      );

      const isEmergency = checkEmergencyText(followUp.question + " " + followUp.answer);

      const botStep: ChatStep = {
        id: botStepId,
        sender: "assistant",
        text: followUp.answer,
        timestamp: now,
        faqItem: parentFaq,
        followUpQuestion: followUp,
        availableFollowUps: remainingFollowUps,
        relatedFaqs: getRelatedFaqs(parentFaq),
        isEmergencyAlert: isEmergency,
      };

      return [...updated, userStep, botStep];
    });

    scrollToBottom(150);
  };

  const handleSpeak = async (stepId: string, text: string) => {
    if (speakingStepId === stepId) {
      await stopSpeaking();
      setSpeakingStepId(null);
      return;
    }
    setSpeakingStepId(stepId);
    const locale = localeForLanguage(selectedLanguage);
    await speakText(text, locale);
    setSpeakingStepId(null);
  };

  const handleResetConversation = () => {
    Alert.alert(
      t("chat_start_fresh_title", "Start Fresh?"),
      t("chat_start_fresh_body", "Clear current conversation and explore new pregnancy questions?"),
      [
        { text: t("cancel", "Cancel"), style: "cancel" },
        {
          text: t("chat_start_fresh_btn", "Start Fresh"),
          style: "destructive",
          onPress: () => {
            stopSpeaking();
            setSpeakingStepId(null);
            setConversation([]);
            setSearchQuery("");
            setIsSearchFocused(false);
          },
        },
      ]
    );
  };

  const handleCallEmergency = () => {
    Linking.openURL("tel:108").catch(() => {
      Alert.alert(t("sos_button", "Emergency"), t("sos_alert_body", "Please dial 108 or your nearest hospital immediately."));
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Top Header Bar with Soft Baby Pink -> Baby Blue Gradient */}
      <View style={styles.header}>
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
          <Defs>
            <LinearGradient id="chatHeaderGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#FDE7EF" stopOpacity={0.95} />
              <Stop offset="60%" stopColor="#FFFFFF" stopOpacity={0.9} />
              <Stop offset="100%" stopColor="#E6F4FC" stopOpacity={0.95} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#chatHeaderGrad)" />
        </Svg>
        <View style={styles.headerRow}>
          <View style={styles.headerTitleWrap}>
            <View style={styles.headerBadge}>
              <Sparkles size={13} color={colors.brand} />
              <Text style={styles.headerBadgeText}>{t("chat_badge", "600+ Prebuilt Answers")}</Text>
            </View>
            <Text style={styles.headerTitle}>{t("chat_header_title", "Maa Guide")}</Text>
            <Text style={styles.headerSubtitle}>
              {t("chat_header_subtitle", "Interactive pregnancy decision explorer")}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <LanguageSelector />
            <EmergencySupportButton onPress={handleCallEmergency} />
            {conversation.length > 0 && (
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleResetConversation}
                activeOpacity={0.7}
                accessibilityLabel="Reset conversation"
              >
                <RotateCcw size={16} color={colors.brand} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Live Search Bar */}
        <View style={styles.searchBarContainer}>
          <View style={[styles.searchBox, isSearchFocused && styles.searchBoxFocused]}>
            <Search size={18} color={isSearchFocused ? colors.brand : "#8E99B0"} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder={t("chat_search_placeholder", "Search questions (e.g., diet, scan, vomiting)...")}
              placeholderTextColor="#9AA2BC"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                // Short timeout to allow clicking search items
                setTimeout(() => setIsSearchFocused(false), 250);
              }}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearSearchBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={16} color="#8E99B0" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories Horizontal Carousel */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {displayCategories.map((cat, idx) => {
              const isSelected = selectedCategory === cat;
              const isEven = idx % 2 === 0;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    isEven ? styles.categoryChipPink : styles.categoryChipBlue,
                    isSelected && styles.categoryChipActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat);
                    if (searchQuery) setSearchQuery("");
                  }}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextActive,
                    ]}
                  >
                    {getLocalizedCategory(cat, selectedLanguage)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.body}>
        {/* Live Search Results Popup Dropdown */}
        {searchQuery.trim().length > 0 && (
          <View style={styles.searchResultsDropdown}>
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsCount}>
                {t("chat_found_prefix", "Found")} {searchResults.length} {t("chat_found_questions", "prebuilt questions")}
              </Text>
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Text style={styles.closeSearchText}>{t("close", "Close")}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.searchResultsScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {searchResults.length === 0 ? (
                <View style={styles.noResultsBox}>
                  <HelpCircle size={28} color="#9AA2BC" />
                  <Text style={styles.noResultsTitle}>{t("chat_no_match", "No exact question match")}</Text>
                  <Text style={styles.noResultsSubtitle}>
                    {t("chat_try_searching", "Try searching for common keywords like \"food\", \"scan\", \"pain\", \"trimester\", \"iron\", or \"weight\".")}
                  </Text>
                </View>
              ) : (
                searchResults.map((item) => {
                  const locItem = getLocalizedFaq(item, selectedLanguage);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.searchResultItem}
                      onPress={() => handleSelectQuestion(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.resultItemLeft}>
                        <View style={styles.categoryBadgeMini}>
                          <Text style={styles.categoryBadgeMiniText}>{getLocalizedCategory(item.category, selectedLanguage)}</Text>
                        </View>
                        <Text style={styles.searchResultQuestion}>{locItem.question}</Text>
                        {locItem.follow_up_questions && locItem.follow_up_questions.length > 0 && (
                          <Text style={styles.followUpBadge}>
                            ✦ {locItem.follow_up_questions.length} {t("chat_interactive_followups", "interactive follow-ups")}
                          </Text>
                        )}
                      </View>
                      <ChevronRight size={18} color={colors.brand} />
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          </View>
        )}

        {/* Scrollable Conversation Stream */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome Screen when conversation is empty */}
          {conversation.length === 0 ? (
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeCard}>
                <View style={styles.welcomeIconWrap}>
                  <Sparkles size={32} color={colors.brand} />
                </View>
                <Text style={styles.welcomeTitle}>{t("chat_welcome_title", "Interactive Pregnancy Guide")}</Text>
                <Text style={styles.welcomeDesc}>
                  {t("chat_welcome_desc", "Select a prebuilt question below or type keywords in the search bar above. Tap interactive options to drill down into specific medical guidance.")}
                </Text>

                <View style={styles.bankFlowNotice}>
                  <Info size={16} color={colors.brand} />
                  <Text style={styles.bankFlowText}>
                    {t("chat_decision_mode", "Decision Tree Mode: Tap questions to get verified answers and explore step-by-step sub-options.")}
                  </Text>
                </View>
              </View>

              {/* Starter Question Cards */}
              <View style={styles.starterSection}>
                <View style={styles.starterHeaderRow}>
                  <Text style={styles.starterSectionTitle}>
                    {selectedCategory === "All" ? t("chat_faq_title", "Frequently Asked Questions") : `${getLocalizedCategory(selectedCategory, selectedLanguage)} ${t("chat_topics", "Questions")}`}
                  </Text>
                  <Text style={styles.starterBadge}>{starterQuestions.length} {t("chat_topics", "Topics")}</Text>
                </View>

                <View style={styles.starterList}>
                  {starterQuestions.map((item) => {
                    const locItem = getLocalizedFaq(item, selectedLanguage);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.starterCard}
                        onPress={() => handleSelectQuestion(item)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.starterCardTop}>
                          <View style={styles.starterTag}>
                            <Text style={styles.starterTagText}>{getLocalizedCategory(item.category, selectedLanguage)}</Text>
                          </View>
                          {item.trimester && item.trimester.length > 0 && (
                            <Text style={styles.starterTrimester}>
                              {item.trimester.join(", ")} Trimester
                            </Text>
                          )}
                        </View>
                        <Text style={styles.starterQuestionText}>{locItem.question}</Text>
                        <View style={styles.starterCardBottom}>
                          <Text style={styles.starterActionText}>{t("chat_tap_explore", "Tap to explore options")}</Text>
                          <ArrowRight size={14} color={colors.brand} />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          ) : (
            // Conversation Stream with Interactive Decision Tree Options
            <View style={styles.conversationList}>
              {conversation.map((step, index) => {
                if (step.sender === "user") {
                  return (
                    <View key={step.id} style={styles.userBubbleWrap}>
                      <View style={styles.userBubble}>
                        <Text style={styles.userBubbleText}>{step.text}</Text>
                        <Text style={styles.userTimeText}>{step.timestamp}</Text>
                      </View>
                    </View>
                  );
                }

                // Assistant Response Card
                return (
                  <View key={step.id} style={styles.assistantCardWrap}>
                    <View style={styles.assistantCard}>
                      {/* Card Header with Badges and Audio Button */}
                      <View style={styles.assistantHeader}>
                        <View style={styles.avatarPill}>
                          <View style={styles.avatarCircle}>
                            <Heart size={14} color={colors.white} fill={colors.white} />
                          </View>
                          <Text style={styles.avatarLabel}>Maa Care</Text>
                        </View>

                        <View style={styles.assistantMetaRow}>
                          {step.faqItem?.category && (
                            <View style={styles.metaCategoryBadge}>
                              <Text style={styles.metaCategoryText}>
                                {getLocalizedCategory(step.faqItem.category, selectedLanguage)}
                              </Text>
                            </View>
                          )}
                          <TouchableOpacity
                            style={styles.audioBtn}
                            onPress={() => handleSpeak(step.id, step.text)}
                            activeOpacity={0.7}
                            accessibilityLabel="Read aloud"
                          >
                            {speakingStepId === step.id ? (
                              <VolumeX size={16} color={colors.brand} />
                            ) : (
                              <Volume2 size={16} color="#6980A6" />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Emergency Warning Notice if applicable */}
                      {step.isEmergencyAlert && (
                        <View style={styles.emergencyNoticeCard}>
                          <AlertTriangle size={18} color="#D32F2F" />
                          <View style={styles.emergencyNoticeContent}>
                            <Text style={styles.emergencyNoticeTitle}>
                              {t("chat_caution_title", "Immediate Medical Caution")}
                            </Text>
                            <Text style={styles.emergencyNoticeText}>
                              {t("chat_caution_body", "If you experience heavy bleeding, severe abdominal pain, chest pain, breathing difficulty, or reduced baby movement, seek emergency care immediately.")}
                            </Text>
                            <TouchableOpacity
                              style={styles.callEmergencyBtn}
                              onPress={handleCallEmergency}
                            >
                              <PhoneCall size={13} color={colors.white} />
                              <Text style={styles.callEmergencyBtnText}>{t("chat_call_108", "Call 108 Emergency")}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}

                      {/* Main Answer Text */}
                      <Text style={styles.assistantText}>{step.text}</Text>

                      {/* Trimesters Info Tag */}
                      {step.faqItem?.trimester && step.faqItem.trimester.length > 0 && (
                        <View style={styles.trimesterRow}>
                          <Text style={styles.trimesterLabel}>{t("chat_applicable_trimesters", "Applicable Trimesters:")}</Text>
                          {step.faqItem.trimester.map((tri) => (
                            <View key={tri} style={styles.trimesterChip}>
                              <Text style={styles.trimesterChipText}>{tri}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Interactive Decision-Tree Options Section */}
                      {step.availableFollowUps && step.availableFollowUps.length > 0 && (
                        <View style={styles.optionsSection}>
                          <View style={styles.optionsDivider} />
                          <View style={styles.optionsHeader}>
                            <CornerDownRight size={15} color={colors.brand} />
                            <Text style={styles.optionsTitle}>
                              {t("chat_drill_down", "Tap a follow-up option to drill down:")}
                            </Text>
                          </View>

                          <View style={styles.optionsList}>
                            {step.availableFollowUps.map((fu, fuIdx) => {
                              const isSelected = step.selectedOptionText === fu.question;
                              return (
                                <TouchableOpacity
                                  key={fuIdx}
                                  style={[
                                    styles.optionBtn,
                                    isSelected && styles.optionBtnSelected,
                                  ]}
                                  onPress={() => {
                                    if (step.faqItem) {
                                      handleSelectFollowUp(index, fu, step.faqItem);
                                    }
                                  }}
                                  activeOpacity={0.75}
                                >
                                  <View style={styles.optionNumberCircle}>
                                    <Text style={styles.optionNumberText}>{fuIdx + 1}</Text>
                                  </View>
                                  <Text
                                    style={[
                                      styles.optionText,
                                      isSelected && styles.optionTextSelected,
                                    ]}
                                  >
                                    {fu.question}
                                  </Text>
                                  {isSelected ? (
                                    <CheckCircle2 size={16} color={colors.brand} />
                                  ) : (
                                    <ChevronRight size={16} color="#8E99B0" />
                                  )}
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      )}

                      {/* Related Questions Pills (if any) */}
                      {step.relatedFaqs && step.relatedFaqs.length > 0 && (
                        <View style={styles.relatedSection}>
                          <Text style={styles.relatedSectionTitle}>
                            {t("chat_related", "Related Questions:")}
                          </Text>
                          <View style={styles.relatedList}>
                            {step.relatedFaqs.slice(0, 3).map((relFaq) => {
                              const locRel = getLocalizedFaq(relFaq, selectedLanguage);
                              return (
                                <TouchableOpacity
                                  key={relFaq.id}
                                  style={styles.relatedChip}
                                  onPress={() => handleSelectQuestion(relFaq)}
                                  activeOpacity={0.7}
                                >
                                  <BookOpen size={13} color={colors.brand} />
                                  <Text style={styles.relatedChipText} numberOfLines={2}>
                                    {locRel.question}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      )}

                      {/* Quick Action to browse another question */}
                      <View style={styles.cardFooterActions}>
                        <TouchableOpacity
                          style={styles.browseAnotherBtn}
                          onPress={() => {
                            searchInputRef.current?.focus();
                          }}
                        >
                          <Search size={13} color={colors.brand} />
                          <Text style={styles.browseAnotherText}>
                            {t("chat_search_another", "Search another topic")}
                          </Text>
                        </TouchableOpacity>
                        <Text style={styles.assistantTimeText}>{step.timestamp}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  header: {
    backgroundColor: colors.white,
    paddingTop: Platform.OS === "ios" ? 54 : 45,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F5",
    ...shadows.default,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitleWrap: {
    flex: 1,
    marginRight: 10,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 4,
    gap: 4,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.brand,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1F2B4D",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6980A6",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  resetBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF0F4",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBarContainer: {
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F3F8",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  searchBoxFocused: {
    borderColor: colors.brand,
    backgroundColor: colors.white,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2B4D",
    marginLeft: 8,
    padding: 0,
  },
  clearSearchBtn: {
    padding: 2,
  },
  categoriesContainer: {
    marginHorizontal: -16,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  categoryChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F1F3F8",
  },
  categoryChipPink: {
    backgroundColor: "#FDE7EF",
    borderColor: "#F8C8D8",
  },
  categoryChipBlue: {
    backgroundColor: "#E6F4FC",
    borderColor: "#BFDFF5",
  },
  categoryChipActive: {
    backgroundColor: "#F8C8D8",
    borderColor: "#E05D82",
    borderWidth: 1.5,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#30343B",
  },
  categoryChipTextActive: {
    color: "#30343B",
    fontWeight: "800",
  },
  body: {
    flex: 1,
    position: "relative",
  },
  searchResultsDropdown: {
    position: "absolute",
    top: 0,
    left: 12,
    right: 12,
    maxHeight: 380,
    backgroundColor: colors.white,
    borderRadius: 18,
    zIndex: 999,
    ...shadows.default,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E5E9F2",
    overflow: "hidden",
  },
  searchResultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF1F7",
    backgroundColor: "#F9FAFC",
  },
  searchResultsCount: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6980A6",
    textTransform: "uppercase",
  },
  closeSearchText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.brand,
  },
  searchResultsScroll: {
    maxHeight: 330,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F5FA",
  },
  resultItemLeft: {
    flex: 1,
    marginRight: 10,
  },
  categoryBadgeMini: {
    backgroundColor: "#FFF0F4",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  categoryBadgeMiniText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.brand,
  },
  searchResultQuestion: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2B4D",
    lineHeight: 19,
  },
  followUpBadge: {
    fontSize: 11,
    fontWeight: "600",
    color: "#059669",
    marginTop: 3,
  },
  noResultsBox: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2B4D",
    marginTop: 8,
  },
  noResultsSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6980A6",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  welcomeContainer: {
    paddingBottom: 20,
  },
  welcomeCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F2F7",
    ...shadows.default,
    marginBottom: 20,
  },
  welcomeIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFF0F4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1F2B4D",
    marginBottom: 6,
    textAlign: "center",
  },
  welcomeDesc: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6980A6",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  bankFlowNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8F0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FFE4CC",
  },
  bankFlowText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#B45309",
    flex: 1,
    lineHeight: 16,
  },
  starterSection: {
    marginTop: 6,
  },
  starterHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  starterSectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2B4D",
  },
  starterBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8E99B0",
  },
  starterList: {
    gap: 12,
  },
  starterCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: "#EAEFF7",
    ...shadows.default,
  },
  starterCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  starterTag: {
    backgroundColor: "#FFF0F4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  starterTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.brand,
    textTransform: "uppercase",
  },
  starterTrimester: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8E99B0",
  },
  starterQuestionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2B4D",
    lineHeight: 21,
    marginBottom: 10,
  },
  starterCardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F4F6FB",
    paddingTop: 8,
  },
  starterActionText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.brand,
  },
  conversationList: {
    gap: 16,
  },
  userBubbleWrap: {
    alignItems: "flex-end",
    marginVertical: 4,
  },
  userBubble: {
    backgroundColor: "#FDE7EF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F8C8D8",
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: "85%",
    ...shadows.default,
  },
  userBubbleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#30343B",
    lineHeight: 20,
  },
  userTimeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6F7480",
    textAlign: "right",
    marginTop: 4,
  },
  assistantCardWrap: {
    alignItems: "flex-start",
    marginVertical: 6,
  },
  assistantCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    padding: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#EAEFF7",
    ...shadows.default,
  },
  assistantHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  avatarPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1F2B4D",
  },
  assistantMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaCategoryBadge: {
    backgroundColor: "#F1F3F8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  metaCategoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4A5269",
  },
  audioBtn: {
    padding: 4,
  },
  emergencyNoticeCard: {
    flexDirection: "row",
    backgroundColor: "#FFEBEE",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFCDD2",
    gap: 10,
  },
  emergencyNoticeContent: {
    flex: 1,
  },
  emergencyNoticeTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#C62828",
    marginBottom: 3,
  },
  emergencyNoticeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#B71C1C",
    lineHeight: 17,
    marginBottom: 8,
  },
  callEmergencyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C62828",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    gap: 6,
  },
  callEmergencyBtnText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.white,
  },
  assistantText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#30343B",
    lineHeight: 22,
    marginBottom: 10,
  },
  trimesterRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  trimesterLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8E99B0",
  },
  trimesterChip: {
    backgroundColor: "#FFF0F4",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  trimesterChipText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.brand,
  },
  optionsSection: {
    marginTop: 4,
    marginBottom: 10,
  },
  optionsDivider: {
    height: 1,
    backgroundColor: "#EEF1F8",
    marginBottom: 12,
  },
  optionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  optionsTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.brand,
    letterSpacing: 0.2,
  },
  optionsList: {
    gap: 8,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
    borderWidth: 1.5,
    borderColor: "#E6ECF6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  optionBtnSelected: {
    borderColor: colors.brand,
    backgroundColor: "#FFF5F8",
  },
  optionNumberCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  optionNumberText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#4A5269",
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2B4D",
    lineHeight: 18,
  },
  optionTextSelected: {
    color: colors.brand,
    fontWeight: "700",
  },
  relatedSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEF1F8",
  },
  relatedSectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8E99B0",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  relatedList: {
    gap: 6,
  },
  relatedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8FA",
    borderWidth: 1,
    borderColor: "#FFE4EE",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 8,
  },
  relatedChipText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#2C3550",
  },
  cardFooterActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F4F6FB",
  },
  browseAnotherBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  browseAnotherText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.brand,
  },
  assistantTimeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#8E99B0",
  },
});
