/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiArrowUpRight, 
  FiArrowDownLeft, 
  FiSearch, 
  FiDownload, 
  FiClock 
} from 'react-icons/fi';
import supabase from '@/lib/db';
import SubscriptionDialog from '../../../components/subscription/page';
import { toast } from 'sonner';

interface TransactionHistory {
  id: string;
  amount: number;
  created_at: string;
  type: 'income' | 'withdrawal';
  status: 'pending' | 'success' | 'failed';
  jobs: {
    title: string;
    profiles: {
      full_name: string;
    } | null;
  } | null;
}

const History: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'withdrawal'>('all');
  const [showSubModal, setShowSubModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [historyData, setHistoryData] = useState<TransactionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            id,
            amount,
            status,
            type,
            created_at,
            jobs (
              title,
              profiles (
                full_name
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHistoryData((data as any) || []);
      } catch (err) {
        console.error("Gagal memuat riwayat transaksi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, []);

  const filteredData = historyData.filter(item => {
    const matchesTab = activeTab === 'all' ? true : item.type === activeTab;
    const taskTitle = item.jobs?.title || 'Penarikan Saldo';
    const employerName = item.jobs?.profiles?.full_name || 'Bank Tujuan';
    const matchesSearch = 
      taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const formatTanggal = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Fungsi untuk memproses dan mengunduh data riwayat ke format CSV
  const handleDownloadReport = () => {
    if (filteredData.length === 0) {
      toast.error("Tidak ada data transaksi yang bisa diunduh untuk filter ini.");
      return;
    }

    // Definisikan Header Kolom CSV
    const headers = ["ID Transaksi", "Tanggal", "Aktivitas / Tugas", "Employer / Mitra", "Tipe", "Status", "Nominal (Rp)"];

    // Petakan data riwayat transaksi ke dalam baris-baris CSV
    const rows = filteredData.map((item) => {
      const tanggal = new Date(item.created_at).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      const judulTugas = item.jobs?.title || 'Penarikan Saldo Mandiri';
      const namaEmployer = item.jobs?.profiles?.full_name || 'Ke Rekening Bank';
      const tipeText = item.type === 'income' ? 'Pendapatan' : 'Penarikan';
      const statusText = item.status === 'success' ? 'Berhasil' : item.status === 'pending' ? 'Proses' : 'Gagal';
      const tandaNominal = item.type === 'income' ? item.amount : -item.amount;

      return [
        item.id.toUpperCase(),
        tanggal,
        // Membungkus teks dengan tanda kutip ganda untuk mengantisipasi jika ada karakter koma (,) di dalam judul tugas
        `"${judulTugas.replace(/"/g, '""')}"`,
        `"${namaEmployer.replace(/"/g, '""')}"`,
        tipeText,
        statusText,
        tandaNominal
      ];
    });

    // Gabungkan header dan baris menggunakan separator koma dan baris baru
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    // Buat file Blob dari string CSV dengan format encoding UTF-8 (agar karakter khusus/simbol aman)
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Trigger download file secara otomatis di browser pengguna
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    // Penamaan berkas adaptif berdasarkan filter tab yang sedang aktif (Semua, Pendapatan, Penarikan)
    const namaFileSuffix = activeTab === 'all' ? 'semua' : activeTab;
    link.setAttribute("download", `laporan_transaksi_karyamandiri_${namaFileSuffix}_${new Date().toISOString().split('T')[0]}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    // 🌟 PERBAIKAN: Menambahkan px-4 w-full dan overflow-x-hidden pada pembungkus utama luar
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-6 md:pt-12 lg:pt-4 overflow-x-hidden">
      
      {/* Header & Filter */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Riwayat Aktivitas</h1>
          <p className="text-sm text-slate-500">Pantau semua transaksi dan pengerjaan tugas Anda.</p>
        </div>
        <button
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 border border-slate-300 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition text-sm shadow-sm"
          onClick={handleDownloadReport}
          disabled={loading} // Mencegah tombol diklik saat data dari Supabase masih loading
        >
          <FiDownload /> Unduh Laporan
        </button>
      </section>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
          {(['all', 'income', 'withdrawal'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-initial text-center px-4 py-2 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'all' ? 'Semua' : tab === 'income' ? 'Pendapatan' : 'Penarikan'}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 text-slate-700 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* History List Table */}
      {/* 🌟 PERBAIKAN: Kontainer tabel diberi max-w-full dan overflow-hidden tulen */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-full">
        <div className="w-full overflow-x-auto min-w-0">
          <table className="w-full text-left border-collapse table-auto">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-4 md:px-6 py-4">Aktivitas / Tugas</th>
                <th className="px-4 md:px-6 py-4 hidden sm:table-cell">Tanggal</th>
                <th className="px-4 md:px-6 py-4 hidden md:table-cell">Status</th>
                <th className="px-4 md:px-6 py-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 md:px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
                      <div className="space-y-1.5 w-full">
                        <div className="h-4 w-3/4 bg-slate-100 rounded" />
                        <div className="h-3 w-1/2 bg-slate-100 rounded" />
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden sm:table-cell"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                    <td className="px-4 md:px-6 py-4 hidden md:table-cell"><div className="h-6 w-16 bg-slate-100 rounded-full" /></td>
                    <td className="px-4 md:px-6 py-4 text-right"><div className="h-4 w-16 bg-slate-100 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-sm text-slate-400 font-medium px-4">
                    Tidak ada riwayat transaksi yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition group">
                    <td className="px-4 md:px-6 py-4 max-w-[180px] sm:max-w-none truncate-container">
                      <div className="flex items-center gap-3">
                        {/* Ikon dibuat shrink-0 agar tidak gepeng saat teks panjang */}
                        <div className={`p-2.5 rounded-xl shrink-0 ${
                          item.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {item.type === 'income' ? <FiArrowDownLeft size={18} /> : <FiArrowUpRight size={18} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm md:text-base text-slate-800 group-hover:text-blue-600 transition truncate">
                            {item.jobs?.title || 'Penarikan Saldo Mandiri'}
                          </p>
                          <p className="text-xs text-slate-400 font-medium truncate">
                            {item.jobs?.profiles?.full_name || 'Ke Rekening Bank'}
                          </p>
                          
                          {/* 🌟 RESPONSIVE DETAIL: Muncul di bawah judul HANYA saat layar mobile */}
                          <div className="flex items-center gap-2 mt-1 sm:hidden">
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                              {formatTanggal(item.created_at)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              item.status === 'success' ? 'bg-green-100 text-green-700' : 
                              item.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {item.status === 'success' ? 'Selesai' : item.status === 'pending' ? 'Proses' : 'Gagal'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Kolom Tanggal (Sembunyi di Mobile Ekstrim) */}
                    <td className="px-4 md:px-6 py-4 hidden sm:table-cell whitespace-nowrap">
                      <p className="text-sm text-slate-600 font-medium">{formatTanggal(item.created_at)}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-bold italic">
                        <FiClock /> {item.id.substring(0, 8).toUpperCase()}
                      </p>
                    </td>
                    
                    {/* Kolom Status (Sembunyi di Mobile & Tablet Potret) */}
                    <td className="px-4 md:px-6 py-4 hidden md:table-cell whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'success' ? 'bg-green-100 text-green-700' : 
                        item.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status === 'success' ? 'Berhasil' : item.status === 'pending' ? 'Proses' : 'Gagal'}
                      </span>
                    </td>
                    
                    {/* Kolom Nominal (Selalu Muncul Kanan secara Rapi) */}
                    <td className="px-4 md:px-6 py-4 text-right font-bold text-sm md:text-base text-slate-800 whitespace-nowrap">
                      <span className={item.type === 'income' ? 'text-green-600' : 'text-slate-800'}>
                        {item.type === 'income' ? '+' : '-'} Rp{item.amount.toLocaleString('id-ID')}
                      </span>
                      {/* Sub-info ID kecil di bawah nominal khusus mobile */}
                      <p className="text-[9px] text-slate-400 font-normal block sm:hidden mt-0.5">
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
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default History;