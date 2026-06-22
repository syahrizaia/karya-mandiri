/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import supabase from "@/lib/db";
import SubscriptionDialog from "../../../components/subscription/page";
import { toast } from "sonner";
import { HistoryTable, TransactionHistory } from "@/components/history/HistoryTable";
import { HistoryHeader } from "@/components/history/HistoryHeader";
import { HistoryFilters } from "@/components/history/HistoryFilters";

const History: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "income" | "withdrawal">("all");
  const [showSubModal, setShowSubModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [historyData, setHistoryData] = useState<TransactionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("transactions")
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
          .order("created_at", { ascending: false });

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

  const filteredData = historyData.filter((item) => {
    const matchesTab = activeTab === "all" ? true : item.type === activeTab;
    const taskTitle = item.jobs?.title || "Penarikan Saldo";
    const employerName = item.jobs?.profiles?.full_name || "Bank Tujuan";
    const matchesSearch = 
      taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const formatTanggal = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const handleDownloadReport = () => {
    if (filteredData.length === 0) {
      toast.error("Tidak ada data transaksi yang bisa diunduh untuk filter ini.");
      return;
    }

    const headers = ["ID Transaksi", "Tanggal", "Aktivitas / Tugas", "Employer / Mitra", "Tipe", "Status", "Nominal (Rp)"];

    const rows = filteredData.map((item) => {
      const tanggal = new Date(item.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
      const judulTugas = item.jobs?.title || "Penarikan Saldo Mandiri";
      const namaEmployer = item.jobs?.profiles?.full_name || "Ke Rekening Bank";
      const tipeText = item.type === "income" ? "Pendapatan" : "Penarikan";
      const statusText = item.status === "success" ? "Berhasil" : item.status === "pending" ? "Proses" : "Gagal";
      const tandaNominal = item.type === "income" ? item.amount : -item.amount;

      return [
        item.id.toUpperCase(),
        tanggal,
        `"${judulTugas.replace(/"/g, '""')}"`,
        `"${namaEmployer.replace(/"/g, '""')}"`,
        tipeText,
        statusText,
        tandaNominal
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(","))
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const namaFileSuffix = activeTab === "all" ? "semua" : activeTab;
    link.setAttribute("download", `laporan_transaksi_karyamandiri_${namaFileSuffix}_${new Date().toISOString().split("T")[0]}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 md:pt-12 lg:pt-4 overflow-x-hidden text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header Utama */}
      <HistoryHeader loading={loading} onDownload={handleDownloadReport} />

      {/* Tabs & Pencarian */}
      <HistoryFilters 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* Tabel Riwayat */}
      <HistoryTable 
        loading={loading} 
        filteredData={filteredData} 
        formatTanggal={formatTanggal} 
      />

      {/* Dialog Langganan */}
      <SubscriptionDialog open={showSubModal} onOpenChange={setShowSubModal} />
    </div>
  );
};

export default History;