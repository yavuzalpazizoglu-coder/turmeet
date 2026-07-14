/*
 * FAVORİLER — master doküman 4.8.
 * Backend: GET /api/v1/favorites (mock: sponsorlu mekanlar gösterilir)
 * Düzen: FavoritesBoard — üstte arama motoru, segmentler (All / Quote
 * received), favori bölgeler şeridi ve kompakt satır kartları.
 */
import { PageHeader } from "@/components/ui";
import { FavoritesBoard } from "@/components/venue/FavoritesBoard";
import { getVenues, getQuoteRequests } from "@/services";

export const metadata = { title: "Favorites — Turmeet" };

export default async function FavoritesPage() {
  // MOCK: favori olarak sponsorlu + popüler mekanları göster
  const venues = (await getVenues()).filter((v) => v.isSponsored || v.isPopular);

  // Teklif alınan mekanlar — "Quote received" segmenti bu kümeden beslenir
  const requests = await getQuoteRequests();
  const quotedIds = [
    ...new Set(
      requests.flatMap((r) => r.quotes.filter((qt) => qt.status === "received").map((qt) => qt.venueId)),
    ),
  ];

  return (
    <>
      <PageHeader
        title="Favorites"
        description={`${venues.length} venues you saved for future events.`}
      />
      <FavoritesBoard venues={venues} quotedIds={quotedIds} />
    </>
  );
}
