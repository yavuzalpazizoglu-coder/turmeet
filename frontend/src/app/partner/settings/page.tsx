/*
 * PARTNER AYARLARI — kullanıcılar + bildirim tercihleri.
 */
import { PageHeader, Card, Input, Field, Button, Badge } from "@/components/ui";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";

export const metadata = { title: "Settings — Turmeet Partner" };

const TEAM = [
  { name: "Merve Aksoy", email: "merve.aksoy@swissotel.com", role: "Manager" },
  { name: "Can Öztürk", email: "can.ozturk@swissotel.com", role: "Staff" },
];

export default async function PartnerSettingsPage() {
  const lang = await getPanelLang();
  const t = makeT(lang);

  return (
    <>
      <PageHeader
        title={t("Settings", "Ayarlar")}
        description={t("Manage your team and notification preferences.", "Ekibinizi ve bildirim tercihlerinizi yönetin.")}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 font-bold text-ink">{t("Contact details", "İletişim bilgileri")}</h2>
          <div className="space-y-4">
            <Field label={t("Sales contact", "Satış yetkilisi")}>
              <Input defaultValue="Merve Aksoy" />
            </Field>
            <Field label={t("Email", "E-posta")}>
              <Input defaultValue="mice.bosphorus@swissotel.com" type="email" />
            </Field>
            <Field label={t("Phone", "Telefon")}>
              <Input defaultValue="+90 212 000 00 00" type="tel" />
            </Field>
            <Button>{t("Save changes", "Değişiklikleri kaydet")}</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">{t("Team members", "Ekip üyeleri")}</h2>
            <Button size="sm" variant="secondary">
              {t("+ Invite", "+ Davet et")}
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {TEAM.map((m) => (
              <div key={m.email} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{m.name}</p>
                  <p className="text-xs text-muted">{m.email}</p>
                </div>
                <Badge tone={m.role === "Manager" ? "brand" : "neutral"}>
                  {m.role === "Manager" ? t("Manager", "Yönetici") : t("Staff", "Personel")}
                </Badge>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            {t(
              "Managers can respond to quotes and edit promotions. Staff can view and message only.",
              "Yöneticiler teklifleri yanıtlayabilir ve promosyonları düzenleyebilir. Personel yalnızca görüntüleyip mesaj gönderebilir.",
            )}
          </p>
        </Card>
      </div>
    </>
  );
}
