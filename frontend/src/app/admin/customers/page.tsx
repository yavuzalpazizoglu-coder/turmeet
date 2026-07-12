/*
 * MÜŞTERİLER — master doküman 6.3: onaylı müşteri listesi.
 * Backend: GET /api/v1/admin/customers
 */
import { PageHeader, Table, Badge } from "@/components/ui";

export const metadata = { title: "Customers — Turmeet Admin" };

const CUSTOMERS = [
  { id: "cu1", company: "Nordwind Capital GmbH", country: "Germany", sector: "Corporate", users: 3, requests: 3, contracts: 1, revenue: "€ 21,400", tier: "Gold" },
  { id: "cu2", company: "Helios Pharma AG", country: "Switzerland", sector: "Corporate", users: 5, requests: 7, contracts: 2, revenue: "€ 144,200", tier: "Platinum" },
  { id: "cu3", company: "EU Trade Delegation", country: "Belgium", sector: "Government", users: 2, requests: 2, contracts: 1, revenue: "€ 46,200", tier: "Silver" },
  { id: "cu4", company: "Vertex Events Ltd", country: "United Kingdom", sector: "Agency / PCO", users: 8, requests: 12, contracts: 4, revenue: "€ 287,900", tier: "Platinum" },
];

export default function CustomersPage() {
  return (
    <>
      <PageHeader title="Customers" description="Approved organizer accounts and their activity." />

      <Table headers={["Company", "Country", "Sector", "Users", "Requests", "Contracts", "Total revenue", "Tier"]}>
        {CUSTOMERS.map((c) => (
          <tr key={c.id} className="hover:bg-surface/60">
            <td className="px-4 py-3 font-medium text-ink">{c.company}</td>
            <td className="px-4 py-3">{c.country}</td>
            <td className="px-4 py-3">{c.sector}</td>
            <td className="px-4 py-3">{c.users}</td>
            <td className="px-4 py-3">{c.requests}</td>
            <td className="px-4 py-3">{c.contracts}</td>
            <td className="px-4 py-3 font-semibold">{c.revenue}</td>
            <td className="px-4 py-3">
              <Badge tone={c.tier === "Platinum" ? "brand" : c.tier === "Gold" ? "warning" : "neutral"}>{c.tier}</Badge>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
