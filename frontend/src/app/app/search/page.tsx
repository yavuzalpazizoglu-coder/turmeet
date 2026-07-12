/*
 * PANEL İÇİ MEKAN ARAMA — public SERP'in panel versiyonu (master 4.2).
 */
import { PageHeader } from "@/components/ui";
import { VenueCard } from "@/components/venue/VenueCard";
import { getVenues } from "@/services";

export const metadata = { title: "Venue Search — Turmeet" };

export default async function PanelSearchPage() {
  const venues = await getVenues();

  return (
    <>
      <PageHeader
        title="Venue search"
        description="Browse venues and add them to a new quote request."
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {venues.map((v) => (
          <VenueCard key={v.id} venue={v} />
        ))}
      </div>
    </>
  );
}
