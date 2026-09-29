import re

file_path = "src/data/translations.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_keys = {
    "English": {
        "severity_mild": "MILD",
        "severity_moderate": "MODERATE",
        "severity_severe": "SEVERE",
        "voice_input": "VOICE INPUT",
        "symptom_placeholder": "e.g. Nausea, Fatigue",
    },
    "தமிழ்": {
        "severity_mild": "லேசானது",
        "severity_moderate": "மிதமானது",
        "severity_severe": "தீவிரமானது",
        "voice_input": "குரல் உள்ளீடு",
        "symptom_placeholder": "எ.கா. குமட்டல், சோர்வு",
    },
    "हिन्दी": {
        "severity_mild": "हल्का",
        "severity_moderate": "मध्यम",
        "severity_severe": "गंभीर",
        "voice_input": "वॉइस इनपुट",
        "symptom_placeholder": "उदा. मतली, थकान",
    },
    "ಕನ್ನಡ": {
        "severity_mild": "ಸೌಮ್ಯ",
        "severity_moderate": "ಮಧ್ಯಮ",
        "severity_severe": "ತೀವ್ರ",
        "voice_input": "ಧ್ವನಿ ಇನ್‌ಪುಟ್",
        "symptom_placeholder": "ಉದಾ. ವಾಕರಿಕೆ, ಆಯಾಸ",
    },
    "मराठी": {
        "severity_mild": "सौम्य",
        "severity_moderate": "मध्यम",
        "severity_severe": "तीव्र",
        "voice_input": "व्हॉइस इनपुट",
        "symptom_placeholder": "उदा. मळमळ, थकवा",
    },
    "മലയാളം": {
        "severity_mild": "ലഘുവായത്",
        "severity_moderate": "മിതമായത്",
        "severity_severe": "ഗുരുതരമായത്",
        "voice_input": "വോയ്‌സ് ഇൻപുട്ട്",
        "symptom_placeholder": "ഉദാ. ഛർദ്ദി, ക്ഷീണം",
    },
}

for lang, keys in new_keys.items():
    # Find the block for this language
    pattern = rf'("{lang}":\s*\{{)'
    m = re.search(pattern, content)
    if not m:
        # maybe without quotes
        pattern = rf'({lang}:\s*\{{)'
        m = re.search(pattern, content)
    if m:
        lines = []
        for k, v in keys.items():
            lines.append(f'    "{k}": "{v}",')
        insertion = "\n" + "\n".join(lines)
        pos = m.end()
        content = content[:pos] + insertion + content[pos:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated translations with severity and voice_input keys successfully.")
