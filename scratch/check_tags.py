import re

with open('app/(tabs)/chat.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

tags = sorted(list(set(re.findall(r'<([A-Z][a-zA-Z0-9]+)', code))))
print('Total unique JSX tags:', len(tags))

header = code[:code.find('export default function')]

for t in tags:
    found = re.search(r'\b' + t + r'\b', header) is not None
    print(f'{t}: {"FOUND" if found else ">>> MISSING! <<<"}')
