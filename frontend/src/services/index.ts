/*
 * ════════════════════════════════════════════════════════════════
 *  SERVİS KATMANI — sayfalar SADECE bu fonksiyonları kullanır.
 * ════════════════════════════════════════════════════════════════
 *
 * Her fonksiyonun üzerinde bağlanacağı Laravel endpoint'i yazılıdır.
 * USE_MOCKS=false olduğunda apiGet/apiPost devreye girer;
 * sayfa kodunda değişiklik gerekmez.
 */

import { USE_MOCKS, apiGet, apiPost, mockDelay } from "@/lib/api-client";
import { MOCK_VENUES, MOCK_DESTINATIONS } from "@/mocks/venues";
import { MOCK_QUOTE_REQUESTS } from "@/mocks/quotes";
import { MOCK_CONTRACTS, MOCK_COMMISSIONS } from "@/mocks/contracts";
import {
  MOCK_THREADS,
  MOCK_PENDING_REGISTRATIONS,
  MOCK_PROMOTIONS,
  MOCK_COORDINATORS,
} from "@/mocks/misc";
import type {
  Venue,
  Destination,
  QuoteRequest,
  Contract,
  Commission,
  MessageThread,
  PendingRegistration,
  Promotion,
  Coordinator,
} from "@/types";

// ── Mekanlar ───────────────────────────────────────────────────

export interface VenueFilters {
  city?: string;
  stars?: number;
  minCapacity?: number;
  type?: string;
  q?: string;
  /** ICCA/IAPCO etkinlik tipi (MICE Inspection B.3) */
  eventType?: string;
  /** Bütçe segmenti (MICE Inspection B.1) */
  budget?: string;
  /** "1" → yalnızca metro/tramvay erişimli oteller (MICE Inspection C.2) */
  metro?: string;
  /** "1" → sürdürülebilirlik sertifikalı oteller (MICE Inspection I.1) */
  sustainable?: string;
}

/** GET /api/v1/hotels?city=&star=&capacity=&eventType=&budget=&metro= */
export async function getVenues(filters: VenueFilters = {}): Promise<Venue[]> {
  if (!USE_MOCKS) return apiGet<Venue[]>(`/hotels?${new URLSearchParams(filters as Record<string, string>)}`);
  let list = [...MOCK_VENUES];
  if (filters.city) list = list.filter((v) => v.city.toLowerCase() === filters.city!.toLowerCase());
  if (filters.stars) list = list.filter((v) => v.stars === filters.stars);
  if (filters.minCapacity) list = list.filter((v) => v.maxTheatreCapacity >= filters.minCapacity!);
  if (filters.type) list = list.filter((v) => v.type === filters.type);
  if (filters.eventType) list = list.filter((v) => v.supportedEventTypes.includes(filters.eventType as Venue["supportedEventTypes"][number]));
  if (filters.budget) list = list.filter((v) => v.budgetSegment === filters.budget);
  if (filters.metro === "1") list = list.filter((v) => v.transitAccess === "metro");
  if (filters.sustainable === "1") list = list.filter((v) => v.sustainabilityCertified);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter((v) => v.name.toLowerCase().includes(q) || v.city.toLowerCase().includes(q));
  }
  // Sponsorlu olanlar üstte, ardından D Event inspection puanı + rating
  list.sort(
    (a, b) =>
      Number(b.isSponsored) - Number(a.isSponsored) ||
      b.inspectionScore - a.inspectionScore ||
      b.rating - a.rating,
  );
  return mockDelay(list);
}

/** GET /api/v1/hotels/{slug} */
export async function getVenueBySlug(slug: string): Promise<Venue | null> {
  if (!USE_MOCKS) return apiGet<Venue>(`/hotels/${slug}`);
  return mockDelay(MOCK_VENUES.find((v) => v.slug === slug) ?? null);
}

/** GET /api/v1/hotels?ids= — karşılaştırma ekranı */
export async function getVenuesByIds(ids: string[]): Promise<Venue[]> {
  if (!USE_MOCKS) return apiGet<Venue[]>(`/hotels?ids=${ids.join(",")}`);
  return mockDelay(MOCK_VENUES.filter((v) => ids.includes(v.id)));
}

/** GET /api/v1/destinations */
export async function getDestinations(): Promise<Destination[]> {
  if (!USE_MOCKS) return apiGet<Destination[]>("/destinations");
  return mockDelay(MOCK_DESTINATIONS);
}

// ── Teklifler ──────────────────────────────────────────────────

/** GET /api/v1/quote-requests (müşteri paneli) */
export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  if (!USE_MOCKS) return apiGet<QuoteRequest[]>("/quote-requests");
  return mockDelay(MOCK_QUOTE_REQUESTS);
}

/** GET /api/v1/quote-requests/{id} */
export async function getQuoteRequest(id: string): Promise<QuoteRequest | null> {
  if (!USE_MOCKS) return apiGet<QuoteRequest>(`/quote-requests/${id}`);
  return mockDelay(MOCK_QUOTE_REQUESTS.find((r) => r.id === id) ?? null);
}

/** POST /api/v1/quote-requests */
export async function createQuoteRequest(payload: Partial<QuoteRequest>): Promise<{ id: string }> {
  if (!USE_MOCKS) return apiPost<{ id: string }>("/quote-requests", payload);
  return mockDelay({ id: `qr-mock-${Date.now()}` });
}

// ── Kontratlar ─────────────────────────────────────────────────

/** GET /api/v1/contracts */
export async function getContracts(): Promise<Contract[]> {
  if (!USE_MOCKS) return apiGet<Contract[]>("/contracts");
  return mockDelay(MOCK_CONTRACTS);
}

// ── Mesajlar ───────────────────────────────────────────────────

/** GET /api/v1/messages/threads */
export async function getThreads(): Promise<MessageThread[]> {
  if (!USE_MOCKS) return apiGet<MessageThread[]>("/messages/threads");
  return mockDelay(MOCK_THREADS);
}

// ── Partner (Otel) Paneli ──────────────────────────────────────

/** GET /api/v1/partner/requests — otele gelen teklif talepleri */
export async function getPartnerRequests(): Promise<QuoteRequest[]> {
  if (!USE_MOCKS) return apiGet<QuoteRequest[]>("/partner/requests");
  return mockDelay(MOCK_QUOTE_REQUESTS);
}

/** GET /api/v1/partner/promotions */
export async function getPromotions(): Promise<Promotion[]> {
  if (!USE_MOCKS) return apiGet<Promotion[]>("/partner/promotions");
  return mockDelay(MOCK_PROMOTIONS);
}

/** GET /api/v1/partner/profile — otel kendi profili (salt okunur) */
export async function getPartnerProfile(): Promise<Venue> {
  if (!USE_MOCKS) return apiGet<Venue>("/partner/profile");
  return mockDelay(MOCK_VENUES[0]);
}

// ── Admin Paneli ───────────────────────────────────────────────

/** GET /api/v1/admin/registrations?status=pending */
export async function getPendingRegistrations(): Promise<PendingRegistration[]> {
  if (!USE_MOCKS) return apiGet<PendingRegistration[]>("/admin/registrations?status=pending");
  return mockDelay(MOCK_PENDING_REGISTRATIONS);
}

/** GET /api/v1/admin/commissions */
export async function getCommissions(): Promise<Commission[]> {
  if (!USE_MOCKS) return apiGet<Commission[]>("/admin/commissions");
  return mockDelay(MOCK_COMMISSIONS);
}

/** GET /api/v1/admin/coordinators */
export async function getCoordinators(): Promise<Coordinator[]> {
  if (!USE_MOCKS) return apiGet<Coordinator[]>("/admin/coordinators");
  return mockDelay(MOCK_COORDINATORS);
}

/** GET /api/v1/admin/venues — tüm mekan yönetimi */
export async function getAdminVenues(): Promise<Venue[]> {
  if (!USE_MOCKS) return apiGet<Venue[]>("/admin/venues");
  return mockDelay(MOCK_VENUES);
}
