# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

# Read existing translations
ts_file = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\translations.ts"

with open(ts_file, "r", encoding="utf-8") as f:
    orig_content = f.read()

# Helper to extract a dictionary for a language from ts_file
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
    # match "key": "value"
    # value can contain escaped quotes
    matches = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"', block)
    return {k: v.replace('\\"', '"') for k, v in matches}

existing_en = extract_lang_dict(orig_content, "English")
existing_ta = extract_lang_dict(orig_content, "தமிழ்")
existing_hi = extract_lang_dict(orig_content, "हिन्दी")
existing_kn = extract_lang_dict(orig_content, "ಕನ್ನಡ")
existing_mr = extract_lang_dict(orig_content, "मराठी")
existing_ml = extract_lang_dict(orig_content, "മലയാളം")

print(f"Loaded existing keys - EN: {len(existing_en)}, TA: {len(existing_ta)}, HI: {len(existing_hi)}, KN: {len(existing_kn)}, MR: {len(existing_mr)}, ML: {len(existing_ml)}")
