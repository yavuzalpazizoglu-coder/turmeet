/*
 * KOORDİNATÖRLER — master doküman 6.7: atama yükü ve SLA takibi.
 * Backend: GET /api/v1/admin/coordinators
 */
import { PageHeader, Card, Badge, Button } from "@/components/ui";
import { getCoordinators } from "@/services";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";

export const metadata = { title: "Coordinators — Turmeet Admin" };

export default async function CoordinatorsPage() {
  const lang = await getPanelLang();
  const t = makeT(lang);
  const coordinators = await getCoordinators();

  return (
    <>
      <PageHeader
        title={t("Coordinators", "Koordinatörler")}
        description={t(
          "Assignment load and SLA compliance per coordinator.",
          "Koordinatör başına atama yükü ve SLA uyumu.",
        )}
        action={<Button>{t("+ Add coordinator", "+ Koordinatör ekle")}</Button>}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {coordinators.map((c) => (
          <Card key={c.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                {c.name.charAt(0)}
              </div>
              <Badge tone={c.available ? "success" : "neutral"}>
                {c.available ? t("Available", "Müsait") : t("At capacity", "Kapasitede")}
              </Badge>
            </div>
            <h2 className="mt-4 font-bold text-ink">{c.name}</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">{t("Active assignments", "Aktif atamalar")}</dt>
                <dd className="font-semibold text-ink">{c.activeAssignments}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">{t("New this week", "Bu hafta yeni")}</dt>
                <dd className="font-semibold text-ink">{c.newThisWeek}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">{t("SLA compliance", "SLA uyumu")}</dt>
                <dd className={`font-semibold ${c.slaCompliance >= 95 ? "text-success" : c.slaCompliance >= 90 ? "text-warning" : "text-danger"}`}>
                  {c.slaCompliance}%
                </dd>
              </div>
            </dl>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-surface">
              <div
                className={`h-full rounded-full ${c.slaCompliance >= 95 ? "bg-success" : c.slaCompliance >= 90 ? "bg-warning" : "bg-danger"}`}
                style={{ width: `${c.slaCompliance}%` }}
              />
            </div>
            <Button size="sm" variant="secondary" className="mt-4 w-full">
              {t("View assignments", "Atamaları görüntüle")}
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
}
