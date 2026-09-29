import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { colors } from "@/constants/theme";
import * as WebBrowser from "expo-web-browser";
import { useApp } from "@/context/AppContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { SupportedLanguage } from "@/data/translations";

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
      description: "Learn about the essential nutrients required during pregnancy, including folic acid, iron, calcium, and more.",
      tag: "Nutrition",
      minutes: 5,
    },
    "தமிழ்": {
      title: "கர்ப்பகால ஊட்டச்சத்து",
      description: "போலிக் அமிலம், இரும்புச்சத்து, கால்சியம் உள்ளிட்ட கர்ப்பகால அத்தியாவசிய ஊட்டச்சத்துக்கள் பற்றி அறியவும்.",
      tag: "ஊட்டச்சத்து",
      minutes: 5,
    },
    "हिन्दी": {
      title: "गर्भावस्था के दौरान पोषण",
      description: "फोलिक एसिड, आयरन, कैल्शियम सहित गर्भावस्था में आवश्यक पोषक तत्वों के बारे में जानें।",
      tag: "पोषण",
      minutes: 5,
    },
    "ಕನ್ನಡ": {
      title: "ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಪೋಷಣೆ",
      description: "ಫೋಲಿಕ್ ಆಸಿಡ್, ಕಬ್ಬಿಣ, ಕ್ಯಾಲ್ಸಿಯಂ ಸೇರಿದಂತೆ ಗರ್ಭಾವಸ್ಥೆಗೆ ಅಗತ್ಯವಾದ ಪೋಷಕಾಂಶಗಳ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ.",
      tag: "ಪೋಷಣೆ",
      minutes: 5,
    },
    "मराठी": {
      title: "गर्भावस्थेतील पोषण",
      description: "फॉलिक अ‍ॅसिड, लोह, कॅल्शियम यांसह गरोदरपणात आवश्यक पोषक घटकांविषयी जाणून घ्या.",
      tag: "पोषण",
      minutes: 5,
    },
    "മലയാളം": {
      title: "ഗർഭകാല പോഷകാഹാരം",
      description: "ഫോളിക് ആസിഡ്, ഇരുമ്പ്, കാൽസ്യം എന്നിവയുൾപ്പെടെ ഗർഭകാലത്ത് ആവശ്യമായ പ്രധാന പോഷകങ്ങളെക്കുറിച്ച് അറിയുക.",
      tag: "പോഷകാഹാരം",
      minutes: 5,
    },
  },
  2: {
    English: {
      title: "Exercise During Pregnancy",
      description: "Discover safe and effective ways to stay active while pregnant, and the benefits for both you and your baby.",
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
  },
  3: {
    English: {
      title: "Pregnancy Week by Week",
      description: "A comprehensive guide on fetal development and what changes to expect in your body week by week.",
      tag: "Development",
      minutes: 7,
    },
    "தமிழ்": {
      title: "வாராந்திர கர்ப்ப வளர்ச்சி",
      description: "கருவின் வளர்ச்சி மற்றும் உங்கள் உடலில் வாரம் தோறும் ஏற்படும் மாற்றங்கள் குறித்த முழுமையான வழிகாட்டி.",
      tag: "வளர்ச்சி",
      minutes: 7,
    },
    "हिन्दी": {
      title: "सप्ताह-दर-सप्ताह गर्भावस्था",
      description: "भ्रूण के विकास और सप्ताह-दर-सप्ताह आपके शरीर में होने वाले परिवर्तनों पर व्यापक मार्गदर्शिका।",
      tag: "विकास",
      minutes: 7,
    },
    "ಕನ್ನಡ": {
      title: "ವಾರದ ಗರ್ಭಧಾರಣೆಯ ಬೆಳವಣಿಗೆ",
      description: "ಭ್ರೂಣದ ಬೆಳವಣಿಗೆ ಮತ್ತು ನಿಮ್ಮ ದೇಹದಲ್ಲಿ ಪ್ರತಿ ವಾರ ಆಗುವ ಬದಲಾವಣೆಗಳ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ.",
      tag: "ಬೆಳವಣಿಗೆ",
      minutes: 7,
    },
    "मराठी": {
      title: "आठवड्यानुसार गर्भधारणा",
      description: "गर्भाचा विकास आणि आठवड्यानुसार शरीरात होणाऱ्या बदलांविषयी सविस्तर माहिती.",
      tag: "विकास",
      minutes: 7,
    },
    "മലയാളം": {
      title: "ആഴ്ചതോറുമുള്ള ഗർഭധാരണം",
      description: "ഭ്രൂണ വളർച്ചയെക്കുറിച്ചും ഓരോ ആഴ്ചയും ശരീരത്തിലുണ്ടാകുന്ന മാറ്റങ്ങളെക്കുറിച്ചും വിശദമായ ഗൈഡ്.",
      tag: "വളർച്ച",
      minutes: 7,
    },
  },
  4: {
    English: {
      title: "Mental Health During Pregnancy",
      description: "Guidance on taking care of your mental well-being during pregnancy and after childbirth.",
      tag: "Mental Health",
      minutes: 6,
    },
    "தமிழ்": {
      title: "கர்ப்பகால மனநலம்",
      description: "கர்ப்ப காலத்திலும் பிரசவத்திற்குப் பிறகும் உங்கள் மனநலத்தைப் பேணுவதற்கான மருத்துவ வழிகாட்டுதல்.",
      tag: "மனநலம்",
      minutes: 6,
    },
    "हिन्दी": {
      title: "गर्भावस्था में मानसिक स्वास्थ्य",
      description: "गर्भावस्था के दौरान और प्रसव के बाद अपनी मानसिक भलाई का ध्यान रखने पर मार्गदर्शन।",
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
  },
};

const articles = [
  {
    id: 1,
    title: "Nutrition During Pregnancy",
    source: "ACOG (American College of Obstetricians)",
    description: "Learn about the essential nutrients required during pregnancy, including folic acid, iron, calcium, and more.",
    url: "https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    tag: "Nutrition",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Exercise During Pregnancy",
    source: "ACOG",
    description: "Discover safe and effective ways to stay active while pregnant, and the benefits for both you and your baby.",
    url: "https://www.acog.org/womens-health/faqs/exercise-during-pregnancy",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    tag: "Wellness",
    readTime: "4 min read"
  },
  {
    id: 3,
    title: "Pregnancy Week by Week",
    source: "Mayo Clinic",
    description: "A comprehensive guide on fetal development and what changes to expect in your body week by week.",
    url: "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/basics/healthy-pregnancy/hlv-20049471",
    image: "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&q=80",
    tag: "Development",
    readTime: "7 min read"
  },
  {
    id: 4,
    title: "Mental Health During Pregnancy",
    source: "WHO (World Health Organization)",
    description: "Guidance on taking care of your mental well-being during pregnancy and after childbirth.",
    url: "https://www.who.int/news-room/fact-sheets/detail/maternal-mental-health",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80",
    tag: "Mental Health",
    readTime: "6 min read"
  },
  {
    id: 5,
    title: "Breastfeeding Basics",
    source: "CDC (Centers for Disease Control)",
    description: "Information on the benefits of breastfeeding and tips to get started successfully.",
    url: "https://www.cdc.gov/breastfeeding/about-breastfeeding/index.html",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80",
    tag: "Postpartum",
    readTime: "5 min read"
  },
  {
    id: 6,
    title: "Postpartum Recovery & Healing",
    source: "Cleveland Clinic",
    description: "Essential guide to physical recovery, emotional changes, and resting safely after labor.",
    url: "https://my.clevelandclinic.org/health/articles/9682-postpartum-care",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80",
    tag: "Recovery",
    readTime: "6 min read"
  }
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

  const openArticle = async (url: string) => {
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      toolbarColor: colors.brand,
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>{t("articles_title", "Pregnancy Resources")}</Text>
          <LanguageSelector />
        </View>
        <Text style={styles.headerSubtitle}>
          {t("articles_subtitle", "Curated open-source, safe, and expert-verified articles.")}
        </Text>
      </View>

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
              style={styles.card} 
              activeOpacity={0.9} 
              onPress={() => openArticle(article.url)}
            >
              <SafeArticleImage uri={article.image} />
              <View style={styles.cardContent}>
                <View style={styles.tagRow}>
                  <View style={styles.tagWrap}>
                    <Text style={styles.tagText}>{loc.tag}</Text>
                  </View>
                  <Text style={styles.readTimeText}>{readTimeStr}</Text>
                </View>
                <Text style={styles.title}>{loc.title}</Text>
                <Text style={styles.source}>{t("articles_source", "Source:")} {article.source}</Text>
                <Text style={styles.description}>{loc.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F8",
  },
  content: {
    paddingTop: 65,
    paddingHorizontal: 18,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 24,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1F2B4D",
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6980A6",
    lineHeight: 20,
    fontWeight: "500",
  },
  articlesList: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#F1F2F7",
  },
  cardContent: {
    padding: 18,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tagWrap: {
    backgroundColor: "#FFF1F5",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: colors.brand,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  readTimeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9AA2BC",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2B4D",
    marginBottom: 4,
  },
  source: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9AA2BC",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#4A5269",
    lineHeight: 22,
    fontWeight: "500",
  },
});
