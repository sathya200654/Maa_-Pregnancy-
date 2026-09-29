import os
import re

root = r'C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main'

def scan_file(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    issues = []
    for m in re.finditer(r'([a-zA-Z0-9_]+):\s*\{([^}]+)\}', text):
        name = m.group(1)
        body = m.group(2)
        if 'flexDirection: "row"' in body or "flexDirection: 'row'" in body:
            if 'alignItems' not in body:
                issues.append(name)
    return issues

print("=== Scanning for row styles missing alignItems ===")
for base in [os.path.join(root, 'app'), os.path.join(root, 'src', 'components')]:
    for dirpath, _, filenames in os.walk(base):
        for f in filenames:
            if f.endswith('.tsx'):
                fp = os.path.join(dirpath, f)
                iss = scan_file(fp)
                if iss:
                    rel = os.path.relpath(fp, root)
                    print(f"{rel}: {iss}")
