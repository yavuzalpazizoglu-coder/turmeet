/*
 * MEKAN ARAMA / LİSTELEME — master doküman 3.2.2 (SERP)
 * Sol filtre paneli + sağ sonuç grid'i. Filtreler URL query param'ları ile
 * çalışır (backend'e aynı param'lar gidecek: ?city=&stars=&capacity=).
 */
import { PublicHeader } from "@/components/layout/PublicHeader";
import { VenueCard } from "@/components/venue/VenueCard";
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

  return (
    <>
      <PublicHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-ink">
          {params.city ? `Meeting venues in ${params.city}` : "All meeting venues in Turkey"}
        </h1>
        <p className="mt-1 text-sm text-muted">{venues.length} venues found · sponsored venues shown first</p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
          <VenueFilterPanel current={params} />
          <div>
            {venues.length === 0 ? (
              <p className="rounded-card border border-dashed border-gray-300 p-12 text-center text-muted">
                No venues match your filters. Try widening your search.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {venues.map((v) => (
                  <VenueCard key={v.id} venue={v} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
