export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Memuat...
        </p>
      </div>
    </main>
  );
}
