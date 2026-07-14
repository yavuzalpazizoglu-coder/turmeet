# turmeet.com

> MICE Booking Engine — Meetings · Incentives · Conferences · Exhibitions

## Proje Hakkında

**turmeet.com**, MICE sektörü için geliştirilmekte olan API-first rezervasyon ve etkinlik yönetim platformudur. Harici bir MICE veri sistemi ile API entegrasyonu üzerine kuruludur.

---

## Durum

> **Frontend hazır (mock veri ile tam çalışır durumda) — Backend entegrasyonu bekleniyor.**
>
> - 4 portal canlı: Public site, `/app` (müşteri), `/partner` (otel), `/admin` (D Event)
> - Demo giriş: `/login` sayfasından rol seçerek panellere girilebilir
> - Devralan ekip için ilk okuma: **[docs/DEVIR_BRIEF.md](docs/DEVIR_BRIEF.md)**
> - Backend ekibi için başlangıç noktası: **[docs/BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md)**
> - UI dili: İngilizce (sistem dili) · Geliştirici dokümanları: Türkçe

---

## Teknoloji Stack (Zorunlu — PROJECT_CONVENTIONS.md)

| Katman | Teknoloji |
|--------|-----------|
| Backend | Laravel (PHP 8.1+) |
| Veritabanı | MySQL (projeye özel DB) |
| Cache | Redis |
| Queue | RabbitMQ |
| Web Server | Nginx |
| Deploy | VPS (systemd + PHP-FPM) |
| Frontend | Next.js (TypeScript + Tailwind) |

---

## Repo Yapısı

```
turmeet/
├── docs/
│   └── BACKEND_INTEGRATION.md  # Laravel ekibi için entegrasyon kılavuzu
├── frontend/             # Next.js — kullanıcı arayüzü (mock veri ile çalışır)
│   └── src/
│       ├── app/          # App Router sayfalar
│       │   ├── (public)/ # Anasayfa, arama, detay, login/register
│       │   ├── app/      # Müşteri paneli (7 sayfa)
│       │   ├── partner/  # Otel paneli (8 sayfa)
│       │   └── admin/    # D Event admin paneli (9 sayfa)
│       ├── components/   # UI kütüphanesi, layout, venue kartları
│       ├── services/     # API çağrı katmanı (mock ↔ gerçek API geçişi)
│       ├── mocks/        # Mock veri seti
│       ├── lib/          # api-client.ts (backend geçiş noktası)
│       └── types/        # TypeScript tipleri (Laravel tablolarıyla eşleşir)
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Requests/
│   │   ├── Services/     # İş mantığı
│   │   ├── Repositories/ # DB sorguları
│   │   ├── Jobs/
│   │   └── Policies/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   └── deploy/
│       ├── nginx.conf
│       ├── supervisor-worker.conf
│       └── deploy.sh
└── .cursor/rules/        # AI kuralları
```

---

## Başlarken

### Backend

```bash
cd backend
cp .env.example .env
# .env dosyasını düzenle (DB, Redis, RabbitMQ, MICE API)
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
npm run dev    # http://localhost:3000
```

Backend olmadan da tüm sayfalar mock veriyle çalışır.
Gerçek API'ye geçiş: `frontend/.env.local` içinde `NEXT_PUBLIC_USE_MOCKS=false`
ve `NEXT_PUBLIC_API_URL` ayarlanır — detay: [docs/BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md)

---

## Deploy (VPS)

```bash
cd backend
bash deploy/deploy.sh
```

---

## Mimari Kurallar

- Controller'lar **ince** kalır
- İş mantığı → `Services/`
- DB sorguları → `Repositories/`
- Tüm API response'ları `{"success": bool, "data": {}, "message": null}` formatında
- `.env` commit edilmez, `.env.example` commit edilir

---

© 2026 turmeet.com — All rights reserved
