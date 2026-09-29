import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

diary_path = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\components\PersonalDiaryModal.tsx"
with open(diary_path, "r", encoding="utf-8") as f:
    diary_code = f.read()

t_calls = re.findall(r't\(\s*"([^"]+)"', diary_code)
print(f"PersonalDiaryModal has {len(t_calls)} calls to t():")
print(set(t_calls))

# Find <Text> tags in PersonalDiaryModal that have raw text
raw_texts = re.findall(r'<Text[^>]*>([^<{]+)</Text>', diary_code)
print(f"\nRaw text in <Text> tags (first 30):")
for txt in list(set(t.strip() for t in raw_texts if t.strip()))[:30]:
    print(f"  - '{txt}'")

# Also check placeholders
placeholders = re.findall(r'placeholder="([^"]+)"', diary_code)
print(f"\nPlaceholders in PersonalDiaryModal:")
for ph in set(placeholders):
    print(f"  - '{ph}'")

