import re, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/translations.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# find telugu section
telugu_idx = text.find('"తెలుగు": {')
if telugu_idx != -1:
    telugu_block = text[telugu_idx:]
    test_keys = ['chat_faq_title', 'chat_topics', 'chat_tap_explore', 'chat_badge', 'lmp_short', 'trimester_1', 'baby_development']
    for k in test_keys:
        m = re.search(rf'"{k}":\s*"(.*?)"', telugu_block)
        if m:
            print(f'{k} -> {m.group(1)}')
        else:
            print(f'{k} -> NOT FOUND')
