/*
 * MÜŞTERİ KAYIT — master doküman 3.1.2:
 * B2B kayıt formu → admin onayı bekler (auto-login YOK).
 * Backend: POST /api/v1/auth/register → status: pending_approval
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button, Input, Field, Card, Select } from "@/components/ui";
import { CheckIcon } from "@/components/ui/icons";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <Card className="max-w-md p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckIcon size={28} />
          </div>
          <h1 className="mt-4 text-xl font-bold text-ink">Application received</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Thank you! Your account is pending verification. Our team reviews every application to keep the platform
            trusted — you&apos;ll receive an email within 1 business day.
          </p>
          <Link href="/" className="mt-6 inline-block text-sm font-medium text-brand hover:underline">
            Back to homepage
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-lg">
        <Link href="/" className="mb-8 flex justify-center">
          <Image src="/logo-magenta.png" alt="TURMEET" width={180} height={48} className="h-11 w-auto object-contain" />
        </Link>

        <Card className="p-8">
          <h1 className="text-xl font-bold text-ink">Create your organizer account</h1>
          <p className="mt-1 text-sm text-muted">
            Free for organizers. B2B accounts are verified by our team before activation.
          </p>

          <form
            className="mt-6 grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true); // MOCK: backend'de POST /auth/register
            }}
          >
            <Field label="First name">
              <Input required placeholder="Anna" />
            </Field>
            <Field label="Last name">
              <Input required placeholder="Weber" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Company">
                <Input required placeholder="Nordwind Capital GmbH" />
              </Field>
            </div>
            <Field label="Country">
              <Select required defaultValue="">
                <option value="" disabled>
                  Select...
                </option>
                {["Germany", "United Kingdom", "France", "Netherlands", "UAE", "Türkiye", "Other"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Sector">
              <Select required defaultValue="">
                <option value="" disabled>
                  Select...
                </option>
                {["Corporate", "Agency / PCO", "Association", "Government", "Other"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Business email">
                <Input type="email" required placeholder="you@company.com" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Password">
                <Input type="password" required placeholder="Min. 8 characters" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" className="w-full">
                Apply for account
              </Button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            Are you a hotel?{" "}
            <Link href="/register/hotel" className="font-medium text-brand hover:underline">
              List your venue
            </Link>
            {" · "}
            <Link href="/login" className="font-medium text-brand hover:underline">
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
