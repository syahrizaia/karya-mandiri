# KaryaMandiri

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

![Logo KaryaMandiri](public/screenshot-landing-page.png)

**"Memberdayakan Tangan-Tangan Terampil, Membangun Kemandirian Bangsa."**

KaryaMandiri adalah platform inklusi ekonomi sektor informal berbasis model bisnis *crowdsourcing*. Platform ini menjembatani pekerja sektor informal (kurir, tenaga sortir, pekerja harian, UMKM rumahan) ke dalam ekosistem digital yang terstruktur, transparan, dan berdaya saing.

## 🌐 Live Demo

[https://karya-mandiri.vercel.app](https://karya-mandiri.vercel.app)

---

## 🚀 Fitur Utama

- **Crowdsourcing Engine** — memecah proyek skala besar menjadi tugas mikro yang dikerjakan kolaboratif.
- **Visual Trust System** — portofolio multimedia dengan testimoni dan *community vouching*.
- **Collective Procurement** — belanja kolektif untuk menekan biaya operasional mitra.
- **Decision Support System (DSS)** — dasbor analitik tren ekonomi sektor informal *real-time*.
- **Smart-Contract Lite** — kesepakatan kerja digital berbahasa sederhana.
- **Asisten Suara Kama** — navigasi, pencarian, dan aksi sistem via perintah suara (Gemini AI).
- **PWA + Push Notification** — installable, offline-ready, notifikasi web push real-time.
- **AI Brief Enhancer** — peningkatan deskripsi proyek/layanan berbasis AI.

## 🛠 Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, React Compiler, Turbopack) |
| UI | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + Radix UI |
| Language | TypeScript 5 |
| Database & Auth | [Supabase](https://supabase.com/) (PostgreSQL, `@supabase/ssr`) |
| Animasi | Framer Motion |
| AI | Google Gemini (`@google/generative-ai`) |
| PWA & Push | Service Worker + Web Push API |
| Deployment | [Vercel](https://vercel.com/) |

## 📋 Struktur Proyek

```text
app/            # Next.js App Router (route groups: auth, private, public, api)
components/     # Reusable UI & feature components
lib/            # Supabase client, utils
types/          # TypeScript interfaces
public/         # Static assets (PWA manifest, service worker)
middleware.ts   # Proteksi rute + refresh sesi Supabase
```

## 🚦 Prasyarat

- Node.js 20+
- Akun [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- (Opsional) API key Google Gemini untuk fitur AI

## ⚙️ Environment Variables

Buat `.env.local` di root proyek:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://karya-mandiri.vercel.app
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
GEMINI_API_KEY=
```

## 🚀 Menjalankan Proyek

```bash
# Install dependensi
npm install

# Mode development
npm run dev

# Production build
npm run build

# Jalankan hasil build
npm start

# Lint
npm run lint
```

Buka [http://localhost:3000](http://localhost:3000).

## 📚 Dokumentasi

- [Next.js](https://nextjs.org/docs)
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Web Push API](https://web.dev/push-notifications-web-push-protocol/)
