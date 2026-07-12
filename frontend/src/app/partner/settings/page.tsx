/*
 * PARTNER AYARLARI — kullanıcılar + bildirim tercihleri.
 */
import { PageHeader, Card, Input, Field, Button, Badge } from "@/components/ui";

export const metadata = { title: "Settings — Turmeet Partner" };

const TEAM = [
  { name: "Merve Aksoy", email: "merve.aksoy@swissotel.com", role: "Manager" },
  { name: "Can Öztürk", email: "can.ozturk@swissotel.com", role: "Staff" },
];

export default function PartnerSettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your team and notification preferences." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 font-bold text-ink">Contact details</h2>
          <div className="space-y-4">
            <Field label="Sales contact">
              <Input defaultValue="Merve Aksoy" />
            </Field>
            <Field label="Email">
              <Input defaultValue="mice.bosphorus@swissotel.com" type="email" />
            </Field>
            <Field label="Phone">
              <Input defaultValue="+90 212 000 00 00" type="tel" />
            </Field>
            <Button>Save changes</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">Team members</h2>
            <Button size="sm" variant="secondary">
              + Invite
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {TEAM.map((m) => (
              <div key={m.email} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{m.name}</p>
                  <p className="text-xs text-muted">{m.email}</p>
                </div>
                <Badge tone={m.role === "Manager" ? "brand" : "neutral"}>{m.role}</Badge>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            Managers can respond to quotes and edit promotions. Staff can view and message only.
          </p>
        </Card>
      </div>
    </>
  );
}
