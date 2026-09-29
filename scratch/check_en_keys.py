# -*- coding: utf-8 -*-
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

# Load en_keys
with open(r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\scratch\en_keys.json", "r", encoding="utf-8") as f:
    en_keys = json.load(f)

print(f"Total English keys to provide Telugu for: {len(en_keys)}")
