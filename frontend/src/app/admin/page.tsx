/*
 * ADMİN DASHBOARD — master doküman 6.1:
 * platform KPI'ları + onay kuyruğu + SLA takibi + komisyon özeti.
 */
import Link from "next/link";
import { PageHeader, StatCard, Card, StatusBadge, LinkButton } from "@/components/ui";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getPendingRegistrations, getQuoteRequests, getCommissions, getCoordinators } from "@/services";

export const metadata = { title: "Admin Dashboard — Turmeet" };

export default async function AdminDashboard() {
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
      <PageHeader title="Platform overview" description="D Event operations dashboard" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending approvals" value={pendingRegs.length} tone="warning" hint="Customer registrations" />
        <StatCard label="Active quote requests" value={requests.filter((r) => r.status !== "contracted").length} tone="brand" />
        <StatCard label="Open commissions" value={`€ ${openAmount.toLocaleString("en-US")}`} tone="danger" hint={`${openCommissions.length} invoices`} />
        <StatCard label="Active coordinators" value={coordinators.filter((c) => c.available).length} tone="success" hint={`of ${coordinators.length} total`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Onay kuyruğu */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">Approval queue</h2>
            <Link href="/admin/registrations" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              View all <ArrowRightIcon size={14} />
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
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </Card>

        {/* Koordinatör yükü */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">Coordinator workload</h2>
            <Link href="/admin/coordinators" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              Manage <ArrowRightIcon size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {coordinators.map((c) => (
              <div key={c.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-ink">{c.name}</span>
                  <span className="text-muted">
                    {c.activeAssignments} active · SLA {c.slaCompliance}%
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
          <h2 className="font-bold text-ink">Latest quote requests</h2>
          <LinkButton href="/admin/requests" size="sm" variant="secondary">
            All requests
          </LinkButton>
        </div>
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-btn bg-surface p-3">
              <div>
                <p className="text-sm font-medium text-ink">{r.eventName}</p>
                <p className="text-xs text-muted">
                  {r.city} · {r.guests} guests · {r.venueIds.length} venues contacted
                </p>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
