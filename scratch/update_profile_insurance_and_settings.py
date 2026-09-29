# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

profile_path = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\app\(tabs)\profile.tsx"

with open(profile_path, "r", encoding="utf-8") as f:
    code = f.read()

replacements = [
    # Insurance & claims hub title & subtitle
    (
        '<Text style={styles.sectionTitle}>INSURANCE & CLAIMS HUB</Text>',
        '<Text style={styles.sectionTitle}>{t("insurance_claims_hub", "INSURANCE & CLAIMS HUB")}</Text>'
    ),
    (
        '<Text style={styles.featureSubtitle}>Store policy details, estimate coverage, and track claim submissions.</Text>',
        '<Text style={styles.featureSubtitle}>{t("insurance_subtitle", "Store policy details, estimate coverage, and track claim submissions.")}</Text>'
    ),
    (
        'placeholder="Provider"',
        'placeholder={t("provider", "Provider")}'
    ),
    (
        'placeholder="Policy number"',
        'placeholder={t("policy_number", "Policy number")}'
    ),
    (
        'placeholder="Coverage %"',
        'placeholder={t("coverage_percent", "Coverage %")}'
    ),
    (
        'placeholder="Renewal YYYY-MM-DD"',
        'placeholder={t("renewal_date_placeholder", "Renewal YYYY-MM-DD")}'
    ),
    (
        'placeholder="Deductible"',
        'placeholder={t("deductible", "Deductible")}'
    ),
    (
        'placeholder="Out-of-pocket"',
        'placeholder={t("out_of_pocket", "Out-of-pocket")}'
    ),
    (
        'placeholder="Maternity cover limit"',
        'placeholder={t("maternity_cover_limit", "Maternity cover limit")}'
    ),
    (
        '<Text style={styles.primaryActionText}>Save Policy</Text>',
        '<Text style={styles.primaryActionText}>{t("save_policy", "Save Policy")}</Text>'
    ),
    (
        '<Text style={styles.estimatorTitle}>Coverage Estimator</Text>',
        '<Text style={styles.estimatorTitle}>{t("coverage_estimator", "Coverage Estimator")}</Text>'
    ),
    (
        'placeholder="Expected maternity expense"',
        'placeholder={t("expected_maternity_expense", "Expected maternity expense")}'
    ),
    (
        '<Text style={styles.estimatorLine}>Estimated covered: {cappedCovered.toFixed(0)}</Text>',
        '<Text style={styles.estimatorLine}>{t("estimated_covered", "Estimated covered")}: {cappedCovered.toFixed(0)}</Text>'
    ),
    (
        '<Text style={styles.estimatorLine}>Estimated out-of-pocket: {outOfPocketEstimate.toFixed(0)}</Text>',
        '<Text style={styles.estimatorLine}>{t("estimated_out_of_pocket", "Estimated out-of-pocket")}: {outOfPocketEstimate.toFixed(0)}</Text>'
    ),
    (
        '<Text style={styles.estimatorHint}>Applies your stored coverage percent and maternity cap.</Text>',
        '<Text style={styles.estimatorHint}>{t("estimator_hint", "Applies your stored coverage percent and maternity cap.")}</Text>'
    ),
    (
        '<Text style={styles.claimTitle}>Claims</Text>',
        '<Text style={styles.claimTitle}>{t("claims_title", "Claims")}</Text>'
    ),
    (
        'placeholder="Claim title"',
        'placeholder={t("claim_title", "Claim title")}'
    ),
    (
        '<Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>{status.replace("_", " ")}</Text>',
        '<Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>{t(`claim_status_${status}`, status.replace("_", " "))}</Text>'
    ),
    (
        'placeholder="Estimated amount"',
        'placeholder={t("estimated_amount", "Estimated amount")}'
    ),
    (
        'placeholder="Deadline YYYY-MM-DD"',
        'placeholder={t("submission_deadline", "Deadline YYYY-MM-DD")}'
    ),
    (
        'placeholder="Claim notes"',
        'placeholder={t("claim_notes", "Claim notes")}'
    ),
    (
        '<Text style={styles.primaryActionText}>Save Claim</Text>',
        '<Text style={styles.primaryActionText}>{t("save_claim", "Save Claim")}</Text>'
    ),
    (
        '<Text style={styles.claimEmptyText}>No claims yet.</Text>',
        '<Text style={styles.claimEmptyText}>{t("no_claims_yet", "No claims yet.")}</Text>'
    ),
    (
        '<Text style={styles.claimStatusText}>{claim.status.replace("_", " ")}</Text>',
        '<Text style={styles.claimStatusText}>{t(`claim_status_${claim.status}`, claim.status.replace("_", " "))}</Text>'
    ),
    (
        '<Text style={styles.claimItemMeta}>Amount: {claim.estimated_amount ?? "--"}</Text>',
        '<Text style={styles.claimItemMeta}>{t("amount_label", "Amount")}: {claim.estimated_amount ?? "--"}</Text>'
    ),
    (
        '<Text style={styles.claimItemMeta}>Deadline: {claim.submission_deadline ?? "--"}</Text>',
        '<Text style={styles.claimItemMeta}>{t("deadline_label", "Deadline")}: {claim.submission_deadline ?? "--"}</Text>'
    ),
    (
        '{dueIn >= 0 ? `Reminder: due in ${dueIn} day(s)` : `Reminder: overdue by ${Math.abs(dueIn)} day(s)`}',
        '{dueIn >= 0 ? `${t("reminder_due_in", "Reminder: due in")} ${dueIn} ${t("days_label", "day(s)")}` : `${t("reminder_overdue_by", "Reminder: overdue by")} ${Math.abs(dueIn)} ${t("days_label", "day(s)")}`}'
    ),
    (
        '<Text style={styles.secondaryActionText}>Upload Document</Text>',
        '<Text style={styles.secondaryActionText}>{t("upload_document", "Upload Document")}</Text>'
    ),
    (
        '<Text style={styles.docEmptyText}>No documents attached.</Text>',
        '<Text style={styles.docEmptyText}>{t("no_documents_attached", "No documents attached.")}</Text>'
    ),
    # Edit profile settings modal
    (
        '<Text style={styles.modalHeaderTitle}>Edit Profile Settings</Text>',
        '<Text style={styles.modalHeaderTitle}>{t("edit_profile_settings", "Edit Profile Settings")}</Text>'
    ),
    (
        '<Text style={styles.closeText}>Cancel</Text>',
        '<Text style={styles.closeText}>{t("cancel", "Cancel")}</Text>'
    ),
    (
        '<Text style={styles.modalLabel}>First Name *</Text>',
        '<Text style={styles.modalLabel}>{t("first_name_required", "First Name *")}</Text>'
    ),
    (
        'placeholder="e.g. Priya"',
        'placeholder={t("first_name_placeholder", "e.g. Priya")}'
    ),
    (
        '<Text style={styles.modalLabel}>Due Date (YYYY-MM-DD) *</Text>',
        '<Text style={styles.modalLabel}>{t("due_date_required", "Due Date (YYYY-MM-DD) *")}</Text>'
    ),
    (
        ': "Select due date"}',
        ': t("select_due_date", "Select due date")}'
    ),
    (
        '<Text style={styles.pickerDoneText}>Done</Text>',
        '<Text style={styles.pickerDoneText}>{t("done", "Done")}</Text>'
    ),
    (
        '<Text style={styles.modalLabel}>Blood Type (Optional)</Text>',
        '<Text style={styles.modalLabel}>{t("blood_type_label", "Blood Type (Optional)")}</Text>'
    ),
    (
        '<Text style={styles.modalLabel}>Doctor Name (Optional)</Text>',
        '<Text style={styles.modalLabel}>{t("doctor_name_label", "Doctor Name (Optional)")}</Text>'
    ),
    (
        '<Text style={styles.modalLabel}>Doctor Phone (Optional)</Text>',
        '<Text style={styles.modalLabel}>{t("doctor_phone_label", "Doctor Phone (Optional)")}</Text>'
    ),
    (
        '<Text style={styles.modalLabel}>Preferred Voice (Optional)</Text>',
        '<Text style={styles.modalLabel}>{t("preferred_voice_label", "Preferred Voice (Optional)")}</Text>'
    ),
    (
        '<Text style={styles.modalSaveBtnText}>Save Settings</Text>',
        '<Text style={styles.modalSaveBtnText}>{t("save_settings", "Save Settings")}</Text>'
    ),
    # Sign out alert
    (
        '''    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out? Your offline logs will be saved on this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/(onboarding)");
          },
        },
      ]
    );''',
        '''    Alert.alert(
      t("sign_out", "Sign Out"),
      t("sign_out_confirm", "Are you sure you want to sign out? Your offline logs will be saved on this device."),
      [
        { text: t("cancel", "Cancel"), style: "cancel" },
        {
          text: t("sign_out", "Sign Out"),
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/(onboarding)");
          },
        },
      ]
    );'''
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

with open(profile_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Saved updated profile.tsx successfully!")
