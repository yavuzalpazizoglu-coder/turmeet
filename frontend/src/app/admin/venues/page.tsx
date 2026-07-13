/*
 * MEKAN YÖNETİMİ — master doküman 6.4: envanter listesi + sponsorluk.
 * Backend: GET /api/v1/admin/venues
 */
import { PageHeader, Table, Badge, Button, StarRow } from "@/components/ui";
import { venueTypeLabel } from "@/lib/mice-criteria";
import { getAdminVenues } from "@/services";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";
import { ShowcaseTagEditor } from "./tag-editor";

export const metadata = { title: "Venues — Turmeet Admin" };

export default async function AdminVenuesPage() {
  const lang = await getPanelLang();
  const t = makeT(lang);
  const venues = await getAdminVenues();

  return (
    <>
      <PageHeader
        title={t("Venue inventory", "Mekan envanteri")}
        description={t(`${venues.length} venues live on the platform.`, `Platformda ${venues.length} mekan yayında.`)}
        action={<Button>{t("+ Add venue", "+ Mekan ekle")}</Button>}
      />

      <Table
        headers={[
          t("Venue", "Mekan"),
          t("City", "Şehir"),
          t("Stars", "Yıldız"),
          t("Rooms", "Oda"),
          t("Max capacity", "Maks. kapasite"),
          t("Response", "Yanıt"),
          t("Listing", "Liste türü"),
          t("Showcase tags", "Vitrin etiketleri"),
          "",
        ]}
      >
        {venues.map((v) => (
          <tr key={v.id} className="hover:bg-surface/60">
            <td className="px-4 py-3">
              <p className="font-medium text-ink">{v.name}</p>
              <p className="text-xs text-muted">{venueTypeLabel(v.type)}</p>
            </td>
            <td className="px-4 py-3">{v.city}</td>
            <td className="px-4 py-3">
              <StarRow stars={v.stars} />
            </td>
            <td className="px-4 py-3">{v.totalRooms.toLocaleString("en-US")}</td>
            <td className="px-4 py-3">{v.maxTheatreCapacity.toLocaleString("en-US")}</td>
            <td className="px-4 py-3">{v.responseTimeHours} {t("hr", "sa")}</td>
            <td className="px-4 py-3">
              {v.isSponsored ? (
                <Badge tone="accent">{t("Sponsored (8%)", "Sponsorlu (%8)")}</Badge>
              ) : (
                <Badge tone="neutral">{t("Standard (10%)", "Standart (%10)")}</Badge>
              )}
            </td>
            <td className="px-4 py-3">
              {/* Vitrin etiketleri — tıklanarak işaretlenir (anasayfa kartlarında görünür) */}
              <ShowcaseTagEditor initial={v.showcaseTags} />
            </td>
            <td className="px-4 py-3">
              <Button size="sm" variant="ghost">
                {t("Edit", "Düzenle")}
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
