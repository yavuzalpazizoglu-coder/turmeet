/*
 * GİRİŞ — MOCK AUTH
 * Backend bağlanana kadar: rol seçimi ile ilgili panele yönlendirir.
 * Backend geldiğinde: POST /api/v1/auth/login → JWT token →
 * localStorage("turmeet_token") — bkz. src/lib/api-client.ts authHeaders().
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input, Field, Card } from "@/components/ui";

const ROLES = [
  { value: "customer", label: "Event Organizer (Customer)", target: "/app" },
  { value: "partner", label: "Hotel / Venue (Partner)", target: "/partner" },
  { value: "admin", label: "D Event Staff (Admin)", target: "/admin" },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("customer");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // MOCK: gerçek auth yerine rol bazlı yönlendirme.
    const target = ROLES.find((r) => r.value === role)?.target ?? "/app";
    router.push(target);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Image src="/logo-magenta.png" alt="TURMEET" width={180} height={48} className="h-11 w-auto object-contain" />
        </Link>

        <Card className="p-8">
          <h1 className="text-xl font-bold text-ink">Log in</h1>
          <p className="mt-1 text-sm text-muted">
            Demo mode: choose a role to explore the corresponding panel.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Email">
              <Input type="email" placeholder="you@company.com" defaultValue="demo@turmeet.com" />
            </Field>
            <Field label="Password">
              <Input type="password" placeholder="••••••••" defaultValue="demo1234" />
            </Field>

            <div>
              <span className="mb-1.5 block text-sm font-medium text-ink">Role (demo)</span>
              <div className="space-y-2">
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-btn border p-3 text-sm transition-colors ${
                      role === r.value ? "border-brand bg-brand-light font-medium text-brand" : "border-gray-300 text-ink"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={role === r.value}
                      onChange={() => setRole(r.value)}
                      className="accent-brand"
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Log in
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            No account yet?{" "}
            <Link href="/register" className="font-medium text-brand hover:underline">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
