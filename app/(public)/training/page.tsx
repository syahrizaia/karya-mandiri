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

  const categories: ITrainingCategory[] = [
    { id: 'all', name: 'Semua Materi', icon: <FiBookOpen /> },
    { id: 'ai-digital', name: 'AI & Tugas Digital', icon: <FiCpu /> },
    { id: 'admin-data', name: 'Administrasi & Data', icon: <FiDatabase /> },
    { id: 'technical', name: 'Keahlian Teknis', icon: <FiCamera /> },
    { id: 'professional', name: 'Etika & Bisnis', icon: <FiBriefcase /> },
  ];

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
      imageBg: 'bg-gradient-to-br from-blue-600/80 to-indigo-700/80',
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
      imageBg: 'bg-gradient-to-br from-emerald-600/80 to-teal-700/80',
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
      imageBg: 'bg-gradient-to-br from-purple-600/80 to-pink-700/80',
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
      imageBg: 'bg-gradient-to-br from-amber-600/80 to-orange-700/80',
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
      imageBg: 'bg-gradient-to-br from-cyan-600/80 to-blue-700/80',
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
      imageBg: 'bg-gradient-to-br from-rose-600/80 to-red-700/80',
      description: 'Tulis kalimat penawaran yang memikat untuk portofolio katalog jasa Anda agar menarik minat klik dari para Employer potensial.'
    }
  ];

  const filteredCourses = coursesData.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* HERO BANNER SECTION */}
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4 text-left">
            <span className="glass-capsule text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 px-3.5 py-1.5 inline-flex items-center gap-2">
              <FiAward className="text-sm" /> Akademi Pelatihan Mandiri
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Tingkatkan Keahlian, <br />Raih Proyek <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">Berupah Tinggi</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
              Akses modul pelatihan gratis yang dirancang khusus untuk sektor informal. Selesaikan kelas, dapatkan sertifikasi terverifikasi, dan raih prioritas tugas premium.
            </p>
            
            {/* Search Input Bar */}
            <div className="relative max-w-md pt-2">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
              <input 
                type="text"
                placeholder="Cari materi pelatihan (misal: Anotasi, Spreadsheet)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition font-medium"
              />
            </div>
          </div>

          {/* BENEFIT MINI STATS CARD */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-7 rounded-3xl space-y-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">Keuntungan Sertifikasi Digital</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-emerald-500 text-base mt-0.5 shrink-0" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"><span className="font-bold text-slate-900 dark:text-white">Prioritas Kuota:</span> Akun bersertifikat otomatis diprioritaskan sistem untuk kuota proyek massal.</p>
              </div>
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-emerald-500 text-base mt-0.5 shrink-0" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"><span className="font-bold text-slate-900 dark:text-white">Kenaikan Tarif:</span> Akses eksklusif ke tugas mikro premium dengan rate upah 30% lebih tinggi.</p>
              </div>
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-emerald-500 text-base mt-0.5 shrink-0" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"><span className="font-bold text-slate-900 dark:text-white">Lencana Profil:</span> Badge kompetensi dipajang langsung di profil publik dan katalog jasa Anda.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FILTER CATEGORIES */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 space-y-8">
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-blue-500/10'
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
              <div className="col-span-full glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl glass-capsule text-slate-400 flex items-center justify-center text-xl">
                  <FiBookOpen />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">Modul Tidak Ditemukan</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
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
                  className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group"
                >
                  {/* Top Color Banner Representation */}
                  <div className={`p-6 ${course.imageBg} text-white space-y-3 relative`}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest glass-capsule text-white px-2.5 py-1">
                        {course.level}
                      </span>
                      {course.isCertified && (
                        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500 text-white px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
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
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    <div className="space-y-3 pt-2">
                      {/* Meta info (Time & Modules) */}
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 border-t border-slate-200/50 dark:border-white/10 pt-3">
                        <span className="flex items-center gap-1"><FiClock size={13} /> {course.duration}</span>
                        <span className="flex items-center gap-1"><FiPlayCircle size={13} /> {course.modulesCount} Materi</span>
                        <span className="flex items-center gap-1 text-amber-500"><FiStar size={13} className="fill-amber-500" /> {course.rating}</span>
                      </div>

                      {/* Action Trigger Button */}
                      <button 
                        onClick={() => toast.message(`Memulai pengerjaan kelas: ${course.title}`)}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition duration-200 active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer"
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