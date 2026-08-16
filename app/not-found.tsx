import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-6">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-black text-blue-600 mb-3">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
