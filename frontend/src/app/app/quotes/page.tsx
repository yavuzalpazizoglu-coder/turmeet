/*
 * TEKLİF TALEPLERİM — master doküman 4.3: talep listesi + durum.
 */
import Link from "next/link";
import { PageHeader, Table, StatusBadge, LinkButton } from "@/components/ui";
import { getQuoteRequests } from "@/services";

export const metadata = { title: "My Quote Requests — Turmeet" };

export default async function QuotesPage() {
  const requests = await getQuoteRequests();

  return (
    <>
      <PageHeader
        title="My quote requests"
        description="Track all your RFQs and received offers in one place."
        action={<LinkButton href="/app/quotes/new">+ New Quote Request</LinkButton>}
      />

      <Table headers={["Event", "City", "Dates", "Guests", "Venues", "Quotes", "Status", ""]}>
        {requests.map((r) => {
          const received = r.quotes.filter((q) => q.status === "received").length;
          return (
            <tr key={r.id} className="hover:bg-surface/60">
              <td className="px-4 py-3 font-medium text-ink">{r.eventName}</td>
              <td className="px-4 py-3">{r.city}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {r.checkIn} → {r.checkOut}
              </td>
              <td className="px-4 py-3">{r.guests}</td>
              <td className="px-4 py-3">{r.venueIds.length}</td>
              <td className="px-4 py-3">
                <span className={received > 0 ? "font-semibold text-success" : "text-muted"}>
                  {received}/{r.quotes.length}
                </span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-3">
                <Link href={`/app/quotes/${r.id}`} className="text-sm font-medium text-brand hover:underline">
                  Details
                </Link>
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
