/*
 * KOMİSYON YÖNETİMİ — master doküman 6.6:
 * tahakkuk → fatura → tahsilat akışı. Standart %10, sponsor %8, KDV %20.
 * Backend: GET /api/v1/admin/commissions
 */
import { PageHeader, Table, StatusBadge, StatCard } from "@/components/ui";
import { getCommissions } from "@/services";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";

export const metadata = { title: "Commissions — Turmeet Admin" };

export default async function CommissionsPage() {
  const lang = await getPanelLang();
  const t = makeT(lang);
  const commissions = await getCommissions();

  const paid = commissions.filter((c) => c.status === "paid").reduce((s, c) => s + c.amount, 0);
  const open = commissions.filter((c) => c.status !== "paid").reduce((s, c) => s + c.amount, 0);

  return (
    <>
      <PageHeader
        title={t("Commission management", "Komisyon yönetimi")}
        description={t(
          "Accrual → invoice → collection. Standard rate 10%, sponsored 8%, VAT 20%.",
          "Tahakkuk → fatura → tahsilat. Standart oran %10, sponsorlu %8, KDV %20.",
        )}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label={t("Collected (YTD)", "Tahsil edilen (yıl başından)")} value={`€ ${paid.toLocaleString("en-US")}`} tone="success" />
        <StatCard label={t("Outstanding", "Bekleyen")} value={`€ ${open.toLocaleString("en-US")}`} tone="warning" />
        <StatCard label={t("Avg. commission rate", "Ort. komisyon oranı")} value="9.4%" hint={t("Weighted by revenue", "Gelire göre ağırlıklı")} />
      </div>

      <Table
        headers={[
          t("Invoice", "Fatura"),
          t("Venue", "Mekan"),
          t("Event", "Etkinlik"),
          t("Base", "Matrah"),
          t("Rate", "Oran"),
          t("Commission", "Komisyon"),
          t("Due date", "Vade"),
          t("Status", "Durum"),
        ]}
      >
        {commissions.map((c) => (
          <tr key={c.id} className="hover:bg-surface/60">
            <td className="px-4 py-3 font-mono text-xs font-medium text-brand">{c.invoiceNumber}</td>
            <td className="px-4 py-3">{c.venueName}</td>
            <td className="px-4 py-3">{c.eventName}</td>
            <td className="px-4 py-3">€ {c.baseAmount.toLocaleString("en-US")}</td>
            <td className="px-4 py-3">{(c.rate * 100).toFixed(0)}%</td>
            <td className="px-4 py-3 font-semibold">€ {c.amount.toLocaleString("en-US")}</td>
            <td className="px-4 py-3">{c.dueDate}</td>
            <td className="px-4 py-3">
              <StatusBadge status={c.status} lang={lang} />
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
