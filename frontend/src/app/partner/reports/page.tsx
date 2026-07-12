/*
 * PARTNER RAPORLARI — master doküman 5.5:
 * win-rate, gelir trendi, talep hunisi. Grafikler CSS bar ile
 * (harici chart kütüphanesi olmadan) — backend'e bağlanınca
 * GET /api/v1/partner/reports?period= verisiyle beslenecek.
 */
import { PageHeader, StatCard, Card } from "@/components/ui";

export const metadata = { title: "Reports — Turmeet Partner" };

const MONTHLY_REVENUE = [
  { month: "Feb", value: 12 },
  { month: "Mar", value: 28 },
  { month: "Apr", value: 19 },
  { month: "May", value: 46 },
  { month: "Jun", value: 31 },
  { month: "Jul", value: 22 },
];

const FUNNEL = [
  { stage: "Requests received", value: 48, pct: 100 },
  { stage: "Quotes submitted", value: 41, pct: 85 },
  { stage: "Shortlisted", value: 22, pct: 46 },
  { stage: "Contracted", value: 14, pct: 29 },
];

export default function PartnerReportsPage() {
  const max = Math.max(...MONTHLY_REVENUE.map((m) => m.value));

  return (
    <>
      <PageHeader title="Reports" description="Your performance on Turmeet — last 6 months." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Requests received" value="48" hint="Last 6 months" />
        <StatCard label="Quotes submitted" value="41" tone="brand" hint="85% response rate" />
        <StatCard label="Events won" value="14" tone="success" hint="34% win rate" />
        <StatCard label="Revenue" value="€ 158K" tone="brand" hint="Realized events" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Gelir grafiği (CSS bar chart) */}
        <Card className="p-6">
          <h2 className="mb-6 font-bold text-ink">Monthly revenue (€ K)</h2>
          <div className="flex h-48 items-end gap-3">
            {MONTHLY_REVENUE.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-ink">{m.value}</span>
                <div
                  className="w-full rounded-t bg-brand transition-all"
                  style={{ height: `${(m.value / max) * 100}%` }}
                />
                <span className="text-xs text-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Huni */}
        <Card className="p-6">
          <h2 className="mb-6 font-bold text-ink">Request funnel</h2>
          <div className="space-y-4">
            {FUNNEL.map((f) => (
              <div key={f.stage}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-ink">{f.stage}</span>
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
            Tip: venues responding within 12 hours win 2.1× more events on average.
          </p>
        </Card>
      </div>
    </>
  );
}
