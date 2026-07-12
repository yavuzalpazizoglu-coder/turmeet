/*
 * /app — MÜŞTERİ PANELİ LAYOUT
 * Master doküman Bölüm 4 (Customer Panel). Mock auth: login'de
 * "Event Organizer" seçilince buraya gelinir.
 */
import { PanelShell } from "@/components/layout/PanelShell";
import {
  HomeIcon,
  SearchIcon,
  FileTextIcon,
  CheckIcon,
  MessageIcon,
  HeartIcon,
  SettingsIcon,
} from "@/components/ui/icons";

const NAV = [
  { href: "/app", label: "Dashboard", icon: <HomeIcon size={18} /> },
  { href: "/app/search", label: "Venue Search", icon: <SearchIcon size={18} /> },
  { href: "/app/quotes", label: "My Quote Requests", icon: <FileTextIcon size={18} /> },
  { href: "/app/contracts", label: "Contracts", icon: <CheckIcon size={18} /> },
  { href: "/app/messages", label: "Messages", icon: <MessageIcon size={18} /> },
  { href: "/app/favorites", label: "Favorites", icon: <HeartIcon size={18} /> },
  { href: "/app/settings", label: "Settings", icon: <SettingsIcon size={18} /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelShell
      title="Customer Panel"
      nav={NAV}
      roleLabel="Anna Weber — Nordwind Capital"
      /* Mock oturum bilgisi — backend'de GET /api/v1/me'den gelecek.
         Statü: sadakat seviyesi (MD v26) + doğrulama rozeti. */
      user={{
        name: "Anna Weber",
        company: "Nordwind Capital GmbH",
        status: "Business+ Member",
        badge: "Verified B2B",
      }}
    >
      {children}
    </PanelShell>
  );
}
