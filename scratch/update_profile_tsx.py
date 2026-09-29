# -*- coding: utf-8 -*-
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

profile_path = r"C:\Users\abcsa\OneDrive\Desktop\MAA_Mobile_App_Updated\Users\Admin\Downloads\MAA_Mobile_App-main\MAA_Mobile_App-main\app\(tabs)\profile.tsx"

with open(profile_path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Update milestones definition
old_milestones = """const milestones = [
  { title: "First Ultrasound", week: "WEEK 12", weekNum: 12 },
  { title: "Anatomy Scan", week: "WEEK 20", weekNum: 20 },
  { title: "Glucose Test", week: "WEEK 24", weekNum: 24 },
  { title: "Third Trimester", week: "WEEK 28", weekNum: 28 },
] as const;"""

new_milestones = """const milestones = [
  { key: "milestone_ultrasound", title: "First Ultrasound", weekNum: 12 },
  { key: "milestone_anatomy", title: "Anatomy Scan", weekNum: 20 },
  { key: "milestone_glucose", title: "Glucose Test", weekNum: 24 },
  { key: "milestone_third_trimester", title: "Third Trimester", weekNum: 28 },
] as const;"""

if old_milestones in code:
    code = code.replace(old_milestones, new_milestones)
    print("1. Replaced milestones definition")
else:
    print("1. Could not find old milestones")

# 2. Update currentTrimesterRange
old_trange = """  const currentTrimesterRange = useMemo(() => {
    if (week <= 13) return "WEEK 1 - 13";
    if (week <= 27) return "WEEK 14 - 27";
    return "WEEK 28 - 40";
  }, [week]);"""

new_trange = """  const currentTrimesterRange = useMemo(() => {
    const wp = t("week_prefix", "WEEK");
    if (week <= 13) return `${wp} 1 - 13`;
    if (week <= 27) return `${wp} 14 - 27`;
    return `${wp} 28 - 40`;
  }, [week, t]);"""

if old_trange in code:
    code = code.replace(old_trange, new_trange)
    print("2. Replaced currentTrimesterRange")
else:
    print("2. Could not find old currentTrimesterRange")

# 3. Update milestones render
old_ms_render = """        <View style={styles.timelineWrap}>
          {milestones.map((item, idx) => {
            const isCompleted = week >= item.weekNum;
            return (
              <View key={item.title} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, isCompleted && styles.timelineDotCompleted]}>
                    {isCompleted ? <CheckCircle2 size={10} color="#FFF" /> : null}
                  </View>
                  {idx < milestones.length - 1 ? (
                    <View style={[styles.timelineLine, isCompleted && styles.timelineLineCompleted]} />
                  ) : null}
                </View>
                <View>
                  <Text style={[styles.timelineTitle, isCompleted && styles.timelineTitleCompleted]}>
                    {item.title} {isCompleted ? " ✓" : ""}
                  </Text>
                  <Text style={styles.timelineWeek}>{item.week}</Text>
                </View>
              </View>
            );
          })}
        </View>"""

new_ms_render = """        <View style={styles.timelineWrap}>
          {milestones.map((item, idx) => {
            const isCompleted = week >= item.weekNum;
            const itemTitle = t(item.key, item.title);
            const weekText = `${t("week_prefix", "WEEK")} ${item.weekNum}`;
            return (
              <View key={item.key} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, isCompleted && styles.timelineDotCompleted]}>
                    {isCompleted ? <CheckCircle2 size={10} color="#FFF" /> : null}
                  </View>
                  {idx < milestones.length - 1 ? (
                    <View style={[styles.timelineLine, isCompleted && styles.timelineLineCompleted]} />
                  ) : null}
                </View>
                <View>
                  <Text style={[styles.timelineTitle, isCompleted && styles.timelineTitleCompleted]}>
                    {itemTitle} {isCompleted ? " ✓" : ""}
                  </Text>
                  <Text style={styles.timelineWeek}>{weekText}</Text>
                </View>
              </View>
            );
          })}
        </View>"""

if old_ms_render in code:
    code = code.replace(old_ms_render, new_ms_render)
    print("3. Replaced milestones render")
else:
    print("3. Could not find old milestones render")

# 4. Update Personal Diary Card
old_diary_card = """      {/* Pink-Themed Personal Pregnancy Diary Card */}
      <View style={styles.diarySectionHead}>
        <View style={styles.diaryHeadLeft}>
          <Sparkles size={14} color="#E91E63" />
          <Text style={styles.diarySectionTitle}>PERSONAL DIARY</Text>
        </View>
        <View style={styles.privateBadge}>
          <Lock size={11} color="#C2185B" />
          <Text style={styles.privateBadgeText}>PRIVATE & LOCKED</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.diaryCard}
        onPress={() => setIsDiaryOpen(true)}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel="Open personal pregnancy diary"
      >
        <View style={styles.diaryCardLeft}>
          <View style={styles.diaryIconWrap}>
            <Heart size={26} color="#C2185B" fill="#F48FB1" />
            <View style={styles.miniPadlockBadge}>
              <Lock size={10} color="#D4AF37" />
            </View>
          </View>
        </View>

        <View style={styles.diaryCardContent}>
          <Text style={styles.diaryCardTitle}>Secret Pregnancy Journal</Text>
          <Text style={styles.diaryCardSubtitle}>
            Pink vintage diary with heart key lock. Record your thoughts, struggles & activities from Day 1 to labor.
          </Text>
          <View style={styles.diaryCardFooter}>
            <View style={styles.diaryFooterPill}>
              <Text style={styles.diaryCardTag}>🌸 Day 1 to 280 • Daily Sealed Records</Text>
            </View>
          </View>
        </View>

        <View style={styles.diaryCardArrow}>
          <ChevronRight size={22} color="#C2185B" />
        </View>
      </TouchableOpacity>"""

new_diary_card = """      {/* Pink-Themed Personal Pregnancy Diary Card */}
      <View style={styles.diarySectionHead}>
        <View style={styles.diaryHeadLeft}>
          <Sparkles size={14} color="#E91E63" />
          <Text style={styles.diarySectionTitle}>{t("personal_diary", "PERSONAL DIARY")}</Text>
        </View>
        <View style={styles.privateBadge}>
          <Lock size={11} color="#C2185B" />
          <Text style={styles.privateBadgeText}>{t("private_locked", "PRIVATE & LOCKED")}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.diaryCard}
        onPress={() => setIsDiaryOpen(true)}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel="Open personal pregnancy diary"
      >
        <View style={styles.diaryCardLeft}>
          <View style={styles.diaryIconWrap}>
            <Heart size={26} color="#C2185B" fill="#F48FB1" />
            <View style={styles.miniPadlockBadge}>
              <Lock size={10} color="#D4AF37" />
            </View>
          </View>
        </View>

        <View style={styles.diaryCardContent}>
          <Text style={styles.diaryCardTitle}>{t("secret_pregnancy_journal", "Secret Pregnancy Journal")}</Text>
          <Text style={styles.diaryCardSubtitle}>
            {t("secret_journal_subtitle", "Pink vintage diary with heart key lock. Record your thoughts, struggles & activities from Day 1 to labor.")}
          </Text>
          <View style={styles.diaryCardFooter}>
            <View style={styles.diaryFooterPill}>
              <Text style={styles.diaryCardTag}>🌸 {t("day_prefix", "Day")} 1 {t("to", "to")} 280 • {t("daily_sealed_records", "Daily Sealed Records")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.diaryCardArrow}>
          <ChevronRight size={22} color="#C2185B" />
        </View>
      </TouchableOpacity>"""

if old_diary_card in code:
    code = code.replace(old_diary_card, new_diary_card)
    print("4. Replaced diary card")
else:
    print("4. Could not find old diary card")

# 5. Update Clinician Share Report Section
old_clinician = """      <View style={styles.dropdownWrap}>
        <TouchableOpacity style={styles.dropdownHeader} onPress={() => setIsClinicianOpen((prev) => !prev)}>
          <View style={styles.featureHeadLeft}>
            <View style={styles.featureHeadIconWrap}>
              <FileText size={14} color={colors.brand} />
            </View>
            <Text style={styles.sectionTitle}>CLINICIAN SHARE REPORT</Text>
          </View>
          {isClinicianOpen ? <ChevronUp size={16} color="#7E8FAF" /> : <ChevronDown size={16} color="#7E8FAF" />}
        </TouchableOpacity>

        {isClinicianOpen ? (
          <View style={styles.featureCard}>
            <Text style={styles.featureSubtitle}>Prepare and share a concise report before appointments.</Text>

            <View style={styles.vitalsRow}>
              <TextInput
                value={reportDraft.bpSystolic}
                onChangeText={(value) => setReportDraft((prev) => ({ ...prev, bpSystolic: value }))}
                placeholder="BP SYS"
                keyboardType="numeric"
                style={styles.vitalsInput}
              />
              <TextInput
                value={reportDraft.bpDiastolic}
                onChangeText={(value) => setReportDraft((prev) => ({ ...prev, bpDiastolic: value }))}
                placeholder="BP DIA"
                keyboardType="numeric"
                style={styles.vitalsInput}
              />
              <TextInput
                value={reportDraft.temperatureC}
                onChangeText={(value) => setReportDraft((prev) => ({ ...prev, temperatureC: value }))}
                placeholder="Temp C"
                keyboardType="decimal-pad"
                style={styles.vitalsInput}
              />
              <TextInput
                value={reportDraft.glucoseMgDl}
                onChangeText={(value) => setReportDraft((prev) => ({ ...prev, glucoseMgDl: value }))}
                placeholder="Glucose"
                keyboardType="decimal-pad"
                style={styles.vitalsInput}
              />
            </View>

            <TextInput
              value={reportDraft.medications}
              onChangeText={(value) => setReportDraft((prev) => ({ ...prev, medications: value }))}
              placeholder="Medication and supplements"
              placeholderTextColor="#9EAAC2"
              multiline
              style={styles.featureTextArea}
            />

            <TextInput
              value={reportDraft.questions}
              onChangeText={(value) => setReportDraft((prev) => ({ ...prev, questions: value }))}
              placeholder="Questions for your clinician"
              placeholderTextColor="#9EAAC2"
              multiline
              style={styles.featureTextArea}
            />

            <View style={styles.featureActionsRow}>
              <TouchableOpacity style={styles.secondaryActionBtn} onPress={() => onSaveClinicianDraft().catch(() => undefined)}>
                <Text style={styles.secondaryActionText}>Save Draft</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryActionBtn} onPress={() => onGenerateReport().catch(() => undefined)}>
                <Text style={styles.primaryActionText}>{reportBusy ? "Generating..." : "Generate"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryActionBtn} onPress={() => onShareReport().catch(() => undefined)}>
                <Text style={styles.secondaryActionText}>Share</Text>
              </TouchableOpacity>
            </View>

            {reportSummary ? (
              <View style={styles.reportPreviewWrap}>
                <Text style={styles.reportPreviewTitle}>Preview</Text>
                <Text numberOfLines={12} style={styles.reportPreviewText}>{reportSummary}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>"""

new_clinician = """      <View style={styles.dropdownWrap}>
        <TouchableOpacity style={styles.dropdownHeader} onPress={() => setIsClinicianOpen((prev) => !prev)}>
          <View style={styles.featureHeadLeft}>
            <View style={styles.featureHeadIconWrap}>
              <FileText size={14} color={colors.brand} />
            </View>
            <Text style={styles.sectionTitle}>{t("clinician_share_report", "CLINICIAN SHARE REPORT")}</Text>
          </View>
          {isClinicianOpen ? <ChevronUp size={16} color="#7E8FAF" /> : <ChevronDown size={16} color="#7E8FAF" />}
        </TouchableOpacity>

        {isClinicianOpen ? (
          <View style={styles.featureCard}>
            <Text style={styles.featureSubtitle}>{t("clinician_report_subtitle", "Prepare and share a concise report before appointments.")}</Text>

            <View style={styles.vitalsRow}>
              <TextInput
                value={reportDraft.bpSystolic}
                onChangeText={(value) => setReportDraft((prev) => ({ ...prev, bpSystolic: value }))}
                placeholder={t("bp_sys", "BP SYS")}
                placeholderTextColor="#9EAAC2"
                keyboardType="numeric"
                style={styles.vitalsInput}
              />
              <TextInput
                value={reportDraft.bpDiastolic}
                onChangeText={(value) => setReportDraft((prev) => ({ ...prev, bpDiastolic: value }))}
                placeholder={t("bp_dia", "BP DIA")}
                placeholderTextColor="#9EAAC2"
                keyboardType="numeric"
                style={styles.vitalsInput}
              />
              <TextInput
                value={reportDraft.temperatureC}
                onChangeText={(value) => setReportDraft((prev) => ({ ...prev, temperatureC: value }))}
                placeholder={t("temp_c", "Temp C")}
                placeholderTextColor="#9EAAC2"
                keyboardType="decimal-pad"
                style={styles.vitalsInput}
              />
              <TextInput
                value={reportDraft.glucoseMgDl}
                onChangeText={(value) => setReportDraft((prev) => ({ ...prev, glucoseMgDl: value }))}
                placeholder={t("glucose", "Glucose")}
                placeholderTextColor="#9EAAC2"
                keyboardType="decimal-pad"
                style={styles.vitalsInput}
              />
            </View>

            <TextInput
              value={reportDraft.medications}
              onChangeText={(value) => setReportDraft((prev) => ({ ...prev, medications: value }))}
              placeholder={t("medications_placeholder", "Medication and supplements")}
              placeholderTextColor="#9EAAC2"
              multiline
              style={styles.featureTextArea}
            />

            <TextInput
              value={reportDraft.questions}
              onChangeText={(value) => setReportDraft((prev) => ({ ...prev, questions: value }))}
              placeholder={t("questions_placeholder", "Questions for your clinician")}
              placeholderTextColor="#9EAAC2"
              multiline
              style={styles.featureTextArea}
            />

            <View style={styles.featureActionsRow}>
              <TouchableOpacity style={styles.secondaryActionBtn} onPress={() => onSaveClinicianDraft().catch(() => undefined)}>
                <Text style={styles.secondaryActionText}>{t("save_draft", "Save Draft")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryActionBtn} onPress={() => onGenerateReport().catch(() => undefined)}>
                <Text style={styles.primaryActionText}>{reportBusy ? t("generating", "Generating...") : t("generate", "Generate")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryActionBtn} onPress={() => onShareReport().catch(() => undefined)}>
                <Text style={styles.secondaryActionText}>{t("share", "Share")}</Text>
              </TouchableOpacity>
            </View>

            {reportSummary ? (
              <View style={styles.reportPreviewWrap}>
                <Text style={styles.reportPreviewTitle}>{t("preview", "Preview")}</Text>
                <Text numberOfLines={12} style={styles.reportPreviewText}>{reportSummary}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>"""

if old_clinician in code:
    code = code.replace(old_clinician, new_clinician)
    print("5. Replaced clinician share report")
else:
    print("5. Could not find old clinician share report")

# 6. Update Insurance & Claims Hub Section
old_insurance = """      <View style={styles.dropdownWrap}>
        <TouchableOpacity style={styles.dropdownHeader} onPress={() => setIsInsuranceOpen((prev) => !prev)}>
          <View style={styles.featureHeadLeft}>
            <View style={styles.featureHeadIconWrap}>
              <ShieldCheck size={14} color={colors.brand} />
            </View>
            <Text style={styles.sectionTitle}>INSURANCE & CLAIMS HUB</Text>
          </View>
          {isInsuranceOpen ? <ChevronUp size={16} color="#7E8FAF" /> : <ChevronDown size={16} color="#7E8FAF" />}
        </TouchableOpacity>

        {isInsuranceOpen ? (
          <View style={styles.featureCard}>
            <Text style={styles.featureSubtitle}>Store policy details, estimate coverage, and track claim submissions.</Text>

            <TextInput
              value={policyForm.provider}
              onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, provider: value }))}
              placeholder="Provider"
              placeholderTextColor="#9EAAC2"
              style={styles.featureInput}
            />
            <TextInput
              value={policyForm.policyNumber}
              onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, policyNumber: value }))}
              placeholder="Policy number"
              placeholderTextColor="#9EAAC2"
              style={styles.featureInput}
            />

          <View style={styles.doubleRow}>
          <TextInput
            value={policyForm.maternityCoveragePercent}
            onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, maternityCoveragePercent: value }))}
            placeholder="Coverage %"
            placeholderTextColor="#9EAAC2"
            keyboardType="decimal-pad"
            style={styles.featureInputHalf}
          />
          <TextInput
            value={policyForm.renewalDate}
            onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, renewalDate: value }))}
            placeholder="Renewal YYYY-MM-DD"
            placeholderTextColor="#9EAAC2"
            style={styles.featureInputHalf}
          />
          </View>

          <View style={styles.doubleRow}>
          <TextInput
            value={policyForm.deductible}
            onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, deductible: value }))}
            placeholder="Deductible"
            placeholderTextColor="#9EAAC2"
            keyboardType="decimal-pad"
            style={styles.featureInputHalf}
          />
          <TextInput
            value={policyForm.outOfPocketLimit}
            onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, outOfPocketLimit: value }))}
            placeholder="Out-of-pocket"
            placeholderTextColor="#9EAAC2"
            keyboardType="decimal-pad"
            style={styles.featureInputHalf}
          />
          </View>

            <TextInput
              value={policyForm.maternityCoverLimit}
              onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, maternityCoverLimit: value }))}
              placeholder="Maternity cover limit"
              placeholderTextColor="#9EAAC2"
              keyboardType="decimal-pad"
              style={styles.featureInput}
            />

            <TouchableOpacity style={styles.primaryActionBtn} onPress={() => onSavePolicy().catch(() => undefined)}>
              <Text style={styles.primaryActionText}>Save Policy</Text>
            </TouchableOpacity>

          <View style={styles.estimatorCard}>
          <Text style={styles.estimatorTitle}>Coverage Estimator</Text>
          <TextInput
            value={coverageEstimator}
            onChangeText={setCoverageEstimator}
            placeholder="Expected maternity expense"
            placeholderTextColor="#9EAAC2"
            keyboardType="decimal-pad"
            style={styles.featureInput}
          />
          <Text style={styles.estimatorLine}>Estimated covered: {cappedCovered.toFixed(0)}</Text>
          <Text style={styles.estimatorLine}>Estimated out-of-pocket: {outOfPocketEstimate.toFixed(0)}</Text>
          <Text style={styles.estimatorHint}>Applies your stored coverage percent and maternity cap.</Text>
          </View>

            <Text style={styles.subFeatureTitle}>Claims</Text>

            <TextInput
              value={claimForm.title}
              onChangeText={(value) => setClaimForm((prev) => ({ ...prev, title: value }))}
              placeholder="Claim title"
              placeholderTextColor="#9EAAC2"
              style={styles.featureInput}
            />

            <View style={styles.statusChipsRow}>
              {claimStatuses.map((status) => {
                const active = claimForm.status === status;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[styles.statusChip, active && styles.statusChipActive]}
                    onPress={() => setClaimForm((prev) => ({ ...prev, status }))}
                  >
                    <Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>
                      {status.replace("_", " ").toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.doubleRow}>
              <TextInput
                value={claimForm.amountEstimated}
                onChangeText={(value) => setClaimForm((prev) => ({ ...prev, amountEstimated: value }))}
                placeholder="Estimated amount"
                placeholderTextColor="#9EAAC2"
                keyboardType="decimal-pad"
                style={styles.featureInputHalf}
              />
              <TextInput
                value={claimForm.deadlineDate}
                onChangeText={(value) => setClaimForm((prev) => ({ ...prev, deadlineDate: value }))}
                placeholder="Deadline YYYY-MM-DD"
                placeholderTextColor="#9EAAC2"
                style={styles.featureInputHalf}
              />
            </View>

            <TextInput
              value={claimForm.notes}
              onChangeText={(value) => setClaimForm((prev) => ({ ...prev, notes: value }))}
              placeholder="Claim notes"
              placeholderTextColor="#9EAAC2"
              multiline
              style={styles.featureTextArea}
            />

            <TouchableOpacity style={styles.primaryActionBtn} onPress={() => onSaveClaim().catch(() => undefined)}>
              <Text style={styles.primaryActionText}>Save Claim</Text>
            </TouchableOpacity>

            {claims.length === 0 ? (
              <Text style={styles.emptyInlineText}>No claims yet.</Text>
            ) : (
              claims.map((claim) => (
                <View key={claim.id} style={styles.claimItemCard}>
                  <View style={styles.claimHeadRow}>
                    <Text style={styles.claimTitle}>{claim.title}</Text>
                    <View style={styles.claimBadge}>
                      <Text style={styles.claimBadgeText}>{claim.status.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.claimMeta}>
                    Est. {claim.amount_estimated ?? "-"} • Deadline: {claim.deadline_date || "-"}
                  </Text>
                  {claim.notes ? <Text style={styles.claimNotes}>{claim.notes}</Text> : null}

                  <TouchableOpacity
                    style={styles.uploadDocBtn}
                    onPress={() => onUploadClaimDocument(claim.id).catch(() => undefined)}
                  >
                    <Text style={styles.uploadDocText}>Upload Document</Text>
                  </TouchableOpacity>

                  {(claimDocsMap[claim.id] || []).length === 0 ? (
                    <Text style={styles.noDocText}>No documents attached.</Text>
                  ) : (
                    (claimDocsMap[claim.id] || []).map((doc) => (
                      <Text key={doc.id} style={styles.docItemText}>• {doc.file_name}</Text>
                    ))
                  )}
                </View>
              ))
            )}
          </View>
        ) : null}
      </View>"""

new_insurance = """      <View style={styles.dropdownWrap}>
        <TouchableOpacity style={styles.dropdownHeader} onPress={() => setIsInsuranceOpen((prev) => !prev)}>
          <View style={styles.featureHeadLeft}>
            <View style={styles.featureHeadIconWrap}>
              <ShieldCheck size={14} color={colors.brand} />
            </View>
            <Text style={styles.sectionTitle}>{t("insurance_claims_hub", "INSURANCE & CLAIMS HUB")}</Text>
          </View>
          {isInsuranceOpen ? <ChevronUp size={16} color="#7E8FAF" /> : <ChevronDown size={16} color="#7E8FAF" />}
        </TouchableOpacity>

        {isInsuranceOpen ? (
          <View style={styles.featureCard}>
            <Text style={styles.featureSubtitle}>{t("insurance_hub_subtitle", "Store policy details, estimate coverage, and track claim submissions.")}</Text>

            <TextInput
              value={policyForm.provider}
              onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, provider: value }))}
              placeholder={t("insurance_provider", "Provider")}
              placeholderTextColor="#9EAAC2"
              style={styles.featureInput}
            />
            <TextInput
              value={policyForm.policyNumber}
              onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, policyNumber: value }))}
              placeholder={t("policy_number", "Policy number")}
              placeholderTextColor="#9EAAC2"
              style={styles.featureInput}
            />

          <View style={styles.doubleRow}>
          <TextInput
            value={policyForm.maternityCoveragePercent}
            onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, maternityCoveragePercent: value }))}
            placeholder={t("coverage_percent", "Coverage %")}
            placeholderTextColor="#9EAAC2"
            keyboardType="decimal-pad"
            style={styles.featureInputHalf}
          />
          <TextInput
            value={policyForm.renewalDate}
            onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, renewalDate: value }))}
            placeholder={t("renewal_date_placeholder", "Renewal YYYY-MM-DD")}
            placeholderTextColor="#9EAAC2"
            style={styles.featureInputHalf}
          />
          </View>

          <View style={styles.doubleRow}>
          <TextInput
            value={policyForm.deductible}
            onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, deductible: value }))}
            placeholder={t("deductible", "Deductible")}
            placeholderTextColor="#9EAAC2"
            keyboardType="decimal-pad"
            style={styles.featureInputHalf}
          />
          <TextInput
            value={policyForm.outOfPocketLimit}
            onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, outOfPocketLimit: value }))}
            placeholder={t("out_of_pocket", "Out-of-pocket")}
            placeholderTextColor="#9EAAC2"
            keyboardType="decimal-pad"
            style={styles.featureInputHalf}
          />
          </View>

            <TextInput
              value={policyForm.maternityCoverLimit}
              onChangeText={(value) => setPolicyForm((prev) => ({ ...prev, maternityCoverLimit: value }))}
              placeholder={t("maternity_cover_limit", "Maternity cover limit")}
              placeholderTextColor="#9EAAC2"
              keyboardType="decimal-pad"
              style={styles.featureInput}
            />

            <TouchableOpacity style={styles.primaryActionBtn} onPress={() => onSavePolicy().catch(() => undefined)}>
              <Text style={styles.primaryActionText}>{t("save_policy", "Save Policy")}</Text>
            </TouchableOpacity>

          <View style={styles.estimatorCard}>
          <Text style={styles.estimatorTitle}>{t("coverage_estimator", "Coverage Estimator")}</Text>
          <TextInput
            value={coverageEstimator}
            onChangeText={setCoverageEstimator}
            placeholder={t("expected_maternity_expense", "Expected maternity expense")}
            placeholderTextColor="#9EAAC2"
            keyboardType="decimal-pad"
            style={styles.featureInput}
          />
          <Text style={styles.estimatorLine}>{t("estimated_covered", "Estimated covered")}: {cappedCovered.toFixed(0)}</Text>
          <Text style={styles.estimatorLine}>{t("estimated_out_of_pocket", "Estimated out-of-pocket")}: {outOfPocketEstimate.toFixed(0)}</Text>
          <Text style={styles.estimatorHint}>{t("estimator_hint", "Applies your stored coverage percent and maternity cap.")}</Text>
          </View>

            <Text style={styles.subFeatureTitle}>{t("claims_title", "Claims")}</Text>

            <TextInput
              value={claimForm.title}
              onChangeText={(value) => setClaimForm((prev) => ({ ...prev, title: value }))}
              placeholder={t("claim_title", "Claim title")}
              placeholderTextColor="#9EAAC2"
              style={styles.featureInput}
            />

            <View style={styles.statusChipsRow}>
              {claimStatuses.map((status) => {
                const active = claimForm.status === status;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[styles.statusChip, active && styles.statusChipActive]}
                    onPress={() => setClaimForm((prev) => ({ ...prev, status }))}
                  >
                    <Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>
                      {t(`claim_status_${status}`, status.replace("_", " "))}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.doubleRow}>
              <TextInput
                value={claimForm.amountEstimated}
                onChangeText={(value) => setClaimForm((prev) => ({ ...prev, amountEstimated: value }))}
                placeholder={t("estimated_amount", "Estimated amount")}
                placeholderTextColor="#9EAAC2"
                keyboardType="decimal-pad"
                style={styles.featureInputHalf}
              />
              <TextInput
                value={claimForm.deadlineDate}
                onChangeText={(value) => setClaimForm((prev) => ({ ...prev, deadlineDate: value }))}
                placeholder={t("deadline_placeholder", "Deadline YYYY-MM-DD")}
                placeholderTextColor="#9EAAC2"
                style={styles.featureInputHalf}
              />
            </View>

            <TextInput
              value={claimForm.notes}
              onChangeText={(value) => setClaimForm((prev) => ({ ...prev, notes: value }))}
              placeholder={t("claim_notes", "Claim notes")}
              placeholderTextColor="#9EAAC2"
              multiline
              style={styles.featureTextArea}
            />

            <TouchableOpacity style={styles.primaryActionBtn} onPress={() => onSaveClaim().catch(() => undefined)}>
              <Text style={styles.primaryActionText}>{t("save_claim", "Save Claim")}</Text>
            </TouchableOpacity>

            {claims.length === 0 ? (
              <Text style={styles.emptyInlineText}>{t("no_claims_yet", "No claims yet.")}</Text>
            ) : (
              claims.map((claim) => (
                <View key={claim.id} style={styles.claimItemCard}>
                  <View style={styles.claimHeadRow}>
                    <Text style={styles.claimTitle}>{claim.title}</Text>
                    <View style={styles.claimBadge}>
                      <Text style={styles.claimBadgeText}>{t(`claim_status_${claim.status}`, claim.status.toUpperCase())}</Text>
                    </View>
                  </View>
                  <Text style={styles.claimMeta}>
                    {t("estimated_amount", "Estimated amount")}: {claim.amount_estimated ?? "-"} • {t("deadline_placeholder", "Deadline")}: {claim.deadline_date || "-"}
                  </Text>
                  {claim.notes ? <Text style={styles.claimNotes}>{claim.notes}</Text> : null}

                  <TouchableOpacity
                    style={styles.uploadDocBtn}
                    onPress={() => onUploadClaimDocument(claim.id).catch(() => undefined)}
                  >
                    <Text style={styles.uploadDocText}>{t("upload_document", "Upload Document")}</Text>
                  </TouchableOpacity>

                  {(claimDocsMap[claim.id] || []).length === 0 ? (
                    <Text style={styles.noDocText}>{t("no_documents_attached", "No documents attached.")}</Text>
                  ) : (
                    (claimDocsMap[claim.id] || []).map((doc) => (
                      <Text key={doc.id} style={styles.docItemText}>• {doc.file_name}</Text>
                    ))
                  )}
                </View>
              ))
            )}
          </View>
        ) : null}
      </View>"""

if old_insurance in code:
    code = code.replace(old_insurance, new_insurance)
    print("6. Replaced insurance & claims hub")
else:
    print("6. Could not find old insurance hub")

# 7. Update alerts in profile
alerts_replacements = [
    ('Alert.alert("Saved", "Clinician report draft saved.");',
     'Alert.alert(t("save", "Saved"), t("clinician_draft_saved", "Clinician report draft saved."));'),
    ('Alert.alert("Report error", "Could not generate clinician report right now.");',
     'Alert.alert(t("save_error_title", "Report error"), t("clinician_gen_error", "Could not generate clinician report right now."));'),
    ('Alert.alert("Missing info", "Provider and policy number are required.");',
     'Alert.alert(t("save_error_title", "Missing info"), t("provider_policy_required", "Provider and policy number are required."));'),
    ('Alert.alert("Saved", "Insurance policy added.");',
     'Alert.alert(t("save", "Saved"), t("policy_saved", "Insurance policy added."));'),
    ('Alert.alert("Missing info", "Claim title is required.");',
     'Alert.alert(t("save_error_title", "Missing info"), t("claim_title_required", "Claim title is required."));'),
    ('Alert.alert("Saved", "Claim saved and reminder scheduled when deadline is set.");',
     'Alert.alert(t("save", "Saved"), t("claim_saved", "Claim saved and reminder scheduled when deadline is set."));'),
    ('Alert.alert("Uploaded", "Document attached to claim.");',
     'Alert.alert(t("save", "Uploaded"), t("doc_uploaded", "Document attached to claim."));'),
    ('Alert.alert("Upload error", "Could not upload document right now.");',
     'Alert.alert(t("save_error_title", "Upload error"), t("upload_error", "Could not upload document right now."));'),
]

for old_al, new_al in alerts_replacements:
    if old_al in code:
        code = code.replace(old_al, new_al)
        print(f"Replaced alert: {old_al[:30]}")
    else:
        print(f"Could not find alert: {old_al[:30]}")

# 8. Update Profile Settings Modal
old_settings = """            <View style={styles.settingsCard}>
              <View style={styles.settingsHeader}>
                <Text style={styles.settingsTitle}>Edit Profile Settings</Text>
                <TouchableOpacity onPress={() => setIsSettingsOpen(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.settingsBody}
                contentContainerStyle={styles.settingsBodyContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  value={settingsName}
                  onChangeText={setSettingsName}
                  placeholder="e.g. Priya"
                  placeholderTextColor="#9EAAC2"
                  style={styles.input}
                />

                <Text style={styles.label}>Due Date (YYYY-MM-DD) *</Text>
                <TouchableOpacity
                  style={styles.datePickerTrigger}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <CalendarDays size={18} color="#7E8FAF" />
                  <Text style={styles.datePickerTriggerText}>
                    {settingsDueDate ? formatDateForDisplay(selectedDate) : "Select due date"}
                  </Text>
                </TouchableOpacity>

                {showDatePicker ? (
                  Platform.OS === "ios" ? (
                    <View style={styles.iosDatePickerCard}>
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="spinner"
                        onChange={onDateChange}
                        minimumDate={minimumSelectableDueDate}
                        maximumDate={maximumSelectableDueDate}
                      />
                      <TouchableOpacity style={styles.iosDatePickerDoneBtn} onPress={() => setShowDatePicker(false)}>
                        <Text style={styles.iosDatePickerDoneText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                      minimumDate={minimumSelectableDueDate}
                      maximumDate={maximumSelectableDueDate}
                    />
                  )
                ) : null}

                <Text style={styles.label}>Blood Type (Optional)</Text>
                <TextInput
                  value={settingsBloodType}
                  onChangeText={setSettingsBloodType}
                  placeholder="e.g. O+ / B-"
                  placeholderTextColor="#9EAAC2"
                  style={styles.input}
                />

                <Text style={styles.label}>Doctor Name (Optional)</Text>
                <TextInput
                  value={settingsDoctorName}
                  onChangeText={setSettingsDoctorName}
                  placeholder="e.g. Dr. Alpa"
                  placeholderTextColor="#9EAAC2"
                  style={styles.input}
                />

                <Text style={styles.label}>Doctor Phone (Optional)</Text>
                <TextInput
                  value={settingsDoctorPhone}
                  onChangeText={setSettingsDoctorPhone}
                  placeholder="e.g. +91 98765 43210"
                  placeholderTextColor="#9EAAC2"
                  keyboardType="phone-pad"
                  style={styles.input}
                />

                <Text style={styles.label}>Preferred Voice (Optional)</Text>
                <TextInput
                  value={settingsPreferredVoice}
                  onChangeText={setSettingsPreferredVoice}
                  placeholder="e.g. en-US-language"
                  placeholderTextColor="#9EAAC2"
                  style={styles.input}
                />

                <TouchableOpacity style={styles.saveSettingsBtn} onPress={onSaveSettings}>
                  <Text style={styles.saveSettingsText}>Save Settings</Text>
                </TouchableOpacity>"""

new_settings = """            <View style={styles.settingsCard}>
              <View style={styles.settingsHeader}>
                <Text style={styles.settingsTitle}>{t("edit_profile_settings", "Edit Profile Settings")}</Text>
                <TouchableOpacity onPress={() => setIsSettingsOpen(false)}>
                  <Text style={styles.cancelText}>{t("cancel", "Cancel")}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.settingsBody}
                contentContainerStyle={styles.settingsBodyContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.label}>{t("first_name", "First Name *")}</Text>
                <TextInput
                  value={settingsName}
                  onChangeText={setSettingsName}
                  placeholder={t("first_name_placeholder", "e.g. Priya")}
                  placeholderTextColor="#9EAAC2"
                  style={styles.input}
                />

                <Text style={styles.label}>{t("due_date_star", "Due Date (YYYY-MM-DD) *")}</Text>
                <TouchableOpacity
                  style={styles.datePickerTrigger}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <CalendarDays size={18} color="#7E8FAF" />
                  <Text style={styles.datePickerTriggerText}>
                    {settingsDueDate ? formatDateForDisplay(selectedDate) : t("select_due_date", "Select due date")}
                  </Text>
                </TouchableOpacity>

                {showDatePicker ? (
                  Platform.OS === "ios" ? (
                    <View style={styles.iosDatePickerCard}>
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="spinner"
                        onChange={onDateChange}
                        minimumDate={minimumSelectableDueDate}
                        maximumDate={maximumSelectableDueDate}
                      />
                      <TouchableOpacity style={styles.iosDatePickerDoneBtn} onPress={() => setShowDatePicker(false)}>
                        <Text style={styles.iosDatePickerDoneText}>{t("done", "Done")}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                      minimumDate={minimumSelectableDueDate}
                      maximumDate={maximumSelectableDueDate}
                    />
                  )
                ) : null}

                <Text style={styles.label}>{t("blood_type_optional", "Blood Type (Optional)")}</Text>
                <TextInput
                  value={settingsBloodType}
                  onChangeText={setSettingsBloodType}
                  placeholder={t("blood_type_placeholder", "e.g. O+ / B-")}
                  placeholderTextColor="#9EAAC2"
                  style={styles.input}
                />

                <Text style={styles.label}>{t("doctor_name_optional", "Doctor Name (Optional)")}</Text>
                <TextInput
                  value={settingsDoctorName}
                  onChangeText={setSettingsDoctorName}
                  placeholder={t("doctor_name_placeholder", "e.g. Dr. Alpa")}
                  placeholderTextColor="#9EAAC2"
                  style={styles.input}
                />

                <Text style={styles.label}>{t("doctor_phone_optional", "Doctor Phone (Optional)")}</Text>
                <TextInput
                  value={settingsDoctorPhone}
                  onChangeText={setSettingsDoctorPhone}
                  placeholder={t("doctor_phone_placeholder", "e.g. +91 98765 43210")}
                  placeholderTextColor="#9EAAC2"
                  keyboardType="phone-pad"
                  style={styles.input}
                />

                <Text style={styles.label}>{t("preferred_voice_optional", "Preferred Voice (Optional)")}</Text>
                <TextInput
                  value={settingsPreferredVoice}
                  onChangeText={setSettingsPreferredVoice}
                  placeholder={t("preferred_voice_placeholder", "e.g. en-US-language")}
                  placeholderTextColor="#9EAAC2"
                  style={styles.input}
                />

                <TouchableOpacity style={styles.saveSettingsBtn} onPress={onSaveSettings}>
                  <Text style={styles.saveSettingsText}>{t("save_settings", "Save Settings")}</Text>
                </TouchableOpacity>"""

if old_settings in code:
    code = code.replace(old_settings, new_settings)
    print("8. Replaced settings modal")
else:
    print("8. Could not find old settings modal")

with open(profile_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Saved updated profile.tsx successfully!")
