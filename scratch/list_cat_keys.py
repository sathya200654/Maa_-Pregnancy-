import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/services/knowledgeLocalization.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('export const CATEGORY_TRANSLATIONS:')
end = text.find('export const TOPIC_TERMS:', start)

block = text[start:end]
lines = block.split('\n')
keys = []
for line in lines:
    line_s = line.strip()
    if line_s.endswith(':{') or line_s.endswith(': {'):
        k = line_s.split(':')[0].strip().strip('"').strip("'")
        if k != 'export const CATEGORY_TRANSLATIONS':
            keys.append(k)

print(f"Total categories: {len(keys)}")
for k in keys:
    print(k)
