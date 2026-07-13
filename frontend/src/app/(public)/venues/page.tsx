/*
 * MEKAN ARAMA / LİSTELEME (SERP) — master doküman 3.2.2
 *
 * Anasayfa arama motorundan gelinen profesyonel sonuç ekranı.
 * Panel içi Venue Search ile aynı düzen kullanılır (components/search):
 *  - Üstte kompakt yatay filtre çubuğu (MICE Inspection kriterleri)
 *  - Altta 2 blok: solda otel kolonu, sağda etkileşimli harita
 *    (otel kutusuna tıklanınca harita o otele uçar, baloncuk açılır)
 *
 * Filtreler URL query param'ları ile çalışır — backend'e aynı
 * param'lar gidecek (?city=&stars=&capacity=...).
 */
import { PublicHeader } from "@/components/layout/PublicHeader";
import { getVenues } from "@/services";
import { DetailedVenueFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";

export const metadata = { title: "Search Venues — Turmeet" };

export default async function VenuesPage({
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
      <PublicHeader />
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-ink">
              {params.city ? `Meeting venues in ${params.city}` : "All meeting venues in Turkey"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              <span className="font-bold text-ink">{venues.length}</span> venues found · sponsored venues shown first
            </p>
          </div>
        </div>

        {/* Kompakt filtre çubuğu — panel araması ile ortak bileşen */}
        <div className="mt-4">
          <DetailedVenueFilters current={params} basePath="/venues" />
        </div>

        <div className="mt-4">
          {venues.length === 0 ? (
            <p className="rounded-card border border-dashed border-gray-300 p-12 text-center text-muted">
              No venues match your filters. Try widening your search.
            </p>
          ) : (
            /* 2 blok: solda otel kolonu, sağda harita */
            <SearchResults venues={venues} />
          )}
        </div>
      </div>
    </>
  );
}
