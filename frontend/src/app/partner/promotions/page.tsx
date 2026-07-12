/*
 * PROMOSYONLAR — master doküman 5.7: otelin kampanya yönetimi.
 * Backend: GET/POST /api/v1/partner/promotions
 */
import { PageHeader, Card, Badge, Button } from "@/components/ui";
import { TagIcon } from "@/components/ui/icons";
import { getPromotions } from "@/services";

export const metadata = { title: "Promotions — Turmeet Partner" };

export default async function PromotionsPage() {
  const promotions = await getPromotions();

  return (
    <>
      <PageHeader
        title="Promotions"
        description="Special offers shown on your listing and in search results."
        action={<Button>+ New promotion</Button>}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {promotions.map((p) => (
          <Card key={p.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-brand">
                <TagIcon size={20} />
              </div>
              <Badge tone={p.active ? "success" : "neutral"}>{p.active ? "Active" : "Scheduled"}</Badge>
            </div>
            <h2 className="mt-4 font-bold text-ink">{p.name}</h2>
            <p className="mt-1 text-sm text-muted">{p.description}</p>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Valid</dt>
                <dd className="font-medium text-ink">
                  {p.validFrom} → {p.validUntil}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Min. condition</dt>
                <dd className="font-medium text-ink">{p.minCondition}</dd>
              </div>
            </dl>
            <div className="mt-5 flex gap-2">
              <Button size="sm" variant="secondary">
                Edit
              </Button>
              <Button size="sm" variant="ghost">
                {p.active ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
