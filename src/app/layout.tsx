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
import "./globals.css";

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

// ... imports

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettingsMap();
  const flags = settings as Record<string, boolean>; // Component compatibility

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
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
        <ThemeProvider>
          <I18nProvider>
            <SettingsProvider settings={flags}>
              <Navbar settings={settings} />
              <PageTransition enabled={!!flags.feature_page_transitions}>
                <main className="min-h-screen md:pl-16">{children}</main>
              </PageTransition>
              <Footer flags={flags} />
              <VisitorTracker />
              <VoiceWidget />
              <ChatWidget />
            </SettingsProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

