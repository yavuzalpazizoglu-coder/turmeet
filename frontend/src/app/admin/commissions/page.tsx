/*
 * KOMİSYON YÖNETİMİ — master doküman 6.6:
 * tahakkuk → fatura → tahsilat akışı. Standart %10, sponsor %8, KDV %20.
 * Backend: GET /api/v1/admin/commissions
 */
import { PageHeader, Table, StatusBadge, StatCard } from "@/components/ui";
import { getCommissions } from "@/services";

export const metadata = { title: "Commissions — Turmeet Admin" };

export default async function CommissionsPage() {
  const commissions = await getCommissions();

  const paid = commissions.filter((c) => c.status === "paid").reduce((s, c) => s + c.amount, 0);
  const open = commissions.filter((c) => c.status !== "paid").reduce((s, c) => s + c.amount, 0);

  return (
    <>
      <PageHeader
        title="Commission management"
        description="Accrual → invoice → collection. Standard rate 10%, sponsored 8%, VAT 20%."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Collected (YTD)" value={`€ ${paid.toLocaleString("en-US")}`} tone="success" />
        <StatCard label="Outstanding" value={`€ ${open.toLocaleString("en-US")}`} tone="warning" />
        <StatCard label="Avg. commission rate" value="9.4%" hint="Weighted by revenue" />
      </div>

      <Table headers={["Invoice", "Venue", "Event", "Base", "Rate", "Commission", "Due date", "Status"]}>
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
              <StatusBadge status={c.status} />
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
