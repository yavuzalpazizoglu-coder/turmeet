/*
 * TALEP İZLEME (ADMİN) — master doküman 6.5: tüm RFQ'ların operasyon görünümü.
 * Backend: GET /api/v1/admin/quote-requests
 */
import { PageHeader, Table, StatusBadge, Badge } from "@/components/ui";
import { getQuoteRequests } from "@/services";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";

export const metadata = { title: "Quote Requests — Turmeet Admin" };

export default async function AdminRequestsPage() {
  const lang = await getPanelLang();
  const t = makeT(lang);
  const requests = await getQuoteRequests();

  return (
    <>
      <PageHeader
        title={t("Quote request monitoring", "Teklif talebi izleme")}
        description={t(
          "All RFQs across the platform — intervene when SLA is at risk.",
          "Platformdaki tüm talepler — SLA riske girdiğinde müdahale edin.",
        )}
      />

      <Table
        headers={[
          t("Event", "Etkinlik"),
          t("Customer", "Müşteri"),
          t("City", "Şehir"),
          t("Dates", "Tarihler"),
          t("Venues", "Mekan"),
          t("Responses", "Yanıtlar"),
          t("Coordinator", "Koordinatör"),
          t("Status", "Durum"),
        ]}
      >
        {requests.map((r) => {
          const received = r.quotes.filter((q) => q.status === "received").length;
          const slaRisk = r.status === "waiting" && received === 0;
          return (
            <tr key={r.id} className="hover:bg-surface/60">
              <td className="px-4 py-3">
                <p className="font-medium text-ink">{r.eventName}</p>
                {slaRisk && <Badge tone="danger">{t("SLA risk", "SLA riski")}</Badge>}
              </td>
              <td className="px-4 py-3">Nordwind Capital</td>
              <td className="px-4 py-3">{r.city}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {r.checkIn} → {r.checkOut}
              </td>
              <td className="px-4 py-3">{r.venueIds.length}</td>
              <td className="px-4 py-3">
                <span className={received > 0 ? "font-semibold text-success" : "text-muted"}>
                  {received}/{r.quotes.length}
                </span>
              </td>
              <td className="px-4 py-3">Gizem</td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status} lang={lang} />
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
