# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

# Read existing translations
ts_file = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\translations.ts"

with open(ts_file, "r", encoding="utf-8") as f:
    orig_content = f.read()

def extract_lang_dict(content, lang_name):
    pos = content.find(f'"{lang_name}":')
    if pos == -1:
        return {}
    brace_pos = content.find('{', pos)
    depth = 0
    end_brace = -1
    for i in range(brace_pos, len(content)):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                end_brace = i
                break
    block = content[brace_pos+1:end_brace]
    matches = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"', block)
    return {k: v.replace('\\"', '"') for k, v in matches}

en_dict = extract_lang_dict(orig_content, "English")
ta_dict = extract_lang_dict(orig_content, "தமிழ்")
hi_dict = extract_lang_dict(orig_content, "हिन्दी")
kn_dict = extract_lang_dict(orig_content, "ಕನ್ನಡ")
mr_dict = extract_lang_dict(orig_content, "मराठी")
ml_dict = extract_lang_dict(orig_content, "മലയാളം")

print(f"Loaded existing - EN: {len(en_dict)}, TA: {len(ta_dict)}, HI: {len(hi_dict)}, KN: {len(kn_dict)}, MR: {len(mr_dict)}, ML: {len(ml_dict)}")

# Let's inspect all keys in EN to make sure we map Telugu for every single key
with open(r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\scratch\en_keys_list.json", "w", encoding="utf-8") as f:
    json.dump(list(en_dict.keys()), f, ensure_ascii=False, indent=2)

print("Saved en_keys_list.json")
