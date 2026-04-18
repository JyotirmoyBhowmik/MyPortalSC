/**
 * Root Layout — The top-level server component that wraps every page.
 * Responsible for: loading fonts, fetching global settings from Supabase,
 * and nesting all context providers (Theme → I18n → Settings) in the correct order.
 */
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/lib/i18n";
import VisitorTracker from "@/components/VisitorTracker";
import ChatWidget from "@/components/chat/ChatWidget";
import VoiceWidget from "@/components/chat/VoiceWidget";
import PageTransition from "@/components/animations/PageTransition";
import { SettingsProvider } from "@/components/SettingsProvider";
import RetroToggle from "@/components/RetroToggle";
import SearchProvider from "@/components/search/SearchProvider";
import "./globals.css";

// Inter is the primary body font; JetBrains Mono provides monospace accents
// for code snippets and technical data. Both use display: "swap" to prevent
// invisible text during font loading (CLS optimization).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

import { getSiteSettingsMap } from "@/lib/data/settings";

// generateMetadata is an async function that runs server-side before rendering.
// It fetches feature flags from the DB to conditionally include OG images —
// this prevents 404s on /api/og if the OG image generation flag is disabled.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsMap();
  const useOg = settings.feature_og_images;

  return {
    title: {
      default: "Jyotirmoy Bhowmik — IT Infrastructure & Project Management",
      template: "%s | Jyotirmoy Bhowmik",
    },
    description:
      "Portfolio of Jyotirmoy Bhowmik – Project Manager, IT Infrastructure & Network | Security | Cloud. 15+ years delivering secure, resilient enterprise infrastructure and technology programs across India and Nepal.",
    keywords: [
      "Jyotirmoy Bhowmik",
      "IT Infrastructure",
      "Project Management",
      "Cloud Strategy",
      "OT Security",
      "Network",
      "Data Center",
      "Disaster Recovery",
      "AWS",
      "Azure",
      "Microsoft 365",
      "SCADA",
      "IEC 62443",
    ],
    authors: [{ name: "Jyotirmoy Bhowmik" }],
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Jyotirmoy Bhowmik – IT Infrastructure & PM Portfolio",
      title: "Jyotirmoy Bhowmik — IT Infrastructure & Project Management",
      description:
        "Explore initiatives, skills, and professional journey in enterprise IT infrastructure, security, cloud, and project management.",
      images: useOg ? ["/api/og"] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: "Jyotirmoy Bhowmik — IT Infrastructure & Project Management",
      description:
        "Explore initiatives, skills, and professional journey in enterprise IT infrastructure, security, cloud, and project management.",
      images: useOg ? ["/api/og"] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

import ProgressBar from "@/components/layout/ProgressBar";

// RootLayout is an async Server Component — it fetches all settings once per
// request and passes them down. This avoids N+1 queries from individual components.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettingsMap();
  // Cast to boolean record for component compatibility; non-boolean values
  // (like site_template string) are spread separately where needed.
  const flags = settings as Record<string, boolean>;

  return (
    // suppressHydrationWarning: Theme class is set by ThemeProvider on mount,
    // which will differ from the server-rendered "dark" — this is intentional.
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* PWA manifest link is conditionally injected based on feature flag */}
        {flags.feature_pwa && <link rel="manifest" href="/manifest.webmanifest" />}
        {flags.feature_jsonld && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Jyotirmoy Bhowmik",
                jobTitle: "IT Infrastructure & Project Manager",
                url: "https://jyotirmoyb.com",
                sameAs: ["https://linkedin.com/in/jyotirmoyb"],
              }),
            }}
          />
        )}
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        data-template={((settings["site_template"] as string) || "classic").replace(/"/g, "")}
      >
        {/* ProgressBar sits outside providers — it only needs navigation events */}
        <ProgressBar />
        {/* Provider nesting order matters:
            ThemeProvider (visual) → I18nProvider (language) → SettingsProvider (flags)
            Each inner provider can access the context of its parent. */}
        <ThemeProvider>
          <I18nProvider>
            <SettingsProvider settings={flags}>
              <RetroToggle />
              <Navbar settings={settings} />
              <PageTransition enabled={!!flags.feature_page_transitions}>
                {/* md:pl-14 for tablet collapsed sidebar (56px), lg:pl-56 for desktop always-open sidebar (224px) */}
                <main className="min-h-screen md:pl-14 lg:pl-56">{children}</main>
              </PageTransition>
              <Footer flags={flags} />
              {/* These 3 components are invisible (render null or floating UI).
                  They're placed at the end to avoid layout shifts during hydration. */}
              <VisitorTracker />
              <VoiceWidget />
              <ChatWidget />
              <SearchProvider />
            </SettingsProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

