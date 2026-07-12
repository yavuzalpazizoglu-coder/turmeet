/*
 * PARTNER DASHBOARD — master doküman 5.1:
 * SLA uyarısı + bekleyen talepler + performans özeti.
 */
import Link from "next/link";
import { PageHeader, StatCard, Card, StatusBadge, LinkButton } from "@/components/ui";
import { ClockIcon, ArrowRightIcon } from "@/components/ui/icons";
import { getPartnerRequests, getContracts } from "@/services";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";

export const metadata = { title: "Partner Dashboard — Turmeet" };

export default async function PartnerDashboard() {
  const lang = await getPanelLang();
  const t = makeT(lang);
  const [requests, contracts] = await Promise.all([getPartnerRequests(), getContracts()]);
  const pending = requests.filter((r) => r.status === "waiting");

  return (
    <>
      <PageHeader
        title="Swissôtel The Bosphorus"
        description={t("Partner performance overview", "Partner performans özeti")}
      />

      {/* SLA uyarı bandı */}
      {pending.length > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-card border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          <ClockIcon size={18} />
          <p>
            {lang === "tr" ? (
              <>
                <span className="font-semibold">{pending.length} teklif talebi</span> yanıtınızı bekliyor — SLA
                hedefi: 24 saat içinde yanıtlayın.
              </>
            ) : (
              <>
                <span className="font-semibold">
                  {pending.length} quote request{pending.length > 1 ? "s" : ""}
                </span>{" "}
                awaiting your response — SLA target: respond within 24 hours.
              </>
            )}
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("Open requests", "Açık talepler")} value={pending.length} tone="warning" hint={t("Respond within SLA", "SLA içinde yanıtlayın")} />
        <StatCard label={t("Win rate (90 days)", "Kazanma oranı (90 gün)")} value="34%" tone="brand" hint={t("Sector average: 22%", "Sektör ortalaması: %22")} />
        <StatCard label={t("Avg. response time", "Ort. yanıt süresi")} value={t("6 hr", "6 sa")} tone="success" hint={t("Target: < 24 hr", "Hedef: < 24 sa")} />
        <StatCard label={t("Revenue via Turmeet", "Turmeet üzerinden gelir")} value="€ 214K" hint={t("Last 12 months", "Son 12 ay")} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">{t("Incoming requests", "Gelen talepler")}</h2>
            <Link href="/partner/requests" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              {t("View all", "Tümünü gör")} <ArrowRightIcon size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {requests.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-btn border border-gray-100 p-3">
                <div>
                  <p className="text-sm font-medium text-ink">{r.eventName}</p>
                  <p className="text-xs text-muted">
                    {r.checkIn} → {r.checkOut} · {r.guests} {t("guests", "katılımcı")} · {r.rooms} {t("rooms", "oda")}
                  </p>
                </div>
                <LinkButton href={`/partner/requests/${r.id}`} size="sm" variant={r.status === "waiting" ? "primary" : "secondary"}>
                  {r.status === "waiting" ? t("Respond", "Yanıtla") : t("View", "Görüntüle")}
                </LinkButton>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">{t("Recent contracts", "Son kontratlar")}</h2>
            <Link href="/partner/contracts" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              {t("View all", "Tümünü gör")} <ArrowRightIcon size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {contracts.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-btn border border-gray-100 p-3">
                <div>
                  <p className="text-sm font-medium text-ink">{c.eventName}</p>
                  <p className="text-xs text-muted">
                    {c.customerCompany} · € {c.totalAmount.toLocaleString("en-US")}
                  </p>
                </div>
                <StatusBadge status={c.status} lang={lang} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
