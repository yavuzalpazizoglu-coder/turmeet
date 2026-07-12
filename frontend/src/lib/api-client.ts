/*
 * ════════════════════════════════════════════════════════════════
 *  BACKEND GEÇİŞ NOKTASI (tek dosya)
 * ════════════════════════════════════════════════════════════════
 *
 * Şu an: USE_MOCKS = true → tüm servisler src/mocks/ verisini döndürür.
 *
 * Laravel backend hazır olduğunda yapılacaklar:
 *   1. .env.local dosyasına ekleyin:  NEXT_PUBLIC_API_URL=https://api.turmeet.com
 *   2. Aşağıdaki USE_MOCKS değerini false yapın (veya env ile yönetin).
 *   3. src/services/ içindeki her fonksiyon zaten apiGet/apiPost
 *      çağrısına hazır — sayfa kodunda HİÇBİR değişiklik gerekmez.
 *
 * API sözleşmesi (Laravel ApiController ile birebir):
 *   { success: boolean, data: T, message: string | null }
 *
 * Endpoint kataloğu: docs/BACKEND_INTEGRATION.md
 */

import type { ApiResponse } from "@/types";

export const USE_MOCKS =
  process.env.NEXT_PUBLIC_USE_MOCKS !== "false"; // varsayılan: mock açık

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API_PREFIX = "/api/v1";

function authHeaders(): Record<string, string> {
  // Backend bağlandığında JWT token buradan eklenecek.
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("turmeet_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${API_PREFIX}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
    cache: "no-store",
  });
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.message ?? "API error");
  return json.data;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${API_PREFIX}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.message ?? "API error");
  return json.data;
}

/** Mock modda gerçekçi ağ gecikmesi simülasyonu. */
export function mockDelay<T>(data: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
