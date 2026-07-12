/*
 * FAVORİLER — master doküman 4.8.
 * Backend: GET /api/v1/favorites (mock: popüler mekanlar gösterilir)
 */
import { PageHeader, EmptyState, LinkButton } from "@/components/ui";
import { VenueCard } from "@/components/venue/VenueCard";
import { getVenues } from "@/services";

export const metadata = { title: "Favorites — Turmeet" };

export default async function FavoritesPage() {
  // MOCK: favori olarak sponsorlu + popüler mekanları göster
  const venues = (await getVenues()).filter((v) => v.isSponsored);

  return (
    <>
      <PageHeader title="Favorites" description="Venues you saved for future events." />
      {venues.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          description="Tap the heart icon on any venue to save it here."
          action={<LinkButton href="/app/search">Browse venues</LinkButton>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {venues.map((v) => (
            <VenueCard key={v.id} venue={v} />
          ))}
        </div>
      )}
    </>
  );
}
