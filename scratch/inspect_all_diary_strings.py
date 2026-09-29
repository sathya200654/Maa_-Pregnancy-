import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

path = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\components\PersonalDiaryModal.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines in PersonalDiaryModal.tsx: {len(lines)}")

for idx, line in enumerate(lines):
    lno = idx + 1
    # Check for hardcoded text inside <Text>...</Text>
    matches = re.findall(r'<Text[^>]*>([^<>{]+)</Text>', line)
    for m in matches:
        s = m.strip()
        if s and not s.isdigit() and s not in ["•", "/", "✓", ":"]:
            print(f"L{lno}: [Text] {s}")

    # Check for placeholder="..."
    p_matches = re.findall(r'placeholder="([^"]+)"', line)
    for p in p_matches:
        print(f"L{lno}: [Placeholder] {p}")

    # Check for Alert.alert("...", "...")
    a_matches = re.findall(r'Alert\.alert\(\s*"([^"]+)"(?:\s*,\s*"([^"]+)")?', line)
    for a1, a2 in a_matches:
        print(f"L{lno}: [Alert] '{a1}', '{a2}'")

