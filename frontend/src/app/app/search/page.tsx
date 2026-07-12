/*
 * PANEL İÇİ MEKAN ARAMA — platformun EN DETAYLI araması (master 4.2).
 * Filtre kriterleri D Event MICE Inspection Formu'ndan gelir
 * (bkz. detailed-filters.tsx). Public SERP'ten farkı: tüm inspection
 * kriterleri tek panelde sunulur.
 */
import { PageHeader } from "@/components/ui";
import { VenueCard } from "@/components/venue/VenueCard";
import { getVenues } from "@/services";
import { DetailedVenueFilters } from "./detailed-filters";

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

      <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
        <DetailedVenueFilters current={params} />

        <div>
          <p className="mb-4 text-sm text-muted">
            <span className="font-bold text-ink">{venues.length}</span> venues match your criteria
          </p>
          {venues.length === 0 ? (
            <div className="rounded-card border border-gray-200 bg-white p-10 text-center text-sm text-muted">
              No venues match these filters. Try relaxing the criteria.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {venues.map((v) => (
                <VenueCard key={v.id} venue={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
