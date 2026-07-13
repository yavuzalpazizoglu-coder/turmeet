/*
 * PANEL İÇİ MEKAN ARAMA — platformun EN DETAYLI araması (master 4.2).
 * Düzen: üstte kompakt yatay filtre çubuğu (detailed-filters.tsx),
 * altında az yer kaplayan sıra kartlar — müşteri kaydırmadan gezer.
 * Filtre kriterleri D Event MICE Inspection Formu'ndan gelir.
 */
import { PageHeader } from "@/components/ui";
import { getVenues } from "@/services";
import { DetailedVenueFilters } from "./detailed-filters";
import { SearchResults } from "./search-results";

export const metadata = { title: "Venue Search — Turmeet" };

export default async function PanelSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const venues = await getVenues({
    q: params.q,
    city: params.city,
    stars: params.stars ? Number(params.stars) : undefined,
    minCapacity: params.capacity ? Number(params.capacity) : undefined,
    type: params.type,
    eventType: params.eventType,
    budget: params.budget,
    metro: params.metro,
    sustainable: params.sustainable,
    groupSize: params.groupSize,
    maxAirport: params.maxAirport,
    maxCenter: params.maxCenter,
    minRooms: params.minRooms,
    minMeetingRooms: params.minMeetingRooms,
    hybrid: params.hybrid,
    accessible: params.accessible,
    minScore: params.minScore,
  });

  return (
    <>
      <PageHeader
        title="Venue search"
        description="The most detailed search on the platform — filter by MICE inspection criteria and add venues to a new quote request."
      />

      {/* Kompakt filtre çubuğu — arama motoru en üstte, tam genişlik */}
      <DetailedVenueFilters current={params} />

      <p className="mb-3 mt-4 text-sm text-muted">
        <span className="font-bold text-ink">{venues.length}</span> venues match your criteria
      </p>

      {venues.length === 0 ? (
        <div className="rounded-card border border-gray-200 bg-white p-10 text-center text-sm text-muted">
          No venues match these filters. Try relaxing the criteria.
        </div>
      ) : (
        /* 2 blok: solda otel kolonu, sağda harita (tıklanınca otel haritada açılır) */
        <SearchResults venues={venues} />
      )}
    </>
  );
}
