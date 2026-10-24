import React from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiClock, FiCheckCircle, FiRotateCw, FiAlertCircle } from "react-icons/fi";

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
    <div className="glass-panel rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5 transition-all">
      <div className="w-full overflow-x-auto min-w-0">
        <table className="w-full text-left border-collapse table-auto">
          <thead className="bg-slate-900/5 dark:bg-white/5 border-b border-white/20 dark:border-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
            <tr>
              <th className="px-5 md:px-7 py-4.5">Aktivitas / Tugas</th>
              <th className="px-5 md:px-7 py-4.5 hidden sm:table-cell">Waktu & Transaksi ID</th>
              <th className="px-5 md:px-7 py-4.5 hidden md:table-cell">Status</th>
              <th className="px-5 md:px-7 py-4.5 text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/40 dark:divide-white/5 text-slate-700 dark:text-slate-300">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 md:px-7 py-5 flex items-center gap-4">
                    <div className="w-11 h-11 bg-slate-200/50 dark:bg-white/5 rounded-2xl shrink-0" />
                    <div className="space-y-2 w-full max-w-sm">
                      <div className="h-4 w-3/4 bg-slate-200/50 dark:bg-white/5 rounded-lg" />
                      <div className="h-3 w-1/2 bg-slate-200/50 dark:bg-white/5 rounded-lg" />
                    </div>
                  </td>
                  <td className="px-5 md:px-7 py-5 hidden sm:table-cell">
                    <div className="h-4 w-24 bg-slate-200/50 dark:bg-white/5 rounded-lg" />
                  </td>
                  <td className="px-5 md:px-7 py-5 hidden md:table-cell">
                    <div className="h-6 w-20 bg-slate-200/50 dark:bg-white/5 rounded-full" />
                  </td>
                  <td className="px-5 md:px-7 py-5 text-right">
                    <div className="h-4 w-20 bg-slate-200/50 dark:bg-white/5 rounded-lg ml-auto" />
                  </td>
                </tr>
              ))
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-sm text-slate-400 dark:text-slate-500 font-medium px-4">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-bold text-slate-700 dark:text-slate-300">Tidak ada riwayat transaksi</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Belum ada catatan aktivitas transaksi yang cocok dengan kriteria filter saat ini.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item) => {
                const isIncome = item.type === "income";
                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors duration-200 group"
                  >
                    <td className="px-5 md:px-7 py-4.5 max-w-[200px] sm:max-w-none">
                      <div className="flex items-center gap-3.5">
                        <div className={`p-3 rounded-2xl shrink-0 transition-transform group-hover:scale-105 border ${
                          isIncome 
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }`}>
                          {isIncome ? <FiArrowDownLeft size={20} /> : <FiArrowUpRight size={20} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm md:text-base text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {item.jobs?.title || "Penarikan Saldo Mandiri"}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">
                            {item.jobs?.profiles?.full_name || "Ke Rekening Bank"}
                          </p>
                          
                          {/* RESPONSIVE FOOTPRINT MOBILE */}
                          <div className="flex items-center gap-2 mt-1.5 sm:hidden">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-900/5 dark:bg-white/5 px-2 py-0.5 rounded-md font-medium border border-white/20 dark:border-white/5">
                              {formatTanggal(item.created_at)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                              item.status === "success" 
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : 
                              item.status === "pending" 
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" : 
                                "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            }`}>
                              {item.status === "success" ? "Berhasil" : item.status === "pending" ? "Proses" : "Gagal"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Kolom Tanggal & ID */}
                    <td className="px-5 md:px-7 py-4.5 hidden sm:table-cell whitespace-nowrap">
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold">{formatTanggal(item.created_at)}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1 font-mono tracking-wider font-semibold">
                        <FiClock size={11} /> {item.id.substring(0, 8).toUpperCase()}
                      </p>
                    </td>
                    
                    {/* Kolom Status Pill */}
                    <td className="px-5 md:px-7 py-4.5 hidden md:table-cell whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "success" 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : 
                        item.status === "pending" 
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" : 
                          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      }`}>
                        {item.status === "success" && <FiCheckCircle size={12} />}
                        {item.status === "pending" && <FiRotateCw size={12} className="animate-spin" />}
                        {item.status === "failed" && <FiAlertCircle size={12} />}
                        {item.status === "success" ? "Berhasil" : item.status === "pending" ? "Dalam Proses" : "Gagal"}
                      </span>
                    </td>
                    
                    {/* Kolom Nominal */}
                    <td className="px-5 md:px-7 py-4.5 text-right font-black text-sm md:text-base whitespace-nowrap">
                      <span className={isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-slate-100"}>
                        {isIncome ? "+" : "-"} Rp{item.amount.toLocaleString("id-ID")}
                      </span>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono block sm:hidden mt-0.5">
                        #{item.id.substring(0, 5).toUpperCase()}
                      </p>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};