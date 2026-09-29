import re

file_path = "src/data/translations.ts"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

langs = ["English", "தமிழ்", "हिन्दी", "ಕನ್ನಡ", "मराठी", "മലയാളം"]

for i, lang in enumerate(langs):
    start_pat = rf'("{lang}":\s*\{{)'
    m_start = re.search(start_pat, text)
    if not m_start:
        continue
    
    if i + 1 < len(langs):
        next_lang = langs[i + 1]
        end_pat = rf'("{next_lang}":\s*\{{)'
        m_end = re.search(end_pat, text[m_start.end():])
        block = text[m_start.end() : m_start.end() + m_end.start()]
    else:
        m_end = re.search(r'(\n\};)', text[m_start.end():])
        block = text[m_start.end() : m_start.end() + m_end.start()]
        
    lines = block.splitlines()
    seen = set()
    cleaned_lines = []
    
    for line in lines:
        km = re.match(r'^\s*"([^"]+)"\s*:\s*(.*)$', line)
        if km:
            k = km.group(1)
            if k in seen:
                continue
            seen.add(k)
            cleaned_lines.append(line)
        else:
            if line.strip().startswith("},") or line.strip() == "}":
                continue
            cleaned_lines.append(line)
            
    suffix = "\n  }," if i + 1 < len(langs) else "\n  }"
    new_block = "\n" + "\n".join(l for l in cleaned_lines if l.strip()) + suffix
    text = text[:m_start.end()] + new_block + "\n  " + text[m_start.end() + m_end.start():]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Deduplicated translations.ts successfully!")
