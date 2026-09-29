# -*- coding: utf-8 -*-
import os
import shutil
import sys

sys.stdout.reconfigure(encoding='utf-8')

project_root = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main"
backup_dir = os.path.join(project_root, "scratch", "backup_pre_redesign")

files_to_backup = [
    os.path.join("constants", "theme.ts"),
    os.path.join("app", "(tabs)", "_layout.tsx"),
    os.path.join("app", "(tabs)", "index.tsx"),
    os.path.join("app", "(tabs)", "articles.tsx"),
    os.path.join("app", "(tabs)", "yoga.tsx"),
    os.path.join("app", "(tabs)", "chat.tsx"),
    os.path.join("app", "(tabs)", "profile.tsx"),
    os.path.join("app", "emergency.tsx"),
    os.path.join("src", "components", "PersonalDiaryModal.tsx"),
    os.path.join("src", "components", "LanguageSelector.tsx"),
    os.path.join("src", "components", "EmergencySupportButton.tsx"),
]

os.makedirs(backup_dir, exist_ok=True)

backed_up = 0
for rel_path in files_to_backup:
    src = os.path.join(project_root, rel_path)
    if os.path.exists(src):
        dst = os.path.join(backup_dir, rel_path)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        print(f"Backed up: {rel_path}")
        backed_up += 1
    else:
        print(f"File not found: {rel_path}")

print(f"\nTotal files safely backed up: {backed_up}")
