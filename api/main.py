from __future__ import annotations

import base64
import json
import os
import re
import io
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
import groq
from dotenv import load_dotenv
from pydantic import BaseModel, Field

APP_DIR = Path(__file__).resolve().parent
CACHE_FILE = APP_DIR / ".cache" / "affirmations.json"
load_dotenv(APP_DIR / ".env")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "groq/compound")
GROQ_STT_MODEL = "whisper-large-v3"

app = FastAPI(title="Maa Local API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(default_factory=list)
    language: str = "English"
    web_search: bool = True

class SttRequest(BaseModel):
    audio_base64: str
    mime_type: str = "audio/m4a"
    language: str = "English"

def _get_client() -> groq.Groq:
    if not GROQ_API_KEY.strip():
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not set in .env")
    return groq.Groq(api_key=GROQ_API_KEY)

def _system_prompt(language: str) -> str:
    return (
        "You are Maa, an advanced and empathetic maternal health assistant acting as a top gynecologist. "
        "Provide highly practical, evidence-based, and medically cautious support based on real articles, "
        "medical guidelines (like ACOG or WHO), and factual data. "
        "If the user asks for urgent symptoms, suggest contacting emergency care immediately. "
        f"Always respond in this language: {language}. "
        "Explicitly cite current, verifiable articles and medical facts when providing medical advice."
    )

def _extract_links(text: str) -> tuple[list[dict[str, str]], list[dict[str, str]]]:
    urls = re.findall(r"https?://[^\s)\]]+", text)
    seen: set[str] = set()
    media: list[dict[str, str]] = []
    sources: list[dict[str, str]] = []

    for url in urls:
        clean_url = url.strip().rstrip(".,")
        if clean_url in seen:
            continue
        seen.add(clean_url)

        lower = clean_url.lower()
        if any(lower.endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".webp", ".gif"]) or "images" in lower:
            media.append({"type": "image", "title": "Image source", "url": clean_url})
        elif "youtube.com" in lower or "youtu.be" in lower or lower.endswith(".mp4"):
            media.append({"type": "video", "title": "Video source", "url": clean_url})
        else:
            sources.append({"title": "Web source", "url": clean_url})

    return sources[:8], media[:6]

def _build_groq_messages(language: str, messages: list[ChatMessage]) -> list[dict[str, str]]:
    formatted = [{"role": "system", "content": _system_prompt(language)}]
    for msg in messages:
        if msg.role != "system":
            formatted.append({"role": msg.role, "content": msg.content})
    return formatted

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "provider": "groq"}

@app.post("/chat")
def chat(payload: ChatRequest) -> dict[str, object]:
    if not payload.messages:
        raise HTTPException(status_code=400, detail="messages must not be empty")

    client = _get_client()
    messages = _build_groq_messages(payload.language, payload.messages)

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            temperature=0.55,
            top_p=0.9,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Groq request failed: {exc}") from exc

    text = (response.choices[0].message.content or "").strip()
    if not text:
        text = "I am here with you. Could you ask that again in a different way?"

    sources, media = _extract_links(text)
    return {"text": text, "sources": sources, "media": media}

@app.post("/chat/stream")
def chat_stream(payload: ChatRequest):
    if not payload.messages:
        raise HTTPException(status_code=400, detail="messages must not be empty")

    client = _get_client()
    messages = _build_groq_messages(payload.language, payload.messages)

    def event_stream():
        full_text = ""
        try:
            stream = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=messages,
                temperature=0.55,
                top_p=0.9,
                stream=True
            )
            for chunk in stream:
                token = chunk.choices[0].delta.content or ""
                if not token:
                    continue
                full_text += token
                yield f"event: token\ndata: {json.dumps({'text': token}, ensure_ascii=True)}\n\n"

            sources, media = _extract_links(full_text)
            done_payload = {"text": full_text.strip(), "sources": sources, "media": media}
            yield f"event: done\ndata: {json.dumps(done_payload, ensure_ascii=True)}\n\n"
        except Exception as exc:
            yield f"event: error\ndata: {json.dumps({'message': str(exc)}, ensure_ascii=True)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.post("/stt")
def stt(payload: SttRequest) -> dict[str, str]:
    client = _get_client()

    encoded = payload.audio_base64.strip()
    if "," in encoded and encoded.startswith("data:"):
        encoded = encoded.split(",", 1)[1]

    try:
        audio_bytes = base64.b64decode(encoded)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid base64 audio: {exc}") from exc

    if not audio_bytes:
        raise HTTPException(status_code=400, detail="audio_base64 must not be empty")

    try:
        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = "audio.m4a"
        response = client.audio.transcriptions.create(
            file=audio_file,
            model=GROQ_STT_MODEL,
            response_format="json",
            language="en" if payload.language == "English" else None
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Groq transcription failed: {exc}") from exc

    text = (response.text or "").strip()
    if not text:
        raise HTTPException(status_code=502, detail="Empty transcription response")

    return {"text": text}

@app.get("/affirmation")
def affirmation() -> dict[str, str]:
    cache = _read_affirmation_cache()
    today = date.today().isoformat()
    if today in cache:
        return {"text": cache[today]}

    client = _get_client()
    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You provide short, uplifting maternal affirmations. Maximum 15 words."},
                {"role": "user", "content": "Give me an affirmation for today."}
            ],
            temperature=0.7,
        )
        text = (response.choices[0].message.content or "").strip()
    except Exception:
        text = "You are doing an incredible job, one day at a time."

    cache[today] = text
    _write_affirmation_cache(cache)
    return {"text": text}

def _read_affirmation_cache() -> dict[str, str]:
    if not CACHE_FILE.exists():
        return {}
    try:
        return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}

def _write_affirmation_cache(cache: dict[str, str]) -> None:
    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    CACHE_FILE.write_text(json.dumps(cache, ensure_ascii=True, indent=2), encoding="utf-8")
