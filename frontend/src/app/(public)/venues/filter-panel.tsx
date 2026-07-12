/*
 * SERP filtre paneli — URL query param'larını günceller.
 * Backend'e aynı param isimleri gider; filtre mantığı services/getVenues içinde.
 */
"use client";

import { useRouter } from "next/navigation";
import { Button, Select, Input, Field } from "@/components/ui";

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
    for (const key of ["q", "city", "stars", "capacity", "type"]) {
      const val = formData.get(key);
      if (val) params.set(key, String(val));
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
        <Button type="submit" className="w-full">
          Apply filters
        </Button>
      </form>
    </aside>
  );
}
