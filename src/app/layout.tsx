import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "tur-meet.com | MICE Booking Platform",
  description:
    "The intelligent booking engine for Meetings, Incentives, Conferences & Exhibitions.",
  openGraph: {
    title: "tur-meet.com",
    description: "MICE Booking Platform — Coming Soon",
    url: "https://tur-meet.com",
    siteName: "tur-meet",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${geist.className} antialiased`}>{children}</body>
    </html>
  );
}
