/*
 * PANEL İÇİ MEKAN ARAMA — platformun EN DETAYLI araması (master 4.2).
 * Düzen: üstte kompakt yatay filtre çubuğu (detailed-filters.tsx),
 * altında az yer kaplayan sıra kartlar — müşteri kaydırmadan gezer.
 * Filtre kriterleri D Event MICE Inspection Formu'ndan gelir.
 */
import { getVenues } from "@/services";
import { DetailedVenueFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";

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
    /*
     * Midnight Glass: panel main padding'ini negatif marginlarla taşarak
     * arama sayfası tam koyu zeminde çizilir; panelin diğer sayfaları
     * açık temada kalır.
     */
    <div className="relative -m-4 min-h-[calc(100vh-64px)] overflow-hidden bg-ink p-4 sm:-m-6 sm:p-6 lg:-m-8 lg:p-8">
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-[#1c1420] to-ink" />
      <div className="animate-float-slow pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-brand/15 blur-3xl" />
      <div className="animate-float-slower pointer-events-none absolute -right-20 bottom-16 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      <div className="relative">
        {/* Koyu tema sayfa başlığı — PageHeader açık temaya göre tasarlandığı için inline */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-white">Venue search</h1>
          <p className="mt-1 text-sm text-white/60">
            The most detailed search on the platform — filter by MICE inspection criteria and add venues to a new quote
            request.
          </p>
        </div>

        {/* Kompakt filtre çubuğu — arama motoru en üstte, tam genişlik */}
        <DetailedVenueFilters current={params} />

        <p className="mb-3 mt-4 text-sm text-white/60">
          <span className="font-bold text-white">{venues.length}</span> venues match your criteria
        </p>

        {venues.length === 0 ? (
          <div className="rounded-card border border-white/15 bg-white/5 p-10 text-center text-sm text-white/60">
            No venues match these filters. Try relaxing the criteria.
          </div>
        ) : (
          /* 2 blok: solda otel kolonu, sağda harita (tıklanınca otel haritada açılır) */
          <SearchResults venues={venues} />
        )}
      </div>
    </div>
  );
}
