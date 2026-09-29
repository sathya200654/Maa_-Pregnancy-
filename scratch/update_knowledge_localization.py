import re, sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('src/services/knowledgeLocalization.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update CATEGORY_TRANSLATIONS with Telugu and missing short categories
extra_categories = {
  "Health": {
    "English": "Health",
    "தமிழ்": "ஆரோக்கியம்",
    "हिन्दी": "स्वास्थ्य",
    "ಕನ್ನಡ": "ಆರೋಗ್ಯ",
    "मराठी": "आरोग्य",
    "മലയാളം": "ആരോഗ്യം",
    "తెలుగు": "ఆరోగ్యం"
  },
  "Symptoms": {
    "English": "Symptoms",
    "தமிழ்": "அறிகுறிகள்",
    "हिन्दी": "लक्षण",
    "ಕನ್ನಡ": "ಲಕ್ಷಣಗಳು",
    "मराठी": "लक्षणे",
    "മലയാളം": "ലക്ഷണങ്ങൾ",
    "తెలుగు": "లక్షణాలు"
  },
  "Food": {
    "English": "Food",
    "தமிழ்": "உணவு",
    "हिन्दी": "आहार",
    "ಕನ್ನಡ": "ಆಹಾರ",
    "मराठी": "अन्न",
    "മലയാളം": "ഭക്ഷണം",
    "తెలుగు": "ఆహారం"
  },
  "Yoga": {
    "English": "Yoga",
    "தமிழ்": "யோகா",
    "हिन्दी": "योग",
    "ಕನ್ನಡ": "ಯೋಗ",
    "मराठी": "योगा",
    "മലയാളം": "യോഗ",
    "తెలుగు": "యోగా"
  },
  "Baby": {
    "English": "Baby",
    "தமிழ்": "குழந்தை",
    "हिन्दी": "शिशु",
    "ಕನ್ನಡ": "ಮಗು",
    "मराठी": "बाळ",
    "മലയാളം": "കുഞ്ഞ്",
    "తెలుగు": "శిశువు"
  },
  "Nutrition": {
    "English": "Nutrition",
    "தமிழ்": "ஊட்டச்சத்து",
    "हिन्दी": "पोषण",
    "ಕನ್ನಡ": "ಪೋಷಣೆ",
    "मराठी": "पोषण",
    "മലയാളം": "പോഷണം",
    "తెలుగు": "పోషకాహారం"
  },
  "Mental Wellness": {
    "English": "Mental Wellness",
    "தமிழ்": "மன நலம்",
    "हिन्दी": "मानसिक स्वास्थ्य",
    "ಕನ್ನಡ": "ಮಾನಸಿಕ ಸ್ವಾಸ್ಥ್ಯ",
    "मराठी": "मानसिक आरोग्य",
    "മലയാളം": "മാനസികാരോഗ്യം",
    "తెలుగు": "మానసిక ఆరోగ్యం"
  }
}

telugu_for_existing = {
  "All": "అన్నీ",
  "General Pregnancy": "సాధారణ గర్భధారణ",
  "Week-by-Week Pregnancy": "వారం వారీగా గర్భధారణ",
  "Baby Development": "శిశువు అభివృద్ధి",
  "Food & Nutrition": "ఆహారం మరియు పోషణ",
  "Fruits": "పండ్లు",
  "Vegetables": "కూరగాయలు",
  "Indian Foods": "భారతీయ ఆహారాలు",
  "Supplements": "సప్లిమెంట్లు",
  "Vitamins": "విటమిన్లు",
  "Water & Hydration": "నీరు మరియు హైడ్రేషన్",
  "Weight Gain": "బరువు పెరుగుట",
  "Exercise": "వ్యాయామం",
  "Prenatal Yoga": "ప్రసవపూర్వ యోగా",
  "Breathing Exercises": "శ్వాస వ్యాయామాలు",
  "Walking": "నడక",
  "Sleep": "నిద్ర",
  "Body Changes": "శరీర మార్పులు",
  "Skin Changes": "చర్మ మార్పులు",
  "Hair Changes": "జుట్టు మార్పులు",
  "Morning Sickness & Nausea": "మార్నింగ్ సిక్‌నెస్ & వికారం",
  "Common Problems": "సాధారణ సమస్యలు",
  "Diseases": "వ్యాధులు",
  "Pregnancy Complications": "గర్భధారణ సమస్యలు",
  "Infections": "ఇన్‌ఫెక్షన్లు",
  "Mental Health": "మానసిక ఆరోగ్యం",
  "Emotional Wellbeing": "భావోద్వేగ శ్రేయస్సు",
  "Stress": "ఒత్తిడి",
  "Anxiety": "ఆందోళన",
  "Relationships": "సంబంధాలు",
  "Sexual Health": "లైంగిక ఆరోగ్యం",
  "Medical Tests": "వైద్య పరీక్షలు",
  "Scans": "స్కాన్లు",
  "Scans & Tests": "స్కాన్లు మరియు పరీక్షలు",
  "Medicines": "మందులు",
  "Safety": "భద్రత",
  "Travel": "ప్రయాణం",
  "Work": "పని",
  "Emergency Symptoms": "అత్యవసర లక్షణాలు",
  "Labor": "ప్రసవ వేదన",
  "Delivery": "డెలివరీ",
  "Labor & Delivery": "ప్రసవం మరియు డెలివరీ",
  "C-Section": "సి-సెక్షన్",
  "Breastfeeding": "తల్లిపాలు ఇవ్వడం",
  "Postpartum Care": "ప్రసవానంతర సంరక్షణ",
  "Newborn Care": "నవజాత శిశు సంరక్షణ",
  "Parenting Preparation": "తల్లిదండ్రుల సంసిద్ధత"
}

# Add Telugu to existing categories where missing
for cat, te_val in telugu_for_existing.items():
    # Look for the cat block
    pattern = re.compile(rf'(\b(?:\"{re.escape(cat)}\"|{re.escape(cat)}):\s*\{{[^}}]*?)(മലയാളം:\s*\"[^\"]*\",?\n)', re.MULTILINE)
    m = pattern.search(code)
    if m:
        before = m.group(1)
        ml_line = m.group(2)
        # Check if already has తెలుగు
        if 'తెలుగు:' not in m.group(0):
            replacement = f'{before}{ml_line}    తెలుగు: "{te_val}",\n'
            code = code[:m.start()] + replacement + code[m.end():]
            print(f"Added Telugu to category: {cat}")

# Add new categories into CATEGORY_TRANSLATIONS right after "All: {\n"
all_pos = code.find('All: {')
if all_pos != -1:
    end_all = code.find('},', all_pos)
    insert_point = end_all + 2
    new_cats_str = ""
    for cat_name, trans_map in extra_categories.items():
        if f'"{cat_name}":' not in code and f'{cat_name}:' not in code:
            new_cats_str += f'\n  "{cat_name}": {{\n'
            for l, v in trans_map.items():
                new_cats_str += f'    {l}: "{v}",\n'
            new_cats_str += '  },'
    if new_cats_str:
        code = code[:insert_point] + new_cats_str + code[insert_point:]
        print(f"Added new categories: {list(extra_categories.keys())}")

# Add Telugu to ANSWER_TAIL_FRAGMENTS
tail_fragments_te = {
    "common": "కొంతమంది మహిళలకు ఇది అనిపించవచ్చు, మరికొందరికి అనిపించకపోవచ్చు. దీని తీవ్రత త్రైమాసికం మరియు వ్యక్తిగత ఆరోగ్యాన్ని బట్టి మారవచ్చు. సాధారణ సమాచారంపై ఆధారపడకుండా మీ ప్రసవపూర్వ సంరక్షణ వైద్యుడిని సంప్రదించండి.",
    "doctor": "ఇది కొత్తగా ప్రారంభమైనా, నిరంతరం కొనసాగినా, లేదా మిమ్మల్ని ఆందోళనకు గురిచేసినా మీ వైద్యుడికి తెలపండి. తీవ్రమైన లక్షణాలు ఉంటే తక్షణ అత్యవసర వైద్య సహాయం పొందండి.",
    "home": "సౌకర్యవంతంగా ఉండే సరళమైన చర్యలను అనుసరించండి మరియు వైద్యుల సలహాలను పాటించండి. లక్షణాలను తీవ్రతరం చేసే పనులకు దూరంగా ఉండండి.",
    "warning": "మీ లక్షణాలు, గర్భధారణ దశ మరియు వైద్య చరిత్ర ఆధారంగా మీ వైద్య బృందం సరైన సలహా ఇవ్వగలదు. ఏదైనా హెచ్చరిక సంకేతాలు కనిపిస్తే వెంటనే ఆసుపత్రికి వెళ్ళండి.",
    "amount": "అందరికీ ఒకే పరిమాణం సరిపోదు. మీ వైద్యుడి సలహాను అనుసరించండి మరియు మీ గర్భధారణ దశకు అనుగుణంగా మార్చుకోండి.",
    "suitable": "ఇది చాలా మందికి అనుకూలంగా ఉండవచ్చు, కానీ వ్యక్తిగత వైద్య సలహా ముఖ్యం. ఏవైనా సమస్యలు ఉంటే మీ వైద్యుడిని సంప్రదించండి.",
    "urgent": "చాట్‌బాట్ కోసం వేచి ఉండకండి. వెంటనే అత్యవసర వైద్య సహాయం తీసుకోండి. పరిస్థితి తీవ్రంగా ఉంటే 108 కి కాల్ చేయండి."
}

for frag_k, frag_te in tail_fragments_te.items():
    pattern = re.compile(rf'(\b{frag_k}:\s*\{{[^}}]*?)(മലയാളം:\s*\"[^\"]*\",?\n)', re.MULTILINE)
    m = pattern.search(code)
    if m:
        before = m.group(1)
        ml_line = m.group(2)
        if 'తెలుగు:' not in m.group(0):
            replacement = f'{before}{ml_line}    తెలుగు: "{frag_te}",\n'
            code = code[:m.start()] + replacement + code[m.end():]
            print(f"Added Telugu to tail fragment: {frag_k}")

# Add Telugu to ANSWER_TAIL_TRANSLATIONS
tail_translations_te = {
    "standard_advice": "గర్భధారణ దశ మరియు మీ ఆరోగ్యాన్ని బట్టి మార్పులు సాధారణం. క్రమం తప్పకుండా వైద్య పరీక్షలు చేయించుకోండి. తీవ్రమైన నొప్పి, అధిక రక్తస్రావం, శ్వాస తీసుకోవడంలో ఇబ్బంది లేదా శిశువు కదలికలు తగ్గితే వెంటనే అత్యవసర వైద్య సంరక్షణ పొందండి.",
    "baby_growth": "శిశువు ఎదుగుదల మరియు లక్షణాలు ప్రతి గర్భధారణలో వేర్వేరుగా ఉంటాయి. ఎదుగుదల సక్రమంగా ఉందని నిర్ధారించుకోవడానికి సాధారణ పరీక్షలను ఉపయోగించండి. రక్తస్రావం లేదా తీవ్రమైన నొప్పి ఉంటే వెంటనే వైద్యుడిని సంప్రదించండి.",
    "food_advice": "తాజా ఆహార పదార్థాలను ఎంచుకోండి, శుభ్రంగా కడిగి, బాగా ఉడికించి తినండి. ఏదైనా ఒక్క ఆహారం కంటే మీ మొత్తం సమతుల్య ఆహార శైలి ముఖ్యం. డయాబెటిస్ లేదా అలర్జీలు ఉంటే వైద్యుడి సలహా తీసుకోండి.",
    "exercise_advice": "సులభమైన వ్యాయామాలతో ప్రారంభించండి మరియు అసౌకర్యంగా అనిపిస్తే వెంటనే ఆపండి. ఏదైనా వ్యాయామం ప్రారంభించే ముందు మీ వైద్యుడితో మాట్లాడండి."
}

for tr_k, tr_te in tail_translations_te.items():
    pattern = re.compile(rf'(\b{tr_k}:\s*\{{[^}}]*?)(മലയാളം:\s*\"[^\"]*\",?\n)', re.MULTILINE)
    m = pattern.search(code)
    if m:
        before = m.group(1)
        ml_line = m.group(2)
        if 'తెలుగు:' not in m.group(0):
            replacement = f'{before}{ml_line}    తెలుగు: "{tr_te}",\n'
            code = code[:m.start()] + replacement + code[m.end():]
            print(f"Added Telugu to tail translation: {tr_k}")

# Add Telugu follow-up question patterns into getLocalizedFollowUpQuestion
fu_patterns_te = [
    # 1. "Tell me more about {topic}"
    ('case "മലയാളം":\n        return `${topic} കുറിച്ച് കൂടുതൽ പറയുക`;',
     'case "മലയാളം":\n        return `${topic} കുറിച്ച് കൂടുതൽ പറയുക`;\n      case "తెలుగు":\n        return `${topic} గురించి మరింత వివరంగా చెప్పండి`;'),
    # 2. "When should I contact a doctor about {topic}?"
    ('case "മലയാളം":\n        return `${topic} സംബന്ധിച്ച് എപ്പോഴാണ് ഡോക്ടറെ കാണേണ്ടത്?`;',
     'case "മലയാളം":\n        return `${topic} സംബന്ധിച്ച് എപ്പോഴാണ് ഡോക്ടറെ കാണേണ്ടത്?`;\n      case "తెలుగు":\n        return `${topic} గురించి నేను ఎప్పుడు వైద్యుడిని సంప్రదించాలి?`;'),
    # 3. "What is the purpose of {scan}?"
    ('case "മലയാളം":\n        return `${scan}-ന്റെ ഉദ്ദേശ്യം എന്താണ്?`;',
     'case "മലയാളം":\n        return `${scan}-ന്റെ ഉദ്ദേശ്യം എന്താണ്?`;\n      case "తెలుగు":\n        return `${scan} యొక్క ప్రయోజనం ఏమిటి?`;'),
    # 4. "What should I do if I have {emergency}?"
    ('case "മലയാളം":\n        return `എനിക്ക് ${symp} ഉണ്ടെങ്കിൽ ഞാൻ എന്താണ് ചെയ്യേണ്ടത്?`;',
     'case "മലയാളം":\n        return `എനിക്ക് ${symp} ഉണ്ടെങ്കിൽ ഞാൻ എന്താണ് ചെയ്യേണ്ടത്?`;\n      case "తెలుగు":\n        return `నాకు ${symp} ఉంటే నేను ఏమి చేయాలి?`;'),
    # 5. "What can I do about {topic}?"
    ('case "മലയാളം":\n        return `${topic}-ന് ഞാൻ എന്തുചെയ്യണം?`;',
     'case "മലയാളം":\n        return `${topic}-ന് ഞാൻ എന്തുചെയ്യണം?`;\n      case "తెలుగు":\n        return `${topic} కోసం నేను ఏమి చేయవచ్చు?`;'),
    # 6. "Is {topic} safe during pregnancy?"
    ('case "മലയാളം":\n        return `ഗർഭകാലത്ത് ${topic} സുരക്ഷിതമാണോ?`;',
     'case "മലയാളം":\n        return `ഗർഭകാലത്ത് ${topic} സുരക്ഷിതമാണോ?`;\n      case "తెలుగు":\n        return `గర్భధారణ సమయంలో ${topic} సురక్షితమేనా?`;'),
    # 7. "How does {topic} affect the baby?"
    ('case "മലയാളം":\n        return `${topic} കുഞ്ഞിനെ എങ്ങനെ ബാധിക്കുന്നു?`;',
     'case "മലയാളം":\n        return `${topic} കുഞ്ഞിനെ എങ്ങനെ ബാധിക്കുന്നു?`;\n      case "తెలుగు":\n        return `${topic} శిశువుపై ఎలా ప్రభావం చూపుతుంది?`;'),
    # 8. "How does {topic} affect my health?"
    ('case "മലയാളം":\n        return `${topic} എന്റെ ആരോഗ്യത്തെ എങ്ങനെ ബാധിക്കുന്നു?`;',
     'case "മലയാളം":\n        return `${topic} എന്റെ ആരോഗ്യത്തെ എങ്ങനെ ബാധിക്കുന്നു?`;\n      case "తెలుగు":\n        return `${topic} నా ఆరోగ్యంపై ఎలా ప్రభావం చూపుతుంది?`;'),
    # 9. "About {topic}, what warning signs should make me seek care?"
    ('case "മലയാളം":\n        return `${topic} സംബന്ധിച്ച്, ഏത് അപായസൂചനകൾക്കാണ് ചികിത്സ തേടേണ്ടത്?`;',
     'case "മലയാളം":\n        return `${topic} സംബന്ധിച്ച്, ഏത് അപായസൂചനകൾക്കാണ് ചികിത്സ തേടേണ്ടത്?`;\n      case "తెలుగు":\n        return `${topic} విషయంలో ఏ హెచ్చరిక సంకేతాలు ఉంటే వైద్య సహాయం పొందాలి?`;'),
    # 10. "What can I do at home to support comfort with {topic}?"
    ('case "മലയാളം":\n        return `${topic}-ൽ ആശ്വാസം ലഭിക്കാൻ വീട്ടിൽ എന്ത് ചെയ്യാം?`;',
     'case "മലയാളം":\n        return `${topic}-ൽ ആശ്വാസം ലഭിക്കാൻ വീട്ടിൽ എന്ത് ചെയ്യാം?`;\n      case "తెలుగు":\n        return `${topic} ఉపశమనం కోసం ఇంట్లో ఏమి చేయవచ్చు?`;'),
    # 11. "How common is {topic} during pregnancy?"
    ('case "മലയാളം":\n        return `ഗർഭകാലത്ത് ${topic} എത്ര സാധാരണമാണ്?`;',
     'case "മലയാളം":\n        return `ഗർഭകാലത്ത് ${topic} എത്ര സാധാരണമാണ്?`;\n      case "తెలుగు":\n        return `గర్భధారణ సమయంలో ${topic} ఎంత సాధారణం?`;'),
    # 12. "What questions should I ask my doctor about {topic}?"
    ('case "മലയാളം":\n        return `${topic} സംബന്ധിച്ച് ഡോക്ടറോട് എന്തൊക്കെ ചോദിക്കണം?`;',
     'case "മലയാളം":\n        return `${topic} സംബന്ധിച്ച് ഡോക്ടറോട് എന്തൊക്കെ ചോദിക്കണം?`;\n      case "తెలుగు":\n        return `${topic} గురించి నా వైద్యుడిని ఏ ప్రశ్నలు అడగాలి?`;'),
]

for orig_p, repl_p in fu_patterns_te:
    if orig_p in code:
        code = code.replace(orig_p, repl_p, 1)
        print("Replaced a follow-up pattern with Telugu")
    else:
        print(f"Warning: pattern not found: {orig_p[:30]}...")

with open('src/services/knowledgeLocalization.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("Finished updating knowledgeLocalization.ts!")
