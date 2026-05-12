"use client";

import React, { useState } from 'react';
import { 
  FiArrowUpRight, 
  FiArrowDownLeft, 
  FiSearch, 
  FiDownload, 
  FiClock 
} from 'react-icons/fi';
import { TransactionHistory } from '../types';

const History: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'withdrawal'>('all');

  // Mock Data Riwayat
  const historyData: TransactionHistory[] = [
    { id: 'TX-102', taskTitle: 'Pengepakan Paket Sembako', employerName: 'Koperasi Makmur', amount: 45000000, date: '12 Mei 2026', type: 'income', status: 'success' },
    { id: 'TX-101', taskTitle: 'Penarikan Saldo Ke Rekening', employerName: 'Bank BCA', amount: 200000000, date: '10 Mei 2026', type: 'withdrawal', status: 'success' },
    { id: 'TX-100', taskTitle: 'Sortir Bahan Baku Tekstil', employerName: 'UMKM Batik Segar', amount: 50000000, date: '08 Mei 2026', type: 'income', status: 'processing' },
    { id: 'TX-099', taskTitle: 'Kurir Logistik Crowd', employerName: 'TaniHub Local', amount: 30000000, date: '05 Mei 2026', type: 'income', status: 'failed' },
  ];

  const filteredData = activeTab === 'all' 
    ? historyData 
    : historyData.filter(item => item.type === activeTab);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Filter */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Riwayat Aktivitas</h1>
          <p className="text-slate-500">Pantau semua transaksi dan pengerjaan tugas Anda.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition">
          <FiDownload /> Unduh Laporan
        </button>
      </section>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          {(['all', 'income', 'withdrawal'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'all' ? 'Semua' : tab === 'income' ? 'Pendapatan' : 'Penarikan'}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari transaksi..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 text-slate-700 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Aktivitas / Tugas</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        item.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {item.type === 'income' ? <FiArrowDownLeft size={20} /> : <FiArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 group-hover:text-blue-600 transition">{item.taskTitle}</p>
                        <p className="text-xs text-slate-400 font-medium">{item.employerName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-600 font-medium">{item.date}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-bold italic"><FiClock /> {item.id}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'success' ? 'bg-green-100 text-green-700' : 
                      item.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'success' ? 'Berhasil' : item.status === 'processing' ? 'Proses' : 'Gagal'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-slate-800">
                    <span className={item.type === 'income' ? 'text-green-600' : 'text-slate-800'}>
                      {item.type === 'income' ? '+' : '-'} Rp{item.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;