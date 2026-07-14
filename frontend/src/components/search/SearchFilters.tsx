/*
 * DETAYLI MEKAN ARAMA — kompakt yatay filtre çubuğu.
 * Hem müşteri paneli (/app/search) hem public SERP (/venues) kullanır;
 * hedef sayfa `basePath` prop'u ile belirlenir.
 *
 * Tasarım kararı: filtreler sol sütun yerine üstte tek çubukta durur,
 * sonuç listesi tam genişlik kullanır — müşteri kaydırmadan arar.
 * İlk satır en önemli kriterler; "More filters" ile MICE Inspection
 * Formu'nun ileri kriterleri açılır (C/D/E/F/I bölümleri + puan).
 *
 * Filtre mantığı services/getVenues içinde; aynı param isimleri backend'e gider.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, ChevronDownIcon } from "@/components/ui/icons";
import { EVENT_TYPES, BUDGET_SEGMENTS, VENUE_TYPES } from "@/lib/mice-criteria";
import { MOCK_VENUES } from "@/mocks/venues";

/* Şehir listesi envanterden türetilir — önce büyük pazarlar, sonra alfabetik.
 * Backend'de GET /api/v1/cities endpoint'i aynı listeyi dönecek. */
const MAJOR_CITIES = ["Istanbul", "Antalya", "Ankara", "Izmir", "Bursa", "Nevşehir"];
const CITIES = [
  ...MAJOR_CITIES,
  ...[...new Set(MOCK_VENUES.map((v) => v.city))]
    .filter((c) => !MAJOR_CITIES.includes(c))
    .sort((a, b) => a.localeCompare(b, "tr")),
];
/* Mekan tipi etiketleri — merkezi ICCA sözlüğünden (lib/mice-criteria) */
const TYPES = VENUE_TYPES;

const TEXT_KEYS = [
  "q",
  "city",
  "stars",
  "type",
  "capacity",
  "eventType",
  "budget",
  "groupSize",
  "maxAirport",
  "maxCenter",
  "minRooms",
  "minMeetingRooms",
  "minScore",
];
const CHECKBOX_KEYS = ["metro", "sustainable", "hybrid", "accessible"];
const ADVANCED_KEYS = [
  "stars",
  "type",
  "capacity",
  "maxAirport",
  "maxCenter",
  "minRooms",
  "minMeetingRooms",
  "minScore",
  "sustainable",
  "hybrid",
  "accessible",
];

const selectCls =
  "h-10 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 text-sm text-ink outline-none focus:border-brand";
const checkCls = "flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 text-sm text-ink";

export function DetailedVenueFilters({
  current,
  basePath = "/app/search",
}: {
  current: Record<string, string | undefined>;
  basePath?: string;
}) {
  const router = useRouter();
  // İleri filtrelerden biri doluysa çubuk açık başlar
  const [more, setMore] = useState(ADVANCED_KEYS.some((k) => current[k]));

  function apply(formData: FormData) {
    const params = new URLSearchParams();
    for (const key of TEXT_KEYS) {
      const val = formData.get(key);
      if (val) params.set(key, String(val));
    }
    for (const key of CHECKBOX_KEYS) {
      if (formData.get(key)) params.set(key, "1");
    }
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <form action={apply} className="rounded-card border border-gray-200 bg-white p-3 shadow-card">
      {/* Satır 1 — en önemli kriterler + arama */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex h-10 min-w-[180px] flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3">
          <SearchIcon size={15} className="shrink-0 text-muted" />
          <input
            name="q"
            defaultValue={current.q}
            placeholder="Venue name or keyword..."
            className="w-full text-sm outline-none placeholder:text-muted"
          />
        </div>
        <select name="city" defaultValue={current.city ?? ""} className={selectCls} aria-label="City">
          <option value="">All cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select name="eventType" defaultValue={current.eventType ?? ""} className={selectCls} aria-label="Event type">
          <option value="">All event types</option>
          {EVENT_TYPES.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
        <select name="groupSize" defaultValue={current.groupSize ?? ""} className={selectCls} aria-label="Group size">
          <option value="">Any group size</option>
          <option value="small">0–50 pax</option>
          <option value="medium">50–250 pax</option>
          <option value="large">250–500 pax</option>
          <option value="mega">500+ pax</option>
        </select>
        <select name="budget" defaultValue={current.budget ?? ""} className={selectCls} aria-label="Budget">
          <option value="">Any budget</option>
          {BUDGET_SEGMENTS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
        <label className={checkCls}>
          <input type="checkbox" name="metro" value="1" defaultChecked={current.metro === "1"} className="h-4 w-4 accent-brand" />
          Metro
        </label>
        <button
          type="submit"
          className="flex h-10 items-center gap-1.5 rounded-lg bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          <SearchIcon size={15} /> Search
        </button>
        <button
          type="button"
          onClick={() => setMore((m) => !m)}
          aria-expanded={more}
          className="flex h-10 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm font-medium text-muted transition-colors hover:border-brand hover:text-brand"
        >
          More filters
          <ChevronDownIcon size={14} className={`transition-transform ${more ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Satır 2 — MICE Inspection ileri kriterleri (açılır) */}
      {more && (
        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-2">
          <select name="stars" defaultValue={current.stars ?? ""} className={selectCls} aria-label="Stars">
            <option value="">Any stars</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
          </select>
          <select name="type" defaultValue={current.type ?? ""} className={selectCls} aria-label="Venue type">
            <option value="">All types</option>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input
            name="capacity"
            type="number"
            min={1}
            defaultValue={current.capacity}
            placeholder="Min. attendees"
            className="h-10 w-32 rounded-lg border border-gray-200 px-2.5 text-sm outline-none placeholder:text-muted focus:border-brand"
          />
          <select name="maxAirport" defaultValue={current.maxAirport ?? ""} className={selectCls} aria-label="Airport distance">
            <option value="">Airport: any</option>
            <option value="10">Airport ≤ 10 km</option>
            <option value="30">Airport ≤ 30 km</option>
            <option value="45">Airport ≤ 45 km</option>
          </select>
          <select name="maxCenter" defaultValue={current.maxCenter ?? ""} className={selectCls} aria-label="Center distance">
            <option value="">Center: any</option>
            <option value="5">Center ≤ 5 km</option>
            <option value="20">Center ≤ 20 km</option>
          </select>
          <select name="minRooms" defaultValue={current.minRooms ?? ""} className={selectCls} aria-label="Total rooms">
            <option value="">Rooms: any</option>
            <option value="50">50+ rooms</option>
            <option value="150">150+ rooms</option>
            <option value="300">300+ rooms</option>
            <option value="500">500+ rooms</option>
          </select>
          <select
            name="minMeetingRooms"
            defaultValue={current.minMeetingRooms ?? ""}
            className={selectCls}
            aria-label="Meeting rooms"
          >
            <option value="">Halls: any</option>
            <option value="2">2+ halls</option>
            <option value="4">4+ halls</option>
            <option value="7">7+ halls</option>
          </select>
          {/* Denetim puanı — 10'luk gösterim dili (rozetlerle aynı); değerler backend'e 100'lük gider */}
          <select name="minScore" defaultValue={current.minScore ?? ""} className={selectCls} aria-label="Inspection score">
            <option value="">Inspection score: any</option>
            <option value="90">9.0+ Exceptional</option>
            <option value="85">8.5+ Excellent</option>
            <option value="80">8.0+ Very good</option>
          </select>
          <label className={checkCls}>
            <input
              type="checkbox"
              name="sustainable"
              value="1"
              defaultChecked={current.sustainable === "1"}
              className="h-4 w-4 accent-brand"
            />
            Eco-certified
          </label>
          <label className={checkCls}>
            <input type="checkbox" name="hybrid" value="1" defaultChecked={current.hybrid === "1"} className="h-4 w-4 accent-brand" />
            Hybrid studio
          </label>
          <label className={checkCls}>
            <input
              type="checkbox"
              name="accessible"
              value="1"
              defaultChecked={current.accessible === "1"}
              className="h-4 w-4 accent-brand"
            />
            Accessible
          </label>
          <button
            type="button"
            onClick={() => router.push(basePath)}
            className="ml-auto h-10 px-2 text-xs font-semibold text-brand hover:underline"
          >
            Reset all
          </button>
        </div>
      )}
    </form>
  );
}
