import json
import re

# Read multilingual knowledge base
input_file = "src/data/MAA_pregnancy_knowledge_base_multilingual.json"
with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# Categories translation map to Hindi
cat_map = {
    "All": "सभी",
    "General Pregnancy": "सामान्य गर्भावस्था",
    "Week-by-Week Pregnancy": "सप्ताह-दर-सप्ताह गर्भावस्था",
    "Baby Development": "शिशु विकास",
    "Food & Nutrition": "भोजन और पोषण",
    "Fruits": "फल",
    "Vegetables": "सब्जियां",
    "Indian Foods": "भारतीय खाद्य पदार्थ",
    "Supplements": "सप्लीमेंट्स",
    "Vitamins": "विटामिन्स",
    "Water & Hydration": "पानी और जलयोजन",
    "Weight Gain": "वजन बढ़ना",
    "Exercise": "व्यायाम",
    "Prenatal Yoga": "गर्भावस्था योग",
    "Breathing Exercises": "श्वसन व्यायाम",
    "Walking": "टहलना",
    "Sleep": "नींद",
    "Body Changes": "शारीरिक परिवर्तन",
    "Skin Changes": "त्वचा में बदलाव",
    "Hair Changes": "बालों में बदलाव",
    "Symptoms": "लक्षण",
    "Common Problems": "आम समस्याएं",
    "Diseases": "बीमारियां",
    "Pregnancy Complications": "गर्भावस्था जटिलताएं",
    "Infections": "संक्रमण",
    "Mental Health": "मानसिक स्वास्थ्य",
    "Emotional Wellbeing": "भावनात्मक कल्याण",
    "Stress": "तनाव",
    "Anxiety": "चिंता",
    "Relationships": "संबंध",
    "Sexual Health": "यौन स्वास्थ्य",
    "Medical Tests": "चिकित्सा परीक्षण",
    "Scans": "स्कैन",
    "Scans & Tests": "स्कैन और परीक्षण",
    "Medicines": "दवाइयां",
    "Safety": "सुरक्षा",
    "Travel": "यात्रा",
    "Work": "कामकाज",
    "Emergency Symptoms": "आपातकालीन लक्षण",
    "Labor": "प्रसव पीड़ा",
    "Delivery": "प्रसव / डिलीवरी",
    "C-Section": "सी-सेक्शन",
    "Breastfeeding": "स्तनपान",
    "Postpartum Care": "प्रसवोत्तर देखभाल",
    "Newborn Care": "नवजात शिशु देखभाल",
    "Parenting Preparation": "पालन-पोषण की तैयारी",
}

# Standard follow up questions in Hindi
def translate_fu_question_hi(q):
    if "How common is" in q:
        topic = re.sub(r"^How common is (.*?) during pregnancy\??$", r"\1", q, flags=re.IGNORECASE).strip()
        return f"गर्भावस्था में {topic} कितना सामान्य है?"
    if "When should I mention" in q:
        topic = re.sub(r"^When should I mention (.*?) to my doctor\??$", r"\1", q, flags=re.IGNORECASE).strip()
        return f"मुझे डॉक्टर को {topic} के बारे में कब बताना चाहिए?"
    if "What can I do at home to support comfort with" in q:
        topic = re.sub(r"^What can I do at home to support comfort with (.*?)\??$", r"\1", q, flags=re.IGNORECASE).strip()
        return f"{topic} में आराम के लिए मैं घर पर क्या कर सकती हूँ?"
    if "what warning signs should make me seek care" in q:
        topic = re.sub(r"^About (.*?), what warning signs should make me seek care\??$", r"\1", q, flags=re.IGNORECASE).strip()
        return f"{topic} के संबंध में किन चेतावनी संकेतों पर ध्यान देना चाहिए?"
    if "How much" in q:
        return f"गर्भावस्था के दौरान इसकी कितनी मात्रा उचित है?"
    if "safe during pregnancy" in q:
        return f"क्या यह गर्भावस्था में सुरक्षित है?"
    return q

def translate_fu_answer_hi(ans):
    if "Some people experience this, while others do not" in ans:
        return "कुछ महिलाएं इसका अनुभव करती हैं, जबकि अन्य नहीं। इसकी आवृत्ति और तीव्रता तिमाही और व्यक्तिगत स्वास्थ्य के अनुसार भिन्न हो सकती है। कोई भी संदेह होने पर अपनी प्रसवपूर्व स्वास्थ्य टीम से संपर्क करें।"
    if "Tell your prenatal or healthcare team if it is new" in ans:
        return "यदि यह नया है, लगातार बना रहता है, बढ़ रहा है या आपको परेशान कर रहा है तो अपने डॉक्टर को बताएं। गंभीर लक्षणों के लिए तुरंत आपातकालीन देखभाल प्राप्त करें।"
    if "Choose gentle, practical steps that feel comfortable" in ans:
        return "कोमल और व्यावहारिक उपाय चुनें जो आपको आरामदायक लगें तथा अपने डॉक्टर की सलाह का पालन करें। किसी भी ऐसी चीज से बचें जो लक्षणों को बढ़ाती हो।"
    if "Your healthcare team can give advice based on your symptoms" in ans:
        return "आपकी स्वास्थ्य सेवा टीम आपके लक्षणों, गर्भावस्था के चरण और चिकित्सा इतिहास के आधार पर व्यक्तिगत सलाह दे सकती है। किसी भी असामान्य लक्षण पर डॉक्टर से संपर्क करें।"
    if "There is no single amount that suits everyone" in ans:
        return "कोई एक निर्धारित मात्रा हर किसी के लिए उपयुक्त नहीं होती। व्यक्तिगत सलाह के लिए अपने डॉक्टर या पोषण विशेषज्ञ से परामर्श करें।"
    if "It may be suitable for many pregnancies" in ans:
        return "यह कई गर्भधारणों के लिए उपयुक्त हो सकता है, लेकिन व्यक्तिगत सलाह आवश्यक है। यदि आपको कोई जटिलता है, तो डॉक्टर से पुष्टि करें।"
    if "Do not wait for a chatbot assessment" in ans:
        return "चैटबॉट के जवाब का इंतजार न करें। तुरंत आपातकालीन चिकित्सा सहायता लें। स्थिति गंभीर होने पर स्थानीय आपातकालीन सेवा (108) पर कॉल करें।"
    return ans

def translate_main_question_hi(q):
    m1 = re.match(r"^What should I know about (.*?)\??$", q, re.IGNORECASE)
    if m1:
        return f"{m1.group(1).strip()} के बारे में मुझे क्या जानना चाहिए?"
    m2 = re.match(r"^How much (.*?) should I have\??$", q, re.IGNORECASE)
    if m2:
        return f"मुझे {m2.group(1).strip()} की कितनी मात्रा लेनी चाहिए?"
    m3 = re.match(r"^What is the purpose of (.*?)\??$", q, re.IGNORECASE)
    if m3:
        return f"{m3.group(1).strip()} का उद्देश्य क्या है?"
    m4 = re.match(r"^What should I do if I have (.*?)\??$", q, re.IGNORECASE)
    if m4:
        return f"यदि मुझे {m4.group(1).strip()} हो तो मुझे क्या करना चाहिए?"
    m5 = re.match(r"^What can I do about (.*?)\??$", q, re.IGNORECASE)
    if m5:
        return f"{m5.group(1).strip()} के लिए मैं क्या कर सकती हूँ?"
    m6 = re.match(r"^Is (.*?) safe during pregnancy\??$", q, re.IGNORECASE)
    if m6:
        return f"क्या गर्भावस्था में {m6.group(1).strip()} सुरक्षित है?"
    return q

def translate_main_answer_hi(ans):
    if "Seek urgent medical care for severe pain, heavy bleeding" in ans:
        return "गर्भावस्था के चरण और आपके स्वास्थ्य के अनुसार सामान्य स्थिति भिन्न हो सकती है। नियमित प्रसवपूर्व जांच कराएं। तेज दर्द, भारी रक्तस्राव, सांस लेने में तकलीफ, बेहोशी, सीने में दर्द या बच्चे की हलचल में कमी होने पर तुरंत आपातकालीन चिकित्सा सहायता लें।"
    if "growth and wellbeing are on track" in ans:
        return "शिशु का विकास और लक्षण हर गर्भावस्था में भिन्न हो सकते हैं। नियमित जांच से पुष्टि करें कि विकास सही तरीके से हो रहा है। रक्तस्राव, तेज दर्द या असामान्य तरल रिसाव होने पर तुरंत डॉक्टर से संपर्क करें।"
    if "Your overall eating pattern matters more than any single food" in ans:
        return "स्वच्छ और ताजी सामग्री चुनें, अच्छी तरह धोकर और पकाकर खाएं। किसी एक भोजन से अधिक आपका संपूर्ण आहार पैटर्न मायने रखता है। मधुमेह या एलर्जी होने पर डॉक्टर से सलाह लें।"
    if "Start gently, stay comfortable, avoid overheating" in ans:
        return "हल्की शुरुआत करें, सहज रहें और अधिक गर्मी से बचें। असहज महसूस होने पर तुरंत रुकें। व्यायाम दिनचर्या बदलने से पहले अपने डॉक्टर से परामर्श अवश्य लें।"
    return ans

added_count = 0
for faq in data.get("faqs", []):
    tr = faq.setdefault("translations", {})
    if "hi" not in tr:
        cat_hi = cat_map.get(faq.get("category"), faq.get("category"))
        sub_hi = cat_map.get(faq.get("subcategory"), faq.get("subcategory", ""))
        q_hi = translate_main_question_hi(faq.get("question", ""))
        a_hi = translate_main_answer_hi(faq.get("answer", ""))
        
        fus_hi = []
        for fu in faq.get("follow_up_questions", []):
            fus_hi.append({
                "question": translate_fu_question_hi(fu.get("question", "")),
                "answer": translate_fu_answer_hi(fu.get("answer", ""))
            })
        
        tr["hi"] = {
            "category_label": cat_hi,
            "subcategory_label": sub_hi,
            "question": q_hi,
            "answer": a_hi,
            "follow_up_questions": fus_hi
        }
        added_count += 1

print(f"Added Hindi translations to {added_count} FAQs.")

# Write back
with open(input_file, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Saved updated multilingual knowledge base.")
