# -*- coding: utf-8 -*-
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

trans_file = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\translations.ts"

with open(trans_file, "r", encoding="utf-8") as f:
    content = f.read()

languages = ["English", "தமிழ்", "हिन्दी", "ಕನ್ನಡ", "मराठी", "മലയാളം", "తెలుగు"]

# We need to find each language block and deduplicate its keys.
# The structure is:
# export const translations: Record<SupportedLanguage, Record<string, string>> = {
#   "English": {
#     ...
#   },
#   "தமிழ்": {
#   ...

# Let's parse each language block precisely.
for lang in languages:
    escaped_lang = re.escape(lang)
    # Find the start of this language block
    pattern = rf'("{escaped_lang}":\s*\{{)'
    m = re.search(pattern, content)
    if not m:
        print(f"Could not find {lang}")
        continue
    
    start_pos = m.end()
    # Find matching closing brace
    # Count braces
    depth = 1
    i = start_pos
    while i < len(content) and depth > 0:
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
        i += 1
    
    end_pos = i - 1 # position of the closing '}'
    block_text = content[start_pos:end_pos]
    
    # Parse key-values in this block
    # Matches either: key: "value", or "key": "value",
    # Note that value can contain escaped quotes
    kv_pattern = re.compile(r'^\s*(?:"([^"]+)"|([a-zA-Z0-9_]+))\s*:\s*"((?:\\.|[^"\\])*)"\s*,?\s*$', re.MULTILINE)
    
    pairs = {}
    for match in kv_pattern.finditer(block_text):
        k = match.group(1) or match.group(2)
        v = match.group(3)
        pairs[k] = v
    
    print(f"Language {lang}: found {len(pairs)} unique keys (original matches: {len(kv_pattern.findall(block_text))})")
    
    # Format sorted unique keys
    new_block_lines = ["\n"]
    for k in sorted(pairs.keys()):
        new_block_lines.append(f'    "{k}": "{pairs[k]}",\n')
    new_block_lines.append("  ")
    new_block_text = "".join(new_block_lines)
    
    content = content[:start_pos] + new_block_text + content[end_pos:]

with open(trans_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Saved deduplicated translations.ts successfully!")
