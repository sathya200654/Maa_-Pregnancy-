# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

file_path = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\app\(tabs)\profile.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

replacements = [
    # Personal diary card colors
    ('color: "#C2185B"', 'color: "#D64A73"'),
    ('color: "#E91E63"', 'color: "#D64A73"'),
    ('color="#C2185B"', 'color="#D64A73"'),
    ('color="#E91E63"', 'color="#D64A73"'),
    ('fill="#F48FB1"', 'fill="#F8C8D8"'),
    ('backgroundColor: "#FCE4EC"', 'backgroundColor: "#FDE7EF"'),
    ('borderColor: "#F8BBD0"', 'borderColor: "#F8C8D8"'),
    ('backgroundColor: "#FFF0F5"', 'backgroundColor: colors.white'),
    ('borderColor: "#F48FB1"', 'borderColor: "#F8C8D8"'),
    ('color: "#4A1525"', 'color: "#30343B"'),
    ('color: "#8C4A60"', 'color: "#6F7480"'),
    # Journey card colors
    ('backgroundColor: "#FFF1F5"', 'backgroundColor: "#FDE7EF"'),
    ('borderColor: "#FDE2EA"', 'borderColor: "#F8C8D8"'),
    ('backgroundColor: "#F8BBD0"', 'backgroundColor: "#F8C8D8"'),
]

count = 0
for old_s, new_s in replacements:
    if old_s in code:
        code = code.replace(old_s, new_s)
        count += 1
        print(f"Replaced: {old_s}")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print(f"Updated profile.tsx ({count} patterns replaced) successfully!")
