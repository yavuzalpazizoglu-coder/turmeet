/*
 * TEKLİF VERME FORMU — master doküman 5.3:
 * Talep detayı + yapılandırılmış teklif formu (oda / paket / F&B / şartlar).
 * Backend: POST /api/v1/partner/requests/{id}/quote
 */
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Button, Input, Field, Textarea, StatusBadge } from "@/components/ui";
import { getQuoteRequest } from "@/services";
import type { QuoteRequest } from "@/types";

export default function PartnerRespondPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [request, setRequest] = useState<QuoteRequest | null>(null);

  useEffect(() => {
    getQuoteRequest(id).then(setRequest);
  }, [id]);

  if (!request) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  return (
    <>
      <PageHeader
        title={request.eventName}
        description={`${request.city} · ${request.checkIn} → ${request.checkOut} · ${request.guests} guests · ${request.rooms} rooms`}
        action={<StatusBadge status={request.status} />}
      />

      {request.notes && (
        <Card className="mb-6 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Organizer requirements</p>
          <p className="mt-1 text-sm text-ink">{request.notes}</p>
        </Card>
      )}

      <form
        className="grid gap-6 lg:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          // MOCK: backend'de POST /partner/requests/{id}/quote
          router.push("/partner/requests");
        }}
      >
        <Card className="p-6">
          <h2 className="mb-4 font-bold text-ink">Accommodation rates (€ / night)</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Single room">
              <Input type="number" placeholder="150" required />
            </Field>
            <Field label="Double room">
              <Input type="number" placeholder="200" required />
            </Field>
          </div>
          <h2 className="mb-4 mt-8 font-bold text-ink">Meeting & F&B</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Meeting package (€/person/day)">
              <Input type="number" placeholder="45" />
            </Field>
            <Field label="Hall rental (€, 0 = included)">
              <Input type="number" placeholder="0" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="F&B estimate (€ total)">
                <Input type="number" placeholder="3200" />
              </Field>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 font-bold text-ink">Terms</h2>
            <div className="space-y-4">
              <Field label="Option valid until">
                <Input type="date" required />
              </Field>
              <Field label="Cancellation terms">
                <Textarea placeholder="Free cancellation until 30 days before arrival..." required />
              </Field>
              <Field label="Notes to organizer (optional)">
                <Textarea placeholder="We're happy to arrange a site inspection..." />
              </Field>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" size="lg" className="flex-1">
                Submit quote
              </Button>
              <Button type="button" variant="ghost" size="lg" onClick={() => router.push("/partner/requests")}>
                Decline request
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              Your quote is binding until the option date you specify.
            </p>
          </Card>
        </div>
      </form>
    </>
  );
}
