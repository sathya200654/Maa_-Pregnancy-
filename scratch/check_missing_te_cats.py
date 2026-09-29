import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/services/knowledgeLocalization.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('export const CATEGORY_TRANSLATIONS:')
end = text.find('export const TOPIC_TERMS:', start)

block = text[start:end]
entries = block.split('\n  ')

missing = []
for entry in entries:
    if ': {' in entry:
        cat_name = entry.split(':')[0].strip().strip('"')
        if 'తెలుగు:' not in entry:
            missing.append(cat_name)

print(f"Categories missing Telugu: {len(missing)}")
for m in missing:
    print(m)
