/*
 * AI DESTEK ENDPOINT'İ — /api/ai-chat (MD 9.5 Chatbox / chatbot katmanı)
 *
 * Sağlayıcı soyutlaması: Gemini veya Claude, env ile seçilir.
 *   AI_PROVIDER=gemini|claude          (varsayılan: gemini)
 *   GEMINI_API_KEY=...                 (Google AI Studio)
 *   GEMINI_MODEL=gemini-2.5-flash     (opsiyonel)
 *   ANTHROPIC_API_KEY=...              (Anthropic Console)
 *   ANTHROPIC_MODEL=claude-sonnet-4-5 (opsiyonel)
 *
 * API anahtarı YOKSA istek FAQ anahtar-kelime motoruna düşer (faq.ts) —
 * böylece demo ortamında da kutu çalışır durumda kalır.
 *
 * Not: Anahtarlar SUNUCU tarafında kalır (NEXT_PUBLIC_ öneki yok);
 * tarayıcıya asla gönderilmez. Canlıda rate-limit + oturum bazlı
 * kota eklenmesi önerilir (bkz. docs/BACKEND_INTEGRATION.md).
 */
import { NextResponse } from "next/server";
import { autoReply } from "@/components/chat/faq";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

/** Modele verilen platform bağlamı — MD 9.5 chatbot görev tanımı */
const SYSTEM_PROMPT = `You are the Turmeet AI Assistant — the support chatbot of turmeet.com, Turkey's B2B MICE venue search engine (congresses, corporate meetings, incentives, retreats).

Facts you can rely on:
- 329+ verified venues, 89,000+ rooms, 2,500+ meeting halls across 34 cities in Turkey.
- Turmeet is 100% free for organizers; commission is paid by the venue after the event. The quoted price is the final price.
- Organizers send one request and receive live comparative offers from multiple hotels; contracts are e-signed on the platform and the client pays the venue directly.
- Groups of 30+ rooms get a dedicated coordinator free of charge. 150+ room congresses are fully managed by the D Event expert team.
- Every venue passes the D Event MICE inspection (capacity, transit access, service quality). Operated by D Event Turizm (Est. 2012, Istanbul, TURSAB No. 7514).
- Hotel/venue registrations are handled at devent-online.com or info@devent-online.com.
- Live human support is available Mon-Fri 09:00-18:00 Istanbul time; outside these hours you are the first line of support and can suggest leaving a message via the Messages panel.

Rules:
- Answer briefly (2-4 sentences), in the language the user writes in (English, Turkish or German).
- Never invent prices or availability — direct users to search at turmeet.com/venues and request quotes.
- For urgent operational issues (event tomorrow, payment problems), advise contacting the coordinator via the Messages panel or phone +90 216 573 18 36.`;

export async function POST(req: Request) {
  let turns: ChatTurn[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.messages)) turns = body.messages.slice(-12);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const lastUser = [...turns].reverse().find((t) => t.role === "user")?.content ?? "";
  if (!lastUser.trim()) {
    return NextResponse.json({ error: "No user message" }, { status: 400 });
  }

  const provider = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();

  try {
    if (provider === "claude" && process.env.ANTHROPIC_API_KEY) {
      const reply = await askClaude(turns);
      if (reply) return NextResponse.json({ reply, source: "claude" });
    }
    if (provider === "gemini" && process.env.GEMINI_API_KEY) {
      const reply = await askGemini(turns);
      if (reply) return NextResponse.json({ reply, source: "gemini" });
    }
  } catch {
    // Sağlayıcı hatası — sessizce FAQ motoruna düş
  }

  // Anahtar yok veya sağlayıcı hata verdi → FAQ anahtar-kelime motoru
  return NextResponse.json({ reply: autoReply(lastUser), source: "faq" });
}

/** Google Gemini — generateContent REST çağrısı */
async function askGemini(turns: ChatTurn[]): Promise<string | null> {
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: turns.map((t) => ({
          role: t.role === "assistant" ? "model" : "user",
          parts: [{ text: t.content }],
        })),
        generationConfig: { maxOutputTokens: 400, temperature: 0.4 },
      }),
    },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

/** Anthropic Claude — messages REST çağrısı */
async function askClaude(turns: ChatTurn[]): Promise<string | null> {
  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY as string,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: turns.map((t) => ({ role: t.role, content: t.content })),
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.content?.[0]?.text ?? null;
}
