/*
 * KARŞILAŞTIRMA — master doküman 3.2.4: yan yana max 4 mekan.
 * Kullanım: /compare?ids=v1,v2,v3
 */
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { LinkButton, StarRow, Stars } from "@/components/ui";
import { HotelLogo } from "@/components/venue/HotelLogo";
import { getVenuesByIds, getVenues } from "@/services";

export const metadata = { title: "Compare Venues — Turmeet" };

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const idList = ids ? ids.split(",").slice(0, 4) : [];
  const venues = idList.length > 0 ? await getVenuesByIds(idList) : (await getVenues()).slice(0, 3);

  const rows: { label: string; render: (v: (typeof venues)[number]) => React.ReactNode }[] = [
    { label: "Star rating", render: (v) => <StarRow stars={v.stars} /> },
    { label: "Guest rating", render: (v) => <Stars rating={v.rating} count={v.reviewCount} /> },
    { label: "City", render: (v) => `${v.city}, ${v.district}` },
    { label: "Total rooms", render: (v) => v.totalRooms.toLocaleString("en-US") },
    { label: "Meeting rooms", render: (v) => v.meetingRoomCount },
    { label: "Max capacity (theatre)", render: (v) => v.maxTheatreCapacity.toLocaleString("en-US") },
    { label: "Airport distance", render: (v) => `${v.airportDistanceKm} km` },
    { label: "Reference price", render: (v) => (v.referencePrice ? `€ ${v.referencePrice} / night` : "On request") },
    { label: "Response time", render: (v) => `${v.responseTimeHours} hr` },
    { label: "Special offer", render: (v) => v.specialOffer ?? "—" },
  ];

  return (
    <>
      <PublicHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-ink">Compare venues</h1>
        <p className="mt-1 text-sm text-muted">Side-by-side comparison of up to 4 venues.</p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-48 border-b border-gray-200 p-3" />
                {venues.map((v) => (
                  <th key={v.id} className="border-b border-gray-200 p-3 text-left align-bottom">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.imageUrl} alt={v.name} className="h-32 w-full rounded-card object-cover" />
                    <div className="mt-2 flex items-center gap-2">
                      <HotelLogo domain={v.domain} name={v.name} size={30} />
                      <Link href={`/venues/${v.slug}`} className="font-semibold text-ink hover:text-brand">
                        {v.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="odd:bg-surface/60">
                  <td className="p-3 font-medium text-muted">{row.label}</td>
                  {venues.map((v) => (
                    <td key={v.id} className="p-3 text-ink">
                      {row.render(v)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-3" />
                {venues.map((v) => (
                  <td key={v.id} className="p-3">
                    <LinkButton href={`/app/quotes/new?venue=${v.id}`} size="sm" className="w-full">
                      Request Quote
                    </LinkButton>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
