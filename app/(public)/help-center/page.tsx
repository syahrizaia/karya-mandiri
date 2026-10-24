"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiChevronDown, 
  FiUser, 
  FiBriefcase, 
  FiCreditCard, 
  FiShield, 
  FiMessageSquare, 
  FiMail, 
  FiPhone,
  FiHelpCircle
} from 'react-icons/fi';

interface IFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface ICategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const categories: ICategory[] = [
    { id: 'all', name: 'Semua Topik', icon: <FiMessageSquare />, description: 'Lihat seluruh pertanyaan umum' },
    { id: 'account', name: 'Akun & Profil', icon: <FiUser />, description: 'Registrasi, verifikasi KTP, dan kelola peran' },
    { id: 'jobs', name: 'Pekerjaan & Jasa', icon: <FiBriefcase />, description: 'Cara melamar, crowdsourcing, dan pasang iklan' },
    { id: 'payment', name: 'Pembayaran & Escrow', icon: <FiCreditCard />, description: 'Sistem pencairan dana, biaya layanan, dan invoice' },
    { id: 'security', name: 'Keamanan & Aturan', icon: <FiShield />, description: 'Perlindungan data, UU ITE, dan penyelesaian sengketa' },
  ];

  const faqData: IFaqItem[] = [
    {
      id: 'faq-1',
      category: 'payment',
      question: 'Bagaimana cara kerja sistem pembayaran Escrow di KaryaMandiri?',
      answer: 'Sistem Escrow (Rekening Bersama) kami mengamankan dana Employer sebelum proyek dimulai. Setelah Pekerja menyelesaikan tugasnya dan diverifikasi oleh Employer atau sistem, dana akan otomatis dicairkan langsung ke saldo dompet Pekerja. Ini menjamin perlindungan 100% dari penipuan.'
    },
    {
      id: 'faq-2',
      category: 'account',
      question: 'Apakah saya bisa mengubah peran dari Worker menjadi Employer atau sebaliknya?',
      answer: 'Untuk menjaga validitas data dan sistem rating, satu akun hanya dapat memiliki satu peran aktif (Worker atau Employer). Jika Anda ingin menggunakan kedua fitur tersebut, Anda disarankan membuat dua akun berbeda menggunakan alamat email yang terpisah.'
    },
    {
      id: 'faq-3',
      category: 'jobs',
      question: 'Apa itu model kerja Crowdsourcing di platform ini?',
      answer: 'Model Crowdsourcing memungkinkan Employer untuk membagi satu proyek besar menjadi tugas-tugas kecil yang bisa diambil oleh banyak Pekerja sekaligus secara paralel. Pekerjaan akan dianggap dimulai secara massal setelah seluruh kuota pekerja yang dibutuhkan terpenuhi.'
    },
    {
      id: 'faq-4',
      category: 'security',
      question: 'Bagaimana jika hasil kerja yang diserahkan tidak sesuai komitmen awal?',
      answer: 'KaryaMandiri menyediakan fitur Mediasi Sengketa. Jika Employer merasa hasil kerja melanggar kesepakatan tertulis, Employer dapat mengajukan komplain sebelum masa verifikasi habis. Tim admin kami akan meninjau bukti digital (kontrak & lampiran tugas) secara adil.'
    },
    {
      id: 'faq-5',
      category: 'account',
      question: 'Mengapa verifikasi profil (KTP) sangat penting bagi Mitra Mandiri?',
      answer: 'Verifikasi KTP diperlukan untuk menciptakan ekosistem kerja sektor informal yang terpercaya, mencegah akun kloning/fraud, serta memastikan kepatuhan terhadap regulasi PDP (Perlindungan Data Pribadi) di Indonesia. Data Anda dienkripsi dengan standar keamanan tinggi.'
    },
    {
      id: 'faq-6',
      category: 'jobs',
      question: 'Bagaimana cara menghubungi penyedia penawaran Jasa?',
      answer: 'Anda dapat membuka halaman detail jasa yang diminati, lalu klik tombol "Hubungi Lewat WhatsApp". Sistem secara otomatis memformat pesan pembuka dan mengarahkan Anda ke WhatsApp resmi mitra terkait tanpa perlu menyimpan nomor terlebih dahulu.'
    }
  ];

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleContactWhatsApp = () => {
    const message = encodeURIComponent("Halo Admin KaryaMandiri, saya membutuhkan bantuan mengenai kendala teknis pada platform.");
    window.open(`https://wa.me/6282114487163?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen pb-24 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* HERO SECTION */}
      <section className="py-12 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="glass-capsule text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 px-3.5 py-1.5 inline-flex items-center gap-2">
            <FiHelpCircle className="text-sm" /> Pusat Bantuan & Edukasi Pengguna
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Ada yang Bisa <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">Kami Bantu</span>?
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Cari jawaban instan seputar pengelolaan akun, sistem pembayaran aman escrow, komisi, dan panduan teknis crowdsourcing.
          </p>
          
          <div className="max-w-xl mx-auto relative mt-4">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input 
              type="text"
              placeholder="Ketik pertanyaan atau kata kunci (misal: Escrow, KTP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-12 pr-4 py-4 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium outline-none transition text-sm"
            />
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-1 space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-2 mb-3">
            Kategori Bantuan
          </h3>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenFaqId(null);
                }}
                className={`flex items-center gap-3.5 p-4 rounded-2xl text-left font-bold text-sm transition shrink-0 lg:shrink grow-0 w-[240px] lg:w-full cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-blue-500/10'
                }`}
              >
                <div className={`p-2.5 rounded-xl text-base ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'glass-capsule text-blue-600 dark:text-blue-400'}`}>
                  {cat.icon}
                </div>
                <div>
                  <p className="block truncate text-sm font-black">{cat.name}</p>
                  <span className={`text-[11px] font-medium block truncate mt-0.5 ${activeCategory === cat.id ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    {cat.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT: FAQ */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Pertanyaan Sering Diajukan</h2>
            <span className="text-xs font-bold glass-capsule px-3 py-1 text-slate-600 dark:text-slate-300">
              {filteredFaqs.length} Artikel
            </span>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl glass-capsule text-slate-400 flex items-center justify-center text-xl">
                <FiSearch />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">Hasil Tidak Ditemukan</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
                Tidak ada dokumentasi FAQ yang cocok dengan kata kunci &quot;{searchQuery}&quot;. Silakan gunakan opsi kontak langsung di bawah.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    className="glass-card rounded-2xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-5 text-left flex justify-between items-center gap-4 font-bold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                    >
                      <span className="text-sm md:text-base leading-snug">{faq.question}</span>
                      <FiChevronDown 
                        className={`text-slate-400 transition-transform duration-300 shrink-0 text-lg ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} 
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-5 pb-5 pt-1 border-t border-slate-200/50 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {/* ESCALATION CARD */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Masih memerlukan bantuan khusus?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Tim Operations & Helpdesk KaryaMandiri siap membantu kendala teknis atau transaksi Anda secara personal selama jam operasional resmi.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
                <span className="flex items-center gap-1.5"><FiMail className="text-blue-500" /> syahrizaalsistani@gmail.com</span>
                <span className="flex items-center gap-1.5"><FiPhone className="text-blue-500" /> +62 821-1448-7163</span>
              </div>
            </div>
            <div className="md:col-span-1">
              <button
                onClick={handleContactWhatsApp}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <FiMessageSquare size={15} /> Live Chat WhatsApp
              </button>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
};

export default HelpCenter;