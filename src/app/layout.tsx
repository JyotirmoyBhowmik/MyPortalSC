import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
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

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Jyotirmoy Bhowmik — IT Infrastructure & Project Management",
    description:
      "Explore initiatives, skills, and professional journey in enterprise IT infrastructure, security, cloud, and project management.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

