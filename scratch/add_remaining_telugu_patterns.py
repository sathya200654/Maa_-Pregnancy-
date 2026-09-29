import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/services/knowledgeLocalization.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# m1
p1_from = 'case "മലയാളം":\n        return `${topic} സംബന്ധിച്ച് ഞാൻ എന്താണ് അറിഞ്ഞിരിക്കേണ്ടത്?`;'
p1_to = 'case "മലയാളം":\n        return `${topic} സംബന്ധിച്ച് ഞാൻ എന്താണ് അറിഞ്ഞിരിക്കേണ്ടത്?`;\n      case "తెలుగు":\n        return `${topic} గురించి నేను ఏమి తెలుసుకోవాలి?`;'

# m2
p2_from = 'case "മലയാളം":\n        return `ആഴ്ച ${week}-ൽ എന്താണ് സംഭവിക്കുന്നത്?`;'
p2_to = 'case "മലയാളം":\n        return `ആഴ്ച ${week}-ൽ എന്താണ് സംഭവിക്കുന്നത്?`;\n      case "తెలుగు":\n        return `వారం ${week} లో ఏమి జరుగుతుంది?`;'

# m7
p7_from = 'case "മലയാളം":\n        return `ഗർഭകാലത്ത് ${topic} കഴിക്കാമോ?`;'
p7_to = 'case "മലയാളം":\n        return `ഗർഭകാലത്ത് ${topic} കഴിക്കാമോ?`;\n      case "తెలుగు":\n        return `గర్భధారణ సమయంలో నేను ${topic} తినవచ్చా?`;'

# m8
p8_from = 'case "മലയാളം":\n        return `എപ്പോഴാണ് ഡോക്ടറോട് ${topic} പറയേണ്ടത്?`;'
p8_to = 'case "മലയാളം":\n        return `എപ്പോഴാണ് ഡോക്ടറോട് ${topic} പറയേണ്ടത്?`;\n      case "తెలుగు":\n        return `నేను నా వైద్యుడితో ${topic} గురించి ఎప్పుడు మాట్లాడాలి?`;'

# m10
p10_from = 'case "മലയാളം":\n        return `${topic}-ൽ ആശ്വാസം ലഭിക്കാൻ വീട്ടിൽ എന്ത് ചെയ്യാം?`;'
p10_to = 'case "മലയാളം":\n        return `${topic}-ൽ ആശ്വാസം ലഭിക്കാൻ വീട്ടിൽ എന്ത് ചെയ്യാം?`;\n      case "తెలుగు":\n        return `${topic} ఉపశమనం కోసం ఇంట్లో ఏమి చేయవచ్చు?`;'

# m11
p11_from = 'case "മലയാളം":\n        return `ഗർഭകാലത്ത് ${topic} എത്ര സാധാരണമാണ്?`;'
p11_to = 'case "മലയാളം":\n        return `ഗർഭകാലത്ത് ${topic} എത്ര സാധാരണമാണ്?`;\n      case "తెలుగు":\n        return `గర్భధారణ సమయంలో ${topic} ఎంత సాధారణం?`;'

# m12
p12_from = 'case "മലയാളം":\n        return `${topic} സംബന്ധിച്ച് ഡോക്ടറോട് എന്തൊക്കെ ചോദിക്കണം?`;'
p12_to = 'case "മലയാളം":\n        return `${topic} സംബന്ധിച്ച് ഡോക്ടറോട് എന്തൊക്കെ ചോദിക്കണം?`;\n      case "తెలుగు":\n        return `${topic} గురించి నా వైద్యుడిని ఏ ప్రశ్నలు అడగాలి?`;'

pairs = [(p1_from, p1_to), (p2_from, p2_to), (p7_from, p7_to), (p8_from, p8_to), (p10_from, p10_to), (p11_from, p11_to), (p12_from, p12_to)]

for pf, pt in pairs:
    if pf in content:
        content = content.replace(pf, pt, 1)
        print("Replaced pattern with Telugu")
    else:
        print("Pattern not found!")

with open('src/services/knowledgeLocalization.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Finished adding remaining Telugu patterns.")
