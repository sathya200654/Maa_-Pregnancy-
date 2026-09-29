import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

path = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\components\PersonalDiaryModal.tsx"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# Find all Text tags even multi-line
pattern = re.compile(r'<Text([^>]*)>(.*?)</Text>', re.DOTALL)
matches = pattern.findall(text)
print(f"Total <Text> tags in PersonalDiaryModal: {len(matches)}")
for attrs, content in matches:
    clean = re.sub(r'\s+', ' ', content).strip()
    if not clean.startswith('{t(') and not clean.startswith('{(') and not clean.isdigit():
        # print if contains alphabet
        if re.search(r'[A-Za-z]', clean):
            print(f"  {clean[:80]}")

print("\n--- MOODS array ---")
mood_match = re.search(r'const MOODS = \[(.*?)\];', text, re.DOTALL)
if mood_match:
    print(mood_match.group(0))

