/*
 * MEKAN YÖNETİMİ — master doküman 6.4: envanter listesi + sponsorluk.
 * Backend: GET /api/v1/admin/venues
 */
import { PageHeader, Table, Badge, Button, StarRow } from "@/components/ui";
import { getAdminVenues } from "@/services";

export const metadata = { title: "Venues — Turmeet Admin" };

export default async function AdminVenuesPage() {
  const venues = await getAdminVenues();

  return (
    <>
      <PageHeader
        title="Venue inventory"
        description={`${venues.length} venues live on the platform.`}
        action={<Button>+ Add venue</Button>}
      />

      <Table headers={["Venue", "City", "Stars", "Rooms", "Max capacity", "Response", "Listing", ""]}>
        {venues.map((v) => (
          <tr key={v.id} className="hover:bg-surface/60">
            <td className="px-4 py-3">
              <p className="font-medium text-ink">{v.name}</p>
              <p className="text-xs text-muted">{v.type.replace(/_/g, " ")}</p>
            </td>
            <td className="px-4 py-3">{v.city}</td>
            <td className="px-4 py-3">
              <StarRow stars={v.stars} />
            </td>
            <td className="px-4 py-3">{v.totalRooms.toLocaleString("en-US")}</td>
            <td className="px-4 py-3">{v.maxTheatreCapacity.toLocaleString("en-US")}</td>
            <td className="px-4 py-3">{v.responseTimeHours} hr</td>
            <td className="px-4 py-3">
              {v.isSponsored ? <Badge tone="accent">Sponsored (8%)</Badge> : <Badge tone="neutral">Standard (10%)</Badge>}
            </td>
            <td className="px-4 py-3">
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
