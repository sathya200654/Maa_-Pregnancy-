with open('src/data/translations.ts', 'r', encoding='utf-8') as f:
    text = f.read()

keys = [
    'pregnancy_tracker', 'baby_development', 'tab_yoga', 'nutrition',
    'symptoms', 'appointments', 'tab_health', 'chatbot',
    'daily_medications', 'today_schedule', 'no_meds_scheduled',
    'chat_search_placeholder', 'chat_faq_title', 'chat_topics', 'chat_tap_explore',
    'chat_header_title', 'chat_header_subtitle', 'chat_badge',
    'due_date_short', 'lmp_short', 'quick_actions', 'prenatal_doctor',
    'tap_to_schedule_visit', 'baby_growing_beautifully', 'days_to_go',
    'kicks_label', 'kick_counter', 'track_baby_movement', 'track_journey_desc',
    'pregnancy_insight', 'daily_inspiration'
]

for k in keys:
    count = text.count(f'"{k}":')
    print(f'{k}: {count}')
