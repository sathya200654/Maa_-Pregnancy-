import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

ts_file = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\translations.ts"

with open(ts_file, "r", encoding="utf-8") as f:
    text = f.read()

pos = text.find('"English":')
brace_pos = text.find('{', pos)
depth = 0
end_brace = -1
for i in range(brace_pos, len(text)):
    if text[i] == '{':
        depth += 1
    elif text[i] == '}':
        depth -= 1
        if depth == 0:
            end_brace = i
            break
block = text[brace_pos+1:end_brace]
kvs = re.findall(r'"([^"]+)":\s*"([^"]*)"', block)

with open(r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\scratch\en_keys.json", "w", encoding="utf-8") as f:
    json.dump(dict(kvs), f, ensure_ascii=False, indent=2)

print(f"Exported {len(kvs)} English keys to en_keys.json")
