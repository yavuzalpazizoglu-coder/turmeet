/*
 * HERO ARAMA — anasayfa arama kutusu (aktif / tıklanabilir sürüm).
 *
 * Özellikler:
 *  - Şehir / mekan yazarken tıklanabilir öneri menüsü açılır
 *    (şehir → /venues?city=X, mekan → /venues/{slug})
 *  - "Add dates" gerçek tarih seçicidir (check-in / check-out)
 *  - Form gönderimi tüm kriterlerle /venues sonuç sayfasına gider
 *
 * Backend: öneriler canlıda GET /api/v1/search/suggest endpoint'inden
 * gelecek; şimdilik props ile gelen mock mekan listesi kullanılır.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, MapPinIcon, CalendarIcon, UsersIcon, BuildingIcon, GridIcon } from "@/components/ui/icons";
import { EVENT_TYPES, BUDGET_SEGMENTS, VENUE_TYPES } from "@/lib/mice-criteria";

const CITIES = ["Istanbul", "Antalya", "Ankara", "Izmir", "Bursa", "Bodrum", "Adana", "Nevşehir"];

/** Kullanıcının yazdığı bölge adları → envanterdeki şehir adı */
const CITY_ALIASES: Record<string, string> = { cappadocia: "Nevşehir", kapadokya: "Nevşehir" };

/** Arama kutusunun altında chip olarak gösterilen popüler şehirler */
const POPULAR_CITIES = ["Istanbul", "Antalya", "Ankara", "Cappadocia", "Izmir"];

/*
 * Daktilo efekti — placeholder'da harf harf yazılan örnek aramalar.
 * Featured hotels vitrini ile aynı dil: ICCA mekan kategorileri
 * (city & conference hotel / resort congress hotel / congress &
 * exhibition center) + MICE istatistikleri (pax, halls, metro).
 */
const PLACEHOLDER_QUERIES = [
  "City & conference hotel in Istanbul · 300 pax",
  "Resort congress hotel in Antalya · incentive",
  "Congress & exhibition center · 2,000 pax",
  "Boutique retreat in Cappadocia · 60 pax",
  "Near metro in Ankara · hybrid studio",
];

export interface VenueSuggestion {
  name: string;
  slug: string;
  city: string;
}

/*
 * AKILLI SORGU ÇÖZÜMLEME — serbest metin, arama sayfasının gerçek
 * filtre param'larına çevrilir (?city=&type=&eventType=&capacity=&metro=).
 * Örn. "Congress & exhibition center in Istanbul · 2,000 pax" →
 * type=congress_center & city=Istanbul & capacity=2000.
 * Böylece daktilo placeholder'daki örnek sorgular birebir çalışır.
 */
const TYPE_KEYWORDS: [RegExp, string][] = [
  [/congress\s*&?\s*exhibition\s*(center|centre|hub)?|exhibition\s*(center|centre)|congress\s*(center|centre)/, "congress_center"],
  [/city\s*&?\s*conference\s*hotel|conference\s*hotel|city\s*hotel/, "city_hotel"],
  [/resort/, "resort"],
  [/boutique|retreat/, "boutique"],
  [/thermal|mountain/, "mountain_resort"],
  [/airport\s*(conference\s*)?hotel/, "airport_hotel"],
];

const EVENT_KEYWORDS: [RegExp, string][] = [
  [/incentive|reward/, "incentive"],
  [/gala|dinner/, "gala"],
  [/workshop|training/, "workshop"],
  [/hybrid|online/, "hybrid"],
  [/symposium|seminar/, "symposium"],
  [/trade\s*fair|fair|exhibition/, "exhibition"],
  [/congress|conference/, "congress"],
  [/corporate|company\s*meeting/, "corporate_meeting"],
];

/** Kalan metinden atılan dolgu sözcükleri — geriye mekan adı kalır */
const STOPWORDS = new Set(["in", "near", "at", "the", "a", "an", "for", "with", "and", "hotel", "hotels", "venue", "venues", "studio", "pax"]);

function parseQuery(raw: string): URLSearchParams {
  const params = new URLSearchParams();
  let text = ` ${raw.toLowerCase()} `;

  // 1. Şehir — tam ad veya takma ad (Cappadocia → Nevşehir)
  for (const [alias, target] of Object.entries(CITY_ALIASES)) {
    if (text.includes(alias)) {
      params.set("city", target);
      text = text.replace(alias, " ");
      break;
    }
  }
  if (!params.has("city")) {
    for (const c of CITIES) {
      if (text.includes(c.toLowerCase())) {
        params.set("city", c);
        text = text.replace(c.toLowerCase(), " ");
        break;
      }
    }
  }

  // 2. ICCA mekan kategorisi
  for (const [re, val] of TYPE_KEYWORDS) {
    const m = text.match(re);
    if (m) {
      params.set("type", val);
      text = text.replace(m[0], " ");
      break;
    }
  }

  // 3. Metro / hibrit stüdyo anahtar kelimeleri
  if (/metro|tram/.test(text)) {
    params.set("metro", "1");
    text = text.replace(/near\s*metro|metro|tram/g, " ");
  }
  if (/hybrid\s*studio/.test(text)) {
    params.set("hybrid", "1");
    text = text.replace(/hybrid\s*studio/g, " ");
  }

  // 4. ICCA/IAPCO etkinlik tipi
  for (const [re, val] of EVENT_KEYWORDS) {
    const m = text.match(re);
    if (m) {
      params.set("eventType", val);
      text = text.replace(m[0], " ");
      break;
    }
  }

  // 5. Katılımcı sayısı — "300 pax / 2,000 people" veya çıplak sayı
  const cap = text.match(/(\d[\d,.]*)\s*(pax|people|person|guests?|attendees?)/) ?? text.match(/(\d{2,}[\d,.]*)/);
  if (cap) {
    const n = Number(cap[1].replace(/[,.]/g, ""));
    if (n > 0) params.set("capacity", String(n));
    text = text.replace(cap[0], " ");
  }

  // 6. Kalan anlamlı metin → mekan adı araması (q)
  const leftover = text
    .replace(/[·,&\-–—]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w))
    .join(" ")
    .trim();
  if (leftover.length >= 3) params.set("q", leftover);

  return params;
}

/** Gün ekleme — check-in seçilince check-out otomatik önerilir */
function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function HeroSearch({ venues }: { venues: VenueSuggestion[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [searching, setSearching] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** Tarih alanının herhangi bir yerine tıklanınca takvim açılır */
  function openPicker(e: React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) {
    try {
      e.currentTarget.showPicker?.();
    } catch {
      /* showPicker kullanıcı etkileşimi dışında çağrılırsa sessizce geç */
    }
  }

  // Dışarı tıklanınca öneri menüsünü kapat
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /*
   * Daktilo efekti: örnek aramalar placeholder'a harf harf yazılır,
   * bekler, harf harf silinir, sıradakine geçer. Kullanıcı kutuya
   * yazmaya başlayınca (q dolu) animasyon durur.
   */
  useEffect(() => {
    if (q) return; // kullanıcı yazıyor — animasyonu durdur
    let qi = 0; // hangi örnek sorgu
    let ci = 0; // kaç karakter yazıldı
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const text = PLACEHOLDER_QUERIES[qi];
      if (!deleting) {
        ci++;
        setPlaceholder(text.slice(0, ci));
        if (ci === text.length) {
          deleting = true;
          timer = setTimeout(tick, 2200); // tam yazılmış halde bekle
          return;
        }
        timer = setTimeout(tick, 55);
      } else {
        ci--;
        setPlaceholder(text.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          qi = (qi + 1) % PLACEHOLDER_QUERIES.length;
          timer = setTimeout(tick, 400);
          return;
        }
        timer = setTimeout(tick, 28);
      }
    }

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [q]);

  const query = q.trim().toLowerCase();
  // Takma adlar da şehir önerisine girer (Cappadocia → Nevşehir envanteri)
  const aliasMatches = query
    ? Object.entries(CITY_ALIASES)
        .filter(([alias]) => alias.includes(query) || query.includes(alias))
        .map(([, target]) => target)
    : [];
  const cityMatches = query
    ? [...new Set([...CITIES.filter((c) => c.toLowerCase().includes(query)), ...aliasMatches])].slice(0, 4)
    : [];
  const venueMatches = query
    ? venues.filter((v) => v.name.toLowerCase().includes(query) || v.city.toLowerCase().includes(query)).slice(0, 5)
    : [];
  // ICCA mekan kategorisi ve toplantı tipi önerileri — "congress",
  // "incentive" gibi tarifler yazınca tıklanabilir seçenek çıkar
  const typeMatches = query ? VENUE_TYPES.filter((t) => t.label.toLowerCase().includes(query)).slice(0, 3) : [];
  const eventMatches = query ? EVENT_TYPES.filter((e) => e.label.toLowerCase().includes(query)).slice(0, 3) : [];
  const hasSuggestions = cityMatches.length > 0 || venueMatches.length > 0 || typeMatches.length > 0 || eventMatches.length > 0;

  /*
   * AI çözümleme — /api/ai-search serbest metni filtrelere çevirir
   * (TR/EN/DE, yazım hatalı, karmaşık sorgular). Anahtar yoksa, hata
   * olursa veya 3 sn içinde yanıt gelmezse null döner → regex yedeği.
   */
  async function aiParse(raw: string): Promise<URLSearchParams | null> {
    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: raw }),
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.filters || typeof data.filters !== "object") return null;

      const params = new URLSearchParams();
      for (const [key, val] of Object.entries(data.filters as Record<string, unknown>)) {
        if (val === true) params.set(key, "1"); // metro/hybrid/sustainable/accessible
        else if (typeof val === "string" || typeof val === "number") params.set(key, String(val));
      }
      return params.size > 0 ? params : null;
    } catch {
      return null; // ağ hatası / zaman aşımı — regex yedeğine düş
    }
  }

  async function submit(formData: FormData) {
    // Serbest metin önce AI ile, olmazsa regex ile filtrelere çevrilir:
    // şehir / kategori / toplantı tipi / pax / metro (arama sayfası dili)
    const qVal = String(formData.get("q") ?? "").trim();
    let params: URLSearchParams | null = null;
    if (qVal) {
      setSearching(true);
      params = await aiParse(qVal);
      setSearching(false);
    }
    params ??= qVal ? parseQuery(qVal) : new URLSearchParams();

    // Formdaki açık seçimler serbest metinden türeyenleri ezer
    for (const key of ["checkin", "checkout", "capacity", "eventType", "budget"]) {
      const val = formData.get(key);
      if (val) params.set(key, String(val));
    }
    if (formData.get("metro")) params.set("metro", "1");
    router.push(`/venues?${params.toString()}`);
  }

  return (
    <>
    <form action={submit} className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white shadow-xl">
      {/* Satır 1: nerede · ne zaman · kaç kişi */}
      <div className="flex flex-col sm:flex-row sm:items-center">
        {/* Konum + öneri menüsü */}
        <div ref={boxRef} className="relative flex-1">
          <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-3.5 sm:border-r">
            <MapPinIcon size={18} className="shrink-0 text-muted" />
            <input
              ref={inputRef}
              name="q"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder || "Search for venues or cities"}
              autoComplete="off"
              className="w-full text-[15px] outline-none placeholder:text-muted"
            />
          </div>

          {/* Tıklanabilir öneri menüsü */}
          {open && hasSuggestions && (
            <div className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 text-left shadow-xl">
              {cityMatches.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => router.push(`/venues?city=${encodeURIComponent(c)}`)}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-brand-light"
                >
                  <MapPinIcon size={15} className="shrink-0 text-brand" />
                  <span className="font-semibold">{c}</span>
                  <span className="ml-auto text-xs text-muted">City</span>
                </button>
              ))}
              {/* ICCA mekan kategorileri — tarif yazınca kategoriye arama */}
              {typeMatches.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => router.push(`/venues?type=${encodeURIComponent(t.value)}`)}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-brand-light"
                >
                  <GridIcon size={15} className="shrink-0 text-brand" />
                  <span className="font-medium">{t.label}</span>
                  <span className="ml-auto text-xs text-muted">Venue category</span>
                </button>
              ))}
              {/* ICCA/IAPCO toplantı tipleri — "incentive" gibi tarifler */}
              {eventMatches.map((e) => (
                <button
                  key={e.value}
                  type="button"
                  onClick={() => router.push(`/venues?eventType=${encodeURIComponent(e.value)}`)}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-brand-light"
                >
                  <CalendarIcon size={15} className="shrink-0 text-brand" />
                  <span className="font-medium">{e.label}</span>
                  <span className="ml-auto text-xs text-muted">Meeting type</span>
                </button>
              ))}
              {venueMatches.map((v) => (
                <button
                  key={v.slug}
                  type="button"
                  onClick={() => router.push(`/venues/${v.slug}`)}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-brand-light"
                >
                  <BuildingIcon size={15} className="shrink-0 text-muted" />
                  <span className="truncate">{v.name}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted">{v.city}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tarihler — alana tıklanınca takvim açılır; check-in seçilince
            check-out otomatik +2 gece önerilir (elle değiştirilebilir) */}
        <div className="flex flex-1 items-center gap-2 border-b border-gray-200 px-5 py-3.5 sm:border-r">
          <CalendarIcon size={18} className="shrink-0 text-muted" />
          <input
            name="checkin"
            type="date"
            aria-label="Check-in date"
            value={checkin}
            min={new Date().toISOString().slice(0, 10)}
            onClick={openPicker}
            onFocus={openPicker}
            onChange={(e) => {
              const v = e.target.value;
              setCheckin(v);
              if (v && (!checkout || checkout <= v)) setCheckout(addDays(v, 2));
            }}
            className="w-full cursor-pointer bg-transparent text-[13px] text-ink outline-none [color-scheme:light]"
          />
          <span className="text-muted">–</span>
          <input
            name="checkout"
            type="date"
            aria-label="Check-out date"
            value={checkout}
            min={checkin || undefined}
            onClick={openPicker}
            onFocus={openPicker}
            onChange={(e) => setCheckout(e.target.value)}
            className="w-full cursor-pointer bg-transparent text-[13px] text-ink outline-none [color-scheme:light]"
          />
        </div>

        <div className="flex flex-1 items-center gap-2 border-b border-gray-200 px-5 py-3.5">
          <UsersIcon size={18} className="shrink-0 text-muted" />
          <input
            name="capacity"
            type="number"
            min={1}
            placeholder="Attendees (e.g. 50)"
            className="w-full text-[15px] outline-none placeholder:text-muted"
          />
        </div>
      </div>

      {/* Satır 2: toplantı tipi (ICCA/IAPCO) · bütçe · metro · ara */}
      <div className="flex flex-col gap-2 p-2 sm:flex-row sm:items-center">
        <select
          name="eventType"
          defaultValue=""
          className="h-11 flex-1 cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-sm text-ink outline-none focus:border-brand"
        >
          <option value="">Meeting type (ICCA / IAPCO)</option>
          {EVENT_TYPES.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
        <select
          name="budget"
          defaultValue=""
          className="h-11 flex-1 cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-sm text-ink outline-none focus:border-brand"
        >
          <option value="">Any budget</option>
          {BUDGET_SEGMENTS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label} hotel
            </option>
          ))}
        </select>
        <label className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm text-ink">
          <input type="checkbox" name="metro" value="1" className="h-4 w-4 accent-brand" />
          Near metro
        </label>
        <button
          type="submit"
          disabled={searching}
          className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-8 text-[15px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark disabled:opacity-80"
        >
          <SearchIcon size={17} /> {searching ? "Searching..." : "Search"}
        </button>
      </div>
    </form>

    {/* Popüler şehirler — tıklanınca arama kutusuna yazılır ve öneriler açılır */}
    <div className="hero-text-shadow mt-5 flex flex-wrap items-center justify-center gap-2">
      <span className="text-sm font-semibold text-white">Popular:</span>
      {POPULAR_CITIES.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => {
            setQ(c);
            setOpen(true);
            inputRef.current?.focus();
          }}
          className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-white/70 hover:bg-white/25 hover:shadow-[0_0_12px_rgba(255,255,255,0.35)]"
        >
          {c}
        </button>
      ))}
    </div>
    </>
  );
}
