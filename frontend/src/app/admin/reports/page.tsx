/*
 * PLATFORM RAPORLARI — master doküman 6.8:
 * GMV, komisyon geliri, dönüşüm hunisi, şehir dağılımı.
 * Backend: GET /api/v1/admin/reports?period=
 */
import { PageHeader, StatCard, Card } from "@/components/ui";

export const metadata = { title: "Reports — Turmeet Admin" };

const GMV_MONTHLY = [
  { month: "Feb", value: 84 },
  { month: "Mar", value: 132 },
  { month: "Apr", value: 118 },
  { month: "May", value: 205 },
  { month: "Jun", value: 176 },
  { month: "Jul", value: 149 },
];

const CITY_SPLIT = [
  { city: "Istanbul", pct: 46 },
  { city: "Antalya", pct: 28 },
  { city: "Ankara", pct: 11 },
  { city: "Izmir", pct: 8 },
  { city: "Other", pct: 7 },
];

const FUNNEL = [
  { stage: "Registered customers", value: 212 },
  { stage: "Quote requests sent", value: 148 },
  { stage: "Quotes received", value: 126 },
  { stage: "Contracts signed", value: 41 },
  { stage: "Events realized", value: 33 },
];

export default function AdminReportsPage() {
  const maxGmv = Math.max(...GMV_MONTHLY.map((m) => m.value));
  const maxFunnel = FUNNEL[0].value;

  return (
    <>
      <PageHeader title="Platform reports" description="Key business metrics — last 6 months." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="GMV (6 months)" value="€ 864K" tone="brand" hint="Gross merchandise value" />
        <StatCard label="Commission revenue" value="€ 81K" tone="success" hint="9.4% avg. rate" />
        <StatCard label="Conversion rate" value="27.7%" hint="Request → contract" />
        <StatCard label="Avg. event size" value="€ 21K" hint="Per contract" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-6 font-bold text-ink">Monthly GMV (€ K)</h2>
          <div className="flex h-48 items-end gap-3">
            {GMV_MONTHLY.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-ink">{m.value}</span>
                <div className="w-full rounded-t bg-brand" style={{ height: `${(m.value / maxGmv) * 100}%` }} />
                <span className="text-xs text-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-6 font-bold text-ink">Demand by city</h2>
          <div className="space-y-4">
            {CITY_SPLIT.map((c) => (
              <div key={c.city}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-ink">{c.city}</span>
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
          <h2 className="mb-6 font-bold text-ink">Conversion funnel</h2>
          <div className="space-y-4">
            {FUNNEL.map((f) => (
              <div key={f.stage}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-ink">{f.stage}</span>
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
