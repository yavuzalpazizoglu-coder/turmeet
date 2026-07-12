/*
 * DETAYLI MEKAN ARAMA FİLTRESİ — Müşteri paneli (platformun en detaylı araması).
 *
 * Kriter kaynağı: D Event "MICE Inspection & Değerlendirme Formu"
 * (ICCA / IAPCO / TUROB Standartları, Sürüm 2.0 — Temmuz 2026).
 * Bölüm eşlemesi:
 *   B.1 Bütçe segmenti · B.2 Grup büyüklüğü · B.3 Etkinlik tipi
 *   C.1 Havalimanı mesafesi · C.2 Metro/toplu taşıma · C.4 Merkeze yakınlık
 *   D.1 Toplam oda · D.4 Engelli erişim
 *   E.1 Ana salon kapasitesi · E.2 Break-out salon sayısı
 *   F.3 Hibrit & online yayın · I.1 Sürdürülebilirlik sertifikası
 *   Puan skalası → min. D Event inspection puanı (85 Premium / 70 Çok iyi / 55 Uygun)
 *
 * Filtre mantığı services/getVenues içinde; aynı param isimleri backend'e gider.
 */
"use client";

import { useRouter } from "next/navigation";
import { Button, Select, Input, Field } from "@/components/ui";
import { EVENT_TYPES, BUDGET_SEGMENTS } from "@/lib/mice-criteria";

const CITIES = ["Istanbul", "Antalya", "Ankara", "Izmir", "Bursa", "Adana", "Nevşehir"];
const TYPES: { value: string; label: string }[] = [
  { value: "city_hotel", label: "City Hotel" },
  { value: "resort", label: "Resort" },
  { value: "congress_center", label: "Congress Center" },
  { value: "boutique", label: "Boutique" },
];

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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">{children}</p>;
}

export function DetailedVenueFilters({ current }: { current: Record<string, string | undefined> }) {
  const router = useRouter();

  function apply(formData: FormData) {
    const params = new URLSearchParams();
    for (const key of TEXT_KEYS) {
      const val = formData.get(key);
      if (val) params.set(key, String(val));
    }
    for (const key of CHECKBOX_KEYS) {
      if (formData.get(key)) params.set(key, "1");
    }
    router.push(`/app/search?${params.toString()}`);
  }

  return (
    <aside className="h-fit rounded-card border border-gray-200 bg-white p-5 lg:sticky lg:top-20">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold uppercase tracking-wide text-ink">Detailed search</p>
        <button
          type="button"
          onClick={() => router.push("/app/search")}
          className="text-xs font-semibold text-brand hover:underline"
        >
          Reset
        </button>
      </div>

      <form action={apply} className="space-y-5">
        {/* ── Temel ── */}
        <div className="space-y-4">
          <Field label="Keyword">
            <Input name="q" defaultValue={current.q} placeholder="Venue name or city..." />
          </Field>
          <Field label="City">
            <Select name="city" defaultValue={current.city ?? ""}>
              <option value="">All cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stars">
              <Select name="stars" defaultValue={current.stars ?? ""}>
                <option value="">Any</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
              </Select>
            </Field>
            <Field label="Venue type">
              <Select name="type" defaultValue={current.type ?? ""}>
                <option value="">All types</option>
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </div>

        {/* ── B. Etkinlik & bütçe uyumu ── */}
        <div className="border-t border-gray-100 pt-4">
          <SectionTitle>Event &amp; budget fit</SectionTitle>
          <div className="space-y-4">
            <Field label="Event type (ICCA / IAPCO)">
              <Select name="eventType" defaultValue={current.eventType ?? ""}>
                <option value="">All event types</option>
                {EVENT_TYPES.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Group size">
              <Select name="groupSize" defaultValue={current.groupSize ?? ""}>
                <option value="">Any group size</option>
                <option value="small">Small group (0–50)</option>
                <option value="medium">Medium group (50–250)</option>
                <option value="large">Large group (250–500)</option>
                <option value="mega">Mega group (500+)</option>
              </Select>
            </Field>
            <Field label="Budget segment">
              <Select name="budget" defaultValue={current.budget ?? ""}>
                <option value="">Any budget</option>
                {BUDGET_SEGMENTS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Min. attendees (theatre)">
              <Input name="capacity" type="number" min={1} defaultValue={current.capacity} placeholder="e.g. 200" />
            </Field>
          </div>
        </div>

        {/* ── C. Konum & ulaşım ── */}
        <div className="border-t border-gray-100 pt-4">
          <SectionTitle>Location &amp; transit</SectionTitle>
          <div className="space-y-4">
            <Field label="Airport distance">
              <Select name="maxAirport" defaultValue={current.maxAirport ?? ""}>
                <option value="">Any distance</option>
                <option value="10">Within 10 km (close)</option>
                <option value="30">Within 30 km</option>
                <option value="45">Within 45 km</option>
              </Select>
            </Field>
            <Field label="City / congress center distance">
              <Select name="maxCenter" defaultValue={current.maxCenter ?? ""}>
                <option value="">Any distance</option>
                <option value="5">Within 5 km (central)</option>
                <option value="20">Within 20 km</option>
              </Select>
            </Field>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input type="checkbox" name="metro" defaultChecked={current.metro === "1"} className="h-4 w-4 accent-brand" />
              Near metro / tram
            </label>
          </div>
        </div>

        {/* ── D + E. Konaklama & toplantı altyapısı ── */}
        <div className="border-t border-gray-100 pt-4">
          <SectionTitle>Accommodation &amp; meeting capacity</SectionTitle>
          <div className="space-y-4">
            <Field label="Total rooms">
              <Select name="minRooms" defaultValue={current.minRooms ?? ""}>
                <option value="">Any size</option>
                <option value="50">50+ rooms</option>
                <option value="150">150+ rooms</option>
                <option value="300">300+ rooms</option>
                <option value="500">500+ rooms</option>
              </Select>
            </Field>
            <Field label="Break-out / meeting rooms">
              <Select name="minMeetingRooms" defaultValue={current.minMeetingRooms ?? ""}>
                <option value="">Any number</option>
                <option value="2">2+ rooms</option>
                <option value="4">4+ rooms</option>
                <option value="7">7+ rooms</option>
              </Select>
            </Field>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="accessible"
                defaultChecked={current.accessible === "1"}
                className="h-4 w-4 accent-brand"
              />
              Accessible rooms (ADA / ICCA)
            </label>
          </div>
        </div>

        {/* ── F + I. Teknik & sürdürülebilirlik ── */}
        <div className="border-t border-gray-100 pt-4">
          <SectionTitle>Technical &amp; sustainability</SectionTitle>
          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input type="checkbox" name="hybrid" defaultChecked={current.hybrid === "1"} className="h-4 w-4 accent-brand" />
              Hybrid / online broadcast studio
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="sustainable"
                defaultChecked={current.sustainable === "1"}
                className="h-4 w-4 accent-brand"
              />
              Sustainability certified (GreenKey, ISO 14001, LEED...)
            </label>
          </div>
        </div>

        {/* ── D Event inspection puanı ── */}
        <div className="border-t border-gray-100 pt-4">
          <SectionTitle>D Event MICE score</SectionTitle>
          <Field label="Minimum inspection score">
            <Select name="minScore" defaultValue={current.minScore ?? ""}>
              <option value="">Any score</option>
              <option value="85">85+ — Premium</option>
              <option value="70">70+ — Very good</option>
              <option value="55">55+ — Suitable</option>
            </Select>
          </Field>
        </div>

        <Button type="submit" className="w-full">
          Apply filters
        </Button>
      </form>
    </aside>
  );
}
