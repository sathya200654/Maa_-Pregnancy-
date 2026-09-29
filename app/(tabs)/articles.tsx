import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  Baby,
  Apple,
  BookOpen,
  Calendar,
  Sparkles,
  Heart,
  Droplets,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Utensils,
  Footprints,
} from "lucide-react-native";
import { colors, fonts } from "@/constants/theme";
import { useApp } from "@/context/AppContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SupportedLanguage } from "@/data/translations";
import { localizedMilestoneData } from "@/data/timelineMilestones";

interface LocalizedArticleContent {
  title: string;
  description: string;
  tag: string;
  minutes: number;
}

const localizedArticleMap: Record<number, Partial<Record<SupportedLanguage, LocalizedArticleContent>>> = {
  1: {
    English: {
      title: "Nutrition During Pregnancy",
      description: "Learn about essential nutrients including folic acid, iron, calcium, and optimal dietary balance.",
      tag: "Nutrition",
      minutes: 5,
    },
    "தமிழ்": {
      title: "கர்ப்பகால ஊட்டச்சத்து",
      description: "போலிக் அமிலம், இரும்புச்சத்து, கால்சியம் உள்ளிட்ட அத்தியாவசிய ஊட்டச்சத்துக்கள் பற்றி அறியவும்.",
      tag: "ஊட்டச்சத்து",
      minutes: 5,
    },
    "हिन्दी": {
      title: "गर्भावस्था के दौरान पोषण",
      description: "फोलिक एसिड, आयरन, कैल्शियम सहित आवश्यक पोषक तत्वों के बारे में जानें।",
      tag: "पोषण",
      minutes: 5,
    },
    "ಕನ್ನಡ": {
      title: "ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಪೋಷಣೆ",
      description: "ಫೋಲಿಕ್ ಆಸಿಡ್, ಕಬ್ಬಿಣ, ಕ್ಯಾಲ್ಸಿಯಂ ಸೇರಿದಂತೆ ಅಗತ್ಯವಾದ ಪೋಷಕಾಂಶಗಳ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ.",
      tag: "ಪೋಷಣೆ",
      minutes: 5,
    },
    "मराठी": {
      title: "गर्भावस्थेतील पोषण",
      description: "फॉलिक अ‍ॅसिड, लोह, कॅल्शियम यांसह आवश्यक पोषक घटकांविषयी जाणून घ्या.",
      tag: "पोषण",
      minutes: 5,
    },
    "മലയാളം": {
      title: "ഗർഭകാല പോഷകാഹാരം",
      description: "ഫോളിക് ആസിഡ്, ഇരുമ്പ്, കാൽസ്യം എന്നിവയുൾപ്പെടെയുള്ള പ്രധാന പോഷകങ്ങളെക്കുറിച്ച് അറിയുക.",
      tag: "പോഷകാഹാരം",
      minutes: 5,
    },
    "తెలుగు": {
      title: "గర్భధారణలో సరైన పోషకాహారం",
      description: "ఫోలిక్ యాసిడ్, ఐరన్, కాల్షియం మరియు సమతుల్య ఆహారం యొక్క ప్రాముఖ్యతను తెలుసుకోండి.",
      tag: "పోషణ",
      minutes: 5,
    },
  },
  2: {
    English: {
      title: "Exercise During Pregnancy",
      description: "Discover safe and effective ways to stay active while pregnant, and the benefits for maternal wellness.",
      tag: "Wellness",
      minutes: 4,
    },
    "தமிழ்": {
      title: "கர்ப்பகால உடற்பயிற்சி",
      description: "கர்ப்ப காலத்தில் பாதுகாப்பாக சுறுசுறுப்பாக இயங்குவதற்கான வழிகள் மற்றும் உங்கள் குழந்தைக்கான நன்மைகள்.",
      tag: "உடல்நலம்",
      minutes: 4,
    },
    "हिन्दी": {
      title: "गर्भावस्था में व्यायाम",
      description: "गर्भवती रहते हुए सक्रिय रहने के सुरक्षित और प्रभावी तरीके तथा आपके और शिशु के लिए लाभ।",
      tag: "कल्याण",
      minutes: 4,
    },
    "ಕನ್ನಡ": {
      title: "ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ವ್ಯಾಯಾಮ",
      description: "ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಸಕ್ರಿಯವಾಗಿರಲು ಸುಲಭ ಮಾರ್ಗಗಳು ಮತ್ತು ಮಗುವಿಗೆ ಸಿಗುವ ಪ್ರಯೋಜನಗಳು.",
      tag: "ಕ್ಷೇಮ",
      minutes: 4,
    },
    "मराठी": {
      title: "गर्भावस्थेत व्यायाम",
      description: "गरोदरपणात सुरक्षितपणे सक्रिय राहण्याचे मार्ग आणि तुमच्या बाळासाठी होणारे फायदे.",
      tag: "आरोग्य",
      minutes: 4,
    },
    "മലയാളം": {
      title: "ഗർഭകാല വ്യായാമം",
      description: "ഗർഭകാലത്ത് സുരക്ഷിതമായി വ്യായാമം ചെയ്യാനുള്ള വഴികളും നിങ്ങൾക്കും കുഞ്ഞിനും ലഭിക്കുന്ന ഗുണങ്ങളും.",
      tag: "ആരോഗ്യം",
      minutes: 4,
    },
    "తెలుగు": {
      title: "గర్భధారణ సమయంలో వ్యాయామం",
      description: "గర్భధారణ సమయంలో సురక్షితమైన తేలికపాటి వ్యాయామాలు మరియు వాటి ప్రయోజనాలను కనుగొనండి.",
      tag: "ఆరోగ్యం",
      minutes: 4,
    },
  },
  3: {
    English: {
      title: "Pregnancy Week by Week",
      description: "A comprehensive guide on fetal development and what changes to expect in your body week by week.",
      tag: "Development",
      minutes: 7,
    },
    "தமிழ்": {
      title: "வாரம் தோறும் கர்ப்பம்",
      description: "கருவின் வளர்ச்சி மற்றும் உங்கள் உடலில் ஏற்படும் மாற்றங்கள் குறித்த விரிவான வழிகாட்டி.",
      tag: "வளர்ச்சி",
      minutes: 7,
    },
    "हिन्दी": {
      title: "सप्ताह-दर-सप्ताह गर्भावस्था",
      description: "भ्रूण विकास और सप्ताह-दर-सप्ताह आपके शरीर में होने वाले बदलावों पर एक संपूर्ण मार्गदर्शिका।",
      tag: "विकास",
      minutes: 7,
    },
    "ಕನ್ನಡ": {
      title: "ವಾರದಿಂದ ವಾರಕ್ಕೆ ಗರ್ಭಾವಸ್ಥೆ",
      description: "ಭ್ರೂಣದ ಬೆಳವಣಿಗೆ ಮತ್ತು ನಿಮ್ಮ ದೇಹದಲ್ಲಿನ ಬದಲಾವಣೆಗಳ ವಿವರವಾದ ಮಾಹಿತಿ.",
      tag: "ಬೆಳವಣಿಗೆ",
      minutes: 7,
    },
    "मराठी": {
      title: "आठवड्यानुसार गर्भधारणा",
      description: "गर्भाचा विकास आणि आठवड्यानुसार शरीरातील बदलांविषयी संपूर्ण माहिती.",
      tag: "विकास",
      minutes: 7,
    },
    "മലയാളം": {
      title: "ഓരോ ആഴ്ചയിലെയും മാറ്റങ്ങൾ",
      description: "ഭ്രൂണത്തിന്റെ വളർച്ചയെക്കുറിച്ചും ഓരോ ആഴ്ചയിലും ശരീരത്തിലുണ്ടാകുന്ന മാറ്റങ്ങളെക്കുറിച്ചും അറിയുക.",
      tag: "വളർച്ച",
      minutes: 7,
    },
    "తెలుగు": {
      title: "వారం వారం గర్భధారణ మార్పులు",
      description: "పిండం అభివృద్ధి మరియు ప్రతి వారం మీ శరీరంలో వచ్చే మార్పుల సమగ్ర మార్గదర్శి.",
      tag: "అభివృద్ధి",
      minutes: 7,
    },
  },
  4: {
    English: {
      title: "Mental Health During Pregnancy",
      description: "Guidance on taking care of your emotional and mental well-being during pregnancy and postpartum.",
      tag: "Mental Health",
      minutes: 6,
    },
    "தமிழ்": {
      title: "கர்ப்பகால மனநலம்",
      description: "கர்ப்ப காலத்தில் மற்றும் பிரசவத்திற்குப் பின் உங்கள் உணர்ச்சி மற்றும் மனநலத்தை பராமரித்தல்.",
      tag: "மனநலம்",
      minutes: 6,
    },
    "हिन्दी": {
      title: "गर्भावस्था में मानसिक स्वास्थ्य",
      description: "गर्भावस्था और प्रसव के बाद अपनी भावनात्मक और मानसिक सेहत का ख्याल रखने के लिए सुझाव।",
      tag: "मानसिक स्वास्थ्य",
      minutes: 6,
    },
    "ಕನ್ನಡ": {
      title: "ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಮಾನಸಿಕ ಆರೋಗ್ಯ",
      description: "ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಮತ್ತು ಹೆರಿಗೆಯ ನಂತರ ನಿಮ್ಮ ಮಾನಸಿಕ ಆರೋಗ್ಯವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳುವ ಮಾರ್ಗದರ್ಶನ.",
      tag: "ಮಾನಸಿಕ ಆರೋಗ್ಯ",
      minutes: 6,
    },
    "मराठी": {
      title: "गरोदरपणातील मानसिक स्वास्थ्य",
      description: "गरोदरपणात आणि बाळंतपणानंतर मानसिक स्वास्थ्याची काळजी कशी घ्यावी याविषयी मार्गदर्शन.",
      tag: "मानसिक आरोग्य",
      minutes: 6,
    },
    "മലയാളം": {
      title: "ഗർഭകാല മാനസികാരോഗ്യം",
      description: "ഗർഭകാലത്തും പ്രസവാനന്തരവും മാനസികാരോഗ്യം സംരക്ഷിക്കുന്നതിനുള്ള പ്രധാന നിർദ്ദേശങ്ങൾ.",
      tag: "മാനസികാരോഗ്യം",
      minutes: 6,
    },
    "తెలుగు": {
      title: "గర్భధారణలో మానసిక ఆరోగ్యం",
      description: "గర్భధారణ మరియు ప్రసవానంతర సమయంలో భావోద్వేగ మరియు మానసిక శ్రేయస్సు సంరక్షణ సూచనలు.",
      tag: "మానసిక ఆరోగ్యం",
      minutes: 6,
    },
  },
  5: {
    English: {
      title: "Breastfeeding Basics",
      description: "Information on the benefits of breastfeeding and tips to get started successfully.",
      tag: "Postpartum",
      minutes: 5,
    },
    "தமிழ்": {
      title: "தாய்ப்பால் அடிப்படைகள்",
      description: "தாய்ப்பால் கொடுப்பதன் நன்மைகள் மற்றும் வெற்றிகரமாகத் தொடங்குவதற்கான நடைமுறை குறிப்புகள்.",
      tag: "பிரசவத்திற்குப் பின்",
      minutes: 5,
    },
    "हिन्दी": {
      title: "स्तनपान की बुनियादी बातें",
      description: "स्तनपान के लाभ और सफलतापूर्वक शुरुआत करने के महत्वपूर्ण सुझाव।",
      tag: "प्रसवोत्तर",
      minutes: 5,
    },
    "ಕನ್ನಡ": {
      title: "ಎದೆಹಾಲುಣಿಸುವಿಕೆಯ ಮೂಲ ಮಾಹಿತಿ",
      description: "ಎದೆಹಾಲುಣಿಸುವಿಕೆಯ ಪ್ರಯೋಜನಗಳು ಮತ್ತು ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಾರಂಭಿಸಲು ಸಲಹೆಗಳು.",
      tag: "ಪ್ರಸವೋತ್ತರ",
      minutes: 5,
    },
    "मराठी": {
      title: "स्तनपानाची मूलभूत माहिती",
      description: "स्तनपानाचे फायदे आणि यशस्वी सुरुवात करण्यासाठी महत्त्वाच्या टिप्स.",
      tag: "प्रसूतीनंतर",
      minutes: 5,
    },
    "മലയാളം": {
      title: "മുലയൂട്ടൽ അടിസ്ഥാന വിവരങ്ങൾ",
      description: "മുലയൂട്ടലിന്റെ ഗുണങ്ങളും വിജയകരമായി ആരംഭിക്കുന്നതിനുള്ള പ്രായോഗಿಕ നുറുങ്ങുകളും.",
      tag: "പ്രസവാനന്തരം",
      minutes: 5,
    },
    "తెలుగు": {
      title: "తల్లిపాలు ఇచ్చే ప్రాథమిక నియమాలు",
      description: "తల్లిపాల ప్రయోజనాలు మరియు విజయవంతంగా ప్రారంభించడానికి అవసరమైన ముఖ్యమైన చిట్కాలు.",
      tag: "ప్రసవానంతరం",
      minutes: 5,
    },
  },
  6: {
    English: {
      title: "Postpartum Recovery & Healing",
      description: "Essential guide to physical recovery, emotional changes, and resting safely after labor.",
      tag: "Recovery",
      minutes: 6,
    },
    "தமிழ்": {
      title: "பிரசவத்திற்குப் பின் குணமடைதல்",
      description: "பிரசவத்திற்குப் பிறகு உடல் மீட்சி, உணர்ச்சி மாற்றங்கள் மற்றும் ஓய்வு குறித்த வழிகாட்டி.",
      tag: "மீட்சி",
      minutes: 6,
    },
    "हिन्दी": {
      title: "प्रसवोत्तर रिकवरी और स्वास्थ्य लाभ",
      description: "प्रसव के बाद शारीरिक सुधार, भावनात्मक बदलाव और सुरक्षित आराम की आवश्यक मार्गदर्शिका।",
      tag: "रिकवरी",
      minutes: 6,
    },
    "ಕನ್ನಡ": {
      title: "ಪ್ರಸವೋತ್ತರ ಚೇತರಿಕೆ ಮತ್ತು ವಿಶ್ರಾಂತಿ",
      description: "ಹೆರಿಗೆಯ ನಂತರ ದೈಹಿಕ ಚೇತರಿಕೆ, ಭಾವನಾತ್ಮಕ ಬದಲಾವಣೆಗಳು ಮತ್ತು ಸುರಕ್ಷಿತ ವಿಶ್ರಾಂತಿ ಮಾರ್ಗದರ್ಶಿ.",
      tag: "ಚೇತರಿಕೆ",
      minutes: 6,
    },
    "मराठी": {
      title: "प्रसूतीनंतर रिकव्हरी आणि विश्रांती",
      description: "बाळंतपणानंतर शारीरिक पुनर्प्राप्ती, भावनिक बदल आणि सुरक्षित विश्रांती मार्गदर्शक.",
      tag: "रिकव्हरी",
      minutes: 6,
    },
    "മലയാളം": {
      title: "പ്രസവാനന്തര വീണ്ടെടുക്കൽ",
      description: "പ്രസവശേഷം ശാരീരിക സുഖം, വൈകാരിക മാറ്റങ്ങൾ, വിശ്രമം എന്നിവയെക്കുറിച്ചുള്ള മാർഗ്ഗരേഖ.",
      tag: "വീണ്ടെടുക്കൽ",
      minutes: 6,
    },
    "తెలుగు": {
      title: "ప్రసవానంతర కోలుకోవడం & రికవరీ",
      description: "ప్రసవం తర్వాత శారీరక స్వస్థత, భావోద్వేగ మార్పులు మరియు సురక్షితమైన విశ్రాంతి మార్గదర్శి.",
      tag: "రికవరీ",
      minutes: 6,
    },
  },
};

const articles = [
  {
    id: 1,
    title: "Nutrition During Pregnancy",
    source: "ACOG (American College of Obstetricians)",
    description: "Learn about essential nutrients required during pregnancy, including folic acid, iron, calcium, and more.",
    url: "https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    tag: "Nutrition",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Exercise During Pregnancy",
    source: "ACOG",
    description: "Discover safe and effective ways to stay active while pregnant, and the benefits for both you and your baby.",
    url: "https://www.acog.org/womens-health/faqs/exercise-during-pregnancy",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    tag: "Wellness",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "Pregnancy Week by Week",
    source: "Mayo Clinic",
    description: "A comprehensive guide on fetal development and what changes to expect in your body week by week.",
    url: "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/basics/healthy-pregnancy/hlv-20049471",
    image: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&q=80",
    tag: "Development",
    readTime: "7 min read",
  },
  {
    id: 4,
    title: "Mental Health During Pregnancy",
    source: "WHO (World Health Organization)",
    description: "Guidance on taking care of your mental well-being during pregnancy and after childbirth.",
    url: "https://www.who.int/news-room/fact-sheets/detail/maternal-mental-health",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80",
    tag: "Mental Health",
    readTime: "6 min read",
  },
  {
    id: 5,
    title: "Breastfeeding Basics",
    source: "CDC (Centers for Disease Control)",
    description: "Information on the benefits of breastfeeding and tips to get started successfully.",
    url: "https://www.cdc.gov/breastfeeding/about-breastfeeding/index.html",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80",
    tag: "Postpartum",
    readTime: "5 min read",
  },
  {
    id: 6,
    title: "Postpartum Recovery & Healing",
    source: "Cleveland Clinic",
    description: "Essential guide to physical recovery, emotional changes, and resting safely after labor.",
    url: "https://my.clevelandclinic.org/health/articles/9682-postpartum-care",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80",
    tag: "Recovery",
    readTime: "6 min read",
  },
];

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&q=80";

function SafeArticleImage({ uri }: { uri: string }) {
  const [imgSrc, setImgSrc] = useState({ uri });
  React.useEffect(() => {
    setImgSrc({ uri });
  }, [uri]);

  return (
    <Image
      source={imgSrc}
      style={styles.cardImage}
      resizeMode="cover"
      onError={() => setImgSrc({ uri: FALLBACK_IMAGE })}
    />
  );
}

export default function ArticlesScreen() {
  const { selectedLanguage, t } = useApp();
  const [activeTab, setActiveTab] = useState<"timeline" | "nutrition" | "articles">("timeline");
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(2);
  const [selectedWeek, setSelectedWeek] = useState<number>(24);

  const openArticle = async (url: string) => {
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      toolbarColor: "#F8C8D8",
    });
  };

  const currentMilestone = useMemo(() => {
    const weekData =
      localizedMilestoneData[selectedWeek]?.[selectedLanguage] ||
      localizedMilestoneData[selectedWeek]?.English;
    return (
      weekData || {
        comparison: t("baby_size_fallback", "Little Wonder"),
        babyDev: t("milestone_fallback_dev", "Your baby continues to mature and grow stronger every day."),
        momChanges: t("milestone_fallback_mom", "Your body is performing an incredible miracle of nurturing life."),
        tip: t("milestone_fallback_tip", "Stay hydrated and rest whenever you feel tired."),
      }
    );
  }, [selectedWeek, selectedLanguage, t]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>{t("maternal_guide", "Pregnancy & Care Hub")}</Text>
          <LanguageSelector />
        </View>
        <Text style={styles.headerSubtitle}>
          {t("articles_subtitle", "Verified developmental timelines, maternal nutrition, and healthcare guidance.")}
        </Text>
      </View>

      {/* Main Navigation Segmented Control */}
      <View style={styles.tabBarWrap}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "timeline" && styles.tabButtonActive]}
          onPress={() => setActiveTab("timeline")}
          activeOpacity={0.85}
        >
          <Baby size={16} color={activeTab === "timeline" ? "#30343B" : "#6F7480"} />
          <Text style={[styles.tabButtonText, activeTab === "timeline" && styles.tabButtonTextActive]}>
            {t("tab_timeline", "Timeline")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "nutrition" && styles.tabButtonActive]}
          onPress={() => setActiveTab("nutrition")}
          activeOpacity={0.85}
        >
          <Apple size={16} color={activeTab === "nutrition" ? "#30343B" : "#6F7480"} />
          <Text style={[styles.tabButtonText, activeTab === "nutrition" && styles.tabButtonTextActive]}>
            {t("tab_nutrition", "Nutrition")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "articles" && styles.tabButtonActive]}
          onPress={() => setActiveTab("articles")}
          activeOpacity={0.85}
        >
          <BookOpen size={16} color={activeTab === "articles" ? "#30343B" : "#6F7480"} />
          <Text style={[styles.tabButtonText, activeTab === "articles" && styles.tabButtonTextActive]}>
            {t("tab_library", "Library")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 1. TIMELINE & BABY DEVELOPMENT SECTION */}
      {activeTab === "timeline" && (
        <View style={styles.sectionContainer}>
          {/* Trimester Selector Pills */}
          <View style={styles.trimesterRow}>
            {[
              { id: 1, label: t("trimester_1", "Trimester 1"), range: "Weeks 1-13" },
              { id: 2, label: t("trimester_2", "Trimester 2"), range: "Weeks 14-27" },
              { id: 3, label: t("trimester_3", "Trimester 3"), range: "Weeks 28-40" },
            ].map((tri) => {
              const active = selectedTrimester === tri.id;
              return (
                <TouchableOpacity
                  key={tri.id}
                  style={[styles.trimesterPill, active && styles.trimesterPillActive]}
                  onPress={() => {
                    setSelectedTrimester(tri.id as 1 | 2 | 3);
                    if (tri.id === 1) setSelectedWeek(8);
                    if (tri.id === 2) setSelectedWeek(20);
                    if (tri.id === 3) setSelectedWeek(32);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.trimesterText, active && styles.trimesterTextActive]}>{tri.label}</Text>
                  <Text style={[styles.trimesterRangeText, active && styles.trimesterRangeActive]}>{tri.range}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Horizontal Week Scroller */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekScroller}>
            {[4, 8, 12, 16, 20, 24, 28, 32, 36, 40].map((wk) => {
              const active = selectedWeek === wk;
              return (
                <TouchableOpacity
                  key={wk}
                  style={[styles.weekBubble, active && styles.weekBubbleActive]}
                  onPress={() => setSelectedWeek(wk)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.weekBubbleNumber, active && styles.weekBubbleNumberActive]}>W{wk}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Large Baby Development Visual Card */}
          <View style={styles.heroDevCard}>
            <View style={styles.heroDevHeader}>
              <View style={styles.devBadgeWrap}>
                <Baby size={16} color="#2563EB" />
                <Text style={styles.devBadgeText}>
                  {t("week_title_dev", "WEEK")} {selectedWeek} • {currentMilestone.comparison.toUpperCase()}
                </Text>
              </View>
              <View style={styles.trimesterSmallPill}>
                <Text style={styles.trimesterSmallText}>
                  {selectedTrimester === 1
                    ? t("trimester_1", "Trimester 1")
                    : selectedTrimester === 2
                    ? t("trimester_2", "Trimester 2")
                    : t("trimester_3", "Trimester 3")}
                </Text>
              </View>
            </View>

            <Text style={styles.heroDevTitle}>
              {t("baby_is_size_of", "Baby is about the size of a")}{" "}
              <Text style={styles.heroDevTitleAccent}>{currentMilestone.comparison}</Text>
            </Text>

            {/* Baby Development Details */}
            <View style={styles.milestoneBlock}>
              <View style={styles.milestoneHeader}>
                <Sparkles size={16} color="#2563EB" />
                <Text style={styles.milestoneHeadingBlue}>{t("baby_development", "Baby's Development")}</Text>
              </View>
              <Text style={styles.milestoneBody}>{currentMilestone.babyDev}</Text>
            </View>

            {/* Mother Changes Details */}
            <View style={styles.milestoneBlockPink}>
              <View style={styles.milestoneHeader}>
                <Heart size={16} color="#D64A73" />
                <Text style={styles.milestoneHeadingPink}>{t("mom_changes", "Mother's Body Changes")}</Text>
              </View>
              <Text style={styles.milestoneBody}>{currentMilestone.momChanges}</Text>
            </View>

            {/* Care Tip */}
            <View style={styles.tipBlock}>
              <CheckCircle2 size={16} color="#10B981" />
              <Text style={styles.tipText}>
                <Text style={styles.tipBold}>{t("weekly_tip", "Clinical Tip:")}</Text> {currentMilestone.tip}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* 2. NUTRITION & FOOD DASHBOARD SECTION */}
      {activeTab === "nutrition" && (
        <View style={styles.sectionContainer}>
          {/* Daily Nutrition Overview Card */}
          <View style={styles.nutritionHeroCard}>
            <View style={styles.nutritionHeaderRow}>
              <View style={styles.nutritionIconCircle}>
                <Utensils size={20} color="#2563EB" />
              </View>
              <View style={styles.flexOne}>
                <Text style={styles.nutritionTagBlue}>{t("daily_maternal_nutrition", "DAILY NUTRITION")}</Text>
                <Text style={styles.nutritionHeroTitle}>{t("nourish_both", "Nourish Yourself & Your Baby")}</Text>
              </View>
            </View>
            <Text style={styles.nutritionHeroBody}>
              {t(
                "nutrition_intro",
                "A balanced diet of micro-nutrients, clean hydration, and quality proteins powers healthy fetal development and maternal vitality."
              )}
            </Text>
          </View>

          {/* Category Cards: Fruits, Vegetables, Protein, Hydration, Vitamins */}
          <View style={styles.nutritionCardsGrid}>
            {/* Folic Acid & Green Veggies */}
            <View style={styles.foodCardPink}>
              <View style={styles.foodCardHead}>
                <View style={[styles.foodIconCircle, styles.iconBgPink]}>
                  <Apple size={18} color="#D64A73" />
                </View>
                <View style={styles.flexOne}>
                  <Text style={styles.foodCategoryPink}>{t("folic_acid", "FOLIC ACID & GREENS")}</Text>
                  <Text style={styles.foodTitle}>{t("neural_tube", "Spina Bifida Prevention")}</Text>
                </View>
              </View>
              <Text style={styles.foodBody}>
                {t(
                  "folic_acid_desc",
                  "Spinach, broccoli, lentils, and citrus fruits. Recommended 400–600 mcg daily for early brain and spine formation."
                )}
              </Text>
            </View>

            {/* Iron & Lean Protein */}
            <View style={styles.foodCardBlue}>
              <View style={styles.foodCardHead}>
                <View style={[styles.foodIconCircle, styles.iconBgBlue]}>
                  <ShieldCheck size={18} color="#2563EB" />
                </View>
                <View style={styles.flexOne}>
                  <Text style={styles.foodCategoryBlue}>{t("iron_protein", "IRON & PROTEIN")}</Text>
                  <Text style={styles.foodTitle}>{t("oxygen_blood", "Blood Volume & Oxygen")}</Text>
                </View>
              </View>
              <Text style={styles.foodBody}>
                {t(
                  "iron_protein_desc",
                  "Beans, paneer, cooked lentils, and poultry. Supports a 50% surge in maternal blood volume and prevents fatigue."
                )}
              </Text>
            </View>

            {/* Calcium & Bone Support */}
            <View style={styles.foodCardPink}>
              <View style={styles.foodCardHead}>
                <View style={[styles.foodIconCircle, styles.iconBgPink]}>
                  <Sparkles size={18} color="#D64A73" />
                </View>
                <View style={styles.flexOne}>
                  <Text style={styles.foodCategoryPink}>{t("calcium_vitamin_d", "CALCIUM & VITAMIN D")}</Text>
                  <Text style={styles.foodTitle}>{t("bones_teeth", "Baby's Skeleton & Teeth")}</Text>
                </View>
              </View>
              <Text style={styles.foodBody}>
                {t(
                  "calcium_desc",
                  "Curd, milk, ragi, and fortified plant milks. Ensures strong bones while safeguarding the mother's bone density."
                )}
              </Text>
            </View>

            {/* Hydration */}
            <View style={styles.foodCardBlue}>
              <View style={styles.foodCardHead}>
                <View style={[styles.foodIconCircle, styles.iconBgBlue]}>
                  <Droplets size={18} color="#2563EB" />
                </View>
                <View style={styles.flexOne}>
                  <Text style={styles.foodCategoryBlue}>{t("hydration", "CLEAN HYDRATION")}</Text>
                  <Text style={styles.foodTitle}>{t("amniotic_fluid", "8–10 Glasses Daily")}</Text>
                </View>
              </View>
              <Text style={styles.foodBody}>
                {t(
                  "hydration_desc",
                  "Fresh water, tender coconut water, and herbal broths. Keeps amniotic fluid refreshed and prevents urinary tract infections."
                )}
              </Text>
            </View>
          </View>

          {/* Foods to Limit & Avoid Section */}
          <View style={styles.warningCard}>
            <View style={styles.warningHead}>
              <AlertCircle size={20} color="#E11D48" />
              <Text style={styles.warningTitle}>{t("foods_to_avoid", "Foods to Limit & Avoid")}</Text>
            </View>
            <View style={styles.warningList}>
              <Text style={styles.warningItem}>• {t("avoid_mercury", "High-mercury fish (shark, swordfish, king mackerel)")}</Text>
              <Text style={styles.warningItem}>• {t("avoid_unpasteurized", "Unpasteurized cheeses, raw milk, and raw sprouts")}</Text>
              <Text style={styles.warningItem}>• {t("avoid_undercooked", "Raw or undercooked meats, sushi, and runny eggs")}</Text>
              <Text style={styles.warningItem}>• {t("limit_caffeine", "Limit caffeine to under 200mg/day (1 small cup of coffee)")}</Text>
            </View>
          </View>
        </View>
      )}

      {/* 3. ARTICLES & VERIFIED MEDICAL LIBRARY */}
      {activeTab === "articles" && (
        <View style={styles.articlesList}>
          {articles.map((article) => {
            const loc = localizedArticleMap[article.id]?.[selectedLanguage] || {
              title: article.title,
              description: article.description,
              tag: article.tag,
              minutes: 5,
            };
            const readTimeStr = `${loc.minutes} ${t("articles_min_read", "min read")}`;

            return (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                activeOpacity={0.9}
                onPress={() => openArticle(article.url)}
              >
                <SafeArticleImage uri={article.image} />
                <View style={styles.articleCardContent}>
                  <View style={styles.tagRow}>
                    <View style={styles.tagWrapPink}>
                      <Text style={styles.tagTextPink}>{loc.tag}</Text>
                    </View>
                    <Text style={styles.readTimeText}>{readTimeStr}</Text>
                  </View>
                  <Text style={styles.articleTitle}>{loc.title}</Text>
                  <Text style={styles.articleSource}>
                    {t("articles_source", "Source:")} {article.source}
                  </Text>
                  <Text style={styles.articleDescription}>{loc.description}</Text>
                  <View style={styles.readArticleRow}>
                    <Text style={styles.readArticleText}>{t("read_full_article", "Read Clinical Guide")}</Text>
                    <ChevronRight size={14} color="#D64A73" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAFBFD",
  },
  content: {
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  flexOne: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 26,
    fontWeight: "900",
    color: "#30343B",
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6F7480",
    lineHeight: 18,
    fontWeight: "500",
  },

  /* Main Tab Segmented Control */
  tabBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 4,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#2F3B52",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 18,
  },
  tabButtonActive: {
    backgroundColor: "#FDE7EF",
  },
  tabButtonText: {
    color: "#6F7480",
    fontSize: 12,
    fontWeight: "700",
  },
  tabButtonTextActive: {
    color: "#30343B",
    fontWeight: "800",
  },

  sectionContainer: {
    gap: 16,
  },

  /* Trimester Row */
  trimesterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trimesterPill: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  trimesterPillActive: {
    backgroundColor: "#E6F4FC",
    borderColor: "#BFDFF5",
  },
  trimesterText: {
    color: "#6F7480",
    fontSize: 12,
    fontWeight: "700",
  },
  trimesterTextActive: {
    color: "#2563EB",
    fontWeight: "800",
  },
  trimesterRangeText: {
    color: "#94A3B8",
    fontSize: 10,
    marginTop: 2,
    fontWeight: "500",
  },
  trimesterRangeActive: {
    color: "#2563EB",
    fontWeight: "600",
  },

  /* Week Scroller */
  weekScroller: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  weekBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  weekBubbleActive: {
    backgroundColor: "#F8C8D8",
    borderColor: "#F8C8D8",
    shadowColor: "#F8C8D8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  weekBubbleNumber: {
    color: "#6F7480",
    fontSize: 12,
    fontWeight: "800",
  },
  weekBubbleNumberActive: {
    color: "#30343B",
    fontWeight: "900",
  },

  /* Baby Dev Hero Card */
  heroDevCard: {
    backgroundColor: colors.white,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: "#BFDFF5",
    shadowColor: "#BFDFF5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 3,
    gap: 14,
  },
  heroDevHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  devBadgeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E6F4FC",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  devBadgeText: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  trimesterSmallPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
  },
  trimesterSmallText: {
    color: "#6F7480",
    fontSize: 10,
    fontWeight: "700",
  },
  heroDevTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: "800",
    color: "#30343B",
  },
  heroDevTitleAccent: {
    color: "#2563EB",
  },
  milestoneBlock: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  milestoneBlockPink: {
    backgroundColor: "#FFF9FA",
    borderRadius: 18,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#F8C8D8",
  },
  milestoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  milestoneHeadingBlue: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "800",
  },
  milestoneHeadingPink: {
    color: "#D64A73",
    fontSize: 13,
    fontWeight: "800",
  },
  milestoneBody: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
  },
  tipBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  tipBold: {
    fontWeight: "800",
    color: "#166534",
  },
  tipText: {
    color: "#166534",
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },

  /* Nutrition Cards */
  nutritionHeroCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#BFDFF5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  nutritionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  nutritionIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E6F4FC",
    alignItems: "center",
    justifyContent: "center",
  },
  nutritionTagBlue: {
    color: "#2563EB",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  nutritionHeroTitle: {
    color: "#30343B",
    fontSize: 16,
    fontWeight: "800",
  },
  nutritionHeroBody: {
    color: "#6F7480",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
  },
  nutritionCardsGrid: {
    gap: 12,
  },
  foodCardPink: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FCE4EC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  foodCardBlue: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  foodCardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  foodIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBgPink: {
    backgroundColor: "#FDE7EF",
  },
  iconBgBlue: {
    backgroundColor: "#E6F4FC",
  },
  foodCategoryPink: {
    color: "#D64A73",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  foodCategoryBlue: {
    color: "#2563EB",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  foodTitle: {
    color: "#30343B",
    fontSize: 14,
    fontWeight: "800",
  },
  foodBody: {
    color: "#475569",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
  },

  /* Warning Section */
  warningCard: {
    backgroundColor: "#FFF1F2",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FECDD3",
  },
  warningHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  warningTitle: {
    color: "#9F1239",
    fontSize: 14,
    fontWeight: "800",
  },
  warningList: {
    gap: 6,
  },
  warningItem: {
    color: "#881337",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },

  /* Articles List */
  articlesList: {
    gap: 16,
  },
  articleCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#F1F2F7",
  },
  articleCardContent: {
    padding: 16,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tagWrapPink: {
    backgroundColor: "#FDE7EF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F8C8D8",
  },
  tagTextPink: {
    color: "#D64A73",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  readTimeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#30343B",
    marginBottom: 4,
  },
  articleSource: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6F7480",
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
    fontWeight: "500",
  },
  readArticleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
  },
  readArticleText: {
    color: "#D64A73",
    fontSize: 12,
    fontWeight: "800",
  },

  bottomSpacer: {
    height: 30,
  },
});
