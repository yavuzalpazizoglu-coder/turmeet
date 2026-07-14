# TURMEET — Backend Entegrasyon Kılavuzu (Laravel Ekibi İçin)

> **Özet:** Frontend %100 çalışır durumda ve mock veriyle dönüyor.
> Sizin işiniz: aşağıdaki endpoint'leri Laravel'de implemente etmek ve tek bir env değişkeni değiştirmek.
> Frontend kodunda **hiçbir sayfa değişikliği gerekmiyor.**

---

## 1. Mimari Özet

```
┌─────────────────────────┐        ┌──────────────────────────┐
│  Next.js Frontend       │  HTTP  │  Laravel Backend (siz)   │
│  (turmeet/frontend)     │ ─────► │  /api/v1/*               │
│                         │  JSON  │  MySQL + Redis + RabbitMQ│
└─────────────────────────┘        └──────────────────────────┘
```

- Sayfalar **sadece** `src/services/index.ts` içindeki fonksiyonları çağırır.
- Bu fonksiyonlar `USE_MOCKS` bayrağına göre ya mock veri ya da gerçek API döndürür.
- Geçiş noktası **tek dosya**: `src/lib/api-client.ts`

## 2. Canlıya Geçiş Adımları (Frontend Tarafı)

1. `frontend/.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_API_URL=https://api.turmeet.com
NEXT_PUBLIC_USE_MOCKS=false
```

2. Bitti. Başka değişiklik yok.

## 3. API Sözleşmesi (Zorunlu Format)

Tüm endpoint'ler `PROJECT_CONVENTIONS.md`'deki standart formatta cevap döner
(`backend/app/Http/Controllers/ApiController.php` hazır):

```json
{
  "success": true,
  "data": { ... },
  "message": null
}
```

Hata durumunda:

```json
{
  "success": false,
  "data": null,
  "message": "Okunabilir hata mesajı"
}
```

## 4. Endpoint Kataloğu

Frontend'in beklediği tüm endpoint'ler. Her satır `src/services/index.ts` içinde
ilgili fonksiyonun üzerinde yorum olarak da yazılıdır.

### 4.1 Public / Müşteri

| Method | Endpoint | Frontend fonksiyonu | Açıklama |
|---|---|---|---|
| GET | `/api/v1/hotels?city=&stars=&capacity=&type=&q=` | `getVenues()` | Mekan arama + filtre |
| GET | `/api/v1/hotels/{slug}` | `getVenueBySlug()` | Mekan detayı |
| GET | `/api/v1/hotels?ids=v1,v2` | `getVenuesByIds()` | Karşılaştırma |
| GET | `/api/v1/destinations` | `getDestinations()` | Destinasyon listesi |
| GET | `/api/v1/quote-requests` | `getQuoteRequests()` | Müşterinin talepleri |
| GET | `/api/v1/quote-requests/{id}` | `getQuoteRequest()` | Talep + gelen teklifler |
| POST | `/api/v1/quote-requests` | `createQuoteRequest()` | Yeni RFQ (max 5 mekan) |
| GET | `/api/v1/contracts` | `getContracts()` | Kontrat listesi |
| GET | `/api/v1/messages/threads` | `getThreads()` | Mesaj thread'leri |

### 4.2 Partner (Otel)

| Method | Endpoint | Frontend fonksiyonu | Açıklama |
|---|---|---|---|
| GET | `/api/v1/partner/requests` | `getPartnerRequests()` | Otele düşen RFQ'lar |
| POST | `/api/v1/partner/requests/{id}/quote` | (form) | Teklif gönderme |
| GET | `/api/v1/partner/promotions` | `getPromotions()` | Kampanyalar |
| GET | `/api/v1/partner/profile` | `getPartnerProfile()` | Otelin kendi vitrini |

### 4.3 Admin (D Event)

| Method | Endpoint | Frontend fonksiyonu | Açıklama |
|---|---|---|---|
| GET | `/api/v1/admin/registrations?status=pending` | `getPendingRegistrations()` | Onay kuyruğu |
| POST | `/api/v1/admin/registrations/{id}/approve` | (buton) | Müşteri onayı |
| POST | `/api/v1/admin/registrations/{id}/reject` | (buton) | Müşteri reddi |
| GET | `/api/v1/admin/commissions` | `getCommissions()` | Komisyon listesi |
| GET | `/api/v1/admin/coordinators` | `getCoordinators()` | Koordinatör yükü |
| GET | `/api/v1/admin/venues` | `getAdminVenues()` | Envanter yönetimi |

### 4.4 Auth (Henüz Mock)

| Method | Endpoint | Notlar |
|---|---|---|
| POST | `/api/v1/auth/login` | JWT token dönmeli → frontend `localStorage("turmeet_token")` içine yazar |
| POST | `/api/v1/auth/register` | B2B kayıt → `pending_approval` durumu (auto-login YOK) |
| POST | `/api/v1/partner/apply` | Otel başvurusu → operasyon ekibi doğrular |

Token, `src/lib/api-client.ts → authHeaders()` fonksiyonuyla her isteğe
`Authorization: Bearer <token>` olarak eklenir. Login sayfası şu an rol seçimiyle
mock yönlendirme yapıyor (`/app`, `/partner`, `/admin`); gerçek auth geldiğinde
`src/app/(public)/login/page.tsx` içindeki `handleSubmit` güncellenecek (yorumda işaretli).

## 5. Veri Modelleri

TypeScript tipleri **birebir Laravel tablolarınızın çıktısı olacak şekilde** tasarlandı:
`frontend/src/types/index.ts`

Ana varlıklar:

- `Venue` (hotels tablosu) — meetingRooms, roomTypes iç içe ilişki
- `QuoteRequest` + `Quote` (quote_requests, quotes)
- `Contract` (contracts) — `TRM-YYYY-XXX` numara formatı
- `Commission` (commissions) — standart %10, sponsor %8, KDV %20
- `MessageThread` + `Message` (threads, messages)
- `User` — roller: `customer_admin/user/viewer`, `partner_manager/staff`, `super_admin`, `coordinator`, `finance`
- `PendingRegistration`, `Promotion`, `Coordinator`, `Destination`

Alan adları camelCase'dir; Laravel tarafında `JsonResource` ile snake_case → camelCase
dönüşümü yapın (veya Eloquent `$casts` + resource'larda mapleyin).

## 6. Mock Veri Nerede?

| Dosya | İçerik |
|---|---|
| `src/mocks/venues.ts` | 29 el yapımı vitrin mekanı + 6 destinasyon + platform istatistikleri |
| `src/mocks/venues-extra.ts` | Gerçek envanterden üretilen 292 otel (Oteller_Tum_Liste Excel'i; ad, şehir/ilçe, oda/salon sayıları, kapasite gerçek) — toplam 321 mekan |
| `src/mocks/quotes.ts` | 3 RFQ + 6 teklif (farklı durumlar) |
| `src/mocks/contracts.ts` | 3 kontrat + 3 komisyon kaydı |
| `src/mocks/misc.ts` | Mesajlar, kullanıcı, bekleyen kayıtlar, promosyonlar, koordinatörler |

Bu dosyalar backend bağlandıktan sonra silinebilir (ya da test fixture'ı olarak tutulabilir).
`venues-extra.ts` özellikle seed/migration verisi olarak birebir kullanılabilir —
gerçek envanterin alan eşlemesi (`hotels` tablosu) için hazır örnektir.

## 7. Sayfa Haritası (Route Kataloğu)

### Public
- `/` — anasayfa (hero + arama + istatistikler + popüler mekanlar)
- `/venues` — arama/filtreleme (SERP)
- `/venues/[slug]` — mekan detayı (salon tablosu + teklif CTA)
- `/compare?ids=v1,v2` — yan yana karşılaştırma (max 4)
- `/destinations` — şehir kartları
- `/how-it-works`, `/for-hotels` — statik tanıtım
- `/login`, `/register`, `/register/hotel` — auth

### /app (Müşteri Paneli)
- `/app` — dashboard
- `/app/search` — panel içi arama
- `/app/quotes` — talep listesi
- `/app/quotes/new` — RFQ sihirbazı (mekan seçimi max 5)
- `/app/quotes/[id]` — teklif karşılaştırma
- `/app/contracts`, `/app/messages`, `/app/favorites`, `/app/settings`

### /partner (Otel Paneli)
- `/partner` — dashboard (SLA uyarısı + win-rate)
- `/partner/requests` — gelen RFQ'lar
- `/partner/requests/[id]` — teklif verme formu
- `/partner/contracts`, `/partner/messages`, `/partner/reports`, `/partner/profile`, `/partner/promotions`, `/partner/settings`

### /admin (D Event Paneli)
- `/admin` — platform dashboard
- `/admin/registrations` — müşteri onay kuyruğu (approve/reject butonlu)
- `/admin/customers`, `/admin/venues`, `/admin/requests`, `/admin/commissions`, `/admin/coordinators`, `/admin/reports`, `/admin/settings`

## 8. Tasarım Sistemi

- Marka rengi: `#CF2C73` (logodan), koyu: `#A91F5C`, açık zemin: `#FDEEF5`
- Tanımlar: `src/app/globals.css` içindeki `@theme` bloğu (Tailwind 4)
- Bileşenler: `src/components/ui/` — Button, Badge, Card, StatCard, Table, StatusBadge, Input, Select, Field, EmptyState, PageHeader
- İkonlar: `src/components/ui/icons.tsx` (inline SVG, harici bağımlılık yok)
- Font: Inter (next/font ile)

## 8.1 Otel Logo Altyapısı

Otel logoları alan adından otomatik çekilir — `src/lib/logo.ts`:

| Öncelik | Servis | Gereksinim |
|---|---|---|
| 1 | logo.dev | Ücretsiz publishable key → `.env.local`: `NEXT_PUBLIC_LOGODEV_TOKEN=pk_...` (yüksek kalite için önerilir) |
| 2 | Google Favicon | Yok — token girilmediyse varsayılan olarak çalışır |

Not: Clearbit Logo API 2025'te kapatıldığı için kullanılmıyor.

`<HotelLogo domain="hilton.com" name="..." />` bileşeni bu zinciri otomatik yönetir
(servis 404 dönerse sıradakine geçer, hiçbiri bulamazsa marka baş harfi gösterir).
Backend'de `hotels.domain` kolonu tutulmalı; API response'ta `domain` alanı dönmelidir.

## 9. Çalıştırma

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run build      # prod build doğrulama
```

Demo giriş: `/login` → rol seç → ilgili panele yönlenir (şifre kontrolü yok, mock).

## 10. Bilinen Eksikler / Sıradaki İşler

- [ ] Gerçek auth (JWT) — login mock durumda
- [ ] Yeni eklenen 292 otelin görselleri jenerik (8 stok fotoğraf dönüşümlü) — gerçek otel fotoğrafları CDN'den gelecek; 29 vitrin mekanının gerçek fotoğrafları mevcut
- [ ] i18n altyapısı (public site için EN/TR/DE) — paneller EN/TR destekli (cookie tabanlı), public site İngilizce; tam çözüm için `next-intl` önerilir
- [ ] Favoriler kalıcı değil (yalnızca local state)
- [ ] Dosya yükleme (kontrat PDF, rooming list) backend'e bağlı
- [ ] E-imza entegrasyonu (Post-MVP)
- [ ] AI arama/sohbet ve çeviri API anahtarları prod ortamında tanımlanmalı (bkz. `docs/AI_ENTEGRASYONU.md`)
- [ ] Otomatik test yok — kritik akışlar için Playwright e2e önerilir
- [ ] Mobil QA turu ve erişilebilirlik (a11y) taraması yapılmadı
- [ ] SEO: sitemap.xml / robots.txt / Open Graph görselleri eklenmedi
