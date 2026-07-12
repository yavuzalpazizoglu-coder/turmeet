/*
 * WHATSAPP WIDGET — SSS içeriği ve otomatik cevap motoru.
 *
 * Backend entegrasyonu: Canlıya geçişte bu statik cevaplar yerine
 * WhatsApp Business API (Cloud API) webhook'u veya Turmeet destek
 * botu endpoint'i bağlanabilir. Şimdilik tamamen frontend'de çalışır.
 */

export const WHATSAPP_PHONE = "902165731836"; // D Event ana hat (+90 216 573 18 36) — canlıda WhatsApp Business numarası ile değiştirin

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  /** Serbest metinde eşleşme için anahtar kelimeler (küçük harf) */
  keywords: string[];
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "free",
    question: "Is Turmeet free for organizers?",
    answer:
      "Yes — Turmeet is 100% free for event organizers. No subscription fees, no service charges, no hidden costs. Commission is paid by the venue, never by you. The quoted price is the final price.",
    keywords: ["free", "commission", "fee", "cost", "price", "charge", "pay"],
  },
  {
    id: "quotes",
    question: "How do I get quotes from venues?",
    answer:
      "Create one request and receive live offers from multiple hotels at the same time. You can compare room rates, meeting packages, F&B options and cancellation terms side by side on one screen. Start at turmeet.com/venues or use the search on our homepage.",
    keywords: ["quote", "offer", "request", "rfp", "proposal", "compare"],
  },
  {
    id: "coordinator",
    question: "What about groups of 30+ rooms?",
    answer:
      "For groups of 30+ rooms, a dedicated Turmeet coordinator is assigned to your event — free of charge. Your coordinator supports negotiations, contract review and logistics so you can focus on the event itself.",
    keywords: ["coordinator", "30", "large", "group", "big", "contract", "negotiat"],
  },
  {
    id: "venues",
    question: "How many venues are on Turmeet?",
    answer:
      "329+ verified venues, 89,000+ rooms and 2,500+ meeting halls across 34 cities in Turkey — from Istanbul's congress hotels to Antalya's resorts and Cappadocia's boutique retreats. New properties join every week.",
    keywords: ["venue", "hotel", "city", "cities", "istanbul", "antalya", "how many", "list"],
  },
  {
    id: "response",
    question: "How fast do venues respond?",
    answer:
      "Most venues respond within 24–48 hours. Every request has a response deadline, and our team follows up with venues that haven't replied so you're never left waiting.",
    keywords: ["fast", "respond", "response", "how long", "wait", "time", "sla", "deadline"],
  },
  {
    id: "hotel-join",
    question: "I'm a hotel — how do I join?",
    answer:
      "Great! Hotel and venue registrations are handled by our partner team at D Event. Visit devent-online.com or email info@devent-online.com and we'll get you onboarded.",
    keywords: ["join", "partner", "register", "sign up", "list my", "our hotel", "supplier"],
  },
];

export const WELCOME_MESSAGE =
  "Hi! 👋 Welcome to Turmeet — Turkey's MICE venue search engine. How can we help? Pick a question below or type your own.";

export const FALLBACK_ANSWER =
  "Thanks for your message! A member of our team will get back to you shortly. For an instant reply, continue this chat on WhatsApp — or if you're logged in, use the Messages panel to reach your coordinator directly.";

/**
 * Serbest metin için basit anahtar-kelime eşleştirme.
 * Eşleşme yoksa fallback cevabı döner.
 */
export function autoReply(text: string): string {
  const lower = text.toLowerCase();
  let best: { item: FaqItem; hits: number } | null = null;
  for (const item of FAQ_ITEMS) {
    const hits = item.keywords.filter((k) => lower.includes(k)).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { item, hits };
  }
  return best ? best.item.answer : FALLBACK_ANSWER;
}

/** wa.me linki — konuşma geçmişini ön-doldurulmuş metin olarak taşır */
export function waLink(prefill?: string): string {
  const text = prefill ?? "Hello Turmeet! I have a question about planning an event in Turkey.";
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
