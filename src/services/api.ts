import { Platform } from "react-native";
import { Buffer } from "buffer";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };
export type ChatMedia = { type: "image" | "video" | "web"; title: string; url: string };
export type ChatSource = { title: string; url: string };
export type ChatResult = { text: string; sources?: ChatSource[]; media?: ChatMedia[] };

// ─── Config ───────────────────────────────────────────────────────────────────
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY || "";
const GROQ_MODEL = "groq/compound";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// On web, use local Python backend (no CORS restrictions).
// On mobile (Android/iOS), call Groq directly (no CORS).
const BACKEND_URL = "http://localhost:8000";
const USE_BACKEND = Platform.OS === "web";

function systemPrompt(language: string): string {
  return (
    "You are Maa, an advanced and empathetic maternal health assistant acting as a top gynecologist. " +
    "Provide highly practical, evidence-based, and medically cautious support based on real articles, " +
    "medical guidelines (like ACOG or WHO), and factual data. " +
    "If the user asks for urgent symptoms, suggest contacting emergency care immediately. " +
    `Always respond in this language: ${language}. ` +
    "Be warm, supportive, and informative."
  );
}

function extractLinks(text: string): { sources: ChatSource[]; media: ChatMedia[] } {
  const urls = text.match(/https?:\/\/[^\s)\]]+/g) ?? [];
  const seen = new Set<string>();
  const sources: ChatSource[] = [];
  const media: ChatMedia[] = [];

  for (const raw of urls) {
    const url = raw.replace(/[.,]+$/, "");
    if (seen.has(url)) continue;
    seen.add(url);
    const lower = url.toLowerCase();
    if (/\.(jpg|jpeg|png|webp|gif)$/.test(lower) || lower.includes("images")) {
      media.push({ type: "image", title: "Image source", url });
    } else if (lower.includes("youtube.com") || lower.includes("youtu.be") || lower.endsWith(".mp4")) {
      media.push({ type: "video", title: "Video source", url });
    } else {
      sources.push({ title: "Web source", url });
    }
  }

  return { sources: sources.slice(0, 8), media: media.slice(0, 6) };
}

// ─── sendChat: web → Python backend | mobile → Groq direct ───────────────────
export async function sendChat(messages: ChatMessage[], language: string): Promise<ChatResult> {
  if (USE_BACKEND) {
    // Web: proxy through local Python backend (avoids CORS)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, language, web_search: true }),
        signal: controller.signal,
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || `Backend error ${response.status}`);
      }
      return (await response.json()) as ChatResult;
    } finally {
      clearTimeout(timeout);
    }
  }

  // Mobile: call Groq API directly
  const systemMsg = { role: "system" as const, content: systemPrompt(language) };
  const filtered = messages.filter((m) => m.role !== "system");
  const body = {
    model: GROQ_MODEL,
    messages: [systemMsg, ...filtered],
    temperature: 0.55,
    top_p: 0.9,
    max_tokens: 1024,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || `Groq error ${response.status}`);
    }
    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
    const text =
      (data.choices?.[0]?.message?.content ?? "").trim() ||
      "I am here with you. Could you ask that again in a different way?";
    const { sources, media } = extractLinks(text);
    return { text, sources, media };
  } finally {
    clearTimeout(timeout);
  }
}

// ─── fetchAffirmation ─────────────────────────────────────────────────────────
export async function fetchAffirmation(): Promise<{ text: string }> {
  if (USE_BACKEND) {
    try {
      const response = await fetch(`${BACKEND_URL}/affirmation`);
      if (!response.ok) throw new Error("Failed");
      return (await response.json()) as { text: string };
    } catch {
      return { text: "You are doing an incredible job, one day at a time." };
    }
  }

  try {
    const body = {
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: "You provide short, uplifting maternal affirmations. Maximum 15 words." },
        { role: "user", content: "Give me an affirmation for today." },
      ],
      temperature: 0.7,
      max_tokens: 60,
    };
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Failed");
    const data = (await response.json()) as { choices: { message: { content: string } }[] };
    const text = (data.choices?.[0]?.message?.content ?? "").trim();
    return { text: text || "You are doing an incredible job, one day at a time." };
  } catch {
    return { text: "You are doing an incredible job, one day at a time." };
  }
}

// ─── streamChat (falls back to sendChat) ─────────────────────────────────────
export async function streamChat(
  messages: ChatMessage[],
  language: string,
  handlers: {
    onToken: (token: string) => void;
    onDone: (result: ChatResult) => void;
    onError: (message: string) => void;
  }
) {
  try {
    const result = await sendChat(messages, language);
    handlers.onDone(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    handlers.onError(msg);
  }
}

// ─── TTS (stub — kept for compatibility) ─────────────────────────────────────
export async function transcribeAudio(
  audioBase64: string,
  mimeType: string,
  language: string
): Promise<{ text: string }> {
  throw new Error("transcribeAudio requires a running backend server.");
}

export async function requestTts(
  text: string,
  voice: string
): Promise<{ base64: string; mimeType: "audio/wav" }> {
  throw new Error("requestTts requires a running backend server.");
}
