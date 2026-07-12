/*
 * PLATFORM AYARLARI — master doküman 6.9:
 * komisyon oranları, SLA süreleri, sistem parametreleri.
 * Backend: GET/PUT /api/v1/admin/settings
 */
import { PageHeader, Card, Input, Field, Button, Badge } from "@/components/ui";

export const metadata = { title: "Settings — Turmeet Admin" };

const STAFF = [
  { name: "System Admin", email: "admin@turmeet.com", role: "Super Admin" },
  { name: "Gizem Yılmaz", email: "gizem@turmeet.com", role: "Coordinator" },
  { name: "Finance Team", email: "finance@turmeet.com", role: "Finance" },
];

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader title="Platform settings" description="Commission rates, SLA targets and staff access." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 font-bold text-ink">Commission & billing</h2>
          <div className="space-y-4">
            <Field label="Standard commission rate (%)">
              <Input type="number" defaultValue={10} />
            </Field>
            <Field label="Sponsored venue rate (%)">
              <Input type="number" defaultValue={8} />
            </Field>
            <Field label="VAT rate (%)">
              <Input type="number" defaultValue={20} />
            </Field>
            <Field label="Payment term (days)">
              <Input type="number" defaultValue={30} />
            </Field>
            <Button>Save changes</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-bold text-ink">SLA targets</h2>
          <div className="space-y-4">
            <Field label="Venue response SLA (hours)">
              <Input type="number" defaultValue={24} />
            </Field>
            <Field label="Registration review SLA (hours)">
              <Input type="number" defaultValue={24} />
            </Field>
            <Field label="Coordinator first-touch SLA (hours)">
              <Input type="number" defaultValue={4} />
            </Field>
            <Button>Save changes</Button>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">Staff accounts</h2>
            <Button size="sm" variant="secondary">
              + Add staff
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {STAFF.map((s) => (
              <div key={s.email} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{s.name}</p>
                  <p className="text-xs text-muted">{s.email}</p>
                </div>
                <Badge tone={s.role === "Super Admin" ? "brand" : "neutral"}>{s.role}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
