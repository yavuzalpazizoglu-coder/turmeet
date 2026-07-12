/*
 * ADMİN DASHBOARD — master doküman 6.1:
 * platform KPI'ları + onay kuyruğu + SLA takibi + komisyon özeti.
 */
import Link from "next/link";
import { PageHeader, StatCard, Card, StatusBadge, LinkButton } from "@/components/ui";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getPendingRegistrations, getQuoteRequests, getCommissions, getCoordinators } from "@/services";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";

export const metadata = { title: "Admin Dashboard — Turmeet" };

export default async function AdminDashboard() {
  const lang = await getPanelLang();
  const t = makeT(lang);
  const [registrations, requests, commissions, coordinators] = await Promise.all([
    getPendingRegistrations(),
    getQuoteRequests(),
    getCommissions(),
    getCoordinators(),
  ]);

  const pendingRegs = registrations.filter((r) => r.status === "pending");
  const openCommissions = commissions.filter((c) => c.status !== "paid");
  const openAmount = openCommissions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <>
      <PageHeader
        title={t("Platform overview", "Platform özeti")}
        description={t("Staff operations dashboard", "Staff operasyon paneli")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("Pending approvals", "Bekleyen onaylar")} value={pendingRegs.length} tone="warning" hint={t("Customer registrations", "Müşteri kayıtları")} />
        <StatCard label={t("Active quote requests", "Aktif teklif talepleri")} value={requests.filter((r) => r.status !== "contracted").length} tone="brand" />
        <StatCard label={t("Open commissions", "Açık komisyonlar")} value={`€ ${openAmount.toLocaleString("en-US")}`} tone="danger" hint={t(`${openCommissions.length} invoices`, `${openCommissions.length} fatura`)} />
        <StatCard label={t("Active coordinators", "Aktif koordinatörler")} value={coordinators.filter((c) => c.available).length} tone="success" hint={t(`of ${coordinators.length} total`, `toplam ${coordinators.length}`)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Onay kuyruğu */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">{t("Approval queue", "Onay kuyruğu")}</h2>
            <Link href="/admin/registrations" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              {t("View all", "Tümünü gör")} <ArrowRightIcon size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {registrations.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-btn border border-gray-100 p-3">
                <div>
                  <p className="text-sm font-medium text-ink">{r.company}</p>
                  <p className="text-xs text-muted">
                    {r.country} · {r.sector} · {new Date(r.appliedAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <StatusBadge status={r.status} lang={lang} />
              </div>
            ))}
          </div>
        </Card>

        {/* Koordinatör yükü */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">{t("Coordinator workload", "Koordinatör iş yükü")}</h2>
            <Link href="/admin/coordinators" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              {t("Manage", "Yönet")} <ArrowRightIcon size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {coordinators.map((c) => (
              <div key={c.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-ink">{c.name}</span>
                  <span className="text-muted">
                    {c.activeAssignments} {t("active", "aktif")} · SLA {c.slaCompliance}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-surface">
                  <div
                    className={`h-full rounded-full ${c.activeAssignments > 12 ? "bg-danger" : c.activeAssignments > 9 ? "bg-warning" : "bg-success"}`}
                    style={{ width: `${Math.min((c.activeAssignments / 16) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Son talepler */}
      <Card className="mt-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-ink">{t("Latest quote requests", "Son teklif talepleri")}</h2>
          <LinkButton href="/admin/requests" size="sm" variant="secondary">
            {t("All requests", "Tüm talepler")}
          </LinkButton>
        </div>
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-btn bg-surface p-3">
              <div>
                <p className="text-sm font-medium text-ink">{r.eventName}</p>
                <p className="text-xs text-muted">
                  {r.city} · {r.guests} {t("guests", "katılımcı")} · {r.venueIds.length}{" "}
                  {t("venues contacted", "mekana iletildi")}
                </p>
              </div>
              <StatusBadge status={r.status} lang={lang} />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
