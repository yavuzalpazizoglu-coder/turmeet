/*
 * TEKLİF KARŞILAŞTIRMA — master doküman 4.5:
 * Bir talebe gelen teklifleri yan yana karşılaştırma tablosu.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader, StatusBadge, Card, LinkButton, Badge } from "@/components/ui";
import { getQuoteRequest } from "@/services";
import type { Quote } from "@/types";

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getQuoteRequest(id);
  if (!request) notFound();

  const received = request.quotes.filter((q) => q.status === "received");
  const cheapest = received.length > 0 ? Math.min(...received.map((q) => q.totalEstimate ?? Infinity)) : null;

  const rows: { label: string; render: (q: Quote) => React.ReactNode }[] = [
    { label: "Single room / night", render: (q) => (q.singlePrice ? `€ ${q.singlePrice}` : "—") },
    { label: "Double room / night", render: (q) => (q.doublePrice ? `€ ${q.doublePrice}` : "—") },
    { label: "Meeting package / person / day", render: (q) => (q.meetingPackagePrice ? `€ ${q.meetingPackagePrice}` : "—") },
    { label: "Hall rental", render: (q) => (q.hallRentalPrice !== null ? (q.hallRentalPrice === 0 ? "Included" : `€ ${q.hallRentalPrice}`) : "—") },
    { label: "F&B estimate", render: (q) => (q.fnbPrice ? `€ ${q.fnbPrice.toLocaleString("en-US")}` : "—") },
    { label: "Option valid until", render: (q) => q.optionUntil ?? "—" },
    { label: "Cancellation terms", render: (q) => q.cancellationTerms || "—" },
  ];

  return (
    <>
      <PageHeader
        title={request.eventName}
        description={`${request.city} · ${request.checkIn} → ${request.checkOut} · ${request.guests} guests · ${request.rooms} rooms`}
        action={<StatusBadge status={request.status} />}
      />

      {request.notes && (
        <Card className="mb-6 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Your requirements</p>
          <p className="mt-1 text-sm text-ink">{request.notes}</p>
        </Card>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-56 border-b border-gray-200 p-3" />
              {request.quotes.map((q) => (
                <th key={q.id} className="border-b border-gray-200 p-3 text-left align-bottom">
                  <p className="font-semibold text-ink">{q.venueName}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusBadge status={q.status} />
                    {q.totalEstimate !== null && q.totalEstimate === cheapest && <Badge tone="success">Best price</Badge>}
                  </div>
                  {q.totalEstimate !== null && (
                    <p className="mt-2 text-xl font-bold text-brand">€ {q.totalEstimate.toLocaleString("en-US")}</p>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="odd:bg-surface/60">
                <td className="p-3 font-medium text-muted">{row.label}</td>
                {request.quotes.map((q) => (
                  <td key={q.id} className="p-3 text-ink">
                    {q.status === "received" ? row.render(q) : <span className="text-muted">Awaiting response</span>}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-3" />
              {request.quotes.map((q) => (
                <td key={q.id} className="p-3">
                  {q.status === "received" ? (
                    <div className="space-y-2">
                      <LinkButton href="/app/contracts" size="sm" className="w-full">
                        Accept & proceed
                      </LinkButton>
                      <LinkButton href="/app/messages" variant="secondary" size="sm" className="w-full">
                        Ask a question
                      </LinkButton>
                    </div>
                  ) : (
                    <p className="text-xs text-muted">Typically responds within 24 hr</p>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-muted">
        Need help negotiating?{" "}
        <Link href="/app/messages" className="font-medium text-brand hover:underline">
          Message your Turmeet coordinator
        </Link>
        {" "}— we&apos;ll handle it for you.
      </p>
    </>
  );
}
