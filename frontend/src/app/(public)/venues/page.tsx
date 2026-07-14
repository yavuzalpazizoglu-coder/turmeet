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
import { PageHero } from "@/components/layout/PageHero";
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

      {/* İnce koyu hero bandı — anasayfa görsel diliyle bağ kurar */}
      <PageHero
        compact
        image="/images/hero-slide-1.jpg"
        title={params.city ? `Meeting venues in ${params.city}` : "All meeting venues in Turkey"}
        subtitle={`${venues.length} venues found · every property inspected on site · sponsored venues shown first`}
      />

      {/*
       * Profesyonel SERP zemini — beyaz kartların ayrıştığı açık nötr gri
       * (Booking/Cvent dili). Panel araması da aynı bg-surface tonunu kullanır.
       */}
      <div className="bg-surface">
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
          {/* Kompakt filtre çubuğu — panel araması ile ortak bileşen */}
          <div className="-mt-10 relative z-20">
            <DetailedVenueFilters current={params} basePath="/venues" />
          </div>

          <div className="mt-4">
            {venues.length === 0 ? (
              <p className="rounded-card border border-dashed border-gray-300 bg-white p-12 text-center text-muted">
                No venues match your filters. Try widening your search.
              </p>
            ) : (
              /* 2 blok: solda otel kolonu, sağda harita */
              <SearchResults venues={venues} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
