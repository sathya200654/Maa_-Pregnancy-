import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

ts_file = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\translations.ts"

with open(ts_file, "r", encoding="utf-8") as f:
    original_code = f.read()

langs = ["English", "தமிழ்", "हिन्दी", "ಕನ್ನಡ", "मराठी", "മലയാളം"]
lang_data = {}
for lang in langs:
    pos = original_code.find(f'"{lang}":')
    if pos != -1:
        brace_pos = original_code.find('{', pos)
        depth = 0
        end_brace = -1
        for i in range(brace_pos, len(original_code)):
            if original_code[i] == '{':
                depth += 1
            elif original_code[i] == '}':
                depth -= 1
                if depth == 0:
                    end_brace = i
                    break
        block = original_code[brace_pos+1:end_brace]
        kvs = dict(re.findall(r'"([^"]+)":\s*"([^"]*)"', block))
        lang_data[lang] = kvs

print("Loaded languages:", list(lang_data.keys()))
print("Key counts:")
for l, d in lang_data.items():
    print(f"  {l}: {len(d)}")

