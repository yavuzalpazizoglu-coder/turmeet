/*
 * SERP filtre paneli — URL query param'larını günceller.
 * Backend'e aynı param isimleri gider; filtre mantığı services/getVenues içinde.
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

export function VenueFilterPanel({ current }: { current: Record<string, string | undefined> }) {
  const router = useRouter();

  function apply(formData: FormData) {
    const params = new URLSearchParams();
    for (const key of ["q", "city", "stars", "capacity", "type", "eventType", "budget"]) {
      const val = formData.get(key);
      if (val) params.set(key, String(val));
    }
    // Checkbox'lar: işaretliyse "1" olarak gönderilir (MICE Inspection C.2 / I.1)
    for (const key of ["metro", "sustainable"]) {
      if (formData.get(key)) params.set(key, "1");
    }
    router.push(`/venues?${params.toString()}`);
  }

  return (
    <aside className="h-fit rounded-card border border-gray-200 bg-white p-5 lg:sticky lg:top-20">
      <p className="mb-4 text-sm font-bold uppercase tracking-wide text-ink">Filters</p>
      <form action={apply} className="space-y-4">
        <Field label="Keyword">
          <Input name="q" defaultValue={current.q} placeholder="Venue name..." />
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
        <Field label="Star rating">
          <Select name="stars" defaultValue={current.stars ?? ""}>
            <option value="">Any</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
          </Select>
        </Field>
        <Field label="Min. meeting capacity">
          <Select name="capacity" defaultValue={current.capacity ?? ""}>
            <option value="">Any</option>
            <option value="100">100+</option>
            <option value="500">500+</option>
            <option value="1000">1,000+</option>
            <option value="3000">3,000+</option>
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

        {/* MICE Inspection kriterleri (ICCA / IAPCO) */}
        <div className="border-t border-gray-100 pt-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">MICE criteria</p>
          <div className="space-y-4">
            <Field label="Event type">
              <Select name="eventType" defaultValue={current.eventType ?? ""}>
                <option value="">All event types</option>
                {EVENT_TYPES.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
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
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="metro"
                defaultChecked={current.metro === "1"}
                className="h-4 w-4 accent-brand"
              />
              Near metro / tram
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="sustainable"
                defaultChecked={current.sustainable === "1"}
                className="h-4 w-4 accent-brand"
              />
              Sustainability certified
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Apply filters
        </Button>
      </form>
    </aside>
  );
}
