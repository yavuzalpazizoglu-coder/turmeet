/*
 * TURMEET — Veri Modeli Tipleri
 * Kaynak: TURMEET_MASTER_Kurulum.md Bölüm 13.6 (Ana Varlıklar)
 * Laravel backend'deki tablolarla birebir eşleşecek şekilde tasarlandı.
 * Backend API response formatı: { success: boolean, data: T, message: string | null }
 */

// ── API Sözleşmesi ─────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// ── Mekan (Venue / Hotel) ──────────────────────────────────────
export type VenueType =
  | "city_hotel"
  | "resort"
  | "congress_center"
  | "boutique"
  | "mountain_resort"
  | "airport_hotel";

export type BoardType = "BB" | "HB" | "FB" | "AI" | "room_only" | "none";

// ── MICE Inspection kriterleri ─────────────────────────────────
// Kaynak: D Event "MICE Inspection & Değerlendirme Formu"
// (ICCA / IAPCO / TUROB Standartları, Sürüm 2.0 — Temmuz 2026)

/** B.1 Bütçe Segmenti */
export type BudgetSegment = "economy" | "mid" | "upper" | "luxury";

/** B.3 Etkinlik Tipi Uyumu — ICCA/IAPCO etkinlik sınıflandırması
 *  (QuoteRequest'teki EventType'tan ayrıdır; oradaki tip talep formunun
 *  serbest sınıflandırmasıdır, bu liste inspection/filtreleme standardıdır.) */
export type MiceEventType =
  | "congress" // Kongre / Konferans
  | "symposium" // Sempozyum / Seminer
  | "corporate_meeting" // Şirket dönem toplantısı
  | "one_day" // Tek günlük toplantı
  | "incentive" // Incentive / Ödül programı
  | "gala" // Gala / Yemek organizasyonu
  | "exhibition" // Sergi / Fuar
  | "workshop" // Eğitim / Workshop
  | "hybrid"; // Hibrit / Online etkinlik

/** C.2 Toplu Taşıma & Transfer Erişimi */
export type TransitAccess = "metro" | "bus" | "taxi_only" | "transfer_only";

/** Inspection formundan platforma taşınan mekan kriterleri */
export interface VenueMiceProfile {
  /** B.1 — otelin uygun olduğu bütçe segmenti */
  budgetSegment: BudgetSegment;
  /** B.3 — otelin uygun olduğu etkinlik tipleri */
  supportedEventTypes: MiceEventType[];
  /** C.2 — en iyi toplu taşıma erişimi */
  transitAccess: TransitAccess;
  /** C.2 — en yakın metro/tramvay durağı (varsa) */
  nearestMetro: string | null;
  /** D Event MICE Inspection toplam puanı (0-100) */
  inspectionScore: number;
  /** I.1 — çevre/sürdürülebilirlik sertifikası (GreenKey, ISO 14001, LEED...) */
  sustainabilityCertified: boolean;
  /** F.3 — hibrit & online yayın altyapısı */
  hybridStudio: boolean;
  /** D.4 — engelli erişilebilir oda & altyapı (ADA/ICCA) */
  accessibleRooms: boolean;
}

export interface MeetingRoom {
  id: string;
  name: string;
  areaSqm: number;
  ceilingHeight: number;
  theatre: number; // tiyatro düzeni kapasitesi
  classroom: number;
  uShape: number;
  banquet: number;
  cocktail: number;
  divisible: boolean;
  features: string[]; // "Screen", "WiFi", "Stage" ...
}

export interface RoomType {
  id: string;
  name: string; // "Single", "Double", "Suite"...
  count: number;
  sizeSqm: number;
  amenities: string[];
}

export interface Venue extends VenueMiceProfile {
  id: string;
  slug: string;
  name: string;
  city: string;
  district: string;
  /** Otelin gerçek açık adresi */
  address: string;
  /** Otelin gerçek web alan adı — logo servisi bu alandan beslenir (bkz. lib/logo.ts) */
  domain: string;
  /** Gerçek konum — arama sayfasındaki harita bu alanlardan beslenir */
  lat: number;
  lng: number;
  stars: 3 | 4 | 5;
  type: VenueType;
  boardTypes: BoardType[];
  totalRooms: number;
  meetingRoomCount: number;
  maxTheatreCapacity: number;
  airportDistanceKm: number;
  cityCenterDistanceKm: number;
  referencePrice: number | null; // €/gece referans (geçmiş kontratlardan) — teklif fiyatı DEĞİL
  rating: number; // 0-5
  reviewCount: number;
  responseTimeHours: number;
  isSponsored: boolean;
  isPopular: boolean;
  specialOffer: string | null;
  description: string;
  imageUrl: string;
  gallery: string[];
  meetingRooms: MeetingRoom[];
  roomTypes: RoomType[];
  features: string[];
}

// ── Teklif Talebi & Teklif ─────────────────────────────────────
export type QuoteRequestStatus = "waiting" | "quotes_received" | "expired" | "contracted";
export type EventType =
  | "congress"
  | "incentive"
  | "corporate_meeting"
  | "training"
  | "gala"
  | "retreat"
  | "other";

export interface QuoteRequest {
  id: string;
  eventName: string;
  eventType: EventType;
  city: string;
  checkIn: string; // ISO tarih
  checkOut: string;
  guests: number;
  rooms: number;
  venueIds: string[];
  status: QuoteRequestStatus;
  createdAt: string;
  notes: string;
  quotes: Quote[];
}

export type QuoteStatus = "pending" | "received" | "declined" | "expired";

export interface Quote {
  id: string;
  requestId: string;
  venueId: string;
  venueName: string;
  status: QuoteStatus;
  singlePrice: number | null; // €/gece
  doublePrice: number | null;
  meetingPackagePrice: number | null; // €/kişi/gün
  hallRentalPrice: number | null;
  fnbPrice: number | null;
  totalEstimate: number | null;
  optionUntil: string | null; // opsiyon bitiş tarihi
  cancellationTerms: string;
  respondedAt: string | null;
}

// ── Kontrat ────────────────────────────────────────────────────
export type ContractStatus = "draft" | "pending_signature" | "active" | "completed" | "cancelled";

export interface Contract {
  id: string;
  number: string; // "TRM-2026-001"
  venueId: string;
  venueName: string;
  customerCompany: string;
  eventName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  totalAmount: number; // €
  status: ContractStatus;
  cutoffDate: string | null;
  createdAt: string;
}

// ── Komisyon ───────────────────────────────────────────────────
export type CommissionStatus = "accrued" | "invoiced" | "paid" | "overdue" | "disputed";

export interface Commission {
  id: string;
  invoiceNumber: string;
  contractId: string;
  venueName: string;
  eventName: string;
  baseAmount: number; // komisyon matrahı €
  rate: number; // 0.10 standart, 0.08 sponsor
  amount: number; // komisyon tutarı €
  vatRate: number; // 0.20
  status: CommissionStatus;
  dueDate: string;
  paidAt: string | null;
}

// ── Mesajlaşma ─────────────────────────────────────────────────
export type ThreadType = "venue" | "coordinator" | "support";

export interface MessageThread {
  id: string;
  type: ThreadType;
  title: string; // otel adı veya "Coordinator"
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
}

export interface Message {
  id: string;
  threadId: string;
  senderRole: "customer" | "venue" | "coordinator" | "admin" | "system";
  senderName: string;
  body: string;
  attachments: { name: string; sizeKb: number }[];
  sentAt: string;
}

// ── Kullanıcı & Roller ─────────────────────────────────────────
export type UserRole =
  | "customer_admin"
  | "customer_user"
  | "customer_viewer"
  | "partner_manager"
  | "partner_staff"
  | "super_admin"
  | "coordinator"
  | "finance";

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  role: UserRole;
  createdAt: string;
}

// ── Müşteri Kaydı (Admin onayı bekleyen) ───────────────────────
export type RegistrationStatus = "pending" | "approved" | "rejected" | "on_hold";

export interface PendingRegistration {
  id: string;
  company: string;
  email: string;
  country: string;
  sector: string;
  contactName: string;
  status: RegistrationStatus;
  appliedAt: string;
}

// ── Promosyon (Partner) ────────────────────────────────────────
export interface Promotion {
  id: string;
  venueId: string;
  name: string;
  validFrom: string;
  validUntil: string;
  description: string;
  minCondition: string; // "100+ oda gecelemesi"
  active: boolean;
}

// ── Koordinatör (Admin) ────────────────────────────────────────
export interface Coordinator {
  id: string;
  name: string;
  activeAssignments: number;
  newThisWeek: number;
  slaCompliance: number; // 0-100
  available: boolean;
}

// ── Destinasyon ────────────────────────────────────────────────
export interface Destination {
  slug: string;
  name: string;
  venueCount: number;
  totalRooms: number;
  category: "congress" | "incentive" | "cultural" | "wellness";
  tagline: string;
  imageUrl: string;
}
