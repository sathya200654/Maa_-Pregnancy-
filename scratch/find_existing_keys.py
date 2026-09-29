import sys
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

path = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\translations.ts"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# Extract English keys
en_match = re.search(r'"English":\s*\{(.*?)\n  \},', text, re.DOTALL)
if en_match:
    en_block = en_match.group(1)
    en_keys = re.findall(r'"([^"]+)":\s*"([^"]*)"', en_block)
    print(f"Total English keys: {len(en_keys)}")
    # Print keys related to profile, journey, diary, clinician, insurance
    print("\nExisting keys related to profile / journey / diary / clinician / insurance:")
    for k, v in en_keys:
        if any(w in k.lower() or w in v.lower() for w in ["journey", "diary", "clinician", "insurance", "claim", "profile", "trimester", "week", "milestone", "lock", "passcode"]):
            print(f"  {k}: {v}")

