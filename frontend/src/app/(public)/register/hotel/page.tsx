/*
 * OTEL BAŞVURU — master doküman 3.1.3: partner onboarding formu.
 * Backend: POST /api/v1/partner/apply → operasyon ekibi doğrular.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button, Input, Field, Card, Select, Textarea } from "@/components/ui";
import { CheckIcon } from "@/components/ui/icons";

export default function HotelRegisterPage() {
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
            Our partnership team will contact you within 2 business days to verify your venue and build your profile
            together.
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
          <Image src="/logo-magenta.png" alt="TURMEET" width={260} height={68} className="h-16 w-auto object-contain" />
        </Link>

        <Card className="p-8">
          <h1 className="text-xl font-bold text-ink">List your venue</h1>
          <p className="mt-1 text-sm text-muted">
            No listing fee — pay a success fee only for realized events.
          </p>

          <form
            className="mt-6 grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true); // MOCK: backend'de POST /partner/apply
            }}
          >
            <div className="sm:col-span-2">
              <Field label="Venue name">
                <Input required placeholder="Grand Hotel Istanbul" />
              </Field>
            </div>
            <Field label="City">
              <Input required placeholder="Istanbul" />
            </Field>
            <Field label="Star rating">
              <Select required defaultValue="">
                <option value="" disabled>
                  Select...
                </option>
                <option>5 stars</option>
                <option>4 stars</option>
                <option>3 stars</option>
                <option>Congress center</option>
              </Select>
            </Field>
            <Field label="Total rooms">
              <Input type="number" required placeholder="250" />
            </Field>
            <Field label="Meeting rooms">
              <Input type="number" required placeholder="8" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Contact person">
                <Input required placeholder="Name Surname — Sales Director" />
              </Field>
            </div>
            <Field label="Email">
              <Input type="email" required placeholder="sales@hotel.com" />
            </Field>
            <Field label="Phone">
              <Input type="tel" required placeholder="+90 ..." />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Notes (optional)">
                <Textarea placeholder="Tell us about your MICE facilities..." />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" className="w-full">
                Submit application
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
