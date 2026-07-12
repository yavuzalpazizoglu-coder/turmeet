/*
 * /admin — D EVENT ADMİN PANELİ LAYOUT
 * Master doküman Bölüm 6 (Admin Panel).
 */
import { PanelShell } from "@/components/layout/PanelShell";
import {
  HomeIcon,
  UsersIcon,
  BuildingIcon,
  FileTextIcon,
  EuroIcon,
  BarChartIcon,
  SettingsIcon,
  CheckIcon,
} from "@/components/ui/icons";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: <HomeIcon size={18} /> },
  { href: "/admin/registrations", label: "Customer Approvals", icon: <CheckIcon size={18} /> },
  { href: "/admin/customers", label: "Customers", icon: <UsersIcon size={18} /> },
  { href: "/admin/venues", label: "Venues", icon: <BuildingIcon size={18} /> },
  { href: "/admin/requests", label: "Quote Requests", icon: <FileTextIcon size={18} /> },
  { href: "/admin/commissions", label: "Commissions", icon: <EuroIcon size={18} /> },
  { href: "/admin/coordinators", label: "Coordinators", icon: <UsersIcon size={18} /> },
  { href: "/admin/reports", label: "Reports", icon: <BarChartIcon size={18} /> },
  { href: "/admin/settings", label: "Settings", icon: <SettingsIcon size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelShell title="Admin Panel" nav={NAV} roleLabel="D Event — Super Admin">
      {children}
    </PanelShell>
  );
}
