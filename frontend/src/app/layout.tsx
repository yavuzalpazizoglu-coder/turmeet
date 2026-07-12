import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppWidget from "@/components/chat/WhatsAppWidget";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Turmeet — Turkey's Meeting & Event Search Engine",
  description:
    "Search 329+ venues across Turkey, compare live group offers and plan with zero commission for organizers.",
  openGraph: {
    title: "Turmeet",
    description: "Meet in Turkey. Plan with Ease.",
    url: "https://turmeet.com",
    siteName: "Turmeet",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        {/* Sağ altta sabit WhatsApp destek kutusu — tüm sayfalarda görünür */}
        <WhatsAppWidget />
      </body>
    </html>
  );
}
