/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import supabase from "@/lib/db";
import { toast } from "sonner";
import { 
  FiTrash2, 
  FiEdit, 
  FiSearch, 
  FiLoader, 
  FiLayers, 
  FiChevronLeft, 
  FiChevronRight 
} from "react-icons/fi";
import EditServiceDialog from "../../services/edit-service/page";
import DeleteServiceDialog from "../../services/delete-service/page";
import Link from "next/link";

interface IService {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
}

interface IServicesProps {
  itemsPerPage?: number;
}

export default function Services({ itemsPerPage = 5 }: IServicesProps) {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // State Pengendali Dialog (Modal)
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

  // Reset halaman aktif ke 1 saat user mengetik di kolom pencarian
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
    const updatedList = services.filter((s) => s.id !== deletedId);
    setServices(updatedList);
    
    // Keamanan baris: jika halaman menjadi kosong setelah dihapus, otomatis mundur 1 halaman
    const filteredAndUpdated = updatedList.filter((s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const newTotalPages = Math.ceil(filteredAndUpdated.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  // Filter pencarian pada UI lokal tabel
  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // LOGIKA UTAMA SPLICING DATA PAGINATION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8 text-slate-900 dark:text-slate-100 transition-colors">
      {/* SEKSI TABEL MANAJEMEN DATA JASA LIQUID GLASS */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5 transition-all">
        {/* Header Tabel & Fitur Cari */}
        <div className="p-5 sm:p-6 border-b border-white/20 dark:border-white/5 bg-slate-900/5 dark:bg-white/5 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Daftar Penawaran Jasa</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kelola tarif, deskripsi, atau tinjau layanan keahlian aktif Anda.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau kategori jasa..."
              className="glass-input w-full pl-10 pr-4 py-2 text-xs rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-medium"
            />
          </div>
        </div>

        {/* Kontainer Tabel Responsif */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 text-center text-slate-400 dark:text-slate-500 font-medium text-sm flex justify-center items-center gap-2.5 animate-pulse">
              <FiLoader className="animate-spin text-blue-500 text-xl" /> Sinkronisasi portofolio keahlian...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="p-16 text-center text-slate-400 dark:text-slate-500 font-medium text-sm">
              Belum ada penawaran jasa yang diposting atau cocok dengan kata kunci pencarian.
            </div>
          ) : (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/5 dark:bg-white/5 border-b border-white/20 dark:border-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-4 px-6">Nama Jasa & Deskripsi</th>
                    <th className="py-4 px-6">Kategori</th>
                    <th className="py-4 px-6">Tarif Jasa</th>
                    <th className="py-4 px-6 text-center">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/40 dark:divide-white/5 text-sm text-slate-700 dark:text-slate-300">
                  {currentItems.map((service) => (
                    <tr key={service.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors duration-200 group">
                      <td className="py-4 px-6 max-w-xs md:max-w-md">
                        <Link 
                          href={`/services/${service.id}`} 
                          className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1"
                        >
                          {service.title}
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{service.description}</p>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-500/10 dark:bg-white/5 border border-white/20 dark:border-white/5 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs">
                          <FiLayers size={13} className="text-blue-500 dark:text-blue-400" /> {service.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        Rp{service.price.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(service)}
                            title="Edit Jasa"
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 rounded-xl transition cursor-pointer"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(service)}
                            title="Hapus Jasa"
                            className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* KONTROL PANEL FOOTER NAVIGATION PAGINATION */}
              {totalPages > 1 && (
                <div className="p-4.5 border-t border-white/20 dark:border-white/5 bg-slate-900/5 dark:bg-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center backdrop-blur-md">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Menampilkan <span className="text-slate-800 dark:text-slate-200">{indexOfFirstItem + 1}</span> -{" "}
                    <span className="text-slate-800 dark:text-slate-200">
                      {Math.min(indexOfLastItem, filteredServices.length)}
                    </span>{" "}
                    dari <span className="text-slate-800 dark:text-slate-200">{filteredServices.length}</span> total jasa
                  </p>

                  <div className="flex items-center gap-1.5">
                    {/* Tombol Halaman Sebelumnya */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="glass-capsule p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition cursor-pointer disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft size={15} />
                    </button>

                    {/* Nomor Urut Iterasi Halaman */}
                    {Array.from({ length: totalPages }, (_, idx) => (
                      <button
                        key={idx + 1}
                        onClick={() => handlePageChange(idx + 1)}
                        className={`w-7.5 h-7.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                          currentPage === idx + 1
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "glass-capsule text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}

                    {/* Tombol Halaman Berikutnya */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="glass-capsule p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition cursor-pointer disabled:cursor-not-allowed"
                    >
                      <FiChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
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