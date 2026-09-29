# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

file_path = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\app\(tabs)\health.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

replacements = [
    ('backgroundColor: "#F6F6F8"', 'backgroundColor: "#FAFBFD"'),
    ('recordKickText: {\n    color: colors.white,', 'recordKickText: {\n    color: "#30343B",'),
    ('addBtnText: {\n    color: colors.white,', 'addBtnText: {\n    color: "#30343B",'),
    ('saveBtnText: {\n    color: colors.white,', 'saveBtnText: {\n    color: "#30343B",'),
    ('kickCount: {\n    color: colors.brand,', 'kickCount: {\n    color: "#2563EB",'),
    ('backgroundColor: "#FFF1F5"', 'backgroundColor: "#FDE7EF"'),
    ('borderColor: "#FDE2EA"', 'borderColor: "#F8C8D8"'),
    ('backgroundColor: "#FF8BAA"', 'backgroundColor: "#F8C8D8"'),
]

count = 0
for old_s, new_s in replacements:
    if old_s in code:
        code = code.replace(old_s, new_s)
        count += 1
        print(f"Replaced: {old_s[:25]}...")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print(f"Updated health.tsx ({count} patterns replaced) successfully!")
