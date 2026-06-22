import React from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiClock } from "react-icons/fi";

export interface TransactionHistory {
  id: string;
  amount: number;
  created_at: string;
  type: "income" | "withdrawal";
  status: "pending" | "success" | "failed";
  jobs: {
    title: string;
    profiles: {
      full_name: string;
    } | null;
  } | null;
}

interface HistoryTableProps {
  loading: boolean;
  filteredData: TransactionHistory[];
  formatTanggal: (isoString: string) => string;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  loading,
  filteredData,
  formatTanggal,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden max-w-full transition-colors">
      <div className="w-full overflow-x-auto min-w-0">
        <table className="w-full text-left border-collapse table-auto">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest transition-colors">
            <tr>
              <th className="px-4 md:px-6 py-4">Aktivitas / Tugas</th>
              <th className="px-4 md:px-6 py-4 hidden sm:table-cell">Tanggal</th>
              <th className="px-4 md:px-6 py-4 hidden md:table-cell">Status</th>
              <th className="px-4 md:px-6 py-4 text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
            {loading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 md:px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0" />
                    <div className="space-y-1.5 w-full">
                      <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                    <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
                  </td>
                  <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                    <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-sm text-slate-400 dark:text-slate-500 font-medium px-4">
                  Tidak ada riwayat transaksi yang ditemukan.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="px-4 md:px-6 py-4 max-w-[180px] sm:max-w-none">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                        item.type === "income" 
                          ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400" 
                          : "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400"
                      }`}>
                        {item.type === "income" ? <FiArrowDownLeft size={18} /> : <FiArrowUpRight size={18} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm md:text-base text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {item.jobs?.title || "Penarikan Saldo Mandiri"}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                          {item.jobs?.profiles?.full_name || "Ke Rekening Bank"}
                        </p>
                        
                        {/* RESPONSIVE FOOTPRINT MOBILE */}
                        <div className="flex items-center gap-2 mt-1 sm:hidden">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-medium transition-colors">
                            {formatTanggal(item.created_at)}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            item.status === "success" ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400" : 
                            item.status === "pending" ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400" : "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400"
                          }`}>
                            {item.status === "success" ? "Selesai" : item.status === "pending" ? "Proses" : "Gagal"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Kolom Tanggal (Sembunyi di Mobile) */}
                  <td className="px-4 md:px-6 py-4 hidden sm:table-cell whitespace-nowrap">
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{formatTanggal(item.created_at)}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1 font-bold italic">
                      <FiClock /> {item.id.substring(0, 8).toUpperCase()}
                    </p>
                  </td>
                  
                  {/* Kolom Status (Sembunyi di Mobile & Tablet) */}
                  <td className="px-4 md:px-6 py-4 hidden md:table-cell whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === "success" ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400" : 
                      item.status === "pending" ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400" : "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400"
                    }`}>
                      {item.status === "success" ? "Berhasil" : item.status === "pending" ? "Proses" : "Gagal"}
                    </span>
                  </td>
                  
                  {/* Kolom Nominal */}
                  <td className="px-4 md:px-6 py-4 text-right font-bold text-sm md:text-base text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    <span className={item.type === "income" ? "text-green-600 dark:text-green-400" : "text-slate-800 dark:text-slate-200"}>
                      {item.type === "income" ? "+" : "-"} Rp{item.amount.toLocaleString("id-ID")}
                    </span>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-normal block sm:hidden mt-0.5">
                      #{item.id.substring(0, 5).toUpperCase()}
                    </p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};