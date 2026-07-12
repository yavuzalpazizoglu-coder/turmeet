/*
 * ════════════════════════════════════════════════════════════════
 *  OTEL LOGO ALTYAPISI — alan adından ücretsiz logo servisi
 * ════════════════════════════════════════════════════════════════
 *
 * Öncelik sırası:
 *   1. logo.dev — en kaliteli sonuç, ücretsiz plan mevcut.
 *      Token almak için: https://logo.dev → Sign up →
 *      Publishable Key'i frontend/.env.local içine yazın:
 *        NEXT_PUBLIC_LOGODEV_TOKEN=pk_...
 *      Token girildiği anda tüm site otomatik logo.dev kullanır.
 *   2. Google Favicon servisi — token gerektirmez, her domain için
 *      sonuç döner (varsayılan; kalite favicon düzeyindedir).
 *
 * Not: Clearbit Logo API (logo.clearbit.com) 2025'te kapatıldı,
 * bu yüzden kullanılmıyor.
 *
 * Kullanım: <HotelLogo domain={venue.domain} name={venue.name} />
 */

const LOGODEV_TOKEN = process.env.NEXT_PUBLIC_LOGODEV_TOKEN;

/** Birincil logo URL'i (logo.dev token'ı varsa o, yoksa Google favicon). */
export function logoUrl(domain: string, size = 128): string {
  if (LOGODEV_TOKEN) {
    return `https://img.logo.dev/${domain}?token=${LOGODEV_TOKEN}&size=${size}&format=png`;
  }
  return faviconUrl(domain, size);
}

/** Fallback: Google favicon servisi (her zaman bir görsel döner). */
export function faviconUrl(domain: string, size = 128): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}
