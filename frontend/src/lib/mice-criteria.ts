/*
 * MICE KRİTER SÖZLÜKLERİ — ICCA / IAPCO etkinlik tipleri ve
 * D Event Inspection formu bütçe segmentleri.
 * Filtre paneli, ana sayfa araması ve mekan kartları ortak kullanır.
 */
import type { MiceEventType, BudgetSegment } from "@/types";

/** ICCA/IAPCO etkinlik sınıflandırması (Inspection formu B.3) */
export const EVENT_TYPES: { value: MiceEventType; label: string }[] = [
  { value: "congress", label: "Congress / Conference" },
  { value: "symposium", label: "Symposium / Seminar" },
  { value: "corporate_meeting", label: "Corporate Meeting" },
  { value: "one_day", label: "One-Day Meeting" },
  { value: "incentive", label: "Incentive / Reward Program" },
  { value: "gala", label: "Gala / Dinner Event" },
  { value: "exhibition", label: "Exhibition / Trade Fair" },
  { value: "workshop", label: "Training / Workshop" },
  { value: "hybrid", label: "Hybrid / Online Event" },
];

/** Bütçe segmentleri (Inspection formu B.1) */
export const BUDGET_SEGMENTS: { value: BudgetSegment; label: string }[] = [
  { value: "economy", label: "Economy" },
  { value: "mid", label: "Mid-range" },
  { value: "upper", label: "Upper segment" },
  { value: "luxury", label: "Premium & Luxury" },
];

export function eventTypeLabel(value: string): string {
  return EVENT_TYPES.find((e) => e.value === value)?.label ?? value;
}
