/*
 * PLATFORM RAPORLARI — master doküman 6.8:
 * GMV, komisyon geliri, dönüşüm hunisi, şehir dağılımı.
 * Backend: GET /api/v1/admin/reports?period=
 */
import { PageHeader, StatCard, Card } from "@/components/ui";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";

export const metadata = { title: "Reports — Turmeet Admin" };

const GMV_MONTHLY = [
  { month: "Feb", monthTr: "Şub", value: 84 },
  { month: "Mar", monthTr: "Mar", value: 132 },
  { month: "Apr", monthTr: "Nis", value: 118 },
  { month: "May", monthTr: "May", value: 205 },
  { month: "Jun", monthTr: "Haz", value: 176 },
  { month: "Jul", monthTr: "Tem", value: 149 },
];

const CITY_SPLIT = [
  { city: "Istanbul", cityTr: "İstanbul", pct: 46 },
  { city: "Antalya", cityTr: "Antalya", pct: 28 },
  { city: "Ankara", cityTr: "Ankara", pct: 11 },
  { city: "Izmir", cityTr: "İzmir", pct: 8 },
  { city: "Other", cityTr: "Diğer", pct: 7 },
];

const FUNNEL = [
  { stage: "Registered customers", stageTr: "Kayıtlı müşteriler", value: 212 },
  { stage: "Quote requests sent", stageTr: "Gönderilen teklif talepleri", value: 148 },
  { stage: "Quotes received", stageTr: "Alınan teklifler", value: 126 },
  { stage: "Contracts signed", stageTr: "İmzalanan kontratlar", value: 41 },
  { stage: "Events realized", stageTr: "Gerçekleşen etkinlikler", value: 33 },
];

export default async function AdminReportsPage() {
  const lang = await getPanelLang();
  const t = makeT(lang);
  const maxGmv = Math.max(...GMV_MONTHLY.map((m) => m.value));
  const maxFunnel = FUNNEL[0].value;

  return (
    <>
      <PageHeader
        title={t("Platform reports", "Platform raporları")}
        description={t("Key business metrics — last 6 months.", "Temel iş metrikleri — son 6 ay.")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("GMV (6 months)", "GMV (6 ay)")} value="€ 864K" tone="brand" hint={t("Gross merchandise value", "Brüt işlem hacmi")} />
        <StatCard label={t("Commission revenue", "Komisyon geliri")} value="€ 81K" tone="success" hint={t("9.4% avg. rate", "%9,4 ort. oran")} />
        <StatCard label={t("Conversion rate", "Dönüşüm oranı")} value="27.7%" hint={t("Request → contract", "Talep → kontrat")} />
        <StatCard label={t("Avg. event size", "Ort. etkinlik büyüklüğü")} value="€ 21K" hint={t("Per contract", "Kontrat başına")} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-6 font-bold text-ink">{t("Monthly GMV (€ K)", "Aylık GMV (€ B)")}</h2>
          <div className="flex h-48 items-end gap-3">
            {GMV_MONTHLY.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-ink">{m.value}</span>
                <div className="w-full rounded-t bg-brand" style={{ height: `${(m.value / maxGmv) * 100}%` }} />
                <span className="text-xs text-muted">{lang === "tr" ? m.monthTr : m.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-6 font-bold text-ink">{t("Demand by city", "Şehre göre talep")}</h2>
          <div className="space-y-4">
            {CITY_SPLIT.map((c) => (
              <div key={c.city}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-ink">{lang === "tr" ? c.cityTr : c.city}</span>
                  <span className="font-semibold text-ink">{c.pct}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-surface">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-6 font-bold text-ink">{t("Conversion funnel", "Dönüşüm hunisi")}</h2>
          <div className="space-y-4">
            {FUNNEL.map((f) => (
              <div key={f.stage}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-ink">{lang === "tr" ? f.stageTr : f.stage}</span>
                  <span className="font-semibold text-ink">{f.value}</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-surface">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${(f.value / maxFunnel) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
