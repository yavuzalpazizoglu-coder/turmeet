# AI Entegrasyonu — Turmeet

Bu doküman, platformdaki yapay zeka özelliklerinin nasıl çalıştığını ve
canlıya alırken yazılımcıların yapması gerekenleri özetler.

## Özellikler ve endpoint'ler

| Endpoint | Görev | Anahtar yoksa |
| --- | --- | --- |
| `POST /api/ai-search` | Ana sayfa arama kutusundaki serbest metni (TR/EN/DE) arama filtrelerine çevirir | İstemci regex çözümleyicisine düşer |
| `POST /api/ai-chat` | Destek sohbet asistanı (SupportDock) | FAQ anahtar-kelime motoruna düşer |
| `POST /api/translate` | Staff panelinde mesaj çevirisi | Google'ın anahtarsız gtx endpoint'i |

Üç endpoint de **anahtarsız ortamda kırılmaz** — demo/dev kurulumunda hiçbir
yapılandırma gerekmez.

## AI Arama (/api/ai-search) nasıl çalışır?

1. Kullanıcı arama kutusuna serbest metin yazar
   (örn. *"Antalya'da 300 kişilik, metroya yakın kongre oteli"*).
2. `HeroSearch` bileşeni sorguyu `POST /api/ai-search`'e gönderir
   (istemci tarafında 3 sn zaman aşımı).
3. Sunucu, sorguyu seçili LLM sağlayıcısına katı JSON şablonuyla iletir
   (sunucu tarafında 2,5 sn zaman aşımı, `temperature: 0`).
4. Dönen JSON **sunucuda doğrulanır**: yalnızca bilinen alanlar
   (`city`, `type`, `eventType`, `budget`, `capacity`, `stars`, `metro`,
   `hybrid`, `sustainable`, `accessible`, `maxAirport`, `minScore`,
   `checkin`, `checkout`, `q`) ve geçerli sözlük değerleri geçer.
   Şehir adları envantere eşlenir (Cappadocia → Nevşehir).
5. Filtreler `/venues?...` sonuç sayfasına URL parametresi olarak taşınır.
   Formdaki açık seçimler (tarih, pax, meeting type, budget, metro)
   AI çıktısını her zaman ezer.
6. Herhangi bir adım başarısız olursa (anahtar yok, kota, zaman aşımı,
   bozuk JSON) yanıt `{ fallback: true }` olur ve istemci mevcut
   regex çözümleyicisiyle aramayı tamamlar — kullanıcı fark etmez.

## Yapılandırma (.env.local)

```bash
# Sağlayıcı seçimi: gemini | claude   (varsayılan: gemini)
AI_PROVIDER=gemini

# Google Gemini — https://aistudio.google.com/apikey
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash        # opsiyonel

# Anthropic Claude — https://console.anthropic.com
ANTHROPIC_API_KEY=...
ANTHROPIC_MODEL=claude-sonnet-4-5    # opsiyonel
```

Anahtarlar **yalnızca sunucu tarafında** kullanılır (`NEXT_PUBLIC_` öneki
yok); tarayıcıya asla gönderilmez.

## Maliyet ve performans

- `gemini-2.5-flash` ile bir arama çözümlemesi ~500 token ≈ **$0.0002**;
  Google AI Studio'nun ücretsiz katmanı demo/düşük trafik için yeterlidir.
- Gecikme tipik olarak 0,5–1 sn; 2,5 sn'yi aşarsa istek iptal edilir ve
  regex yedeği devreye girer — arama hiçbir durumda bloklanmaz.

## Canlıya alırken önerilenler

- Endpoint'lere **rate limit** ekleyin (ör. IP başına 20 istek/dk) —
  Vercel/Cloudflare katmanında veya middleware ile.
- `AI_PROVIDER` ve anahtarları deploy ortamının secret yönetiminden verin;
  repoya asla koymayın.
- Sorgu logları toplanacaksa KVKK/GDPR kapsamında kişisel veri
  içerebileceğini unutmayın; anonimleştirerek saklayın.

## Sonraki adaylar (henüz uygulanmadı)

- Sonuç listesinde sorguya özel "neden bu mekan" açıklamaları.
- RFQ formunda "Meeting requirements" metnini AI ile üretme.
- SupportDock sohbetine mekan önerisi (konsiyerj) yeteneği.
