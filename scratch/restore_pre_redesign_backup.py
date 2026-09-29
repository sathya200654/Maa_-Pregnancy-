# -*- coding: utf-8 -*-
import os
import shutil
import sys

sys.stdout.reconfigure(encoding='utf-8')

project_root = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main"
backup_dir = os.path.join(project_root, "scratch", "backup_pre_redesign")

if not os.path.exists(backup_dir):
    print("Error: Backup directory does not exist!")
    sys.exit(1)

restored = 0
for dirpath, dirnames, filenames in os.walk(backup_dir):
    for fn in filenames:
        src = os.path.join(dirpath, fn)
        rel_path = os.path.relpath(src, backup_dir)
        dst = os.path.join(project_root, rel_path)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)
        print(f"Restored: {rel_path}")
        restored += 1

print(f"\nSuccessfully restored {restored} files from snapshot!")
