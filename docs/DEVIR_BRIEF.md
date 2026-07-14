# TURMEET — Yazılım Ekibi Devir Brief'i

> Bu doküman projeyi devralacak yazılımcı/ekip için hazırlanmıştır.
> 15 dakikada okunacak şekilde yazıldı; detaylar bağlantı verilen dokümanlardadır.

---

## 1. Proje Nedir?

**tur-meet.com** — Türkiye'nin ilk toplantı & etkinlik arama motoru (MICE booking engine).
Kurumsal etkinlik organizatörleri şehir/tarih/grup büyüklüğüne göre otel ve kongre
merkezi arar, tek istekle birden fazla mekandan canlı grup teklifi toplar,
karşılaştırır ve dijital kontratla süreci tamamlar. İş modeli: organizatöre ücretsiz,
komisyon etkinlik gerçekleştikten sonra mekandan alınır. Operasyon: D Event Turizm
(TURSAB No. 7514, Est. 2012).

Üç taraf, dört portal:

| Portal | URL | Kullanıcı |
|---|---|---|
| Public site | `/` | Ziyaretçi / organizatör adayı |
| Müşteri paneli | `/app` | Etkinlik organizatörü (B2B) |
| Partner paneli | `/partner` | Otel / mekan |
| Admin paneli | `/admin` | D Event operasyon ekibi |

## 2. Ne Teslim Ediliyor?

- **Frontend: üretim kalitesinde, mock veriyle %100 çalışan Next.js uygulaması.**
  41 sayfa, 4 portal, arama + harita (Leaflet, 321 gerçek mekan), RFQ sihirbazı,
  teklif karşılaştırma, kontrat/komisyon ekranları, mesajlaşma, AI sohbet asistanı,
  admin çeviri aracı, panellerde EN/TR dil desteği.
- **Gerçek envanter mock'ta:** 329 otellik D Event Excel envanteri `venues-extra.ts`
  olarak koda aktarıldı — backend seed verisi olarak birebir kullanılabilir.
- **Laravel iskeleti:** `backend/` klasöründe controller/service/repository iskeleti
  ve standart API response sınıfı hazır (iş mantığı boş).
- **Dokümantasyon (Türkçe):** bu brief + entegrasyon kılavuzu + AI kılavuzu.

**Teknoloji:** Next.js App Router + TypeScript + Tailwind 4 (frontend) ·
Laravel PHP 8.1+ / MySQL / Redis / RabbitMQ / Nginx (backend, sözleşme gereği).

## 3. Nasıl Çalıştırılır? (5 dakika)

```bash
git clone <repo> && cd turmeet/frontend
npm install
npm run dev          # http://localhost:3000
```

Demo giriş: `/login` → rol seç (şifresiz mock). Build doğrulama: `npm run build`.

## 4. Okuma Sırası

1. **Bu doküman** — kapsam ve beklenti.
2. **`docs/BACKEND_INTEGRATION.md`** — asıl iş listeniz: endpoint kataloğu,
   veri modelleri, API sözleşmesi, mock→gerçek geçiş anahtarı.
3. **`frontend/src/types/index.ts`** — veri modelleri (Laravel tablolarıyla birebir
   eşleşecek şekilde tasarlandı; Türkçe yorumlarla).
4. **`frontend/src/services/index.ts`** — frontend'in çağırdığı tüm fonksiyonlar;
   her birinin üstünde beklenen endpoint yazılı.
5. `docs/AI_ENTEGRASYONU.md` — AI sohbet/arama ve çeviri servisleri (opsiyonel faz).

## 5. Sizden Beklenen İş (Önerilen Fazlama)

**Faz 1 — Çekirdek okuma API'leri (frontend'i gerçek veriye bağlar):**
`hotels` tablosu + arama/filtre endpoint'leri (`GET /api/v1/hotels`, `/hotels/{slug}`,
`/destinations`). Seed: `venues-extra.ts`. Bitince `NEXT_PUBLIC_USE_MOCKS=false`
ile frontend gerçek veriyle döner — sayfa değişikliği gerekmez.

**Faz 2 — Auth & kayıt:** JWT login, B2B kayıt (`pending_approval` akışı),
otel başvurusu. Login sayfasındaki mock yönlendirmenin değişeceği yer kodda işaretli.

**Faz 3 — RFQ / teklif döngüsü (işin kalbi):** Teklif talebi oluşturma (max 5 mekan),
partner paneline düşmesi, otelin canlı fiyatla yanıtı, 48 saat SLA takibi,
teklif karşılaştırma. Bildirimler (e-posta) burada devreye girer.

**Faz 4 — Kontrat & komisyon:** Kontrat kayıtları (`TRM-YYYY-XXX`), komisyon
hesaplama (standart %10, sponsor %8, KDV %20 — **komisyon oranları hiçbir zaman
public UI'da gösterilmez**), admin onay kuyrukları.

**Faz 5 — Tamamlayıcılar:** Mesajlaşma, favoriler (kalıcı), dosya yükleme,
raporlar, AI servis anahtarları, e-imza (post-MVP).

## 6. Kurallar / Sözleşmeler

- API response formatı sabit: `{ success, data, message }` (kılavuz §3).
- Alan adları API'da **camelCase** (Laravel Resource katmanında dönüştürün).
- UI dili **İngilizce**, geliştirici dokümantasyonu ve kod yorumları **Türkçe**.
- Marka rengi `#CF2C73`; tasarım tokenları `globals.css @theme` bloğunda.
- Mekan sıralaması: sponsorlu üstte → MICE inspection puanı → rating.
- Ödemeler her zaman doğrudan mekana; platform para tutmaz (metinlerde vurgulanır).

## 7. Kabul Kriterleri (Faz 1 için "bitti" tanımı)

- [ ] `NEXT_PUBLIC_USE_MOCKS=false` iken `/venues`, `/venues/[slug]`,
      `/destinations`, anasayfa vitrinleri gerçek DB'den dönüyor.
- [ ] Filtre parametrelerinin tamamı (şehir, yıldız, kapasite, tip, etkinlik tipi,
      bütçe, metro, skor...) SQL'de karşılanıyor.
- [ ] Response süreleri arama için < 500ms (Redis cache ile).
- [ ] Excel envanterindeki 329 otel migration/seed ile DB'de.

## 8. Bilinen Eksikler

`docs/BACKEND_INTEGRATION.md §10`'da güncel liste tutulur. Özet: gerçek auth,
292 otelin gerçek fotoğrafları (CDN), public site i18n, kalıcı favoriler,
dosya yükleme, e-imza, otomatik testler, mobil QA, SEO teknik dosyaları.

## 9. İletişim & Karar Sahipleri

- Ürün/içerik kararları: D Event (Yavuzalp — proje sahibi)
- Bu repo'daki her şey commit'li ve `main` branch'i deploy edilebilir durumda.
- Sorularınız için önce ilgili dosyadaki Türkçe yorumlara bakın — mimari kararların
  gerekçeleri kodda yazılıdır.
