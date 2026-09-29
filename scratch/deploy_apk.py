# -*- coding: utf-8 -*-
import hashlib
import os
import shutil
import sys

sys.stdout.reconfigure(encoding='utf-8')

src = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\android\app\build\outputs\apk\release\app-release.apk"
dest1 = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\MAA_Mobile_App.apk"
dest2 = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\MAA_Mobile_App.apk"

print(f"Source file exists: {os.path.exists(src)}")
print(f"Source file size: {os.path.getsize(src)} bytes")

shutil.copy2(src, dest1)
print(f"Copied to dest1: {dest1} (size: {os.path.getsize(dest1)} bytes)")

shutil.copy2(src, dest2)
print(f"Copied to dest2: {dest2} (size: {os.path.getsize(dest2)} bytes)")

# Compute sha256 to ensure complete integrity
def get_sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

src_sha = get_sha256(src)
d1_sha = get_sha256(dest1)
print(f"SHA-256 match: {src_sha == d1_sha} ({src_sha})")
