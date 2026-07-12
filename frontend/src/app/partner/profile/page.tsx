/*
 * MEKAN PROFİLİ — master doküman 5.6:
 * Otel kendi vitrin bilgilerini görür; düzenleme talebi operasyon
 * ekibine gider (envanter kalitesi D Event kontrolünde tutulur).
 */
import { PageHeader, Card, Table, Badge, Button } from "@/components/ui";
import { HotelLogo } from "@/components/venue/HotelLogo";
import { getPartnerProfile } from "@/services";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";

export const metadata = { title: "Venue Profile — Turmeet Partner" };

export default async function PartnerProfilePage() {
  const lang = await getPanelLang();
  const t = makeT(lang);
  const venue = await getPartnerProfile();

  return (
    <>
      <PageHeader
        title={t("Venue profile", "Tesis profili")}
        description={t(
          "This is how organizers see your venue. Profile changes are reviewed by the Turmeet operations team.",
          "Organizatörler tesisinizi böyle görür. Profil değişiklikleri Turmeet operasyon ekibi tarafından incelenir.",
        )}
        action={<Button variant="secondary">{t("Request profile update", "Profil güncellemesi iste")}</Button>}
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
                {venue.isSponsored && <Badge tone="accent">{t("Sponsored listing", "Sponsorlu liste")}</Badge>}
              </div>
              <p className="mt-1 text-sm text-muted">
                {venue.address} · {venue.stars} {t("stars", "yıldız")}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink/80">{venue.description}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-bold text-ink">{t("Meeting rooms", "Toplantı salonları")}</h2>
            <Table
              headers={[
                t("Room", "Salon"),
                t("Area", "Alan"),
                t("Theatre", "Tiyatro"),
                t("Classroom", "Sınıf"),
                t("Banquet", "Banket"),
              ]}
            >
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
            <h2 className="mb-4 font-bold text-ink">{t("Key figures", "Önemli rakamlar")}</h2>
            <dl className="space-y-3 text-sm">
              {[
                [t("Total rooms", "Toplam oda"), venue.totalRooms.toLocaleString("en-US")],
                [t("Meeting rooms", "Toplantı salonu"), String(venue.meetingRoomCount)],
                [t("Max capacity", "Maks. kapasite"), venue.maxTheatreCapacity.toLocaleString("en-US")],
                [t("Airport distance", "Havalimanı mesafesi"), `${venue.airportDistanceKm} km`],
                [t("Guest rating", "Misafir puanı"), `${venue.rating} / 5 (${venue.reviewCount} ${t("reviews", "değerlendirme")})`],
                [t("Response time", "Yanıt süresi"), t(`${venue.responseTimeHours} hr avg.`, `ort. ${venue.responseTimeHours} sa`)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 font-bold text-ink">{t("Profile completeness", "Profil doluluk oranı")}</h2>
            <div className="h-3 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-success" style={{ width: "86%" }} />
            </div>
            <p className="mt-2 text-sm text-muted">
              {t("86% — add 360° photos to reach 100%.", "%86 — %100'e ulaşmak için 360° fotoğraf ekleyin.")}
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
