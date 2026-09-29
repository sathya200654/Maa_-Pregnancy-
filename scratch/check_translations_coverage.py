import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\translations.ts", "r", encoding="utf-8") as f:
    code = f.read()

# Parse translations object
# We can extract the languages and their keys
langs = ["English", "தமிழ்", "हिन्दी", "ಕನ್ನಡ", "मराठी", "മലയാളം"]
# Also check if Telugu exists
if "తెలుగు" in code:
    langs.append("తెలుగు")

print("Languages in translations.ts:")
lang_dict = {}
for lang in langs:
    pattern = rf'"{re.escape(lang)}"\s*:\s*\{{([^}}]+(?:\{{[^}}]*\}}[^}}]*)*)\}}'
    # Actually simpler: find slice between `"{lang}": {` and the next `},\n  "` or end
    pos = code.find(f'"{lang}":')
    if pos != -1:
        # Find opening brace
        brace_pos = code.find('{', pos)
        # Scan until matching closing brace
        depth = 0
        end_brace = -1
        for i in range(brace_pos, len(code)):
            if code[i] == '{':
                depth += 1
            elif code[i] == '}':
                depth -= 1
                if depth == 0:
                    end_brace = i
                    break
        content = code[brace_pos+1:end_brace]
        keys = set(re.findall(r'"([^"]+)"\s*:', content))
        lang_dict[lang] = keys
        print(f"  {lang}: {len(keys)} keys")
    else:
        print(f"  {lang}: NOT FOUND")

# Check diary keys
diary_keys = [
    'open_for_writing', 'save_diary_page', 'lock_and_exit', 'enter_passcode', 'of_280', 'window',
    'activities_moments', 'forgot_passcode', 'sealed_memory', 'unlocking_with_key', 'go_to_today',
    'Save Error', 'thoughts_placeholder', 'Diary Protected 🌸', 'struggles_placeholder', 'setup_diary_title',
    'struggles_symptoms', 'thoughts_feelings', 'Invalid Day', 'activities_placeholder', 'Sealed Page',
    'todays_page', 'Passcode Reset ✨', 'personal_diary', 'future_page', 'day_prefix', 'setup_diary_desc'
]

print("\nChecking the 27 diary keys across languages:")
for k in diary_keys:
    missing_in = [lang for lang in lang_dict if k not in lang_dict[lang]]
    if missing_in:
        print(f"  Key '{k}' is MISSING in: {missing_in}")
    else:
        print(f"  Key '{k}': Present in all {len(lang_dict)} languages")

