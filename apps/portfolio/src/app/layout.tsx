import type { Metadata } from "next";
import { Inter, Calistoga } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import JsonLd from "@/components/JsonLd";
import PageLoader from "@/components/page-loader";
import CursorSpotlight from "@/components/cursor-spotlight";
import { getContact, getHero, getSkills } from "@/lib/content";
import { siteUrl } from "@/utils";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const calistoga = Calistoga({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export async function generateMetadata(): Promise<Metadata> {
  const hero    = getHero();
  const contact = getContact();
  const skills  = getSkills();

  const baseUrl    = siteUrl(contact.website);
  const fullTitle  = `${hero.name} — ${hero.title}`;
  const keywords   = [
    hero.name,
    hero.title,
    ...skills.flatMap((c) => c.skills).slice(0, 12),
    "Web Developer Portfolio",
  ];

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default:  fullTitle,
      template: `%s | ${hero.name}`,
    },
    description: hero.subtitle,
    keywords,
    authors:  [{ name: hero.name, url: baseUrl }],
    creator:  hero.name,
    alternates: { canonical: baseUrl },
    openGraph: {
      type:        "website",
      url:         baseUrl,
      siteName:    hero.name,
      title:       fullTitle,
      description: hero.subtitle,
      locale:      "en_US",
    },
    twitter: {
      card:        "summary_large_image",
      title:       fullTitle,
      description: hero.subtitle,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={twMerge(inter.variable, calistoga.variable, "antialiased bg-gray-900 text-white font-sans")}
      >
        <JsonLd />
        <PageLoader />
        <CursorSpotlight />
        {children}
      </body>
    </html>
  );
}
