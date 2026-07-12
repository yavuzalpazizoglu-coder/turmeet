/*
 * PROMOSYONLAR — master doküman 5.7: otelin kampanya yönetimi.
 * Backend: GET/POST /api/v1/partner/promotions
 */
import { PageHeader, Card, Badge, Button } from "@/components/ui";
import { TagIcon } from "@/components/ui/icons";
import { getPromotions } from "@/services";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";

export const metadata = { title: "Promotions — Turmeet Partner" };

export default async function PromotionsPage() {
  const lang = await getPanelLang();
  const t = makeT(lang);
  const promotions = await getPromotions();

  return (
    <>
      <PageHeader
        title={t("Promotions", "Promosyonlar")}
        description={t(
          "Special offers shown on your listing and in search results.",
          "Listenizde ve arama sonuçlarında gösterilen özel teklifler.",
        )}
        action={<Button>{t("+ New promotion", "+ Yeni promosyon")}</Button>}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {promotions.map((p) => (
          <Card key={p.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-brand">
                <TagIcon size={20} />
              </div>
              <Badge tone={p.active ? "success" : "neutral"}>
                {p.active ? t("Active", "Aktif") : t("Scheduled", "Planlandı")}
              </Badge>
            </div>
            <h2 className="mt-4 font-bold text-ink">{p.name}</h2>
            <p className="mt-1 text-sm text-muted">{p.description}</p>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">{t("Valid", "Geçerlilik")}</dt>
                <dd className="font-medium text-ink">
                  {p.validFrom} → {p.validUntil}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">{t("Min. condition", "Min. koşul")}</dt>
                <dd className="font-medium text-ink">{p.minCondition}</dd>
              </div>
            </dl>
            <div className="mt-5 flex gap-2">
              <Button size="sm" variant="secondary">
                {t("Edit", "Düzenle")}
              </Button>
              <Button size="sm" variant="ghost">
                {p.active ? t("Deactivate", "Devre dışı bırak") : t("Activate", "Aktifleştir")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
