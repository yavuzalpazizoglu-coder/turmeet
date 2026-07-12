/*
 * MÜŞTERİ DASHBOARD — master doküman 4.1:
 * özet kartlar + aktif talepler + yaklaşan etkinlikler + son mesajlar.
 */
import Link from "next/link";
import { StatCard, Card, StatusBadge, PageHeader, LinkButton } from "@/components/ui";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getQuoteRequests, getContracts, getThreads } from "@/services";

export const metadata = { title: "Dashboard — Turmeet" };

export default async function CustomerDashboard() {
  const [requests, contracts, threads] = await Promise.all([
    getQuoteRequests(),
    getContracts(),
    getThreads(),
  ]);

  const activeRequests = requests.filter((r) => r.status === "waiting" || r.status === "quotes_received");
  const activeContracts = contracts.filter((c) => c.status === "active" || c.status === "pending_signature");
  const unread = threads.reduce((sum, t) => sum + t.unreadCount, 0);

  return (
    <>
      <PageHeader
        title="Welcome back, Anna"
        description="Here's what's happening with your events."
        action={<LinkButton href="/app/quotes/new">+ New Quote Request</LinkButton>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active requests" value={activeRequests.length} tone="brand" hint="Awaiting or comparing quotes" />
        <StatCard label="Active contracts" value={activeContracts.length} tone="success" hint="Signed or pending signature" />
        <StatCard label="Unread messages" value={unread} tone={unread > 0 ? "warning" : "neutral"} />
        <StatCard label="Upcoming events" value={activeContracts.length} hint="Next: Executive Board Retreat" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Aktif talepler */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">Quote requests</h2>
            <Link href="/app/quotes" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              View all <ArrowRightIcon size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {requests.slice(0, 3).map((r) => (
              <Link key={r.id} href={`/app/quotes/${r.id}`} className="flex items-center justify-between rounded-btn border border-gray-100 p-3 transition-colors hover:border-brand/40">
                <div>
                  <p className="text-sm font-medium text-ink">{r.eventName}</p>
                  <p className="text-xs text-muted">
                    {r.city} · {r.checkIn} → {r.checkOut} · {r.guests} guests
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </Link>
            ))}
          </div>
        </Card>

        {/* Son mesajlar */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">Recent messages</h2>
            <Link href="/app/messages" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              View all <ArrowRightIcon size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {threads.map((t) => (
              <Link key={t.id} href="/app/messages" className="flex items-start justify-between gap-3 rounded-btn border border-gray-100 p-3 transition-colors hover:border-brand/40">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{t.title}</p>
                  <p className="truncate text-xs text-muted">{t.lastMessage}</p>
                </div>
                {t.unreadCount > 0 && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                    {t.unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Yaklaşan etkinlik */}
      <Card className="mt-6 p-5">
        <h2 className="mb-4 font-bold text-ink">Upcoming events</h2>
        <div className="space-y-3">
          {activeContracts.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-btn bg-surface p-4">
              <div>
                <p className="text-sm font-semibold text-ink">{c.eventName}</p>
                <p className="text-xs text-muted">
                  {c.venueName} · {c.checkIn} → {c.checkOut} · {c.guests} guests
                </p>
              </div>
              <div className="flex items-center gap-3">
                {c.cutoffDate && <p className="text-xs text-warning">Cut-off: {c.cutoffDate}</p>}
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
