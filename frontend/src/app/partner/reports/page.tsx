/*
 * PARTNER RAPORLARI — master doküman 5.5:
 * win-rate, gelir trendi, talep hunisi. Grafikler CSS bar ile
 * (harici chart kütüphanesi olmadan) — backend'e bağlanınca
 * GET /api/v1/partner/reports?period= verisiyle beslenecek.
 */
import { PageHeader, StatCard, Card } from "@/components/ui";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";

export const metadata = { title: "Reports — Turmeet Partner" };

const MONTHLY_REVENUE = [
  { month: "Feb", monthTr: "Şub", value: 12 },
  { month: "Mar", monthTr: "Mar", value: 28 },
  { month: "Apr", monthTr: "Nis", value: 19 },
  { month: "May", monthTr: "May", value: 46 },
  { month: "Jun", monthTr: "Haz", value: 31 },
  { month: "Jul", monthTr: "Tem", value: 22 },
];

const FUNNEL = [
  { stage: "Requests received", stageTr: "Gelen talepler", value: 48, pct: 100 },
  { stage: "Quotes submitted", stageTr: "Gönderilen teklifler", value: 41, pct: 85 },
  { stage: "Shortlisted", stageTr: "Kısa listeye kalan", value: 22, pct: 46 },
  { stage: "Contracted", stageTr: "Kontratlanan", value: 14, pct: 29 },
];

export default async function PartnerReportsPage() {
  const lang = await getPanelLang();
  const t = makeT(lang);
  const max = Math.max(...MONTHLY_REVENUE.map((m) => m.value));

  return (
    <>
      <PageHeader
        title={t("Reports", "Raporlar")}
        description={t("Your performance on Turmeet — last 6 months.", "Turmeet'teki performansınız — son 6 ay.")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("Requests received", "Gelen talepler")} value="48" hint={t("Last 6 months", "Son 6 ay")} />
        <StatCard label={t("Quotes submitted", "Gönderilen teklifler")} value="41" tone="brand" hint={t("85% response rate", "%85 yanıt oranı")} />
        <StatCard label={t("Events won", "Kazanılan etkinlikler")} value="14" tone="success" hint={t("34% win rate", "%34 kazanma oranı")} />
        <StatCard label={t("Revenue", "Gelir")} value="€ 158K" tone="brand" hint={t("Realized events", "Gerçekleşen etkinlikler")} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Gelir grafiği (CSS bar chart) */}
        <Card className="p-6">
          <h2 className="mb-6 font-bold text-ink">{t("Monthly revenue (€ K)", "Aylık gelir (€ B)")}</h2>
          <div className="flex h-48 items-end gap-3">
            {MONTHLY_REVENUE.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-ink">{m.value}</span>
                <div
                  className="w-full rounded-t bg-brand transition-all"
                  style={{ height: `${(m.value / max) * 100}%` }}
                />
                <span className="text-xs text-muted">{lang === "tr" ? m.monthTr : m.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Huni */}
        <Card className="p-6">
          <h2 className="mb-6 font-bold text-ink">{t("Request funnel", "Talep hunisi")}</h2>
          <div className="space-y-4">
            {FUNNEL.map((f) => (
              <div key={f.stage}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-ink">{lang === "tr" ? f.stageTr : f.stage}</span>
                  <span className="font-semibold text-ink">
                    {f.value} <span className="font-normal text-muted">({f.pct}%)</span>
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-surface">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted">
            {t(
              "Tip: venues responding within 12 hours win 2.1× more events on average.",
              "İpucu: 12 saat içinde yanıt veren tesisler ortalama 2,1 kat daha fazla etkinlik kazanıyor.",
            )}
          </p>
        </Card>
      </div>
    </>
  );
}
