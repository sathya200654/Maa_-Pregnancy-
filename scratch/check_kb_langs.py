import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

# Check knowledge base sample
with open(r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\localized_insights.json", "r", encoding="utf-8") as f:
    data = json.load(f)
    print("localized_insights keys/languages:", list(data.keys()) if isinstance(data, dict) else "not dict")
    if isinstance(data, dict):
        sample = next(iter(data.values()))
        if isinstance(sample, dict):
            print("sample inner keys:", list(sample.keys()))

with open(r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\services\knowledgeLocalization.ts", "r", encoding="utf-8") as f:
    kl = f.read()
    import re
    case_matches = re.findall(r'case\s+"([^"]+)":', kl)
    print("knowledgeLocalization cases:", set(case_matches))

