import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  authors: [{ name: "Syahriza", url: "https://github.com/syahrizaia" }],
  title: "KaryaMandiri",
  description: "Temukan Pekerjaan yang Sesuai dengan Kebutuhanmu",
  keywords: [
    "KaryaMandiri",
    "Karya",
    "Mandiri",
    "Syahriza",
    "pekerjaan",
    "proyek",
    "crowdsourcing", 
    "freelance",
    "Indonesia"
  ],
  // icons: {
  //   icon: "/icon.png",
  //   shortcut: "/icon.png",
  //   apple: "/icon.png",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
