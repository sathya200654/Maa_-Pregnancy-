# -*- coding: utf-8 -*-
import os

root_dir = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main"

hits = []
for dirpath, dirnames, filenames in os.walk(root_dir):
    for fn in filenames:
        if fn.endswith((".png", ".jpg", ".jar", ".zip", ".apk", ".so", ".class")):
            continue
        fp = os.path.join(dirpath, fn)
        try:
            with open(fp, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                if "M:\\MAA_Mobile_App-main" in content or "M:/MAA_Mobile_App-main" in content:
                    hits.append(fp)
        except Exception:
            pass

print(f"Found {len(hits)} occurrences:")
for h in hits:
    print(h)
