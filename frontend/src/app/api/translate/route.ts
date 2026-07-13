/*
 * ÇEVİRİ API'Sİ — staff panelindeki mesaj çevirisi için.
 * Sağlayıcı zinciri (.env ile seçilir, anahtar yoksa bir alttakine düşer):
 *   1. TRANSLATE_PROVIDER=deepl  + DEEPL_API_KEY          → DeepL API
 *   2. TRANSLATE_PROVIDER=google + GOOGLE_TRANSLATE_API_KEY → Google Cloud Translation v2
 *   3. Anahtar yok → Google'ın anahtarsız gtx endpoint'i (demo/dev için yeterli)
 * İstek:  POST { text: string, target: "tr" | "en" }
 * Yanıt:  { translation: string, source: "deepl" | "google" | "gtx" }
 */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let text = "";
  let target = "tr";
  try {
    const body = await req.json();
    text = String(body.text ?? "").slice(0, 4000);
    target = body.target === "en" ? "en" : "tr";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!text.trim()) return NextResponse.json({ error: "Empty text" }, { status: 400 });

  const provider = (process.env.TRANSLATE_PROVIDER ?? "google").toLowerCase();

  try {
    if (provider === "deepl" && process.env.DEEPL_API_KEY) {
      const translation = await askDeepL(text, target);
      if (translation) return NextResponse.json({ translation, source: "deepl" });
    }
    if (process.env.GOOGLE_TRANSLATE_API_KEY) {
      const translation = await askGoogleCloud(text, target);
      if (translation) return NextResponse.json({ translation, source: "google" });
    }
  } catch {
    // Sağlayıcı hatası — sessizce anahtarsız endpoint'e düş
  }

  try {
    const translation = await askGtx(text, target);
    if (translation) return NextResponse.json({ translation, source: "gtx" });
  } catch {
    // gtx de erişilemez — aşağıda 502 döner
  }

  return NextResponse.json({ error: "Translation unavailable" }, { status: 502 });
}

/** DeepL — https://www.deepl.com/docs-api (free ve pro anahtarları desteklenir) */
async function askDeepL(text: string, target: string): Promise<string | null> {
  const key = process.env.DEEPL_API_KEY!;
  const host = key.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com";
  const res = await fetch(`https://${host}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: [text], target_lang: target.toUpperCase() }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.translations?.[0]?.text ?? null;
}

/** Google Cloud Translation v2 — https://cloud.google.com/translate/docs */
async function askGoogleCloud(text: string, target: string): Promise<string | null> {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY!;
  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, target, format: "text" }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.translations?.[0]?.translatedText ?? null;
}

/** Google gtx — anahtarsız hafif endpoint (resmi SLA'sı yoktur; dev/demo için) */
async function askGtx(text: string, target: string): Promise<string | null> {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" +
    target +
    "&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data?.[0])) return null;
  return data[0].map((seg: unknown[]) => (typeof seg?.[0] === "string" ? seg[0] : "")).join("");
}
