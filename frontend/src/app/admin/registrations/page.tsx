/*
 * MÜŞTERİ ONAYLARI — master doküman 6.2: B2B kayıt doğrulama kuyruğu.
 * Backend: GET /api/v1/admin/registrations, POST .../approve | /reject
 */
"use client";

import { useEffect, useState } from "react";
import { PageHeader, Table, StatusBadge, Button } from "@/components/ui";
import { getPendingRegistrations } from "@/services";
import type { PendingRegistration } from "@/types";
import { usePanelLang } from "@/lib/panel-i18n-client";
import { makeT } from "@/lib/panel-i18n";

export default function RegistrationsPage() {
  const lang = usePanelLang();
  const t = makeT(lang);
  const [items, setItems] = useState<PendingRegistration[]>([]);

  useEffect(() => {
    getPendingRegistrations().then(setItems);
  }, []);

  function decide(id: string, status: "approved" | "rejected") {
    // MOCK: backend'de POST /admin/registrations/{id}/approve|reject
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <>
      <PageHeader
        title={t("Customer approvals", "Müşteri onayları")}
        description={t(
          "Verify B2B applications — check company registry and sector before approving.",
          "B2B başvurularını doğrulayın — onaylamadan önce şirket kaydını ve sektörü kontrol edin.",
        )}
      />

      <Table
        headers={[
          t("Company", "Şirket"),
          t("Contact", "İletişim"),
          t("Country", "Ülke"),
          t("Sector", "Sektör"),
          t("Applied", "Başvuru"),
          t("Status", "Durum"),
          t("Actions", "İşlemler"),
        ]}
      >
        {items.map((r) => (
          <tr key={r.id} className="hover:bg-surface/60">
            <td className="px-4 py-3">
              <p className="font-medium text-ink">{r.company}</p>
              <p className="text-xs text-muted">{r.email}</p>
            </td>
            <td className="px-4 py-3">{r.contactName}</td>
            <td className="px-4 py-3">{r.country}</td>
            <td className="px-4 py-3">{r.sector}</td>
            <td className="px-4 py-3 whitespace-nowrap">{new Date(r.appliedAt).toLocaleDateString("en-GB")}</td>
            <td className="px-4 py-3">
              <StatusBadge status={r.status} lang={lang} />
            </td>
            <td className="px-4 py-3">
              {(r.status === "pending" || r.status === "on_hold") && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => decide(r.id, "approved")}>
                    {t("Approve", "Onayla")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => decide(r.id, "rejected")}>
                    {t("Reject", "Reddet")}
                  </Button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
