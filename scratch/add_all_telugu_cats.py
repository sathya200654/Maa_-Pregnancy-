import sys
sys.stdout.reconfigure(encoding='utf-8')

telugu_for_categories = {
  "All": "అన్నీ",
  "Health": "ఆరోగ్యం",
  "Symptoms": "లక్షణాలు",
  "Food": "ఆహారం",
  "Yoga": "యోగా",
  "Baby": "శిశువు",
  "Nutrition": "పోషకాహారం",
  "Mental Wellness": "మానసిక ఆరోగ్యం",
  "General Pregnancy": "సాధారణ గర్భధారణ",
  "Week-by-Week Pregnancy": "వారం వారీగా గర్భధారణ",
  "Baby Development": "శిశువు అభివృద్ధి",
  "Food & Nutrition": "ఆహారం మరియు పోషణ",
  "Fruits": "పండ్లు",
  "Vegetables": "కూరగాయలు",
  "Indian Foods": "భారతీయ ఆహారాలు",
  "Supplements": "సప్లిమెంట్లు",
  "Vitamins": "విటమిన్లు",
  "Water & Hydration": "నీరు మరియు హైడ్రేషన్",
  "Weight Gain": "బరువు పెరుగుట",
  "Exercise": "వ్యాయామం",
  "Prenatal Yoga": "ప్రసవపూర్వ యోగా",
  "Breathing Exercises": "శ్వాస వ్యాయామాలు",
  "Walking": "నడక",
  "Sleep": "నిద్ర",
  "Body Changes": "శరీర మార్పులు",
  "Skin Changes": "చర్మ మార్పులు",
  "Hair Changes": "జుట్టు మార్పులు",
  "Morning Sickness & Nausea": "మార్నింగ్ సిక్‌నెస్ & వికారం",
  "Common Problems": "సాధారణ సమస్యలు",
  "Diseases": "వ్యాధులు",
  "Pregnancy Complications": "గర్భధారణ సమస్యలు",
  "Infections": "ఇన్‌ఫెక్షన్లు",
  "Mental Health": "మానసిక ఆరోగ్యం",
  "Emotional Wellbeing": "భావోద్వేగ శ్రేయస్సు",
  "Stress": "ఒత్తిడి",
  "Anxiety": "ఆందోళన",
  "Relationships": "సంబంధాలు",
  "Sexual Health": "లైంగిక ఆరోగ్యం",
  "Medical Tests": "వైద్య పరీక్షలు",
  "Scans": "స్కాన్లు",
  "Scans & Tests": "స్కాన్లు మరియు పరీక్షలు",
  "Medicines": "మందులు",
  "Safety": "భద్రత",
  "Travel": "ప్రయాణం",
  "Work": "పని",
  "Emergency Symptoms": "అత్యవసర లక్షణాలు",
  "Labor": "ప్రసవ వేదన",
  "Delivery": "డెలివరీ",
  "Labor & Delivery": "ప్రసవం మరియు డెలివరీ",
  "C-Section": "సి-సెక్షన్",
  "Breastfeeding": "తల్లిపాలు ఇవ్వడం",
  "Postpartum Care": "ప్రసవానంతర సంరక్షణ",
  "Newborn Care": "నవజాత శిశు సంరక్షణ",
  "Parenting Preparation": "తల్లిదండ్రుల సంసిద్ధత"
}

with open('src/services/knowledgeLocalization.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, l in enumerate(lines):
    if 'export const CATEGORY_TRANSLATIONS:' in l:
        start_idx = i
    if start_idx != -1 and 'export const TOPIC_TERMS:' in l:
        end_idx = i
        break

print(f"CATEGORY_TRANSLATIONS range: lines {start_idx+1} to {end_idx+1}")

new_lines = []
current_cat = None
i = 0
added_count = 0

while i < len(lines):
    line = lines[i]
    if start_idx <= i < end_idx:
        # Check if line defines a category: e.g. '  "Health": {' or '  All: {'
        trimmed = line.strip()
        if trimmed.endswith(':{') or trimmed.endswith(': {'):
            cat_k = trimmed.split(':')[0].strip().strip('"').strip("'")
            if cat_k != 'export const CATEGORY_TRANSLATIONS':
                current_cat = cat_k
        
        new_lines.append(line)
        
        # If this is the Malayalam line for current_cat, check if next line is Telugu
        if 'മലയാളം:' in line and current_cat:
            next_line = lines[i+1] if i+1 < len(lines) else ""
            if 'తెలుగు:' not in next_line:
                te_val = telugu_for_categories.get(current_cat, current_cat)
                indent = line[:line.find('മലയാളം:')]
                new_lines.append(f'{indent}తెలుగు: "{te_val}",\n')
                added_count += 1
                print(f"Added Telugu for {current_cat} -> {te_val}")
    else:
        new_lines.append(line)
    i += 1

print(f"Total categories updated with Telugu: {added_count}")

with open('src/services/knowledgeLocalization.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Saved src/services/knowledgeLocalization.ts")
