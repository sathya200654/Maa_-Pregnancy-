# -*- coding: utf-8 -*-
import re

trans_file = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\data\translations.ts"

with open(trans_file, "r", encoding="utf-8") as f:
    content = f.read()

# find english dictionary keys
en_match = re.search(r'"English":\s*\{([^}]+)\}', content, re.DOTALL)
if en_match:
    en_body = en_match.group(1)
    keys = re.findall(r'(\w+):\s*"', en_body)
    print(f"Found {len(keys)} English keys")
else:
    # Alternative format
    keys = re.findall(r'(\w+):\s*"', content[:20000])
    print(f"Sample keys found: {len(keys)}")

candidate_keys = [
    "choose_passcode_step", "secret_pin_placeholder", "confirm_pin_placeholder",
    "security_questions_step", "primary_school_question", "school_placeholder",
    "nickname_question", "nickname_placeholder", "save_lock_diary", "back_to_profile",
    "vintage_style", "maa_diary", "day_1_to_delivery", "tap_to_jump",
    "daily_vibe", "mood_happy", "mood_glowing", "mood_peaceful", "mood_tired",
    "mood_emotional", "mood_anxious", "thoughts_sub", "no_thoughts_recorded",
    "struggles_sub", "no_struggles_recorded", "activities_sub", "no_activities_recorded",
    "page_saved_toast", "inscribing_page", "page_seal_hint", "sealed_keepsake",
    "sealed_keepsake_sub", "page_awaits_you", "future_page_sub_prefix",
    "heart_key_recovery", "new_secret_passcode", "recovery_desc", "recovery_q1",
    "school_name_placeholder", "recovery_q2", "nickname_name_placeholder",
    "verify_answers", "identity_verified", "new_pin_placeholder",
    "confirm_new_pin_placeholder", "save_new_passcode", "jump_to_day_title",
    "jump_to_day_desc", "turn_to_day", "incorrect_password", "choose_4digit_passcode",
    "passcodes_do_not_match", "answer_school_question", "answer_nickname_question",
    "diary_protected_title", "diary_protected_desc", "setup_save_error",
    "answer_both_questions", "answers_do_not_match", "enter_4digit_passcode",
    "passcode_reset_title", "passcode_reset_desc", "reset_passcode_error",
    "sealed_page_title", "sealed_page_desc", "save_page_error", "invalid_day_title",
    "invalid_day_desc"
]

missing = [k for k in candidate_keys if f'{k}:' not in content]
print(f"Missing keys: {len(missing)} out of {len(candidate_keys)}")
print("Missing list:", missing)
