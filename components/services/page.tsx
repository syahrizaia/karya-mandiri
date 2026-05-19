/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import supabase from "@/lib/db";
import { toast } from "sonner";
import { FiPlus, FiTrash2, FiEdit, FiSearch, FiLoader, FiDollarSign, FiLayers } from "react-icons/fi";
import EditServiceDialog from "../edit-service/page";
import DeleteServiceDialog from "../delete-service/page";

interface IService {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
}

export default function Services() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setSubmitLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State Form (Untuk Tambah & Edit)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Kreatif & Desain");

  // 🛠️ State Pengendali Dialog (Modal)
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Fetch data jasa milik user aktif
  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (err: any) {
      toast.error("Gagal memuat daftar jasa: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle Tambah & Update Jasa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Anda harus login terlebih dahulu.");
        return;
      }

      const serviceData = {
        title,
        description,
        price: Number(price),
        category,
        user_id: user.id,
      };

      if (editingId) {
        // Mode Aksi: UPDATE
        const { error } = await supabase
          .from("services")
          .update(serviceData)
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Jasa berhasil diperbarui!");
      } else {
        // Mode Aksi: INSERT
        const { error } = await supabase
          .from("services")
          .insert([serviceData]);

        if (error) throw error;
        toast.success("Jasa baru berhasil diposting!");
      }

      // Reset Form & Refresh Data
      resetForm();
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Pemicu Dialog Edit
  const handleEditClick = (service: IService) => {
    setSelectedService(service);
    setIsEditOpen(true);
  };

  // Pemicu Dialog Delete
  const handleDeleteClick = (service: IService) => {
    setSelectedService(service);
    setIsDeleteOpen(true);
  };

  // Optimistic update setelah sukses menghapus lewat dialog
  const handleDeleteSuccess = (deletedId: string) => {
    setServices(services.filter((s) => s.id !== deletedId));
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("Kreatif & Desain");
  };

  // Filter pencarian pada UI lokal tabel
  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      {/* SEKSI TABEL MANAJEMEN DATA JASA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Tabel & Fitur Cari */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Daftar Jasamu Saat Ini</h3>
            <p className="text-xs text-slate-400 mt-0.5">Kelola, ubah deskripsi, atau hapus penawaran jasamu yang aktif.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama jasa..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-slate-50/50"
            />
          </div>
        </div>

        {/* Kontainer Tabel Responsif */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium text-sm flex justify-center items-center gap-2 animate-pulse">
              <FiLoader className="animate-spin text-blue-500 text-lg" /> Sinkronisasi data keahlian...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium text-sm">
              Belum ada jasa yang diposting atau tidak cocok dengan pencarian.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Nama Jasa</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Tarif Jasa</th>
                  <th className="py-4 px-6 text-center">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 max-w-xs md:max-w-md">
                      <p className="font-bold text-slate-800 line-clamp-2">{service.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{service.description}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 font-semibold rounded-lg text-xs">
                        <FiLayers className="text-slate-400" /> {service.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-green-600">
                      Rp{service.price.toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(service)}
                          title="Edit Jasa"
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(service)}
                          title="Hapus Jasa"
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <EditServiceDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        service={selectedService} 
        onSuccess={fetchServices} 
      />

      <DeleteServiceDialog
        open={isDeleteOpen} 
        onOpenChange={setIsDeleteOpen} 
        serviceId={selectedService?.id || null} 
        serviceTitle={selectedService?.title || ""} 
        onSuccess={handleDeleteSuccess} 
      />
    </div>
  );
}