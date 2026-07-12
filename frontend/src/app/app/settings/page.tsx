/*
 * AYARLAR — master doküman 4.9: profil + şirket + ekip + bildirimler.
 * Backend: GET/PUT /api/v1/me, /api/v1/company/users
 */
import { PageHeader, Card, Input, Field, Button, Select, Badge } from "@/components/ui";
import { MOCK_USER } from "@/mocks/misc";

export const metadata = { title: "Settings — Turmeet" };

const TEAM = [
  { name: "Anna Weber", email: "anna.weber@nordwind-capital.de", role: "Admin" },
  { name: "Lukas Braun", email: "l.braun@nordwind-capital.de", role: "User" },
  { name: "Sofia Keller", email: "s.keller@nordwind-capital.de", role: "Viewer" },
];

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your profile, company and team." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 font-bold text-ink">Profile</h2>
          <div className="space-y-4">
            <Field label="Full name">
              <Input defaultValue={MOCK_USER.name} />
            </Field>
            <Field label="Email">
              <Input defaultValue={MOCK_USER.email} type="email" />
            </Field>
            <Field label="Language">
              <Select defaultValue="en">
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
                <option value="de">Deutsch</option>
              </Select>
            </Field>
            <Button>Save changes</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-bold text-ink">Company</h2>
          <div className="space-y-4">
            <Field label="Company name">
              <Input defaultValue={MOCK_USER.company} />
            </Field>
            <Field label="Country">
              <Input defaultValue={MOCK_USER.country} />
            </Field>
            <Field label="VAT number">
              <Input placeholder="DE 123 456 789" />
            </Field>
            <Button>Save changes</Button>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">Team members</h2>
            <Button size="sm" variant="secondary">
              + Invite member
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {TEAM.map((m) => (
              <div key={m.email} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{m.name}</p>
                  <p className="text-xs text-muted">{m.email}</p>
                </div>
                <Badge tone={m.role === "Admin" ? "brand" : "neutral"}>{m.role}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
