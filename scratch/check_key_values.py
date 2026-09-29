import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

path = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\translations.ts"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

langs = ["English", "தமிழ்", "हिन्दी", "ಕನ್ನಡ", "मराठी", "മലയാളം"]
lang_data = {}
for lang in langs:
    pos = text.find(f'"{lang}":')
    if pos != -1:
        brace_pos = text.find('{', pos)
        depth = 0
        end_brace = -1
        for i in range(brace_pos, len(text)):
            if text[i] == '{':
                depth += 1
            elif text[i] == '}':
                depth -= 1
                if depth == 0:
                    end_brace = i
                    break
        block = text[brace_pos+1:end_brace]
        kvs = dict(re.findall(r'"([^"]+)":\s*"([^"]*)"', block))
        lang_data[lang] = kvs

test_keys = [
    "your_journey", "journey_complete", "milestone_ultrasound", "milestone_anatomy",
    "milestone_glucose", "milestone_trimester3", "personal_diary", "diary_subtitle",
    "open_diary", "clinician_report", "insurance_hub", "lock_and_exit", "enter_passcode"
]

for k in test_keys:
    print(f"\n--- Key: {k} ---")
    for lang in langs:
        print(f"  {lang}: {lang_data.get(lang, {}).get(k, '<MISSING>')}")

