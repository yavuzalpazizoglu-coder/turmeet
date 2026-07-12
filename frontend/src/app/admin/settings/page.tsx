/*
 * PLATFORM AYARLARI — master doküman 6.9:
 * komisyon oranları, SLA süreleri, sistem parametreleri.
 * Backend: GET/PUT /api/v1/admin/settings
 */
import { PageHeader, Card, Input, Field, Button, Badge } from "@/components/ui";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";

export const metadata = { title: "Settings — Turmeet Admin" };

const STAFF = [
  { name: "System Admin", email: "admin@turmeet.com", role: "Super Admin", roleTr: "Süper Admin" },
  { name: "Gizem Yılmaz", email: "gizem@turmeet.com", role: "Coordinator", roleTr: "Koordinatör" },
  { name: "Finance Team", email: "finance@turmeet.com", role: "Finance", roleTr: "Finans" },
];

export default async function AdminSettingsPage() {
  const lang = await getPanelLang();
  const t = makeT(lang);

  return (
    <>
      <PageHeader
        title={t("Platform settings", "Platform ayarları")}
        description={t(
          "Commission rates, SLA targets and staff access.",
          "Komisyon oranları, SLA hedefleri ve personel erişimi.",
        )}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 font-bold text-ink">{t("Commission & billing", "Komisyon & faturalama")}</h2>
          <div className="space-y-4">
            <Field label={t("Standard commission rate (%)", "Standart komisyon oranı (%)")}>
              <Input type="number" defaultValue={10} />
            </Field>
            <Field label={t("Sponsored venue rate (%)", "Sponsorlu mekan oranı (%)")}>
              <Input type="number" defaultValue={8} />
            </Field>
            <Field label={t("VAT rate (%)", "KDV oranı (%)")}>
              <Input type="number" defaultValue={20} />
            </Field>
            <Field label={t("Payment term (days)", "Ödeme vadesi (gün)")}>
              <Input type="number" defaultValue={30} />
            </Field>
            <Button>{t("Save changes", "Değişiklikleri kaydet")}</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-bold text-ink">{t("SLA targets", "SLA hedefleri")}</h2>
          <div className="space-y-4">
            <Field label={t("Venue response SLA (hours)", "Mekan yanıt SLA'sı (saat)")}>
              <Input type="number" defaultValue={24} />
            </Field>
            <Field label={t("Registration review SLA (hours)", "Kayıt inceleme SLA'sı (saat)")}>
              <Input type="number" defaultValue={24} />
            </Field>
            <Field label={t("Coordinator first-touch SLA (hours)", "Koordinatör ilk temas SLA'sı (saat)")}>
              <Input type="number" defaultValue={4} />
            </Field>
            <Button>{t("Save changes", "Değişiklikleri kaydet")}</Button>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">{t("Staff accounts", "Personel hesapları")}</h2>
            <Button size="sm" variant="secondary">
              {t("+ Add staff", "+ Personel ekle")}
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {STAFF.map((s) => (
              <div key={s.email} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{s.name}</p>
                  <p className="text-xs text-muted">{s.email}</p>
                </div>
                <Badge tone={s.role === "Super Admin" ? "brand" : "neutral"}>
                  {lang === "tr" ? s.roleTr : s.role}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
