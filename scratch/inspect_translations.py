import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

path = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\translations.ts"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx, line in enumerate(lines[:15]):
    print(f"{idx+1}: {line.rstrip()}")

lang_lines = []
for idx, line in enumerate(lines):
    m = re.match(r'^\s{2}"([^"]+)":\s*\{', line)
    if m:
        lang_lines.append((idx + 1, m.group(1)))

print("Languages found:")
for lno, lang in lang_lines:
    print(f"  Line {lno}: {lang}")
