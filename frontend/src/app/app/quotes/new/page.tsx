/*
 * YENİ TEKLİF TALEBİ (RFQ WIZARD) — master doküman 4.4:
 * Etkinlik detayları + mekan seçimi (max 5) + gönderim.
 * Backend: POST /api/v1/quote-requests
 *
 * Tasarım kararı — "Event details" tek tıkla dolar:
 *  · Etkinlik tipi ve şehir dropdown yerine tıklanabilir chip'ler
 *    (ICCA sözlüğü — arama filtreleriyle aynı liste).
 *  · Tarih için hazır süre chip'leri (2/3/5 gece) — check-in seçilince
 *    check-out otomatik dolar; gece sayısı canlı gösterilir.
 *  · Katılımcı için hızlı boyut chip'leri (50/100/250/500); oda sayısı
 *    katılımcıdan otomatik önerilir (%55 — çiftli/tekli karışım),
 *    kullanıcı elle değiştirirse öneri devre dışı kalır.
 *  · Sağdaki özet kartı her seçimde canlı güncellenir — kullanıcı
 *    göndermeden önce talebin tamamını görür.
 */
"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader, Card, Button, Input, Field, Textarea, Badge } from "@/components/ui";
import { CheckIcon, UsersIcon, MapPinIcon, ClockIcon } from "@/components/ui/icons";
import { EVENT_TYPES } from "@/lib/mice-criteria";
import { getVenues, createQuoteRequest } from "@/services";
import type { Venue } from "@/types";

const CITIES = ["Istanbul", "Antalya", "Ankara", "Izmir", "Bursa", "Cappadocia", "Flexible"];
const GROUP_PRESETS = [50, 100, 250, 500];
const NIGHT_PRESETS = [2, 3, 5];

/** ISO gün ekleme — check-in + N gece = check-out */
function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
}

const chipCls = (active: boolean) =>
  `cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
    active
      ? "border-brand bg-brand text-white shadow-sm"
      : "border-gray-200 bg-white text-ink/70 hover:border-brand/50 hover:text-brand"
  }`;

function NewQuoteForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselected = searchParams.get("venue");

  const [venues, setVenues] = useState<Venue[]>([]);
  const [selected, setSelected] = useState<string[]>(preselected ? [preselected] : []);
  const [sending, setSending] = useState(false);

  // Etkinlik detayları — özet kartı canlı beslenir
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<number | "">("");
  const [rooms, setRooms] = useState<number | "">("");
  const [roomsTouched, setRoomsTouched] = useState(false);

  useEffect(() => {
    getVenues().then(setVenues);
  }, []);

  /* Oda önerisi — katılımcının ~%55'i (çift/tek kişilik karışımı).
     Kullanıcı oda alanına elle dokunduysa öneri yapılmaz. */
  function applyGuests(n: number) {
    setGuests(n);
    if (!roomsTouched) setRooms(Math.max(1, Math.round(n * 0.55)));
  }

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  // Şehir seçilince mekan listesi önce o şehri gösterir
  const sortedVenues = useMemo(() => {
    if (!city || city === "Flexible") return venues;
    return [...venues].sort((a, b) => Number(b.city === city) - Number(a.city === city));
  }, [venues, city]);

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

  const typeLabel = EVENT_TYPES.find((t) => t.value === eventType)?.label;

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
            <h2 className="font-bold text-ink">1. Event details</h2>
            <p className="mb-4 mt-0.5 text-xs text-muted">Tap to select — most requests take under a minute.</p>

            <Field label="Event name">
              <Input
                required
                placeholder="Annual Sales Kick-off 2027"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </Field>

            {/* Etkinlik tipi — ICCA sözlüğünden tıklanabilir chip'ler */}
            <p className="mb-1.5 mt-4 text-sm font-medium text-ink">Event type</p>
            <div className="flex flex-wrap gap-1.5">
              {EVENT_TYPES.map((t) => (
                <button key={t.value} type="button" onClick={() => setEventType(t.value)} className={chipCls(eventType === t.value)}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Şehir chip'leri */}
            <p className="mb-1.5 mt-4 text-sm font-medium text-ink">City</p>
            <div className="flex flex-wrap gap-1.5">
              {CITIES.map((c) => (
                <button key={c} type="button" onClick={() => setCity(c)} className={chipCls(city === c)}>
                  {c}
                </button>
              ))}
            </div>

            {/* Tarihler + hazır süre chip'leri */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Check-in">
                <Input
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    // Check-out check-in'den önceyse sıfırla
                    if (checkOut && e.target.value >= checkOut) setCheckOut("");
                  }}
                />
              </Field>
              <Field label="Check-out">
                <Input type="date" required min={checkIn} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
              </Field>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted">Quick duration:</span>
              {NIGHT_PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={!checkIn}
                  onClick={() => setCheckOut(addDays(checkIn, n))}
                  className={`${chipCls(nights === n)} disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {n} nights
                </button>
              ))}
              {nights > 0 && (
                <span className="ml-1 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                  <ClockIcon size={12} /> {nights} night{nights > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Katılımcı + oda — hızlı boyut chip'leri ve otomatik oda önerisi */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Field label="Guests">
                  <Input
                    type="number"
                    required
                    placeholder="85"
                    min={1}
                    value={guests}
                    onChange={(e) => applyGuests(Number(e.target.value) || 0)}
                  />
                </Field>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {GROUP_PRESETS.map((n) => (
                    <button key={n} type="button" onClick={() => applyGuests(n)} className={chipCls(guests === n)}>
                      {n} pax
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Field label="Rooms needed">
                  <Input
                    type="number"
                    required
                    placeholder="45"
                    min={1}
                    value={rooms}
                    onChange={(e) => {
                      setRoomsTouched(true);
                      setRooms(Number(e.target.value) || 0);
                    }}
                  />
                </Field>
                {!roomsTouched && rooms !== "" && (
                  <p className="mt-1.5 text-xs text-muted">Auto-suggested from guest count — edit anytime.</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <Field label="Meeting requirements & notes">
                <Textarea placeholder="Main hall in theatre setup for 100, 2 breakout rooms, coffee breaks..." />
              </Field>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-1 font-bold text-ink">2. Select venues</h2>
            <p className="mb-4 text-sm text-muted">
              Choose up to 5 venues — {selected.length}/5 selected.
              {city && city !== "Flexible" ? ` ${city} venues shown first.` : ""}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {sortedVenues.map((v) => {
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

        {/* Sağ: canlı özet */}
        <aside className="h-fit lg:sticky lg:top-20">
          <Card className="p-6">
            <h2 className="font-bold text-ink">Summary</h2>

            {/* Etkinlik özeti — form dolarken canlı güncellenir */}
            <div className="mt-3 space-y-1.5 text-sm">
              {eventName && <p className="font-semibold text-ink">{eventName}</p>}
              {typeLabel && (
                <p className="inline-flex items-center gap-1.5 text-ink/80">
                  <CheckIcon size={13} className="text-brand" /> {typeLabel}
                </p>
              )}
              {city && (
                <p className="flex items-center gap-1.5 text-ink/80">
                  <MapPinIcon size={13} className="text-brand" /> {city}
                </p>
              )}
              {nights > 0 && (
                <p className="flex items-center gap-1.5 text-ink/80">
                  <ClockIcon size={13} className="text-brand" /> {checkIn} → {checkOut} · {nights} night{nights > 1 ? "s" : ""}
                </p>
              )}
              {guests !== "" && guests > 0 && (
                <p className="flex items-center gap-1.5 text-ink/80">
                  <UsersIcon size={13} className="text-brand" /> {guests} guests · {rooms || "?"} rooms
                </p>
              )}
              {!eventName && !typeLabel && !city && nights === 0 && (
                <p className="text-muted">Fill in the event details — they appear here.</p>
              )}
            </div>

            <div className="mt-4 border-t border-gray-100 pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                Venues · {selected.length}/5
              </p>
              {selected.length === 0 ? (
                <p className="text-sm text-muted">No venues selected yet.</p>
              ) : (
                <div className="space-y-2">
                  {selected.map((id) => {
                    const v = venues.find((x) => x.id === id);
                    return v ? (
                      <div key={id} className="flex items-center justify-between text-sm">
                        <span className="truncate text-ink">{v.name}</span>
                        <Badge tone="brand">{v.city}</Badge>
                      </div>
                    ) : null;
                  })}
                </div>
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
