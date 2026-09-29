# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append('.')

# Load translations.ts
ts_file = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\translations.ts"

with open(ts_file, "r", encoding="utf-8") as f:
    content = f.read()

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

langs = ["English", "தமிழ்", "हिन्दी", "ಕನ್ನಡ", "मराठी", "മലയാളം", "తెలుగు"]
dicts = {l: extract_lang_dict(content, l) for l in langs}

union_keys = set()
for l, d in dicts.items():
    union_keys.update(d.keys())

print(f"Total distinct keys across all languages: {len(union_keys)}")
for l in langs:
    missing = union_keys - set(dicts[l].keys())
    print(f"  {l}: {len(dicts[l])} keys, missing {len(missing)} keys")
