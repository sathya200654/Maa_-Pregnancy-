# -*- coding: utf-8 -*-
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append('.')

from scratch.te_base import te_base
from scratch.new_keys_all_langs import NEW_KEYS

ts_file = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\translations.ts"

with open(ts_file, "r", encoding="utf-8") as f:
    orig_content = f.read()

def extract_lang_dict(content, lang_name):
    pos = content.find(f'"{lang_name}":')
    if pos == -1:
        return {}
    brace_pos = content.find('{', pos)
    depth = 0
    end_brace = -1
    for i in range(brace_pos, len(content)):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                end_brace = i
                break
    block = content[brace_pos+1:end_brace]
    matches = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"', block)
    return {k: v.replace('\\"', '"') for k, v in matches}

en_dict = extract_lang_dict(orig_content, "English")
ta_dict = extract_lang_dict(orig_content, "தமிழ்")
hi_dict = extract_lang_dict(orig_content, "हिन्दी")
kn_dict = extract_lang_dict(orig_content, "ಕನ್ನಡ")
mr_dict = extract_lang_dict(orig_content, "मराठी")
ml_dict = extract_lang_dict(orig_content, "മലയാളം")

# Load missing te
with open(r"scratch\missing_te.json", "r", encoding="utf-8") as f:
    missing_te = json.load(f)

# Translated missing_te
te_missing_translated = {
  "change_photo": "ఫోటో మార్చండి",
  "choose_avatar": "అవతార్‌ను ఎంచుకోండి",
  "appointments_title": "అపాయింట్‌మెంట్లు & సందర్శనలు",
  "appointments_subtitle": "మీ డాక్టర్ సందర్శనలు మరియు వైద్య రిమైండర్‌లను నిర్వహించండి",
  "add_appointment": "అపాయింట్‌మెంట్ జోడించండి",
  "no_appointments_scheduled": "ఇంకా రాబోయే అపాయింట్‌మెంట్లు షెడ్యూల్ చేయలేదు.",
  "open_for_writing": "ఈనాటి పేజీ — రాయడానికి & ఆలోచించడానికి తెరవబడింది",
  "daily_tablets": "రోజువారీ మందులు",
  "done": "పూర్తయింది",
  "mark_done": "పూర్తయినట్లు గుర్తించండి",
  "done_caps": "పూర్తయింది",
  "no_tablet_reminders": "ఇంకా టాబ్లెట్ రిమైండర్‌లు లేవు",
  "add_first_medication": "మీ మొదటి మందుల షెడ్యూల్‌ను జోడించడానికి + నొక్కండి.",
  "upcoming_schedule": "రాబోయే షెడ్యూల్",
  "no_upcoming_visits_scheduled": "రాబోయే సందర్శనలు ఏవీ షెడ్యూల్ చేయలేదు",
  "tap_add_appointment": "మీ తదుపరి అపాయింట్‌మెంట్‌ను జోడించడానికి + నొక్కండి.",
  "add_tablet": "టాబ్లెట్ జోడించండి",
  "edit_tablet": "టాబ్లెట్ సవరించండి",
  "set_medication_schedule": "మీ మందుల షెడ్యూల్‌ను సెట్ చేయండి",
  "medication_name": "మందు పేరు",
  "medication_placeholder": "ఉదా. ఐరన్ టాబ్లెట్",
  "time": "సమయం",
  "dosage": "మోతాదు",
  "after_food": "భోజనం తర్వాత",
  "before_food": "భోజనానికి ముందు",
  "one_tablet": "1 టాబ్లెట్",
  "update_reminder": "రిమైండర్‌ను నవీకరించండి",
  "new_visit": "కొత్త సందర్శన",
  "edit_visit": "సందర్శనను సవరించండి",
  "schedule_next_checkup": "మీ తదుపరి చెకప్‌ను షెడ్యూల్ చేయండి",
  "reason_for_visit": "సందర్శన కారణం",
  "visit_placeholder": "ఉదా. అల్ట్రాసౌండ్ స్కాన్",
  "date": "తేదీ",
  "lead_reminder": "ముందస్తు రిమైండర్",
  "confirm_appointment": "అపాయింట్‌మెంట్‌ను నిర్ధారించండి",
  "at_appointment_time": "అపాయింట్‌మెంట్ సమయంలో",
  "one_day_before": "1 రోజు ముందు",
  "two_days_before": "2 రోజుల ముందు",
  "baby_blueberry": "బ్లూబెర్రీ",
  "baby_lime": "నిమ్మకాయ",
  "baby_avocado": "అవకాడో",
  "baby_banana": "అరటిపండు",
  "baby_corn": "మొక్కజొన్న",
  "baby_eggplant": "వంకాయ",
  "baby_pineapple": "అనాసపండు",
  "baby_papaya": "బొప్పాయి",
  "baby_pumpkin": "గుమ్మడికాయ",
  "baby_watermelon": "పుచ్చకాయ",
  "articles_header_title": "గర్భధారణ వనరులు",
  "articles_header_subtitle": "నిపుణులచే ధృవీకరించబడిన సురక్షితమైన వ్యాసాలు.",
  "source_label": "మూలం",
  "tag_nutrition": "పోషకాహారం",
  "tag_wellness": "ఆరోగ్యం",
  "tag_development": "అభివృద్ధి",
  "tag_mental_health": "మానసిక ఆరోగ్యం",
  "tag_postpartum": "ప్రసవానంతర",
  "tag_recovery": "కోలుకోవడం",
  "min_read_suffix": "నిమిషాల పఠనం",
  "step_label": "దశ",
  "reps_label": "పునరావృత్తులు",
  "start": "ప్రారంభించండి",
  "pause": "పాజ్ చేయండి",
  "completed": "పూర్తయింది",
  "add_rep": "+ పునరావృతం జోడించండి",
  "reset": "రీసెట్",
  "voice": "వాయిస్",
  "next_pose": "తదుపరి ఆసనం",
  "track_baby_movements": "బిడ్డ కదలికలను ట్రాక్ చేయండి",
  "resets_at_midnight": "ప్రతిరోజూ అర్ధరాత్రి 12:00 గంటలకు రీసెట్ అవుతుంది",
  "record_a_kick": "కిక్‌ను రికార్డ్ చేయండి",
  "no_symptoms_tracked": "ఇంకా లక్షణాలు ట్రాక్ చేయలేదు",
  "todays_journal_entries": "ఈనాటి జర్నల్ ఎంట్రీలు",
  "logged_label": "నమోదు చేయబడింది",
  "logged_today": "ఈరోజు నమోదు చేయబడింది",
  "track_how_feeling": "మీరు ఎలా భావిస్తున్నారో ట్రాక్ చేయండి",
  "severity_label": "తీవ్రత",
  "date_label": "తేదీ",
  "notes_label": "గమనికలు",
  "notes_placeholder": "ఏవైనా కారణాలు, వ్యవధి లేదా వివరాలు...",
  "save_log": "లాగ్‌ను సేవ్ చేయండి",
  "chat_badge": "600+ ముందస్తు సమాధానాలు",
  "chat_welcome_title": "ఇంటరాక్టివ్ గర్భధారణ మార్గదర్శి",
  "chat_welcome_desc": "క్రింద ఉన్న ప్రశ్నను ఎంచుకోండి లేదా శోధన పట్టీలో టైప్ చేయండి. నిర్దిష్ట వైద్య సలహా కోసం ఎంపికలను నొక్కండి.",
  "chat_decision_mode": "నిర్ణయ పద్ధతి: ధృవీకరించబడిన సమాధానాలు మరియు దశలవారీ ఎంపికలను పొందడానికి ప్రశ్నలను నొక్కండి.",
  "chat_faq_title": "తరచుగా అడిగే ప్రశ్నలు",
  "chat_topics": "విషయాలు",
  "chat_tap_explore": "ఎంపికలను చూడటానికి నొక్కండి",
  "chat_caution_title": "తక్షణ వైద్య హెచ్చరిక",
  "chat_caution_body": "తీవ్ర రక్తస్రావం, తీవ్ర కడుపు నొప్పి, శ్వాస తీసుకోవడంలో ఇబ్బంది లేదా బిడ్డ కదలికలు తగ్గితే వెంటనే అత్యవసర చికిత్స పొందండి.",
  "chat_call_108": "108 అత్యవసర కాల్ చేయండి",
  "chat_drill_down": "వివరాల కోసం తదుపరి ఎంపికను నొక్కండి:",
  "chat_related": "సంబంధిత ప్రశ్నలు:",
  "chat_search_another": "మరొక విషయాన్ని శోధించండి",
  "chat_start_fresh_title": "కొత్తగా ప్రారంభించాలా?",
  "chat_start_fresh_body": "ప్రస్తుత సంభాషణను క్లియర్ చేసి కొత్త గర్భధారణ ప్రశ్నలను చూడాలా?",
  "chat_start_fresh_btn": "కొత్తగా ప్రారంభించండి",
  "chat_interactive_followups": "ఇంటరాక్టివ్ తదుపరి ప్రశ్నలు",
  "chat_found_questions": "లభ్యమైన ప్రశ్నలు"
}

te_dict = dict(te_base)
te_dict.update(te_missing_translated)

all_dicts = {
    "English": en_dict,
    "தமிழ்": ta_dict,
    "हिन्दी": hi_dict,
    "ಕನ್ನಡ": kn_dict,
    "मराठी": mr_dict,
    "മലയാളം": ml_dict,
    "తెలుగు": te_dict,
}

# Apply all NEW_KEYS to all dictionaries
for key, lang_map in NEW_KEYS.items():
    for lang in all_dicts:
        if lang in lang_map:
            all_dicts[lang][key] = lang_map[lang]
        else:
            print(f"Warning: {lang} missing in NEW_KEYS for {key}")

# Ensure every key in English is in every other language
en_all_keys = set(all_dicts["English"].keys())
for lang, d in all_dicts.items():
    missing = en_all_keys - set(d.keys())
    if missing:
        print(f"Warning: {lang} missing {len(missing)} keys from English: {missing}")
        for m in missing:
            d[m] = all_dicts["English"][m]

print("Final Key Counts:")
for lang, d in all_dicts.items():
    print(f"  {lang}: {len(d)} keys")

# Generate TypeScript code
ordered_langs = ["English", "தமிழ்", "हिन्दी", "ಕನ್ನಡ", "मराठी", "മലയാളം", "తెలుగు"]

out = []
out.append('export type SupportedLanguage = "English" | "தமிழ்" | "हिन्दी" | "ಕನ್ನಡ" | "मराठी" | "മലയാളം" | "తెలుగు";\n')
out.append('export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [')
for l in ordered_langs:
    out.append(f'  "{l}",')
out.append('];\n')
out.append('export const translations: Record<SupportedLanguage, Record<string, string>> = {')

for l in ordered_langs:
    out.append(f'  "{l}": {{')
    d = all_dicts[l]
    for k in sorted(d.keys()):
        val = d[k].replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
        out.append(f'    "{k}": "{val}",')
    out.append('  },')

out.append('};\n')

new_ts_content = '\n'.join(out)

with open(ts_file, "w", encoding="utf-8") as f:
    f.write(new_ts_content)

print(f"Successfully wrote updated translations.ts ({len(new_ts_content)} bytes)")
