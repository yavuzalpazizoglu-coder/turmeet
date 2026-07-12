/*
 * /partner — OTEL/PARTNER PANELİ LAYOUT
 * Master doküman Bölüm 5 (Partner Panel).
 */
import { PanelShell } from "@/components/layout/PanelShell";
import {
  HomeIcon,
  FileTextIcon,
  CheckIcon,
  MessageIcon,
  BarChartIcon,
  BuildingIcon,
  TagIcon,
  SettingsIcon,
} from "@/components/ui/icons";

const NAV = [
  { href: "/partner", label: "Dashboard", icon: <HomeIcon size={18} /> },
  { href: "/partner/requests", label: "Quote Requests", icon: <FileTextIcon size={18} /> },
  { href: "/partner/contracts", label: "Contracts", icon: <CheckIcon size={18} /> },
  { href: "/partner/messages", label: "Messages", icon: <MessageIcon size={18} /> },
  { href: "/partner/reports", label: "Reports", icon: <BarChartIcon size={18} /> },
  { href: "/partner/profile", label: "Venue Profile", icon: <BuildingIcon size={18} /> },
  { href: "/partner/promotions", label: "Promotions", icon: <TagIcon size={18} /> },
  { href: "/partner/settings", label: "Settings", icon: <SettingsIcon size={18} /> },
];

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelShell title="Partner Panel" nav={NAV} roleLabel="Swissôtel The Bosphorus — Sales">
      {children}
    </PanelShell>
  );
}
