/*
 * PARTNER KONTRATLARI — master doküman 5.4.
 */
import { PageHeader, Table, StatusBadge } from "@/components/ui";
import { getContracts } from "@/services";

export const metadata = { title: "Contracts — Turmeet Partner" };

export default async function PartnerContractsPage() {
  const contracts = await getContracts();

  return (
    <>
      <PageHeader title="Contracts" description="Won events and their contract status." />

      <Table headers={["Contract #", "Event", "Customer", "Dates", "Rooms", "Amount", "Status"]}>
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
              <StatusBadge status={c.status} />
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
