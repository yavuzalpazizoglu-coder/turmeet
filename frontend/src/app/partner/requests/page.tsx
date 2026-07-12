/*
 * GELEN TALEPLER — master doküman 5.2: otele düşen RFQ listesi.
 * Backend: GET /api/v1/partner/requests
 */
import Link from "next/link";
import { PageHeader, Table, StatusBadge } from "@/components/ui";
import { getPartnerRequests } from "@/services";

export const metadata = { title: "Quote Requests — Turmeet Partner" };

export default async function PartnerRequestsPage() {
  const requests = await getPartnerRequests();

  return (
    <>
      <PageHeader
        title="Quote requests"
        description="Respond within 24 hours to keep your response-time score high."
      />

      <Table headers={["Event", "Type", "Dates", "Guests", "Rooms", "Received", "Status", ""]}>
        {requests.map((r) => (
          <tr key={r.id} className="hover:bg-surface/60">
            <td className="px-4 py-3 font-medium text-ink">{r.eventName}</td>
            <td className="px-4 py-3 capitalize">{r.eventType.replace(/_/g, " ")}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              {r.checkIn} → {r.checkOut}
            </td>
            <td className="px-4 py-3">{r.guests}</td>
            <td className="px-4 py-3">{r.rooms}</td>
            <td className="px-4 py-3 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString("en-GB")}</td>
            <td className="px-4 py-3">
              <StatusBadge status={r.status} />
            </td>
            <td className="px-4 py-3">
              <Link href={`/partner/requests/${r.id}`} className="text-sm font-medium text-brand hover:underline">
                {r.status === "waiting" ? "Respond" : "View"}
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
