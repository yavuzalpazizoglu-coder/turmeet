# tur-meet.com

> MICE Booking Engine — Meetings · Incentives · Conferences · Exhibitions

## Proje Hakkında

**tur-meet.com**, MICE sektörü için geliştirilmekte olan API-first rezervasyon ve etkinlik yönetim platformudur. Harici bir MICE veri sistemi ile API entegrasyonu üzerine kuruludur.

---

## Durum

> **🚧 Yapım Aşamasında / Under Construction**

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
├── frontend/             # Next.js — kullanıcı arayüzü
│   └── src/
│       ├── app/          # App Router sayfalar
│       ├── components/   # UI, layout, shared
│       ├── services/     # API çağrı katmanı
│       └── types/        # TypeScript tipleri
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
npm run dev
```

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

© 2026 tur-meet.com — All rights reserved
