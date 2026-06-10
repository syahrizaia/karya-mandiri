"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBookOpen, 
  FiClock, 
  FiAward, 
  FiSearch, 
  FiCheckCircle, 
  FiStar, 
  FiPlayCircle, 
  FiCpu, 
  FiDatabase, 
  FiCamera, 
  FiBriefcase 
} from 'react-icons/fi';
import { toast } from 'sonner';

interface ICourse {
  id: string;
  title: string;
  category: string;
  duration: string;
  modulesCount: number;
  rating: number;
  level: 'Dasar' | 'Menengah' | 'Mahir';
  isCertified: boolean;
  imageBg: string;
  description: string;
}

interface ITrainingCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const TrainingCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Kategori Pelatihan
  const categories: ITrainingCategory[] = [
    { id: 'all', name: 'Semua Materi', icon: <FiBookOpen /> },
    { id: 'ai-digital', name: 'AI & Tugas Digital', icon: <FiCpu /> },
    { id: 'admin-data', name: 'Administrasi & Data', icon: <FiDatabase /> },
    { id: 'technical', name: 'Keahlian Teknis', icon: <FiCamera /> },
    { id: 'professional', name: 'Etika & Bisnis', icon: <FiBriefcase /> },
  ];

  // Data Silabus / Modul Pelatihan (Ekosistem KaryaMandiri)
  const coursesData: ICourse[] = [
    {
      id: 'course-1',
      title: 'Dasar Anotasi Data & Labelling untuk Kecerdasan Buatan (AI)',
      category: 'ai-digital',
      duration: '2 Jam 30 Menit',
      modulesCount: 8,
      rating: 4.9,
      level: 'Dasar',
      isCertified: true,
      imageBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      description: 'Pelajari cara melakukan labelling gambar, anotasi teks, dan validasi data secara akurat untuk menyuplai kebutuhan data set kecerdasan buatan.'
    },
    {
      id: 'course-2',
      title: 'Akurasi Tinggi dalam Data Entry & Manajemen Spreadsheet',
      category: 'admin-data',
      duration: '3 Jam',
      modulesCount: 10,
      rating: 4.8,
      level: 'Dasar',
      isCertified: true,
      imageBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      description: 'Kuasai teknik memasukkan data massal secara cepat, meminimalisir eror, serta manipulasi rumus dasar spreadsheet untuk laporan proyek komersial.'
    },
    {
      id: 'course-3',
      title: 'Teknik Fotografi Produk & Komersial Menggunakan Smartphone',
      category: 'technical',
      duration: '4 Jam 15 Menit',
      modulesCount: 12,
      rating: 4.9,
      level: 'Menengah',
      isCertified: true,
      imageBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
      description: 'Maksimalkan kamera ponsel Anda untuk mengambil foto produk UMKM yang estetik, pencahayaan mandiri, dan komposisi sudut pandang komersial.'
    },
    {
      id: 'course-4',
      title: 'Komunikasi Profesional & Etika Kerja Mitra Sektor Informal',
      category: 'professional',
      duration: '1 Jam 45 Menit',
      modulesCount: 5,
      rating: 4.7,
      level: 'Dasar',
      isCertified: false,
      imageBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      description: 'Panduan bernegosiasi, memahami lembar spesifikasi tugas (RFS), serta etika menjaga komitmen tenggat waktu dengan Employer platform.'
    },
    {
      id: 'course-5',
      title: 'Metode Pengumpulan Data Lapangan (Survei) & Validasi Geografis',
      category: 'ai-digital',
      duration: '2 Jam',
      modulesCount: 6,
      rating: 4.6,
      level: 'Menengah',
      isCertified: true,
      imageBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      description: 'Teknik melakukan survei titik lokasi (POI), verifikasi foto ruko fisik, dan pengumpulan kuesioner lapangan yang valid bebas manipulasi.'
    },
    {
      id: 'course-6',
      title: 'Dasar-Dasar Copywriting untuk Pembuatan Caption & Iklan Jasa',
      category: 'technical',
      duration: '3 Jam 45 Menit',
      modulesCount: 9,
      rating: 4.8,
      level: 'Menengah',
      isCertified: true,
      imageBg: 'bg-gradient-to-br from-rose-500 to-red-600',
      description: 'Tulis kalimat penawaran yang memikat untuk portofolio katalog jasa Anda agar menarik minat klik dari para Employer potensial.'
    }
  ];

  // Penapisan/Filter Data Berdasarkan Kategori dan Input Pencarian
  const filteredCourses = coursesData.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* HERO BANNER SECTION */}
      <section className="bg-white border-b border-slate-200 py-16 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-5 text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <FiAward /> Akademi Mandiri
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Tingkatkan Keahlian Anda, <br />Dapatkan Proyek Berupah Tinggi!
            </h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl">
              Akses modul pelatihan gratis yang dirancang khusus untuk sektor informal. Selesaikan kelas, dapatkan lencana sertifikasi, dan jadilah prioritas utama saat melamar kerja *crowd*.
            </p>
            
            {/* Search Input Bar */}
            <div className="relative max-w-md pt-2">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input 
                type="text"
                placeholder="Cari materi pelatihan (misal: Anotasi, Spreadsheet)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
              />
            </div>
          </div>

          {/* BENEFIT MINI STATS CARD */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 space-y-4 shadow-xl shadow-slate-900/10">
            <h3 className="font-black text-sm uppercase tracking-wider text-blue-400">Keuntungan Sertifikasi</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-emerald-400 text-lg mt-0.5 shrink-0" />
                <p className="text-xs text-slate-300 leading-normal"><span className="font-bold text-white">Prioritas Kuota:</span> Akun bersertifikat otomatis diprioritaskan sistem untuk masuk kuota proyek massal.</p>
              </div>
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-emerald-400 text-lg mt-0.5 shrink-0" />
                <p className="text-xs text-slate-300 leading-normal"><span className="font-bold text-white">Kenaikan Tarif:</span> Akses eksklusif ke tugas mikro premium dengan rate upah 30% lebih tinggi.</p>
              </div>
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-emerald-400 text-lg mt-0.5 shrink-0" />
                <p className="text-xs text-slate-300 leading-normal"><span className="font-bold text-white">Lencana Profil:</span> Badge verifikasi kompetensi dipajang langsung di katalog portofolio jasa Anda.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FILTER CATEGORIES */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 mt-12 space-y-8">
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs border transition shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* COURSE GRID CARDS LIST */}
        <AnimatePresence mode="wait">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.length === 0 ? (
              <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-xl">
                  <FiBookOpen />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Modul Tidak Ditemukan</h4>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">
                  Maaf, tidak ada silabus materi pelatihan yang sesuai dengan kata kunci pencarian Anda saat ini.
                </p>
              </div>
            ) : (
              filteredCourses.map((course) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={course.id}
                  className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition duration-200"
                >
                  {/* Top Color Banner Representation */}
                  <div className={`p-6 ${course.imageBg} text-white space-y-3 relative`}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md">
                        {course.level}
                      </span>
                      {course.isCertified && (
                        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500 text-white px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                          <FiAward /> + Sertifikat
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-base leading-snug tracking-tight line-clamp-2 h-12">
                      {course.title}
                    </h3>
                  </div>

                  {/* Course Details Description Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    <div className="space-y-3 pt-2">
                      {/* Meta info info (Time & Modules) */}
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-t border-slate-100 pt-3">
                        <span className="flex items-center gap-1"><FiClock size={13} className="text-slate-400" /> {course.duration}</span>
                        <span className="flex items-center gap-1"><FiPlayCircle size={13} className="text-slate-400" /> {course.modulesCount} Materi</span>
                        <span className="flex items-center gap-1 text-amber-500"><FiStar size={13} className="fill-amber-500" /> {course.rating}</span>
                      </div>

                      {/* Action Trigger Button */}
                      <button 
                        onClick={() => toast.message(`Memulai pengerjaan kelas: ${course.title}`)}
                        className="w-full py-3 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition duration-200"
                      >
                        Mulai Belajar Sekarang
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
};

export default TrainingCenter;