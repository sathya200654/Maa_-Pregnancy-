# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

file_path = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\src\components\PersonalDiaryModal.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

replacements = [
    # 1. verifyAndAnimateUnlock
    (
        'setPinError("Incorrect password. Please try again.");',
        'setPinError(t("incorrect_password", "Incorrect password. Please try again."));'
    ),
    # 2. handleSetupSubmit errors & alert
    (
        'setSetupError("Please choose a 4-digit passcode.");',
        'setSetupError(t("choose_4digit_passcode", "Please choose a 4-digit passcode."));'
    ),
    (
        'setSetupError("Passcodes do not match.");',
        'setSetupError(t("passcodes_do_not_match", "Passcodes do not match."));'
    ),
    (
        'setSetupError("Please answer the primary school question.");',
        'setSetupError(t("answer_school_question", "Please answer the primary school question."));'
    ),
    (
        'setSetupError("Please answer the childhood nickname question.");',
        'setSetupError(t("answer_nickname_question", "Please answer the childhood nickname question."));'
    ),
    (
        '''      Alert.alert(
        "Diary Protected 🌸",
        "Your secret diary is now password protected with heart key recovery questions."
      );''',
        '''      Alert.alert(
        t("diary_protected_title", "Diary Protected 🌸"),
        t("diary_protected_desc", "Your secret diary is now password protected with heart key recovery questions.")
      );'''
    ),
    (
        'setSetupError("Could not save setup. Please try again.");',
        'setSetupError(t("setup_save_error", "Could not save setup. Please try again."));'
    ),
    # 3. handleVerifyRecovery
    (
        'setRecoveryError("Please answer both questions.");',
        'setRecoveryError(t("answer_both_questions", "Please answer both questions."));'
    ),
    (
        'setRecoveryError("Answers do not match. Please try again.");',
        'setRecoveryError(t("answers_do_not_match", "Answers do not match. Please try again."));'
    ),
    # 4. handleResetPinSubmit
    (
        'setRecoveryError("Please enter a 4-digit passcode.");',
        'setRecoveryError(t("enter_4digit_passcode", "Please enter a 4-digit passcode."));'
    ),
    (
        '''      Alert.alert("Passcode Reset ✨", "You can now unlock with your new passcode.");''',
        '''      Alert.alert(t("passcode_reset_title", "Passcode Reset ✨"), t("passcode_reset_desc", "You can now unlock with your new passcode."));'''
    ),
    (
        'setRecoveryError("Could not reset passcode.");',
        'setRecoveryError(t("reset_passcode_error", "Could not reset passcode."));'
    ),
    # 5. handleSavePage
    (
        '''      Alert.alert("Sealed Page", "Only today's page can be written or modified.");''',
        '''      Alert.alert(t("sealed_page_title", "Sealed Page"), t("sealed_page_desc", "Only today's page can be written or modified."));'''
    ),
    (
        '''      Alert.alert("Save Error", "Could not save your diary page right now.");''',
        '''      Alert.alert(t("save_error_title", "Save Error"), t("save_page_error", "Could not save your diary page right now."));'''
    ),
    # 6. Setup screen UI labels
    (
        '<Text style={styles.setupSectionLabel}>1. CHOOSE A 4-DIGIT PASSCODE</Text>',
        '<Text style={styles.setupSectionLabel}>{t("choose_passcode_step", "1. CHOOSE A 4-DIGIT PASSCODE")}</Text>'
    ),
    (
        'placeholder="4-digit secret PIN"',
        'placeholder={t("secret_pin_placeholder", "4-digit secret PIN")}'
    ),
    (
        'placeholder="Confirm 4-digit PIN"',
        'placeholder={t("confirm_pin_placeholder", "Confirm 4-digit PIN")}'
    ),
    (
        '<Text style={[styles.setupSectionLabel, { marginTop: 14 }]}>\n                2. SECURITY QUESTIONS (FOR RECOVERY)\n              </Text>',
        '<Text style={[styles.setupSectionLabel, { marginTop: 14 }]}>\n                {t("security_questions_step", "2. SECURITY QUESTIONS (FOR RECOVERY)")}\n              </Text>'
    ),
    (
        '<Text style={styles.questionLabel}>What is your primary school name?</Text>',
        '<Text style={styles.questionLabel}>{t("primary_school_question", "What is your primary school name?")}</Text>'
    ),
    (
        'placeholder="e.g. St. Anne\'s Primary School"',
        'placeholder={t("school_placeholder", "e.g. St. Anne\'s Primary School")}'
    ),
    (
        '<Text style={styles.questionLabel}>What is your nickname during your childhood?</Text>',
        '<Text style={styles.questionLabel}>{t("nickname_question", "What is your nickname during your childhood?")}</Text>'
    ),
    (
        'placeholder="e.g. Sweety, Golu, Mimi"',
        'placeholder={t("nickname_placeholder", "e.g. Sweety, Golu, Mimi")}'
    ),
    (
        '<Text style={styles.setupSaveBtnText}>Save & Lock My Diary 🔒</Text>',
        '<Text style={styles.setupSaveBtnText}>{t("save_lock_diary", "Save & Lock My Diary 🔒")}</Text>'
    ),
    (
        '<Text style={styles.cancelBtnText}>Back to Profile</Text>',
        '<Text style={styles.cancelBtnText}>{t("back_to_profile", "Back to Profile")}</Text>'
    ),
    # 7. Book cover texts
    (
        '<Text style={styles.coverEmbossSub}>Vintage Style</Text>',
        '<Text style={styles.coverEmbossSub}>{t("vintage_style", "Vintage Style")}</Text>'
    ),
    (
        '<Text style={styles.coverEmbossMain}>Maa Diary</Text>',
        '<Text style={styles.coverEmbossMain}>{t("maa_diary", "Maa Diary")}</Text>'
    ),
    (
        '<Text style={styles.coverEmbossFooter}>Day 1 to Delivery</Text>',
        '<Text style={styles.coverEmbossFooter}>{t("day_1_to_delivery", "Day 1 to Delivery")}</Text>'
    ),
    # 8. Page Meta
    (
        '''                <Text style={styles.pageMetaText}>
                  Week {dayInfo.weekNumber} • {dayInfo.trimester} (Tap to Jump)
                </Text>''',
        '''                <Text style={styles.pageMetaText}>
                  {t("week_prefix", "Week")} {dayInfo.weekNumber} • {dayInfo.trimester} ({t("tap_to_jump", "Tap to Jump")})
                </Text>'''
    ),
    # 9. Daily Vibe & Moods
    (
        '<Text style={styles.pagePromptLabel}>DAILY VIBE:</Text>',
        '<Text style={styles.pagePromptLabel}>{t("daily_vibe", "DAILY VIBE:")}</Text>'
    ),
    (
        '''                          <Text
                            style={[
                              styles.moodSmallLabel,
                              isSelected && styles.moodSmallLabelActive,
                            ]}
                          >
                            {m.label}
                          </Text>''',
        '''                          <Text
                            style={[
                              styles.moodSmallLabel,
                              isSelected && styles.moodSmallLabelActive,
                            ]}
                          >
                            {t(`mood_${m.id}`, m.label)}
                          </Text>'''
    ),
    # 10. Thoughts section
    (
        '''                    <Text style={styles.linedPromptSub}>
                      Your innermost thoughts, hopes, fears, and letters to your baby
                    </Text>''',
        '''                    <Text style={styles.linedPromptSub}>
                      {t("thoughts_sub", "Your innermost thoughts, hopes, fears, and letters to your baby")}
                    </Text>'''
    ),
    (
        '{currentEntry?.thoughts?.trim() || "(No thoughts recorded on this day.)"}',
        '{currentEntry?.thoughts?.trim() || t("no_thoughts_recorded", "(No thoughts recorded on this day.)")}'
    ),
    # 11. Struggles section
    (
        '''                    <Text style={styles.linedPromptSub}>
                      Morning sickness, backaches, tiredness, mood swings, or worries
                    </Text>''',
        '''                    <Text style={styles.linedPromptSub}>
                      {t("struggles_sub", "Morning sickness, backaches, tiredness, mood swings, or worries")}
                    </Text>'''
    ),
    (
        '{currentEntry?.struggles?.trim() || "(No struggles recorded on this day.)"}',
        '{currentEntry?.struggles?.trim() || t("no_struggles_recorded", "(No struggles recorded on this day.)")}'
    ),
    # 12. Activities section
    (
        '''                    <Text style={styles.linedPromptSub}>
                      Prenatal yoga, baby shopping, doctor scans, family walks, gentle kicks
                    </Text>''',
        '''                    <Text style={styles.linedPromptSub}>
                      {t("activities_sub", "Prenatal yoga, baby shopping, doctor scans, family walks, gentle kicks")}
                    </Text>'''
    ),
    (
        '{currentEntry?.activities?.trim() || "(No activities recorded on this day.)"}',
        '{currentEntry?.activities?.trim() || t("no_activities_recorded", "(No activities recorded on this day.)")}'
    ),
    # 13. Save page & hints
    (
        '<Text style={styles.pageSaveToastText}>Page Saved to Journal! 💖</Text>',
        '<Text style={styles.pageSaveToastText}>{t("page_saved_toast", "Page Saved to Journal! 💖")}</Text>'
    ),
    (
        '''                      <Text style={styles.savePageBtnText}>
                        {isSaving ? "Inscribing Page..." : t("save_diary_page", "Sign & Save Today's Page 💖")}
                      </Text>''',
        '''                      <Text style={styles.savePageBtnText}>
                        {isSaving ? t("inscribing_page", "Inscribing Page...") : t("save_diary_page", "Sign & Save Today's Page 💖")}
                      </Text>'''
    ),
    (
        '''                    <Text style={styles.pageSealHint}>
                      🔒 At midnight, today's entry permanently seals into your pregnancy chronicle.
                    </Text>''',
        '''                    <Text style={styles.pageSealHint}>
                      {t("page_seal_hint", "🔒 At midnight, today's entry permanently seals into your pregnancy chronicle.")}
                    </Text>'''
    ),
    # 14. Archival seal & future page
    (
        '''                    <Text style={styles.archivalSealText}>
                      SEALED KEEPSAKE • DAY {dayInfo.dayNumber} OF PREGNANCY
                    </Text>''',
        '''                    <Text style={styles.archivalSealText}>
                      {t("sealed_keepsake", "SEALED KEEPSAKE")} • {t("day_prefix", "DAY")} {dayInfo.dayNumber} {t("of_280", "OF 280")}
                    </Text>'''
    ),
    (
        '''                    <Text style={styles.archivalSealSub}>
                      Preserved in your private archives. Authentic moments cannot be rewritten.
                    </Text>''',
        '''                    <Text style={styles.archivalSealSub}>
                      {t("sealed_keepsake_sub", "Preserved in your private archives. Authentic moments cannot be rewritten.")}
                    </Text>'''
    ),
    (
        '<Text style={styles.futurePageTitle}>This Page Awaits You</Text>',
        '<Text style={styles.futurePageTitle}>{t("page_awaits_you", "This Page Awaits You")}</Text>'
    ),
    (
        '''                    <Text style={styles.futurePageSub}>
                      Take deep breaths and rest today, mama. This page unlocks on {dayInfo.displayDate}.
                    </Text>''',
        '''                    <Text style={styles.futurePageSub}>
                      {t("future_page_sub_prefix", "Take deep breaths and rest today, mama. This page unlocks on")} {dayInfo.displayDate}.
                    </Text>'''
    ),
    # 15. Forgot modal
    (
        '''                <Text style={styles.recoveryTitle}>
                  {recoveryStep === "questions" ? "Heart Key Recovery" : "New Secret Passcode"}
                </Text>''',
        '''                <Text style={styles.recoveryTitle}>
                  {recoveryStep === "questions" ? t("heart_key_recovery", "Heart Key Recovery") : t("new_secret_passcode", "New Secret Passcode")}
                </Text>'''
    ),
    (
        '''                  <Text style={styles.recoveryDesc}>
                    Answer your two security questions to unlock and reset your passcode:
                  </Text>''',
        '''                  <Text style={styles.recoveryDesc}>
                    {t("recovery_desc", "Answer your two security questions to unlock and reset your passcode:")}
                  </Text>'''
    ),
    (
        '<Text style={styles.recoveryQuestion}>1. What is your primary school name?</Text>',
        '<Text style={styles.recoveryQuestion}>{t("recovery_q1", "1. What is your primary school name?")}</Text>'
    ),
    (
        'placeholder="Enter school name"',
        'placeholder={t("school_name_placeholder", "Enter school name")}'
    ),
    (
        '<Text style={styles.recoveryQuestion}>2. What is your nickname during your childhood?</Text>',
        '<Text style={styles.recoveryQuestion}>{t("recovery_q2", "2. What is your nickname during your childhood?")}</Text>'
    ),
    (
        'placeholder="Enter childhood nickname"',
        'placeholder={t("nickname_name_placeholder", "Enter childhood nickname")}'
    ),
    (
        '<Text style={styles.setupSaveBtnText}>Verify Answers</Text>',
        '<Text style={styles.setupSaveBtnText}>{t("verify_answers", "Verify Answers")}</Text>'
    ),
    (
        '''                  <Text style={styles.recoveryDesc}>
                    Identity verified! Choose a new 4-digit passcode for your diary.
                  </Text>''',
        '''                  <Text style={styles.recoveryDesc}>
                    {t("identity_verified", "Identity verified! Choose a new 4-digit passcode for your diary.")}
                  </Text>'''
    ),
    (
        'placeholder="New 4-digit PIN"',
        'placeholder={t("new_pin_placeholder", "New 4-digit PIN")}'
    ),
    (
        'placeholder="Confirm new 4-digit PIN"',
        'placeholder={t("confirm_new_pin_placeholder", "Confirm new 4-digit PIN")}'
    ),
    (
        '<Text style={styles.setupSaveBtnText}>Save New Passcode</Text>',
        '<Text style={styles.setupSaveBtnText}>{t("save_new_passcode", "Save New Passcode")}</Text>'
    ),
    # 16. Jump day modal
    (
        '<Text style={styles.jumpTitle}>Jump to Pregnancy Day</Text>',
        '<Text style={styles.jumpTitle}>{t("jump_to_day_title", "Jump to Pregnancy Day")}</Text>'
    ),
    (
        '''              <Text style={styles.jumpSubtitle}>
                Enter any day from Day 1 (Conception) to Day 280 (End of labor):
              </Text>''',
        '''              <Text style={styles.jumpSubtitle}>
                {t("jump_to_day_desc", "Enter any day from Day 1 (Conception) to Day 280 (End of labor):")}
              </Text>'''
    ),
    (
        '<Text style={styles.jumpCancelText}>Cancel</Text>',
        '<Text style={styles.jumpCancelText}>{t("cancel", "Cancel")}</Text>'
    ),
    (
        '''                      Alert.alert("Invalid Day", "Please enter a day between 1 and 280.");''',
        '''                      Alert.alert(
                        t("invalid_day_title", "Invalid Day"),
                        t("invalid_day_desc", "Please enter a day between 1 and 280.")
                      );'''
    ),
    (
        '<Text style={styles.jumpSubmitText}>Turn to Day</Text>',
        '<Text style={styles.jumpSubmitText}>{t("turn_to_day", "Turn to Day")}</Text>'
    ),
]

success = 0
for old, new in replacements:
    if old in code:
        code = code.replace(old, new)
        success += 1
    else:
        print(f"FAILED to find: {old[:50]}")

print(f"Successfully applied {success}/{len(replacements)} replacements.")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Saved updated PersonalDiaryModal.tsx successfully!")
