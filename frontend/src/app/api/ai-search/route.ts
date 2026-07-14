/*
 * AI ARAMA ÇÖZÜMLEME ENDPOINT'İ — /api/ai-search
 *
 * Ana sayfa arama kutusundaki serbest metni (TR/EN/DE, yazım hatalı,
 * karmaşık) arama sayfasının gerçek filtre param'larına çevirir.
 * Sağlayıcı soyutlaması /api/ai-chat ile aynıdır:
 *   AI_PROVIDER=gemini|claude          (varsayılan: gemini)
 *   GEMINI_API_KEY / ANTHROPIC_API_KEY (sunucu tarafında kalır)
 *
 * Anahtar YOKSA, sağlayıcı hata verirse veya 2,5 sn içinde yanıt
 * gelmezse { fallback: true } döner — istemci (HeroSearch) bu durumda
 * mevcut regex çözümleyicisine düşer; site anahtarsız da aynen çalışır.
 *
 * Dönen filtreler burada SUNUCUDA doğrulanır: yalnızca bilinen alanlar
 * ve geçerli sözlük değerleri geçirilir (LLM çıktısına asla körü
 * körüne güvenilmez). Ayrıntı: docs/AI_ENTEGRASYONU.md
 */
import { NextResponse } from "next/server";

/** Modelin doldurabileceği filtre alanları — arama sayfası sözlüğü */
interface ParsedFilters {
  city?: string;
  type?: string;
  eventType?: string;
  budget?: string;
  capacity?: number;
  stars?: number;
  metro?: boolean;
  hybrid?: boolean;
  sustainable?: boolean;
  accessible?: boolean;
  maxAirport?: number;
  minScore?: number;
  checkin?: string;
  checkout?: string;
  q?: string;
}

/** Envanterdeki şehirler + kullanıcı dilindeki takma adlar */
const CITIES = ["Istanbul", "Antalya", "Ankara", "Izmir", "Bursa", "Bodrum", "Adana", "Nevşehir"];
const CITY_ALIASES: Record<string, string> = {
  "istanbul": "Istanbul",
  "i̇stanbul": "Istanbul",
  "cappadocia": "Nevşehir",
  "kapadokya": "Nevşehir",
  "nevsehir": "Nevşehir",
};

const VENUE_TYPES = ["city_hotel", "resort", "congress_center", "boutique", "mountain_resort", "airport_hotel"];
const EVENT_TYPES = [
  "congress",
  "symposium",
  "corporate_meeting",
  "one_day",
  "incentive",
  "gala",
  "exhibition",
  "workshop",
  "hybrid",
];
const BUDGETS = ["economy", "mid", "upper", "luxury"];

const TIMEOUT_MS = 2500;

/** Modele verilen görev tanımı — katı JSON çıktısı istenir */
const SYSTEM_PROMPT = `You convert free-text venue search queries (Turkish, English or German) from turmeet.com — Turkey's B2B MICE venue search engine — into structured filters.

Return ONLY a JSON object with these optional fields (omit anything not clearly stated):
- city: one of ${CITIES.join(", ")} (map regions: Cappadocia/Kapadokya -> Nevşehir)
- type: venue category, one of ${VENUE_TYPES.join(", ")} (city_hotel = city & conference hotel, resort = resort congress hotel, congress_center = congress & exhibition center, boutique = boutique & retreat, mountain_resort = thermal & mountain resort, airport_hotel = airport conference hotel)
- eventType: ICCA/IAPCO meeting type, one of ${EVENT_TYPES.join(", ")}
- budget: one of ${BUDGETS.join(", ")}
- capacity: attendee count as integer (e.g. "300 kişilik" -> 300)
- stars: hotel stars 3, 4 or 5
- metro: true if near metro/tram is requested
- hybrid: true if hybrid/online streaming studio is requested
- sustainable: true if eco/sustainability certification is requested
- accessible: true if wheelchair accessibility is requested
- maxAirport: max airport distance in km if stated
- minScore: minimum inspection score 0-100 if stated
- checkin / checkout: ISO dates (YYYY-MM-DD) if concrete dates are given; assume the NEXT future occurrence (today is ${new Date().toISOString().slice(0, 10)})
- q: leftover venue/brand name to text-search (e.g. "Hilton"), lowercase, max 5 words

Never invent values. Respond with the JSON object only, no prose.`;

export async function POST(req: Request) {
  let query = "";
  try {
    const body = await req.json();
    query = String(body?.query ?? "").slice(0, 300).trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!query) return NextResponse.json({ error: "Empty query" }, { status: 400 });

  const provider = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();

  try {
    let raw: string | null = null;
    if (provider === "claude" && process.env.ANTHROPIC_API_KEY) {
      raw = await askClaude(query);
    } else if (provider === "gemini" && process.env.GEMINI_API_KEY) {
      raw = await askGemini(query);
    }
    if (raw) {
      const filters = sanitize(JSON.parse(raw));
      if (Object.keys(filters).length > 0) {
        return NextResponse.json({ filters, source: provider });
      }
    }
  } catch {
    // Zaman aşımı / sağlayıcı / parse hatası — sessizce fallback'e düş
  }

  // Anahtar yok veya çözümleme başarısız → istemci regex'e düşsün
  return NextResponse.json({ fallback: true });
}

/*
 * LLM çıktısı doğrulama — yalnızca bilinen alanlar, geçerli sözlük
 * değerleri ve makul aralıklar geçer. Bilinmeyen her şey atılır.
 */
function sanitize(data: unknown): ParsedFilters {
  const out: ParsedFilters = {};
  if (typeof data !== "object" || data === null) return out;
  const d = data as Record<string, unknown>;

  if (typeof d.city === "string") {
    const key = d.city.trim().toLowerCase();
    const city = CITY_ALIASES[key] ?? CITIES.find((c) => c.toLowerCase() === key);
    if (city) out.city = city;
  }
  if (typeof d.type === "string" && VENUE_TYPES.includes(d.type)) out.type = d.type;
  if (typeof d.eventType === "string" && EVENT_TYPES.includes(d.eventType)) out.eventType = d.eventType;
  if (typeof d.budget === "string" && BUDGETS.includes(d.budget)) out.budget = d.budget;

  const capacity = Number(d.capacity);
  if (Number.isFinite(capacity) && capacity >= 1 && capacity <= 100000) out.capacity = Math.round(capacity);

  const stars = Number(d.stars);
  if ([3, 4, 5].includes(stars)) out.stars = stars;

  for (const key of ["metro", "hybrid", "sustainable", "accessible"] as const) {
    if (d[key] === true) out[key] = true;
  }

  const maxAirport = Number(d.maxAirport);
  if (Number.isFinite(maxAirport) && maxAirport >= 1 && maxAirport <= 200) out.maxAirport = Math.round(maxAirport);

  const minScore = Number(d.minScore);
  if (Number.isFinite(minScore) && minScore >= 0 && minScore <= 100) out.minScore = Math.round(minScore);

  for (const key of ["checkin", "checkout"] as const) {
    if (typeof d[key] === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d[key] as string)) out[key] = d[key] as string;
  }

  if (typeof d.q === "string") {
    const q = d.q.trim().slice(0, 60);
    if (q.length >= 2) out.q = q;
  }
  return out;
}

/** Google Gemini — responseMimeType: application/json ile katı JSON */
async function askGemini(query: string): Promise<string | null> {
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: query }] }],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0,
          responseMimeType: "application/json",
        },
      }),
    },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

/** Anthropic Claude — JSON-only yanıt istenir, kod bloğu ayıklanır */
async function askClaude(query: string): Promise<string | null> {
  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY as string,
      "anthropic-version": "2023-06-01",
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      model,
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: query }],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const text: string = data?.content?.[0]?.text ?? "";
  // Model kod bloğuyla sararsa JSON gövdesini ayıkla
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
}
