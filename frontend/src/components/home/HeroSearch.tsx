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
import { SearchIcon, MapPinIcon, CalendarIcon, UsersIcon, BuildingIcon } from "@/components/ui/icons";
import { EVENT_TYPES, BUDGET_SEGMENTS } from "@/lib/mice-criteria";

const CITIES = ["Istanbul", "Antalya", "Ankara", "Izmir", "Bursa", "Adana", "Nevşehir", "Cappadocia"];

export interface VenueSuggestion {
  name: string;
  slug: string;
  city: string;
}

export default function HeroSearch({ venues }: { venues: VenueSuggestion[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklanınca öneri menüsünü kapat
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const query = q.trim().toLowerCase();
  const cityMatches = query ? CITIES.filter((c) => c.toLowerCase().includes(query)).slice(0, 4) : [];
  const venueMatches = query
    ? venues.filter((v) => v.name.toLowerCase().includes(query) || v.city.toLowerCase().includes(query)).slice(0, 5)
    : [];
  const hasSuggestions = cityMatches.length > 0 || venueMatches.length > 0;

  function submit(formData: FormData) {
    const params = new URLSearchParams();
    // Şehir listesinde birebir eşleşme varsa city filtresi olarak gönder
    const qVal = String(formData.get("q") ?? "").trim();
    const exactCity = CITIES.find((c) => c.toLowerCase() === qVal.toLowerCase());
    if (exactCity) params.set("city", exactCity);
    else if (qVal) params.set("q", qVal);

    for (const key of ["checkin", "checkout", "capacity", "eventType", "budget"]) {
      const val = formData.get(key);
      if (val) params.set(key, String(val));
    }
    if (formData.get("metro")) params.set("metro", "1");
    router.push(`/venues?${params.toString()}`);
  }

  return (
    <form action={submit} className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white shadow-xl">
      {/* Satır 1: nerede · ne zaman · kaç kişi */}
      <div className="flex flex-col sm:flex-row sm:items-center">
        {/* Konum + öneri menüsü */}
        <div ref={boxRef} className="relative flex-1">
          <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-3.5 sm:border-r">
            <MapPinIcon size={18} className="shrink-0 text-muted" />
            <input
              name="q"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Search for venues or cities"
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

        {/* Tarihler — gerçek tarih seçici */}
        <div className="flex flex-1 items-center gap-2 border-b border-gray-200 px-5 py-3.5 sm:border-r">
          <CalendarIcon size={18} className="shrink-0 text-muted" />
          <input
            name="checkin"
            type="date"
            aria-label="Check-in date"
            className="w-full bg-transparent text-[13px] text-ink outline-none [color-scheme:light]"
          />
          <span className="text-muted">–</span>
          <input
            name="checkout"
            type="date"
            aria-label="Check-out date"
            className="w-full bg-transparent text-[13px] text-ink outline-none [color-scheme:light]"
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
          className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-8 text-[15px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
        >
          <SearchIcon size={17} /> Search
        </button>
      </div>
    </form>
  );
}
