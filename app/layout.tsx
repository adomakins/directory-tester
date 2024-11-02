import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import notionQuery from "../lib/query";
import Script from "next/script";

import { getSiteData, Site } from "@/lib/data";
import Header from "@/components/header";
import Footer from "@/components/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteData();
  if (!site) {
    throw new Error('Site data not found');
  }
  
  return {
    title: site.name,
    description: site.description,
    // You can add more metadata properties here
    icons: {
      icon: generateDynamicFavicon(site.color),
    },
    verification: {
      google: site.googleAnalyticsId,
    },
  };
}

import { generateDynamicFavicon } from '@/app/favicon'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const { site } = await getSiteData() as { site: Site };
  if (!site) {
    throw new Error('Site data not found');
  } else {
    // console.log(site);
  }
  
  // Generate the favicon
  const faviconUrl = generateDynamicFavicon(site.color)

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={faviconUrl} />
        {site.analytics && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${site.analytics}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${site.analytics}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-[1000px] mx-auto px-4 pb-8`}>
        <Header site={site} />
        {children}
        <Footer site={site} />
      </body>
    </html>
  );
}
