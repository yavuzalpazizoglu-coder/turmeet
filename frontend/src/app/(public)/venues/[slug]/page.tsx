/*
 * MEKAN DETAY — master doküman 3.2.3:
 * galeri + özet bilgi + toplantı salonları tablosu + oda tipleri +
 * konum bilgisi + sticky "Request Quote" CTA.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Badge, Stars, StarRow, Table, LinkButton, Card } from "@/components/ui";
import { MapPinIcon, PlaneIcon, BuildingIcon, CheckIcon, ClockIcon } from "@/components/ui/icons";
import { HotelLogo } from "@/components/venue/HotelLogo";
import { InspectionScoreLight } from "@/components/venue/InspectionScore";
import { venueTypeLabel, eventTypeLabel } from "@/lib/mice-criteria";
import { getVenueBySlug } from "@/services";

export default async function VenueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);
  if (!venue) notFound();

  const boardLabels: Record<string, string> = {
    BB: "Bed & Breakfast",
    HB: "Half Board",
    FB: "Full Board",
    AI: "All Inclusive",
    room_only: "Room Only",
  };

  return (
    <>
      <PublicHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <p className="text-sm text-muted">
          <Link href="/venues" className="hover:text-brand">Venues</Link>
          {" / "}
          <Link href={`/venues?city=${venue.city}`} className="hover:text-brand">{venue.city}</Link>
          {" / "}
          <span className="text-ink">{venue.name}</span>
        </p>

        {/* Galeri */}
        <div className="mt-4 grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={venue.imageUrl} alt={venue.name} className="h-64 w-full rounded-card object-cover sm:col-span-2 sm:row-span-2 sm:h-full" />
          {venue.gallery.slice(0, 4).map((g, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={g} src={g} alt={`${venue.name} ${i + 2}`} className="hidden h-32 w-full rounded-card object-cover sm:block sm:h-full" />
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0">
            {/* Başlık */}
            <div className="flex flex-wrap items-center gap-3">
              <HotelLogo domain={venue.domain} name={venue.name} size={52} />
              <h1 className="text-2xl font-bold text-ink sm:text-3xl">{venue.name}</h1>
              <StarRow stars={venue.stars} />
              {venue.isSponsored && <Badge tone="accent">Sponsored</Badge>}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted">
              <Stars rating={venue.rating} count={venue.reviewCount} />
              <span className="inline-flex items-center gap-1">
                <MapPinIcon size={14} /> {venue.address}
              </span>
              <span className="inline-flex items-center gap-1">
                <PlaneIcon size={14} /> Airport {venue.airportDistanceKm} km
              </span>
            </div>

            {/* ICCA sınıfı + denetim puanı + sürdürülebilirlik — tüm listelerle aynı dil */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                {venueTypeLabel(venue.type)}
              </span>
              <InspectionScoreLight score={venue.inspectionScore} />
              {venue.sustainabilityCertified && (
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">Eco-certified</span>
              )}
              {venue.hybridStudio && (
                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">Hybrid studio</span>
              )}
            </div>

            <p className="mt-5 leading-relaxed text-ink/80">{venue.description}</p>

            {/* Desteklenen etkinlik formatları (ICCA/IAPCO sınıflandırması) */}
            {venue.supportedEventTypes.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {venue.supportedEventTypes.map((e) => (
                  <span key={e} className="rounded-full border border-gray-200 bg-surface px-2.5 py-1 text-xs text-ink/70">
                    {eventTypeLabel(e)}
                  </span>
                ))}
              </div>
            )}

            {/* Öne çıkanlar */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Rooms", value: venue.totalRooms.toLocaleString("en-US") },
                { label: "Meeting rooms", value: venue.meetingRoomCount },
                { label: "Max capacity", value: venue.maxTheatreCapacity.toLocaleString("en-US") },
                { label: "Response time", value: `${venue.responseTimeHours} hr` },
              ].map((s) => (
                <div key={s.label} className="rounded-card bg-surface p-4 text-center">
                  <p className="text-xl font-bold text-brand">{s.value}</p>
                  <p className="text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Toplantı salonları */}
            <h2 className="mt-10 text-xl font-bold text-ink">Meeting rooms &amp; capacities</h2>
            <div className="mt-4">
              <Table headers={["Room", "Area", "Theatre", "Classroom", "U-Shape", "Banquet", "Cocktail"]}>
                {venue.meetingRooms.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{r.name}</p>
                      <p className="text-xs text-muted">{r.features.join(" · ")}</p>
                    </td>
                    <td className="px-4 py-3">{r.areaSqm} m²</td>
                    <td className="px-4 py-3">{r.theatre}</td>
                    <td className="px-4 py-3">{r.classroom}</td>
                    <td className="px-4 py-3">{r.uShape}</td>
                    <td className="px-4 py-3">{r.banquet}</td>
                    <td className="px-4 py-3">{r.cocktail}</td>
                  </tr>
                ))}
              </Table>
            </div>

            {/* Oda tipleri */}
            <h2 className="mt-10 text-xl font-bold text-ink">Accommodation</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {venue.roomTypes.map((t) => (
                <Card key={t.id} className="p-4">
                  <p className="font-semibold text-ink">{t.name}</p>
                  <p className="text-sm text-muted">
                    {t.count} rooms · {t.sizeSqm} m²
                  </p>
                  <p className="mt-2 text-xs text-muted">{t.amenities.join(" · ")}</p>
                </Card>
              ))}
            </div>

            {/* Özellikler */}
            <h2 className="mt-10 text-xl font-bold text-ink">Facilities</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {venue.features.map((f) => (
                <p key={f} className="inline-flex items-center gap-2 text-sm text-ink/80">
                  <CheckIcon size={15} className="text-success" /> {f}
                </p>
              ))}
            </div>
          </div>

          {/* Sticky teklif kutusu */}
          <aside className="h-fit lg:sticky lg:top-20">
            <Card className="p-5 shadow-card">
              {venue.referencePrice !== null && (
                <p className="text-lg">
                  <span className="text-2xl font-bold text-ink">€ {venue.referencePrice}</span>
                  <span className="text-sm text-muted"> / night reference</span>
                </p>
              )}
              <p className="mt-1 text-xs text-muted">
                Reference prices are based on past group contracts. Your quote may differ.
              </p>
              {venue.specialOffer && (
                <div className="mt-3 rounded-btn bg-brand-light p-3 text-sm font-medium text-brand">
                  {venue.specialOffer}
                </div>
              )}
              <div className="mt-4 space-y-2 text-sm text-ink/80">
                <p className="inline-flex items-center gap-2">
                  <ClockIcon size={15} className="text-brand" /> Responds within {venue.responseTimeHours} hours
                </p>
                <br />
                <p className="inline-flex items-center gap-2">
                  <BuildingIcon size={15} className="text-brand" /> Board types:{" "}
                  {venue.boardTypes.map((b) => boardLabels[b] ?? b).join(", ")}
                </p>
              </div>
              <LinkButton href={`/app/quotes/new?venue=${venue.id}`} size="lg" className="mt-5 w-full">
                Request Quote — Free
              </LinkButton>
              <LinkButton href={`/compare?ids=${venue.id}`} variant="secondary" size="md" className="mt-2 w-full">
                Add to comparison
              </LinkButton>
              <p className="mt-3 text-center text-xs text-muted">Zero commission for organizers</p>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
