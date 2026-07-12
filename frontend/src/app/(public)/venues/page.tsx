/*
 * MEKAN ARAMA / LİSTELEME — master doküman 3.2.2 (SERP)
 * Sol filtre paneli + sonuç grid'i. Filtreler URL query param'ları ile
 * çalışır (backend'e aynı param'lar gidecek: ?city=&stars=&capacity=).
 * Arama tek şehre daraldıysa sağda Leaflet haritası gösterilir.
 */
import { PublicHeader } from "@/components/layout/PublicHeader";
import { VenueCard } from "@/components/venue/VenueCard";
import { VenueMap } from "@/components/venue/VenueMap";
import { getVenues } from "@/services";
import { VenueFilterPanel } from "./filter-panel";

export const metadata = { title: "Search Venues — Turmeet" };

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; stars?: string; capacity?: string; type?: string }>;
}) {
  const params = await searchParams;
  const venues = await getVenues({
    q: params.q,
    city: params.city,
    stars: params.stars ? Number(params.stars) : undefined,
    minCapacity: params.capacity ? Number(params.capacity) : undefined,
    type: params.type,
  });

  // Sonuçlar tek şehre daraldıysa haritayı göster
  const cities = [...new Set(venues.map((v) => v.city))];
  const singleCity = venues.length > 0 && cities.length === 1 ? cities[0] : null;

  return (
    <>
      <PublicHeader />
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-ink">
          {params.city ? `Meeting venues in ${params.city}` : "All meeting venues in Turkey"}
        </h1>
        <p className="mt-1 text-sm text-muted">{venues.length} venues found · sponsored venues shown first</p>

        <div
          className={`mt-6 grid gap-6 ${
            singleCity ? "lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_400px]" : "lg:grid-cols-[260px_1fr]"
          }`}
        >
          <VenueFilterPanel current={params} />

          <div>
            {venues.length === 0 ? (
              <p className="rounded-card border border-dashed border-gray-300 p-12 text-center text-muted">
                No venues match your filters. Try widening your search.
              </p>
            ) : (
              <div className={`grid gap-5 sm:grid-cols-2 ${singleCity ? "" : "xl:grid-cols-3"}`}>
                {venues.map((v) => (
                  <VenueCard key={v.id} venue={v} />
                ))}
              </div>
            )}
          </div>

          {/* Harita: xl'de sağ sütunda sabit, daha dar ekranlarda listenin altında */}
          {singleCity && (
            <aside className="h-fit lg:col-span-2 xl:sticky xl:top-24 xl:col-span-1">
              <VenueMap venues={venues} city={singleCity} />
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
