/*
 * PARTNER KONTRATLARI — master doküman 5.4.
 */
import { PageHeader, Table, StatusBadge } from "@/components/ui";
import { getContracts } from "@/services";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";

export const metadata = { title: "Contracts — Turmeet Partner" };

export default async function PartnerContractsPage() {
  const lang = await getPanelLang();
  const t = makeT(lang);
  const contracts = await getContracts();

  return (
    <>
      <PageHeader
        title={t("Contracts", "Kontratlar")}
        description={t("Won events and their contract status.", "Kazanılan etkinlikler ve kontrat durumları.")}
      />

      <Table
        headers={[
          t("Contract #", "Kontrat No"),
          t("Event", "Etkinlik"),
          t("Customer", "Müşteri"),
          t("Dates", "Tarihler"),
          t("Rooms", "Oda"),
          t("Amount", "Tutar"),
          t("Status", "Durum"),
        ]}
      >
        {contracts.map((c) => (
          <tr key={c.id} className="hover:bg-surface/60">
            <td className="px-4 py-3 font-mono text-xs font-medium text-brand">{c.number}</td>
            <td className="px-4 py-3 font-medium text-ink">{c.eventName}</td>
            <td className="px-4 py-3">{c.customerCompany}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              {c.checkIn} → {c.checkOut}
            </td>
            <td className="px-4 py-3">{c.rooms}</td>
            <td className="px-4 py-3 font-semibold">€ {c.totalAmount.toLocaleString("en-US")}</td>
            <td className="px-4 py-3">
              <StatusBadge status={c.status} lang={lang} />
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
