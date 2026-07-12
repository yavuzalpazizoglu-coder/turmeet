/*
 * TEKLİF VERME FORMU — master doküman 5.3:
 * Talep detayı + yapılandırılmış teklif formu (oda / paket / F&B / şartlar).
 * Backend: POST /api/v1/partner/requests/{id}/quote
 */
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, Card, Button, Input, Field, Textarea, StatusBadge } from "@/components/ui";
import { getQuoteRequest } from "@/services";
import type { QuoteRequest } from "@/types";
import { usePanelLang } from "@/lib/panel-i18n-client";
import { makeT } from "@/lib/panel-i18n";

export default function PartnerRespondPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const lang = usePanelLang();
  const t = makeT(lang);
  const [request, setRequest] = useState<QuoteRequest | null>(null);

  useEffect(() => {
    getQuoteRequest(id).then(setRequest);
  }, [id]);

  if (!request) {
    return <p className="text-sm text-muted">{t("Loading...", "Yükleniyor...")}</p>;
  }

  return (
    <>
      <PageHeader
        title={request.eventName}
        description={`${request.city} · ${request.checkIn} → ${request.checkOut} · ${request.guests} ${t("guests", "katılımcı")} · ${request.rooms} ${t("rooms", "oda")}`}
        action={<StatusBadge status={request.status} lang={lang} />}
      />

      {request.notes && (
        <Card className="mb-6 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {t("Organizer requirements", "Organizatör gereksinimleri")}
          </p>
          <p className="mt-1 text-sm text-ink">{request.notes}</p>
        </Card>
      )}

      <form
        className="grid gap-6 lg:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          // MOCK: backend'de POST /partner/requests/{id}/quote
          router.push("/partner/requests");
        }}
      >
        <Card className="p-6">
          <h2 className="mb-4 font-bold text-ink">{t("Accommodation rates (€ / night)", "Konaklama fiyatları (€ / gece)")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("Single room", "Tek kişilik oda")}>
              <Input type="number" placeholder="150" required />
            </Field>
            <Field label={t("Double room", "Çift kişilik oda")}>
              <Input type="number" placeholder="200" required />
            </Field>
          </div>
          <h2 className="mb-4 mt-8 font-bold text-ink">{t("Meeting & F&B", "Toplantı & Yiyecek-İçecek")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("Meeting package (€/person/day)", "Toplantı paketi (€/kişi/gün)")}>
              <Input type="number" placeholder="45" />
            </Field>
            <Field label={t("Hall rental (€, 0 = included)", "Salon kirası (€, 0 = dahil)")}>
              <Input type="number" placeholder="0" />
            </Field>
            <div className="sm:col-span-2">
              <Field label={t("F&B estimate (€ total)", "Yiyecek-içecek tahmini (€ toplam)")}>
                <Input type="number" placeholder="3200" />
              </Field>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 font-bold text-ink">{t("Terms", "Şartlar")}</h2>
            <div className="space-y-4">
              <Field label={t("Option valid until", "Opsiyon geçerlilik tarihi")}>
                <Input type="date" required />
              </Field>
              <Field label={t("Cancellation terms", "İptal koşulları")}>
                <Textarea
                  placeholder={t(
                    "Free cancellation until 30 days before arrival...",
                    "Girişten 30 gün öncesine kadar ücretsiz iptal...",
                  )}
                  required
                />
              </Field>
              <Field label={t("Notes to organizer (optional)", "Organizatöre not (opsiyonel)")}>
                <Textarea
                  placeholder={t(
                    "We're happy to arrange a site inspection...",
                    "Yerinde inceleme ayarlamaktan memnuniyet duyarız...",
                  )}
                />
              </Field>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" size="lg" className="flex-1">
                {t("Submit quote", "Teklifi gönder")}
              </Button>
              <Button type="button" variant="ghost" size="lg" onClick={() => router.push("/partner/requests")}>
                {t("Decline request", "Talebi reddet")}
              </Button>
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              {t(
                "Your quote is binding until the option date you specify.",
                "Teklifiniz, belirttiğiniz opsiyon tarihine kadar bağlayıcıdır.",
              )}
            </p>
          </Card>
        </div>
      </form>
    </>
  );
}
