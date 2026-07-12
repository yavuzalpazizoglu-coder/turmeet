/*
 * MEKAN PROFİLİ — master doküman 5.6:
 * Otel kendi vitrin bilgilerini görür; düzenleme talebi operasyon
 * ekibine gider (envanter kalitesi D Event kontrolünde tutulur).
 */
import { PageHeader, Card, Table, Badge, Button } from "@/components/ui";
import { HotelLogo } from "@/components/venue/HotelLogo";
import { getPartnerProfile } from "@/services";

export const metadata = { title: "Venue Profile — Turmeet Partner" };

export default async function PartnerProfilePage() {
  const venue = await getPartnerProfile();

  return (
    <>
      <PageHeader
        title="Venue profile"
        description="This is how organizers see your venue. Profile changes are reviewed by the Turmeet operations team."
        action={<Button variant="secondary">Request profile update</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={venue.imageUrl} alt={venue.name} className="h-56 w-full object-cover" />
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                <HotelLogo domain={venue.domain} name={venue.name} size={44} />
                <h2 className="text-xl font-bold text-ink">{venue.name}</h2>
                {venue.isSponsored && <Badge tone="accent">Sponsored listing</Badge>}
              </div>
              <p className="mt-1 text-sm text-muted">
                {venue.address} · {venue.stars} stars
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink/80">{venue.description}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-bold text-ink">Meeting rooms</h2>
            <Table headers={["Room", "Area", "Theatre", "Classroom", "Banquet"]}>
              {venue.meetingRooms.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-ink">{r.name}</td>
                  <td className="px-4 py-3">{r.areaSqm} m²</td>
                  <td className="px-4 py-3">{r.theatre}</td>
                  <td className="px-4 py-3">{r.classroom}</td>
                  <td className="px-4 py-3">{r.banquet}</td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 font-bold text-ink">Key figures</h2>
            <dl className="space-y-3 text-sm">
              {[
                ["Total rooms", venue.totalRooms.toLocaleString("en-US")],
                ["Meeting rooms", String(venue.meetingRoomCount)],
                ["Max capacity", venue.maxTheatreCapacity.toLocaleString("en-US")],
                ["Airport distance", `${venue.airportDistanceKm} km`],
                ["Guest rating", `${venue.rating} / 5 (${venue.reviewCount} reviews)`],
                ["Response time", `${venue.responseTimeHours} hr avg.`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 font-bold text-ink">Profile completeness</h2>
            <div className="h-3 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-success" style={{ width: "86%" }} />
            </div>
            <p className="mt-2 text-sm text-muted">86% — add 360° photos to reach 100%.</p>
          </Card>
        </div>
      </div>
    </>
  );
}
