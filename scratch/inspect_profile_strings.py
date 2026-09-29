import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

path = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\app\(tabs)\profile.tsx"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines in profile.tsx: {len(lines)}")

# Look for milestone titles
for idx, line in enumerate(lines[:60]):
    if "milestones" in line:
        for j in range(idx, min(idx+15, len(lines))):
            print(f"L{j+1}: {lines[j].rstrip()}")
        break

# Look for JSX sections: Pregnancy Journey, Personal Diary, Clinician, Insurance
in_jsx = False
for idx, line in enumerate(lines):
    lno = idx + 1
    # Check for hardcoded text inside <Text>...</Text>
    matches = re.findall(r'<Text[^>]*>([^<>{]+)</Text>', line)
    for m in matches:
        s = m.strip()
        if s and not s.isdigit() and s not in ["•", "/", "✓", "• Daily Sealed Records", ":"]:
            # Check if this line is in the relevant sections
            print(f"L{lno}: [Text] {s}")

    # Check for placeholder="..."
    p_matches = re.findall(r'placeholder="([^"]+)"', line)
    for p in p_matches:
        print(f"L{lno}: [Placeholder] {p}")

    # Check for Alert.alert("...", "...")
    a_matches = re.findall(r'Alert\.alert\(\s*"([^"]+)"(?:\s*,\s*"([^"]+)")?', line)
    for a1, a2 in a_matches:
        print(f"L{lno}: [Alert] '{a1}', '{a2}'")

