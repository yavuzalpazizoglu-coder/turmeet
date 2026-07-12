/*
 * KONTRATLARIM — master doküman 4.6.
 */
import { PageHeader, Table, StatusBadge } from "@/components/ui";
import { getContracts } from "@/services";

export const metadata = { title: "Contracts — Turmeet" };

export default async function ContractsPage() {
  const contracts = await getContracts();

  return (
    <>
      <PageHeader
        title="Contracts"
        description="All your event contracts — digital signature and document management."
      />

      <Table headers={["Contract #", "Event", "Venue", "Dates", "Guests", "Amount", "Cut-off", "Status"]}>
        {contracts.map((c) => (
          <tr key={c.id} className="hover:bg-surface/60">
            <td className="px-4 py-3 font-mono text-xs font-medium text-brand">{c.number}</td>
            <td className="px-4 py-3 font-medium text-ink">{c.eventName}</td>
            <td className="px-4 py-3">{c.venueName}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              {c.checkIn} → {c.checkOut}
            </td>
            <td className="px-4 py-3">{c.guests}</td>
            <td className="px-4 py-3 font-semibold">€ {c.totalAmount.toLocaleString("en-US")}</td>
            <td className="px-4 py-3">{c.cutoffDate ?? "—"}</td>
            <td className="px-4 py-3">
              <StatusBadge status={c.status} />
            </td>
          </tr>
        ))}
      </Table>

      <p className="mt-4 text-xs text-muted">
        Contracts pending signature can be signed digitally. Documents (PDF) will be available for download once the
        backend document service is connected.
      </p>
    </>
  );
}
