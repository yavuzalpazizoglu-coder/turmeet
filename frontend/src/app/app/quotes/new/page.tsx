/*
 * YENİ TEKLİF TALEBİ (RFQ WIZARD) — master doküman 4.4:
 * Etkinlik detayları + mekan seçimi (max 5) + gönderim.
 * Backend: POST /api/v1/quote-requests
 */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader, Card, Button, Input, Field, Select, Textarea, Badge } from "@/components/ui";
import { CheckIcon } from "@/components/ui/icons";
import { getVenues, createQuoteRequest } from "@/services";
import type { Venue } from "@/types";

function NewQuoteForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselected = searchParams.get("venue");

  const [venues, setVenues] = useState<Venue[]>([]);
  const [selected, setSelected] = useState<string[]>(preselected ? [preselected] : []);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getVenues().then(setVenues);
  }, []);

  function toggleVenue(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await createQuoteRequest({ venueIds: selected });
    router.push("/app/quotes");
  }

  return (
    <>
      <PageHeader
        title="New quote request"
        description="One request, multiple venues — offers arrive directly on the platform."
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Sol: etkinlik detayları */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 font-bold text-ink">1. Event details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Event name">
                  <Input required placeholder="Annual Sales Kick-off 2027" />
                </Field>
              </div>
              <Field label="Event type">
                <Select required defaultValue="">
                  <option value="" disabled>
                    Select...
                  </option>
                  {["Congress", "Incentive", "Corporate meeting", "Training", "Gala dinner", "Retreat", "Other"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>
              <Field label="City">
                <Select required defaultValue="">
                  <option value="" disabled>
                    Select...
                  </option>
                  {["Istanbul", "Antalya", "Ankara", "Izmir", "Cappadocia", "Bursa", "Flexible"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Check-in">
                <Input type="date" required />
              </Field>
              <Field label="Check-out">
                <Input type="date" required />
              </Field>
              <Field label="Guests">
                <Input type="number" required placeholder="85" min={1} />
              </Field>
              <Field label="Rooms needed">
                <Input type="number" required placeholder="45" min={1} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Meeting requirements & notes">
                  <Textarea placeholder="Main hall in theatre setup for 100, 2 breakout rooms, coffee breaks..." />
                </Field>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-1 font-bold text-ink">2. Select venues</h2>
            <p className="mb-4 text-sm text-muted">Choose up to 5 venues — {selected.length}/5 selected.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {venues.map((v) => {
                const isSelected = selected.includes(v.id);
                return (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => toggleVenue(v.id)}
                    className={`flex items-center gap-3 rounded-btn border p-3 text-left transition-colors ${
                      isSelected ? "border-brand bg-brand-light" : "border-gray-200 hover:border-brand/40"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.imageUrl} alt={v.name} className="h-12 w-16 shrink-0 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{v.name}</p>
                      <p className="text-xs text-muted">
                        {v.city} · {v.maxTheatreCapacity} capacity
                      </p>
                    </div>
                    {isSelected && <CheckIcon size={18} className="shrink-0 text-brand" />}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Sağ: özet */}
        <aside className="h-fit lg:sticky lg:top-20">
          <Card className="p-6">
            <h2 className="font-bold text-ink">Summary</h2>
            <div className="mt-3 space-y-2">
              {selected.length === 0 ? (
                <p className="text-sm text-muted">No venues selected yet.</p>
              ) : (
                selected.map((id) => {
                  const v = venues.find((x) => x.id === id);
                  return v ? (
                    <div key={id} className="flex items-center justify-between text-sm">
                      <span className="truncate text-ink">{v.name}</span>
                      <Badge tone="brand">{v.city}</Badge>
                    </div>
                  ) : null;
                })
              )}
            </div>
            <Button type="submit" size="lg" className="mt-5 w-full" disabled={selected.length === 0 || sending}>
              {sending ? "Sending..." : `Send request to ${selected.length} venue${selected.length === 1 ? "" : "s"}`}
            </Button>
            <p className="mt-3 text-center text-xs text-muted">
              Free of charge — venues typically respond within 24 hours.
            </p>
          </Card>
        </aside>
      </form>
    </>
  );
}

export default function NewQuotePage() {
  return (
    <Suspense>
      <NewQuoteForm />
    </Suspense>
  );
}
