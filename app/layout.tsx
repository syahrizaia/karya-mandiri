import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import ClientDashboardWrapper from "@/components/layout/page";
import KamaAssistant from "@/components/ai/KamaAssistant";
import { createClient } from "@/lib/supabase-server";
import PWALoader from "@/components/pwa/PWALoader";
import { ThemeProvider } from "@/components/theme-provider";
import KaryaMandiriGlobalBackground from "@/components/3d/KaryaMandiriGlobalBackground";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://karya-mandiri.vercel.app";

const outfitHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});


// Metadata SEO yang lebih lengkap
const siteConfig = {
  name: "KaryaMandiri",
  url: SITE_URL,
  ogImage: "/og-image.jpg", // ukuran 1200x630, taruh di folder public
  description: "Platform crowdsourcing freelance terpercaya di Indonesia. Temukan proyek, lowongan pekerjaan, dan penyedia jasa profesional yang siap membantu kebutuhan bisnis Anda.",
  authorName: "Syahriza",
  authorUrl: "https://github.com/syahrizaia",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  // Title default & template (untuk halaman lain bisa override)
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  manifest: "/manifest.json",
  // Informasi aplikasi
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.authorName, url: siteConfig.authorUrl }],
  generator: "Next.js",
  keywords: [
    "KaryaMandiri",
    "Karya",
    "Mandiri",
    "Cari Kerja Freelance",
    "Jasa Profesional",
    "Lowongan Proyek", 
    "Crowdsourcing Indonesia",
    "Freelancer Indonesia",
    "Portal Kerja",
    "Pekerjaan",
    "Jasa",
    "Berita",
    "Proyek",
    "Crowdsourcing",
    "Freelance",
    "Indonesia",
    "Syahriza",
  ],
  referrer: "origin-when-cross-origin",
  creator: siteConfig.authorName,
  publisher: siteConfig.authorName,
  category: "jobs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Ikon
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  // Open Graph (untuk Facebook, LinkedIn, dll.)
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@syahrizaia",
  },

  // Alternates (canonical)
  alternates: {
    canonical: siteConfig.url,
  },

  // Metadata tambahan untuk verifikasi mesin pencari
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ?? "",
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION ?? "",
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION ?? "",
      'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION ?? "",
      'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_VERIFICATION ?? "",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserID = user?.id || undefined;
  
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        plusJakartaSans.variable,
        outfitHeading.variable,
        jetbrainsMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col bg-slate-50/70 text-slate-900 dark:bg-slate-950/70 dark:text-slate-50 transition-colors duration-300 relative selection:bg-blue-500/20 font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <KaryaMandiriGlobalBackground />
          <PWALoader />

          <ClientDashboardWrapper>{children}</ClientDashboardWrapper>

          <Toaster style={{ zIndex: 99999 }} position="top-center" richColors />

          <KamaAssistant userId={currentUserID} />

          {/* Structured Data (JSON-LD) untuk organisasi / situs web */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: siteConfig.name,
                url: siteConfig.url,
                description: siteConfig.description,
                author: {
                  "@type": "Person",
                  name: siteConfig.authorName,
                  url: siteConfig.authorUrl,
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${siteConfig.url}/jobs?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}