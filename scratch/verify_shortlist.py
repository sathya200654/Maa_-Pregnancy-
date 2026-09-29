import sys
sys.stdout.reconfigure(encoding='utf-8')

POPULAR_CATEGORY_SHORTLIST = [
  "All",
  "Health",
  "Symptoms",
  "Food",
  "Yoga",
  "Baby",
  "Nutrition",
  "Mental Wellness",
  "Medicines",
  "General Pregnancy",
  "Scans & Tests",
  "Labor & Delivery",
]

languages = ["English", "தமிழ்", "हिन्दी", "ಕನ್ನಡ", "मराठी", "മലയാളം", "తెలుగు"]

with open('src/services/knowledgeLocalization.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Check each shortlist item
for cat in POPULAR_CATEGORY_SHORTLIST:
    # search for cat in CATEGORY_TRANSLATIONS
    idx = text.find(f'"{cat}":')
    if idx == -1:
        idx = text.find(f'{cat}:')
    if idx == -1:
        print(f"FAILED: {cat} not found in CATEGORY_TRANSLATIONS")
        continue
    
    cat_block = text[idx:idx+400]
    end_brace = cat_block.find('}')
    cat_block = cat_block[:end_brace]
    
    missing_langs = []
    for l in languages:
        if f'{l}:' not in cat_block:
            missing_langs.append(l)
    
    if missing_langs:
        print(f"FAILED: {cat} missing languages: {missing_langs}")
    else:
        print(f"OK: {cat} has all 7 languages")
