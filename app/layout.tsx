import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import ClientDashboardWrapper from "@/components/layout/page";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata SEO yang lebih lengkap
const siteConfig = {
  name: "KaryaMandiri",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://karya-mandiri.vercel.app",
  ogImage: "/og-image.jpg", // ukuran 1200x630, taruh di folder public
  description: "Platform crowdsourcing freelance terpercaya di Indonesia. Temukan proyek, lowongan pekerjaan, dan penyedia jasa profesional yang siap membantu kebutuhan bisnis Anda.",
  authorName: "Syahriza",
  authorUrl: "https://github.com/syahrizaia",
};

export const metadata: Metadata = {
  metadataBase: siteConfig.url,
  // Title default & template (untuk halaman lain bisa override)
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <ClientDashboardWrapper>{children}</ClientDashboardWrapper>

        <Toaster style={{ zIndex: 99999 }} position="top-center" richColors />

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
                target: `${siteConfig.url}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}