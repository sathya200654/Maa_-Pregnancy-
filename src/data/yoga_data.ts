export type PoseType = "timer" | "reps";

export type PoseItem = {
  id: string;
  title: string;
  type: PoseType;
  durationSeconds?: number;
  reps?: number;
  image: any;
  benefit: string;
};

export const trimester1Yoga: PoseItem[] = [
  {
    id: "t1-cat-cow",
    title: "Cat–Cow",
    type: "reps",
    reps: 8,
    image: require("../../assets/images/yoga/cat_cow.jpg"),
    benefit: "Get on hands and knees. Slowly round your back while breathing out, then gently return to a neutral/slightly extended position while breathing in."
  },
  {
    id: "t1-butterfly",
    title: "Butterfly Pose",
    type: "timer",
    durationSeconds: 45,
    image: require("../../assets/images/yoga/butterfly_pose.jpg"),
    benefit: "Sit comfortably, bring the soles of your feet together, and let your knees relax outward. Keep your back comfortable and upright."
  },
  {
    id: "t1-mountain",
    title: "Mountain Pose",
    type: "timer",
    durationSeconds: 45,
    image: require("../../assets/images/yoga/mountain_pose.jpg"),
    benefit: "Stand comfortably with feet grounded. Keep your spine tall, shoulders relaxed, and breathe slowly."
  },
  {
    id: "t1-tree",
    title: "Tree Pose",
    type: "timer",
    durationSeconds: 20,
    image: require("../../assets/images/yoga/tree_pose.jpg"),
    benefit: "Stand near a wall for support. Place one foot against the opposite lower leg—not on the knee—and balance gently."
  },
  {
    id: "t1-warrior-1",
    title: "Warrior I",
    type: "timer",
    durationSeconds: 25,
    image: require("../../assets/images/yoga/warrior_1.jpg"),
    benefit: "Step one foot forward, bend the front knee comfortably, keep the back foot grounded, and raise your arms if comfortable."
  },
  {
    id: "t1-warrior-2",
    title: "Warrior II",
    type: "timer",
    durationSeconds: 25,
    image: require("../../assets/images/yoga/warrior_2.jpg"),
    benefit: "Take a wide stance, bend the front knee gently, extend your arms sideways and keep your torso upright."
  },
  {
    id: "t1-childs-pose",
    title: "Child's Pose",
    type: "timer",
    durationSeconds: 45,
    image: require("../../assets/images/yoga/childs_pose.jpg"),
    benefit: "Kneel and widen your knees enough to leave room for your belly. Lower forward only as far as comfortable."
  },
  {
    id: "t1-seated-stretch",
    title: "Gentle Seated Stretching",
    type: "timer",
    durationSeconds: 30,
    image: require("../../assets/images/yoga/gentle_seated_stretching.jpg"),
    benefit: "Sit comfortably and gently stretch your side, neck, shoulders, or legs without forcing the movement."
  },
  {
    id: "t1-deep-breathing",
    title: "Deep Breathing",
    type: "timer",
    durationSeconds: 180,
    image: require("../../assets/images/yoga/deep_breathing.jpg"),
    benefit: "Sit comfortably. Breathe slowly through your nose and gently exhale. Don't hold your breath."
  }
];

export const trimester2Yoga: PoseItem[] = [
  {
    id: "t2-cat-cow",
    title: "Cat–Cow",
    type: "reps",
    reps: 10,
    image: require("../../assets/images/yoga/cat_cow.jpg"),
    benefit: "Keep movements slow and comfortable."
  },
  {
    id: "t2-butterfly",
    title: "Butterfly Pose",
    type: "timer",
    durationSeconds: 45,
    image: require("../../assets/images/yoga/butterfly_pose.jpg"),
    benefit: "Sit with your back supported if needed."
  },
  {
    id: "t2-mountain",
    title: "Mountain Pose",
    type: "timer",
    durationSeconds: 45,
    image: require("../../assets/images/yoga/mountain_pose.jpg"),
    benefit: "Keep feet slightly apart for better balance."
  },
  {
    id: "t2-tree",
    title: "Tree Pose",
    type: "timer",
    durationSeconds: 20,
    image: require("../../assets/images/yoga/tree_pose.jpg"),
    benefit: "Use a wall/chair for support."
  },
  {
    id: "t2-warrior-1",
    title: "Warrior I",
    type: "timer",
    durationSeconds: 25,
    image: require("../../assets/images/yoga/warrior_1.jpg"),
    benefit: "Use a slightly wider stance and don't force the stretch."
  },
  {
    id: "t2-warrior-2",
    title: "Warrior II",
    type: "timer",
    durationSeconds: 25,
    image: require("../../assets/images/yoga/warrior_2.jpg"),
    benefit: "Keep the stance comfortable and avoid excessive knee bending."
  },
  {
    id: "t2-childs-pose",
    title: "Child's Pose",
    type: "timer",
    durationSeconds: 45,
    image: require("../../assets/images/yoga/childs_pose.jpg"),
    benefit: "Widen the knees to make space for the belly."
  },
  {
    id: "t2-seated-stretch",
    title: "Gentle Seated Stretching",
    type: "timer",
    durationSeconds: 30,
    image: require("../../assets/images/yoga/gentle_seated_stretching.jpg"),
    benefit: "Avoid deep forward folds; keep plenty of space for the belly."
  },
  {
    id: "t2-deep-breathing",
    title: "Deep Breathing",
    type: "timer",
    durationSeconds: 240,
    image: require("../../assets/images/yoga/deep_breathing.jpg"),
    benefit: "Breathe naturally without breath-holding."
  }
];

export const trimester3Yoga: PoseItem[] = [
  {
    id: "t3-cat-cow",
    title: "Cat–Cow",
    type: "reps",
    reps: 8,
    image: require("../../assets/images/yoga/cat_cow.jpg"),
    benefit: "Gentle movement; don't exaggerate the back movement."
  },
  {
    id: "t3-butterfly",
    title: "Butterfly Pose",
    type: "timer",
    durationSeconds: 45,
    image: require("../../assets/images/yoga/butterfly_pose.jpg"),
    benefit: "Sit supported and keep the movement relaxed."
  },
  {
    id: "t3-mountain",
    title: "Mountain Pose",
    type: "timer",
    durationSeconds: 45,
    image: require("../../assets/images/yoga/mountain_pose.jpg"),
    benefit: "Keep feet wider apart and use support if needed."
  },
  {
    id: "t3-tree",
    title: "Tree Pose",
    type: "timer",
    durationSeconds: 15,
    image: require("../../assets/images/yoga/tree_pose.jpg"),
    benefit: "Wall support recommended. Skip it if balance is difficult."
  },
  {
    id: "t3-warrior-1",
    title: "Warrior I",
    type: "timer",
    durationSeconds: 20,
    image: require("../../assets/images/yoga/warrior_1.jpg"),
    benefit: "Use a wider stance and chair/wall support if needed."
  },
  {
    id: "t3-warrior-2",
    title: "Warrior II",
    type: "timer",
    durationSeconds: 20,
    image: require("../../assets/images/yoga/warrior_2.jpg"),
    benefit: "Keep the pose shallow and comfortable."
  },
  {
    id: "t3-childs-pose",
    title: "Child's Pose",
    type: "timer",
    durationSeconds: 45,
    image: require("../../assets/images/yoga/childs_pose.jpg"),
    benefit: "Wide-knee version with pillows/bolsters if needed."
  },
  {
    id: "t3-seated-stretch",
    title: "Gentle Seated Stretching",
    type: "timer",
    durationSeconds: 30,
    image: require("../../assets/images/yoga/gentle_seated_stretching.jpg"),
    benefit: "Focus on comfortable side and shoulder stretches rather than deep forward bends."
  },
  {
    id: "t3-deep-breathing",
    title: "Deep Breathing",
    type: "timer",
    durationSeconds: 240,
    image: require("../../assets/images/yoga/deep_breathing.jpg"),
    benefit: "Slow, relaxed breathing; never force or hold the breath."
  }
];

export const getYogaRoutineForTrimester = (trimester: number) => {
  if (trimester === 1) return trimester1Yoga;
  if (trimester === 2) return trimester2Yoga;
  return trimester3Yoga;
};

import { SupportedLanguage } from "./translations";

export const POSE_TITLES: Record<string, Partial<Record<SupportedLanguage, string>>> = {
  "Cat–Cow": {
    English: "Cat–Cow",
    "தமிழ்": "மார்ஜரியாசனம் (பூனை-பசு போஸ்)",
    "हिन्दी": "मार्जरी आसन (कैट-काउ)",
    "ಕನ್ನಡ": "ಮಾರ್ಜರ್ಯಾಸನ (ಬೆಕ್ಕು-ಹಸು ಆಸನ)",
    "मराठी": "मार्जरी आसन (कॅट-काऊ)",
    "മലയാളം": "മാർജ്ജാര്യാസനം (പൂച്ച-പശു)",
  },
  "Butterfly Pose": {
    English: "Butterfly Pose",
    "தமிழ்": "பத்த கோணாசனம் (வண்ணத்துப்பூச்சி)",
    "हिन्दी": "बद्ध कोणासन (तितली आसन)",
    "ಕನ್ನಡ": "ಚಿಟ್ಟೆ ಆಸನ (ಬದ್ಧ ಕೋಣಾಸನ)",
    "मराठी": "फुलपाखरू आसन (बद्ध कोणासन)",
    "മലയാളം": "ചിത്രശലഭം പോസ് (ബദ്ധ കോണാസനം)",
  },
  "Mountain Pose": {
    English: "Mountain Pose",
    "தமிழ்": "தாடாசனம் (மலை போஸ்)",
    "हिन्दी": "ताड़ासन (पर्वत आसन)",
    "ಕನ್ನಡ": "ತಾಡಾಸನ (ಪರ್ವತ ಆಸನ)",
    "मराठी": "ताडासन (पर्वत आसन)",
    "മലയാളം": "താടാസനം (മല പോസ്)",
  },
  "Tree Pose": {
    English: "Tree Pose",
    "தமிழ்": "விருக்ஷாசனம் (மர போஸ்)",
    "हिन्दी": "वृक्षासन (पेड़ आसन)",
    "ಕನ್ನಡ": "ವೃಕ್ಷಾಸನ (ಮರ ಆಸನ)",
    "मराठी": "वृक्षासन (झाड आसन)",
    "മലയാളം": "വൃക്ഷാസനം (മര പോസ്)",
  },
  "Warrior I": {
    English: "Warrior I",
    "தமிழ்": "வீரபத்ராசனம் 1",
    "हिन्दी": "वीरभद्रासन 1",
    "ಕನ್ನಡ": "ವೀರಭದ್ರಾಸನ ೧",
    "मराठी": "वीरभद्रासन १",
    "മലയാളം": "വീരഭദ്രാസനം 1",
  },
  "Warrior II": {
    English: "Warrior II",
    "தமிழ்": "வீரபத்ராசனம் 2",
    "हिन्दी": "वीरभद्रासन 2",
    "ಕನ್ನಡ": "ವೀರಭದ್ರಾಸನ ೨",
    "मराठी": "वीरभद्रासन २",
    "മലയാളം": "വീരഭദ്രാസനം 2",
  },
  "Child's Pose": {
    English: "Child's Pose",
    "தமிழ்": "பாலாசனம் (குழந்தை போஸ்)",
    "हिन्दी": "बालासन (शिशु आसन)",
    "ಕನ್ನಡ": "ಬಾಲಾಸನ (ಮಗುವಿನ ಆಸನ)",
    "मराठी": "बालासन (बाळ आसन)",
    "മലയാളം": "ബാലാസനം (കുട്ടി പോസ്)",
  },
  "Gentle Seated Stretching": {
    English: "Gentle Seated Stretching",
    "தமிழ்": "மென்மையான அமர்ந்த நிலை நீட்சி",
    "हिन्दी": "बैठकर हल्का खिंचाव",
    "ಕನ್ನಡ": "ಕುಳಿತುಕೊಳ್ಳುವ ಸೌಮ್ಯ ಹಿಗ್ಗಿಸುವಿಕೆ",
    "मराठी": "बसून हलके स्ट्रेचिंग",
    "മലയാളം": "ഇരുന്ന് ലളിതമായ സ്ട്രെച്ചിംഗ്",
  },
  "Deep Breathing": {
    English: "Deep Breathing",
    "தமிழ்": "ஆழ்ந்த சுவாசம் (பிராணாயாமம்)",
    "हिन्दी": "गहरा श्वास (प्राणायाम)",
    "ಕನ್ನಡ": "ಆಳವಾದ ಉಸಿರಾಟ (ಪ್ರಾಣಾಯಾಮ)",
    "मराठी": "दीर्घ श्वसन (प्राणायाम)",
    "മലയാളം": "ദീർഘ ശ്വാസം (പ്രാണായാമം)",
  },
};

export const POSE_BENEFITS: Record<string, Partial<Record<SupportedLanguage, string>>> = {
  "Cat–Cow": {
    English: "Get on hands and knees. Slowly round your back while breathing out, then gently return to a neutral position while breathing in. Keep movements slow and comfortable.",
    "தமிழ்": "கைகள் மற்றும் முழங்கால்களில் நிற்கவும். மூச்சை வெளியேற்றும்போது முதுகை வளைத்து, மூச்சை உள்ளிழுக்கும்போது மெதுவாக இயல்பு நிலைக்குத் திரும்பவும். அசைவுகளை நிதானமாக வைக்கவும்.",
    "हिन्दी": "हाथों और घुटनों के बल आएं। सांस छोड़ते हुए धीरे-धीरे पीठ को गोल करें, फिर सांस लेते हुए सामान्य स्थिति में लौटें। गति धीमी और आरामदायक रखें।",
    "ಕನ್ನಡ": "ಕೈಗಳು ಮತ್ತು ಮೊಣಕಾಲುಗಳ ಮೇಲೆ ಬನ್ನಿ. ಉಸಿರನ್ನು ಹೊರಹಾಕುವಾಗ ಬೆನ್ನನ್ನು ನಿಧಾನವಾಗಿ ಬಗ್ಗಿಸಿ, ಉಸಿರನ್ನು ತೆಗೆದುಕೊಳ್ಳುವಾಗ ಸಹಜ ಸ್ಥಿತಿಗೆ ತನ್ನಿ. ನಿಧಾನವಾಗಿ ಆರಾಮವಾಗಿ ಮಾಡಿ.",
    "मराठी": "हात आणि गुडघ्यांवर या. श्वास सोडताना पाठ हळूवार वर उचला आणि श्वास घेताना पूर्वस्थितीत या. हालचाली सावकाश आणि सोप्या ठेवा.",
    "മലയാളം": "കൈകളും കാൽമുട്ടുകളും നിലത്തുറപ്പിക്കുക. ശ്വാസം പുറത്തുവിടുമ്പോൾ പതുക്കെ നടു വളയ്ക്കുക, ശ്വാസമെടുക്കുമ്പോൾ സാധാരണ നിലയിലേക്ക് വരിക. ആയാസമില്ലാതെ ചെയ്യുക.",
  },
  "Butterfly Pose": {
    English: "Sit comfortably, bring the soles of your feet together, and let your knees relax outward. Keep your back comfortable and upright with support if needed.",
    "தமிழ்": "வசதியாக அமர்ந்து பாதங்களை இணைத்து, முழங்கால்களை வெளிப்புறமாக தளர்த்தவும். முதுகுத்தண்டை நேராகவும் வசதியாகவும் வைத்திருக்க ஆதரவைப் பயன்படுத்தவும்.",
    "हिन्दी": "आराम से बैठें, पैरों के तलवों को एक साथ लाएं और घुटनों को बाहर की ओर ढीला छोड़ें। पीठ को सहारा देकर सीधा रखें।",
    "ಕನ್ನಡ": "ಆರಾಮವಾಗಿ ಕುಳಿತುಕೊಳ್ಳಿ, ಪಾದಗಳ ಅಡಿಭಾಗಗಳನ್ನು ಒಟ್ಟಿಗೆ ಜೋಡಿಸಿ, ಮೊಣಕಾಲುಗಳನ್ನು ಹೊರಗೆ ವಿಶ್ರಮಿಸಿ. ಬೆನ್ನನ್ನು ನೆಟ್ಟಗೆ ಇರಿಸಿ.",
    "मराठी": "आरामात बसा, तळपाय एकत्र आणा आणि गुडघे बाहेरच्या बाजूला सैल सोडा. पाठीला आधार देऊन ताठ बसा.",
    "മലയാളം": "സുഖമായി ഇരിക്കുക, കാൽപാദങ്ങൾ ചേർത്തുപിടിച്ച് കാൽമുട്ടുകൾ വശങ്ങളിലേക്ക് അയക്കുക. നട്ടെല്ല് നിവർത്തിപ്പിടിക്കുക.",
  },
  "Mountain Pose": {
    English: "Stand comfortably with feet grounded. Keep your spine tall, shoulders relaxed, and breathe slowly. Keep feet slightly apart for balance.",
    "தமிழ்": "கால்களை உறுதியாக வைத்து வசதியாக நிற்கவும். முதுகுத்தண்டை நிமிர்த்தி, தோள்களைத் தளர்த்தி, சமநிலைக்கு கால்களை சற்று அகலமாக வைத்து மெதுவாக சுவாசிக்கவும்.",
    "हिन्दी": "पैरों को मजबूती से टिकाकर सीधे खड़े हों। रीढ़ सीधी रखें, कंधे ढीले छोड़ें और संतुलन के लिए पैरों को थोड़ा अलग रखकर धीरे-धीरे सांस लें।",
    "ಕನ್ನಡ": "ಪಾದಗಳನ್ನು ನೆಲದ ಮೇಲೆ ಸಮತೋಲನದಲ್ಲಿರಿಸಿ ನೆಟ್ಟಗೆ ನಿಲ್ಲಿ. ಬೆನ್ನುಮೂಳೆಯನ್ನು ನೇರವಾಗಿರಿಸಿ, ಸಮತೋಲನಕ್ಕಾಗಿ ಪಾದಗಳನ್ನು ಕೊಂಚ ಅಗಲಿಸಿ ನಿಧಾನವಾಗಿ ಉಸಿರಾಡಿ.",
    "मराठी": "पायांवर व्यवस्थित तोल सांभाळून सरळ उभे राहा. खांदे सैल ठेवा आणि पायांमध्ये थोडे अंतर ठेवून शांत श्वास घ्या.",
    "മലയാളം": "കാൽപാദങ്ങൾ ഉറപ്പിച്ചു നിർത്തി നേരെ നിൽക്കുക. തോൾഭാഗം അയച്ചുവിട്ട് ബാലൻസിനായി കാലുകൾ അല്പം അകത്തി സാവധാനം ശ്വാസമെടുക്കുക.",
  },
  "Tree Pose": {
    English: "Stand near a wall for support. Place one foot against the opposite lower leg—not on the knee—and balance gently.",
    "தமிழ்": "ஆதரவிற்காக சுவரின் அருகில் நிற்கவும். ஒரு காலை மற்றொரு காலின் கெண்டைக்கால் மீது வைத்து (முழங்காலில் அல்ல) நிதானமாக சமநிலைப்படுத்தவும்.",
    "हिन्दी": "सहारे के लिए दीवार या कुर्सी के पास खड़े हों। एक पैर को घुटने के नीचे दूसरे पैर पर रखें और धीरे-धीरे संतुलन बनाएं।",
    "ಕನ್ನಡ": "ಬೆಂಬಲಕ್ಕಾಗಿ ಗೋಡೆಯ ಬಳಿ ನಿಲ್ಲಿ. ಒಂದು ಕಾಲನ್ನು ಇನ್ನೊಂದು ಕಾಲಿನ ಕೆಳಭಾಗದಲ್ಲಿರಿಸಿ (ಮೊಣಕಾಲಿನ ಮೇಲಲ್ಲ) ನಿಧಾನವಾಗಿ ಸಮತೋಲನ ಕಾಪಾಡಿ.",
    "मराठी": "आधारासाठी भिंतीजवळ उभे राहा. एका पायाचा तळवा दुसऱ्या पायाच्या नडगीवर ठेवा (गुडघ्यावर नाही) आणि तोल सांभाळा.",
    "മലയാളം": "പിന്തുണയ്ക്കായി ഭിത്തിക്കടുത്ത് നിൽക്കുക. ഒരു കാൽ മറ്റേ കാൽമുട്ടിന് താഴെ അമർത്തി സാവധാനം ബാലൻസ് ചെയ്യുക.",
  },
  "Warrior I": {
    English: "Step one foot forward, bend front knee comfortably, keep back foot grounded, and raise arms gently if comfortable. Use chair/wall support if needed.",
    "தமிழ்": "ஒரு காலை முன்னோக்கி வைத்து, முன் முழங்காலை வசதியாக வளைக்கவும். பின் காலை உறுதியாக வைத்து, கைகளை உயர்த்தவும். தேவைப்பட்டால் நாற்காலி ஆதரவைப் பயன்படுத்தவும்.",
    "हिन्दी": "एक पैर आगे बढ़ाएं, सामने के घुटने को आराम से मोड़ें, पिछला पैर जमीन पर रखें और बाहों को ऊपर उठाएं। जरूरत पड़ने पर दीवार का सहारा लें।",
    "ಕನ್ನಡ": "ಒಂದು ಕಾಲನ್ನು ಮುಂದೆ ಇರಿಸಿ, ಮುಂಭಾಗದ ಮೊಣಕಾಲನ್ನು ಆರಾಮವಾಗಿ ಮಡಚಿ ತೋಳುಗಳನ್ನು ಮೇಲಕ್ಕೆತ್ತಿ. ಅಗತ್ಯವಿದ್ದರೆ ಗೋಡೆಯ ಬೆಂಬಲ ಪಡೆಯಿರಿ.",
    "मराठी": "एक पाय पुढे टाका, पुढचा गुडघा हलका वाकवा आणि हात वर करा. गरज असल्यास भिंतीचा किंवा खुर्चीचा आधार घ्या.",
    "മലയാളം": "ഒരു കാൽ മുന്നോട്ട് വെക്കുക, കാൽമുട്ട് സുഖകരമായി മടക്കി കൈകൾ ഉയർത്തുക. ആവശ്യമെങ്കിൽ ഭിത്തിയിൽ പിടിക്കുക.",
  },
  "Warrior II": {
    English: "Take a wide stance, bend the front knee gently, extend your arms sideways, and keep your torso upright. Keep the pose shallow and comfortable.",
    "தமிழ்": "அகலமாக நின்று, முன் முழங்காலை மெதுவாக வளைத்து, கைகளை பக்கவாட்டில் விரித்து உடலை நேராக வைக்கவும். போஸை சௌகரியமாக வைக்கவும்.",
    "हिन्दी": "पैरों को फैलाकर खड़े हों, सामने के घुटने को मोड़ें, बाहें बगल में फैलाएं और धड़ को सीधा रखें। मुद्रा को सहज बनाए रखें।",
    "ಕನ್ನಡ": "ಅಗಲವಾಗಿ ನಿಲ್ಲಿ, ಮುಂಭಾಗದ ಮೊಣಕಾಲನ್ನು ಸೌಮ್ಯವಾಗಿ ಬಗ್ಗಿಸಿ ತೋಳುಗಳನ್ನು ಪಕ್ಕಕ್ಕೆ ಚಾಚಿ. ಆಸನವನ್ನು ಸುಲಭವಾಗಿರಿಸಿ.",
    "मराठी": "पाय रुंद करा, पुढचा गुडघा वाकवा, हात बाजूला पसरवा आणि शरीर ताठ ठेवा. त्रास होणार नाही याची काळजी घ्या.",
    "മലയാളം": "കാലുകൾ അകത്തി വെക്കുക, കാൽമുട്ട് ലഘുവായി മടക്കി കൈകൾ വശങ്ങളിലേക്ക് നീട്ടി ശരീരം നിവർത്തിപ്പിടിക്കുക.",
  },
  "Child's Pose": {
    English: "Kneel and widen your knees enough to leave room for your belly. Lower forward only as far as comfortable, using pillows if needed.",
    "தமிழ்": "முழங்காலிட்டு, வயிற்றுக்கு இடமளிக்கும் வகையில் முழங்கால்களை அகலப்படுத்தவும். தலையணைகளைப் பயன்படுத்தி வசதியான அளவுக்கு மட்டுமே முன்னோக்கி குனியவும்.",
    "हिन्दी": "घुटने टेकें और पेट के लिए जगह बनाते हुए घुटनों को फैलाएं। तकिए का सहारा लेकर केवल उतनी ही दूर आगे झुकें जितना सहज लगे।",
    "ಕನ್ನಡ": "ಮೊಣಕಾಲೂರಿ ಕುಳಿತು ಹೊಟ್ಟೆಗೆ ಸ್ಥಳಾವಕಾಶ ಕಲ್ಪಿಸಲು ಮೊಣಕಾಲುಗಳನ್ನು ಅಗಲಿಸಿ. ದಿಂಬುಗಳನ್ನು ಬಳಸಿ ಆರಾಮದಾಯಕವಾದಷ್ಟೇ ಮುಂದಕ್ಕೆ ಬಗ್ಗಿ.",
    "मराठी": "गुडघ्यावर बसा आणि पोटाला जागा मिळावी म्हणून गुडघे थोडे रुंद करा. उशांचा वापर करून सोयीस्कर वाटेल तितकेच पुढे वाका.",
    "മലയാളം": "കാൽമുട്ടുകളിൽ ഇരുന്ന് വയറിന് സുഖകരമായ അകലത്തിൽ കാൽമുട്ടുകൾ അകത്തുക. ആവശ്യമെങ്കിൽ തലയണ വെച്ച് മുന്നോട്ട് വിശ്രമിക്കുക.",
  },
  "Gentle Seated Stretching": {
    English: "Sit comfortably and gently stretch your side, neck, shoulders, or legs without forcing the movement. Keep plenty of space for the belly.",
    "தமிழ்": "வசதியாக அமர்ந்து பக்கவாட்டு, கழுத்து, தோள்கள் அல்லது கால்களை மென்மையாக நீட்டவும். வயிற்றுக்கு அழுத்தம் தராமல் போதுமான இடைவெளி விடவும்.",
    "हिन्दी": "आराम से बैठें और गर्दन, कंधों या पैरों को बिना जोर लगाए धीरे-धीरे स्ट्रेच करें। पेट पर बिल्कुल दबाव न डालें।",
    "ಕನ್ನಡ": "ಆರಾಮವಾಗಿ ಕುಳಿತು ಕುತ್ತಿಗೆ, ಭುಜ ಅಥವಾ ಕಾಲುಗಳನ್ನು ಒತ್ತಡವಿಲ್ಲದೆ ಸೌಮ್ಯವಾಗಿ ಹಿಗ್ಗಿಸಿ. ಹೊಟ್ಟೆಯನ್ನು ಒತ್ತಬೇಡಿ.",
    "मराठी": "आरामात बसा आणि मान, खांदे किंवा पाय हलके स्ट्रेच करा. पोटावर मुळीच ताण येऊ देऊ नका.",
    "മലയാളം": "സുഖമായി ഇരുന്ന് കഴുത്ത്, തോൾ, വശങ്ങൾ എന്നിവ അമിതമായി ആയാസപ്പെടാതെ പതുക്കെ സ്ട്രെച്ച് ചെയ്യുക. വയറിന് സുഖകരമായ അകലം നൽകുക.",
  },
  "Deep Breathing": {
    English: "Sit comfortably. Breathe slowly through your nose and gently exhale. Never force or hold the breath.",
    "தமிழ்": "வசதியாக அமர்ந்து மூக்கின் வழியே மெதுவாக மூச்சை உள்ளிழுத்து மென்மையாக வெளியேற்றவும். மூச்சை ஒருபோதும் அடக்க வேண்டாம்.",
    "हिन्दी": "आराम से बैठें। नाक से धीरे-धीरे सांस लें और धीरे से छोड़ें। सांस को बिल्कुल न रोकें।",
    "ಕನ್ನಡ": "ಆರಾಮವಾಗಿ ಕುಳಿತುಕೊಳ್ಳಿ. ಮೂಗಿನ ಮೂಲಕ ನಿಧಾನವಾಗಿ ಉಸಿರೆಳೆದು ನಿಧಾನವಾಗಿ ಬಿಡಿ. ಉಸಿರನ್ನು ಎಂದಿಗೂ ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳಬೇಡಿ.",
    "मराठी": "शांत बसा. नाकाने हळूवार दीर्घ श्वास घ्या आणि हळूच सोडा. श्वास कधीही रोखून धरू नका.",
    "മലയാളം": "ശാന്തമായി ഇരിക്കുക. മൂക്കിലൂടെ സാവധാനം ശ്വാസമെടുത്ത് പതുക്കെ പുറത്തുവിടുക. ശ്വാസം ഒരിക്കലും പിടിച്ചുവെക്കരുത്.",
  },
};

export function getLocalizedPoseTitle(title: string, lang: SupportedLanguage): string {
  if (lang === "English") return title;
  return POSE_TITLES[title]?.[lang] || title;
}

export function getLocalizedPoseBenefit(title: string, fallbackBenefit: string, lang: SupportedLanguage): string {
  if (lang === "English") return fallbackBenefit;
  return POSE_BENEFITS[title]?.[lang] || fallbackBenefit;
}
