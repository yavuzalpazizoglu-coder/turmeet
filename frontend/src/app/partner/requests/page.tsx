/*
 * GELEN TALEPLER — master doküman 5.2: otele düşen RFQ listesi.
 * Backend: GET /api/v1/partner/requests
 */
import Link from "next/link";
import { PageHeader, Table, StatusBadge } from "@/components/ui";
import { eventTypeLabel } from "@/lib/mice-criteria";
import { getPartnerRequests } from "@/services";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";

export const metadata = { title: "Quote Requests — Turmeet Partner" };

export default async function PartnerRequestsPage() {
  const lang = await getPanelLang();
  const t = makeT(lang);
  const requests = await getPartnerRequests();

  return (
    <>
      <PageHeader
        title={t("Quote requests", "Teklif talepleri")}
        description={t(
          "Respond within 24 hours to keep your response-time score high.",
          "Yanıt süresi puanınızı yüksek tutmak için 24 saat içinde yanıtlayın.",
        )}
      />

      <Table
        headers={[
          t("Event", "Etkinlik"),
          t("Type", "Tür"),
          t("Dates", "Tarihler"),
          t("Guests", "Katılımcı"),
          t("Rooms", "Oda"),
          t("Received", "Geliş"),
          t("Status", "Durum"),
          "",
        ]}
      >
        {requests.map((r) => (
          <tr key={r.id} className="hover:bg-surface/60">
            <td className="px-4 py-3 font-medium text-ink">{r.eventName}</td>
            {/* ICCA etkinlik etiketi — public arama filtreleriyle aynı sözlük */}
            <td className="px-4 py-3">{eventTypeLabel(r.eventType)}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              {r.checkIn} → {r.checkOut}
            </td>
            <td className="px-4 py-3">{r.guests}</td>
            <td className="px-4 py-3">{r.rooms}</td>
            <td className="px-4 py-3 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString("en-GB")}</td>
            <td className="px-4 py-3">
              <StatusBadge status={r.status} lang={lang} />
            </td>
            <td className="px-4 py-3">
              <Link href={`/partner/requests/${r.id}`} className="text-sm font-medium text-brand hover:underline">
                {r.status === "waiting" ? t("Respond", "Yanıtla") : t("View", "Görüntüle")}
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
