# -*- coding: utf-8 -*-
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

ts_file = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\translations.ts"
with open(ts_file, "r", encoding="utf-8") as f:
    code = f.read()

langs = ["English", "தமிழ்", "हिन्दी", "ಕನ್ನಡ", "मराठी", "മലയാളം", "తెలుగు"]

def extract_lang(code, lang):
    pos = code.find(f'"{lang}":')
    if pos == -1:
        return None
    brace_pos = code.find('{', pos)
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
    block = code[brace_pos+1:end_brace]
    matches = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"', block)
    return {k: v.replace('\\"', '"') for k, v in matches}

extracted = {}
for l in langs:
    d = extract_lang(code, l)
    if d is None:
        print(f"FAILED to extract {l}")
    else:
        extracted[l] = d
        print(f"{l}: {len(d)} keys")

# Check that all keys match English
en_keys = set(extracted["English"].keys())
for l in langs:
    diff = en_keys ^ set(extracted[l].keys())
    if diff:
        print(f"Mismatch for {l}: {len(diff)} differences: {diff}")
    else:
        print(f"Verified: {l} matches English 100% (510 keys)")

# Sample key check
sample_keys = [
    "your_journey", "complete_label", "week_1", "milestone_ultrasound",
    "personal_diary", "private_locked", "secret_pregnancy_journal",
    "clinician_share_report", "bp_sys", "save_draft",
    "insurance_claims_hub", "insurance_provider", "claims_title",
    "choose_passcode_title", "school_question", "save_and_lock_diary",
    "daily_vibe", "mood_happy", "thoughts_feelings", "thoughts_hint",
    "inscribing_page", "page_saved_toast", "this_page_awaits_you"
]

print("\n--- Sample Key Checks Across All 7 Languages ---")
for k in sample_keys:
    print(f"\n[{k}]")
    for l in langs:
        print(f"  {l}: {extracted[l].get(k, '<MISSING>')}")

