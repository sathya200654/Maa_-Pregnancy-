# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

file_path = "src/components/PlanSection.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace colors
replacements = [
    ("#FFA0B7", "#F8C8D8"),
    ("#FF7E9F", "#D64A73"),
    ("#FFDCE6", "#F8C8D8"),
    ("#FFF1F5", "#FDE7EF"),
    ('<Plus size={20} color={colors.white} />', '<Plus size={20} color="#30343B" />'),
    ('dayCellTextActive: {\n    color: colors.white,', 'dayCellTextActive: {\n    color: "#30343B",'),
    ('donePillTextActive: {\n    color: colors.white,', 'donePillTextActive: {\n    color: "#30343B",'),
    ('confirmBtnText: {\n    color: colors.white,', 'confirmBtnText: {\n    color: "#30343B",'),
]

for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        print(f"Replaced: {old[:30]}...")
    else:
        print(f"Not found: {old[:30]}...")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated PlanSection.tsx successfully!")
