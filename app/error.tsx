"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-6">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-3">
          Terjadi Kesalahan
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Maaf, terjadi kesalahan tak terduga. Silakan coba lagi.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </main>
  );
}
