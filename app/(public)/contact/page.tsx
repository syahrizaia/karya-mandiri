"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock, 
  FiSend, 
  FiMessageSquare, 
  FiCheckCircle 
} from 'react-icons/fi';
import { toast } from 'sonner';

interface IFormData {
  name: string;
  email: string;
  role: string;
  subject: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>({
    name: '',
    email: '',
    role: 'worker',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Mohon lengkapi seluruh kolom formulir!");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const roleLabels: Record<string, string> = {
        worker: "Worker / Mitra Mandiri (Sektor Informal)",
        employer: "Employer / Pemberi Kerja (Penyedia Proyek)",
        partner: "Instansi / Calon Partner Strategis",
        other: "Lainnya"
      };

      const readableRole = roleLabels[formData.role] || formData.role;

      const waMessage = `Halo Tim Operations KaryaMandiri,

Saya ingin mengirimkan pesan melalui Formulir Kontak Website:

*👤 Nama Lengkap:* ${formData.name}
*📧 Alamat Email:* ${formData.email}
*💼 Status Peran:* ${readableRole}
*📌 Subjek / Topik:* ${formData.subject}

*💬 Isi Detail Pesan:*
${formData.message}`;

      const encodedText = encodeURIComponent(waMessage);
      const phoneNumber = "6282114487163";

      window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, "_blank");
      
      toast.success("Mengarahkan pesan Anda ke Live Chat WhatsApp Support...");
      
      setFormData({
        name: '',
        email: '',
        role: 'worker',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Gagal mengarahkan ke WhatsApp. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const message = encodeURIComponent("Halo Operations Team KaryaMandiri, saya ingin mendiskusikan peluang kemitraan/kendala layanan.");
    window.open(`https://wa.me/6282114487163?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* HERO HEADER */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-6 text-center transition-colors">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
            Hubungi Kami
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Mari Terhubung dengan Kami
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Punya pertanyaan mengenai sistem crowdsourcing, kendala verifikasi akun, atau ingin menawarkan kolaborasi strategis? Tim kami siap membantu Anda.
          </p>
        </div>
      </section>

      {/* TWO COLUMN CONTENT LAYOUT */}
      <main className="max-w-5xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: FORMULIR KONTAK */}
        <section className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs"
          >
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">Kirim Pesan Digital</h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs md:text-sm mb-6">Isi formulir di bawah ini dan dapatkan respons resmi dari tim operasional internal.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Alamat Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status Peran Akun</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition"
                >
                  <option value="worker">Worker / Mitra Mandiri (Sektor Informal)</option>
                  <option value="employer">Employer / Pemberi Kerja (Penyedia Proyek)</option>
                  <option value="partner">Instansi / Calon Partner Strategis</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Subjek / Topik Utama</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Contoh: Kendala Tarik Saldo Escrow / Penawaran Kerja Sama"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Isi Detail Pesan</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Tuliskan pesan, kronologi kendala, atau poin proposal Anda di sini..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-xs"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FiSend size={15} /> Kirim Formulir Kontak
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </section>

        {/* KOLOM KANAN: INFORMASI KANAL DIREK */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <h3 className="font-black text-slate-900 dark:text-white text-base">Saluran Hubungan Langsung</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-blue-600 dark:text-blue-400 border border-slate-100 dark:border-slate-700 shrink-0">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Kantor Operasional</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5 leading-snug">
                    Bekasi, Jawa Barat, Indonesia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-blue-600 dark:text-blue-400 border border-slate-100 dark:border-slate-700 shrink-0">
                  <FiMail size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Korespondensi Email</p>
                  <a href="mailto:syahrizaalsistani@gmail.com" className="text-sm font-bold text-blue-500 dark:text-blue-400 hover:text-blue-600 transition block mt-0.5">
                    syahrizaalsistani@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-blue-600 dark:text-blue-400 border border-slate-100 dark:border-slate-700 shrink-0">
                  <FiPhone size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hotline Telepon</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                    +62 821-1448-7163
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-blue-600 dark:text-blue-400 border border-slate-100 dark:border-slate-700 shrink-0">
                  <FiClock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Waktu Kerja Layanan</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5 leading-relaxed">
                    Senin - Jumat: 08:00 - 17:00 WIB <br />
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">(Sabtu, Minggu & Hari Libur Nasional Tutup)</span>
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Tombol Akselerasi WhatsApp */}
            <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xs">
                <FiCheckCircle className="text-green-500" /> Butuh Solusi Lebih Cepat?
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Gunakan fitur bantuan obrolan langsung via WhatsApp jika Anda memerlukan respons interaktif di luar sistem tiket formulir.
              </p>
              <button
                onClick={handleWhatsAppDirect}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs shadow-green-600/5 active:scale-[0.98]"
              >
                <FiMessageSquare size={14} /> Hubungi Lewat Live Chat WA
              </button>
            </div>
          </div>

          {/* Placeholder Visual Peta */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-full h-44 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center text-center p-4 border border-slate-200/40 dark:border-slate-700">
              <FiMapPin className="text-slate-300 dark:text-slate-600 text-3xl mb-1.5 animate-bounce" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Digital Map API Integration</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[200px] mt-0.5 leading-normal">Peta interaktif wilayah Jakarta Selatan dapat diintegrasikan di container box ini.</p>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default ContactUs;