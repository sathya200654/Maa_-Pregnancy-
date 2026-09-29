import knowledgeData from '@/data/MAA_pregnancy_knowledge_base_multilingual.json';
import { SupportedLanguage } from '@/data/translations';

export interface FollowUpQuestion {
  question: string;
  answer: string;
}

export interface FAQTranslation {
  category_label?: string;
  subcategory_label?: string;
  question?: string;
  answer?: string;
  follow_up_questions?: FollowUpQuestion[];
}

export interface FAQItem {
  id: number;
  category: string;
  subcategory: string;
  tags: string[];
  keywords: string[];
  question: string;
  answer: string;
  trimester: string[];
  severity: "normal" | "warning" | string;
  follow_up_questions: FollowUpQuestion[];
  related_questions: number[];
  translations?: Record<string, FAQTranslation>;
}

export interface KnowledgeBaseData {
  app_name: string;
  version: string;
  language: string;
  total_main_questions: number;
  medical_disclaimer: string;
  emergency_symptoms: string[];
  categories: string[];
  faqs: FAQItem[];
}

const kb = knowledgeData as unknown as KnowledgeBaseData;
const faqs: FAQItem[] = kb.faqs || [];
const categories: string[] = kb.categories || [];
const emergencySymptoms: string[] = kb.emergency_symptoms || [];

// Fast map for ID lookup
const faqByIdMap = new Map<number, FAQItem>();
faqs.forEach((faq) => {
  faqByIdMap.set(faq.id, faq);
});

export const LANG_CODE_MAP: Record<SupportedLanguage, string> = {
  English: "en",
  "தமிழ்": "ta",
  "हिन्दी": "hi",
  "ಕನ್ನಡ": "kn",
  "मराठी": "mr",
  "മലയാളം": "ml",
  "తెలుగు": "te",
};

/**
 * Get localized version of an FAQ item from the multilingual knowledge base
 */
export function getLocalizedFaq(faq: FAQItem, lang: SupportedLanguage): FAQItem {
  if (lang === "English") return faq;
  const code = LANG_CODE_MAP[lang];
  const tr = faq.translations?.[code];
  if (tr) {
    return {
      ...faq,
      category: tr.category_label || faq.category,
      subcategory: tr.subcategory_label || faq.subcategory,
      question: tr.question || faq.question,
      answer: tr.answer || faq.answer,
      follow_up_questions:
        tr.follow_up_questions && tr.follow_up_questions.length > 0
          ? tr.follow_up_questions
          : faq.follow_up_questions,
    };
  }
  return faq;
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  return categories;
}

/**
 * Get emergency symptoms list
 */
export function getEmergencySymptoms(): string[] {
  return emergencySymptoms;
}

/**
 * Check if a text contains any emergency symptoms
 */
export function checkEmergencyText(text: string): boolean {
  const lower = text.toLowerCase();
  return emergencySymptoms.some((symptom) => lower.includes(symptom.toLowerCase()));
}

/**
 * Get FAQ by its ID
 */
export function getFaqById(id: number): FAQItem | undefined {
  return faqByIdMap.get(id);
}

/**
 * Get FAQs by category
 */
export function getFaqsByCategory(category: string, limit: number = 25): FAQItem[] {
  if (!category || category === "All") {
    return faqs.slice(0, limit);
  }
  const filtered = faqs.filter(
    (faq) => faq.category.toLowerCase() === category.toLowerCase()
  );
  return filtered.slice(0, limit);
}

/**
 * Search questions by keyword or phrase.
 * Prioritizes question title, keywords, tags, subcategory, and answer.
 */
export function searchQuestions(query: string, limit: number = 15, lang?: SupportedLanguage): FAQItem[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return getPopularQuestions(limit);
  }

  const queryTerms = cleanQuery.split(/\s+/).filter(Boolean);
  const langCode = lang ? LANG_CODE_MAP[lang] : undefined;

  const scoredResults: { faq: FAQItem; score: number }[] = [];

  for (const faq of faqs) {
    const qLower = faq.question.toLowerCase();
    const catLower = faq.category.toLowerCase();
    const subLower = (faq.subcategory || "").toLowerCase();
    const tagsLower = faq.tags.map((t) => t.toLowerCase());
    const keywordsLower = faq.keywords.map((k) => k.toLowerCase());

    const tr = langCode ? faq.translations?.[langCode] : undefined;
    const trQLower = (tr?.question || "").toLowerCase();
    const trCatLower = (tr?.category_label || "").toLowerCase();

    let score = 0;

    // Exact question match or includes full query (English or Localized)
    if (qLower.includes(cleanQuery) || trQLower.includes(cleanQuery)) {
      score += 100;
    }

    // Term-by-term scoring
    let allTermsFound = true;
    for (const term of queryTerms) {
      let termMatched = false;
      if (qLower.includes(term) || trQLower.includes(term)) {
        score += 35;
        termMatched = true;
      }
      if (keywordsLower.some((k) => k.includes(term))) {
        score += 25;
        termMatched = true;
      }
      if (tagsLower.some((t) => t.includes(term))) {
        score += 20;
        termMatched = true;
      }
      if (catLower.includes(term) || subLower.includes(term) || trCatLower.includes(term)) {
        score += 15;
        termMatched = true;
      }
      if (!termMatched) {
        allTermsFound = false;
      }
    }

    // Boost if every word typed by user was found
    if (allTermsFound) {
      score += 30;
    }

    if (score > 0) {
      scoredResults.push({ faq, score });
    }
  }

  scoredResults.sort((a, b) => b.score - a.score);
  return scoredResults.slice(0, limit).map((r) => r.faq);
}

/**
 * Get curated popular starter questions
 */
export function getPopularQuestions(limit: number = 8): FAQItem[] {
  // Select well-known common maternal questions from different categories
  const targetIds = [1, 28, 55, 82, 109, 136, 163, 190, 217, 244];
  const results: FAQItem[] = [];
  for (const id of targetIds) {
    const item = faqByIdMap.get(id);
    if (item) results.push(item);
    if (results.length >= limit) break;
  }
  if (results.length === 0) {
    return faqs.slice(0, limit);
  }
  return results;
}

/**
 * Get related questions for an FAQ
 */
export function getRelatedFaqs(faq: FAQItem): FAQItem[] {
  if (!faq.related_questions || !faq.related_questions.length) {
    return [];
  }
  const related: FAQItem[] = [];
  for (const id of faq.related_questions) {
    const item = faqByIdMap.get(id);
    if (item) related.push(item);
  }
  return related;
}
