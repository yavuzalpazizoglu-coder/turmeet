/*
 * /admin — STAFF (ADMİN) PANELİ LAYOUT
 * Master doküman Bölüm 6 (Admin Panel). EN/TR iki dilli.
 */
import { PanelShell } from "@/components/layout/PanelShell";
import { getPanelLang } from "@/lib/panel-i18n-server";
import { makeT } from "@/lib/panel-i18n";
import {
  HomeIcon,
  UsersIcon,
  BuildingIcon,
  FileTextIcon,
  EuroIcon,
  BarChartIcon,
  SettingsIcon,
  CheckIcon,
  MessageIcon,
} from "@/components/ui/icons";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const lang = await getPanelLang();
  const t = makeT(lang);

  const nav = [
    { href: "/admin", label: t("Dashboard", "Panel"), icon: <HomeIcon size={18} /> },
    { href: "/admin/registrations", label: t("Customer Approvals", "Müşteri Onayları"), icon: <CheckIcon size={18} /> },
    { href: "/admin/customers", label: t("Customers", "Müşteriler"), icon: <UsersIcon size={18} /> },
    { href: "/admin/venues", label: t("Venues", "Mekanlar"), icon: <BuildingIcon size={18} /> },
    { href: "/admin/requests", label: t("Quote Requests", "Teklif Talepleri"), icon: <FileTextIcon size={18} /> },
    { href: "/admin/messages", label: t("Messages", "Mesajlar"), icon: <MessageIcon size={18} /> },
    { href: "/admin/commissions", label: t("Commissions", "Komisyonlar"), icon: <EuroIcon size={18} /> },
    { href: "/admin/coordinators", label: t("Coordinators", "Koordinatörler"), icon: <UsersIcon size={18} /> },
    { href: "/admin/reports", label: t("Reports", "Raporlar"), icon: <BarChartIcon size={18} /> },
    { href: "/admin/settings", label: t("Settings", "Ayarlar"), icon: <SettingsIcon size={18} /> },
  ];

  return (
    <PanelShell
      title={t("Admin Panel", "Admin Paneli")}
      nav={nav}
      roleLabel={t("Staff — Super Admin", "Staff — Süper Admin")}
      lang={lang}
    >
      {children}
    </PanelShell>
  );
}
