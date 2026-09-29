import json

with open('src/data/MAA_pregnancy_knowledge_base.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

faqs = data['faqs']
print('Total FAQs loaded:', len(faqs))

for term in ['vomiting', 'diet', 'scan', 'iron', 'bleeding']:
    matches = [f for f in faqs if term in f['question'].lower() or any(term in k.lower() for k in f['keywords'])]
    print(f'Matches for "{term}": {len(matches)}')
    if matches:
        sample = matches[0]
        print(f'  Sample: {sample["question"]}')
        print(f'  Follow-ups count: {len(sample.get("follow_up_questions", []))}')
        for idx, fu in enumerate(sample.get('follow_up_questions', [])[:2]):
            print(f'    Option {idx+1}: {fu["question"]}')
