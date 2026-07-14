/*
 * FAVORİLER — master doküman 4.8.
 * Backend: GET /api/v1/favorites (mock: popüler mekanlar gösterilir)
 * Düzen: kompakt yatay satır kartları (FavoriteList) — ekranda çok
 * daha fazla mekan görünür; büyük dikey kartlar arama sayfasına özel.
 */
import { PageHeader, EmptyState, LinkButton } from "@/components/ui";
import { FavoriteList } from "@/components/venue/FavoriteList";
import { getVenues } from "@/services";

export const metadata = { title: "Favorites — Turmeet" };

export default async function FavoritesPage() {
  // MOCK: favori olarak sponsorlu + popüler mekanları göster
  const venues = (await getVenues()).filter((v) => v.isSponsored);

  return (
    <>
      <PageHeader
        title="Favorites"
        description={`${venues.length} venues you saved for future events.`}
      />
      {venues.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          description="Tap the heart icon on any venue to save it here."
          action={<LinkButton href="/app/search">Browse venues</LinkButton>}
        />
      ) : (
        <FavoriteList venues={venues} />
      )}
    </>
  );
}
