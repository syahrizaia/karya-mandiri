"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiBell, 
  FiCheckCircle, 
  FiDollarSign, 
  FiInfo, 
  FiTrash2, 
  FiCircle,
  FiUserPlus,
  FiMessageSquare,
} from 'react-icons/fi';
import supabase from '@/lib/db';
import Link from 'next/link';

// Interface menyesuaikan skema PostgreSQL asli
interface NotificationItem {
  id: string;
  title: string;
  message: string;
  created_at: string;
  type: 'payment' | 'job' | 'system' | 'applicant' | 'lead';
  is_read: boolean;
  user_id?: string;
}

// Helper Functions
const getIcon = (type: string) => {
  switch (type) {
    case 'payment': return <FiDollarSign className="text-green-600" />;
    case 'job': return <FiCheckCircle className="text-blue-600" />;
    case 'system': return <FiInfo className="text-purple-600" />;
    case 'applicant': return <FiUserPlus className="text-orange-600" />;
    case 'lead': return <FiMessageSquare className="text-teal-600" />;
    default: return <FiBell className="text-slate-600" />;
  }
};

const getIconBg = (type: string) => {
  switch (type) {
    case 'payment': return 'bg-green-50';
    case 'job': return 'bg-blue-50';
    case 'system': return 'bg-purple-50';
    case 'applicant': return 'bg-orange-50';
    case 'lead': return 'bg-teal-50';
    default: return 'bg-slate-50';
  }
};

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data asli dari Supabase saat halaman dimuat
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (err) {
        console.error("Gagal mengambil data notifikasi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Aksi: Tandai semua telah dibaca
  const markAllAsRead = async () => {
    if (notifications.length === 0) return;

    // Optimistic Update: Ubah di UI dulu biar instan
    const updatedLocal = notifications.map(n => ({ ...n, is_read: true }));
    setNotifications(updatedLocal);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Eksekusi di DB
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
    } catch (err) {
      console.error("Gagal memperbarui status baca di database:", err);
    }
  };

  // Aksi: Tandai satu notifikasi tertentu sebagai dibaca saat diklik
  const markAsRead = async (id: string, currentStatus: boolean) => {
    if (currentStatus) return; // Jika sudah dibaca, abaikan

    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
    } catch (err) {
      console.error("Gagal menandai notifikasi:", err);
    }
  };

  // Aksi: Hapus Notifikasi
  const deleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Mencegah terpicunya fungsi markAsRead akibat gelembung klik DOM

    // Optimistic Update: Hapus di UI dulu
    setNotifications(notifications.filter(n => n.id !== id));

    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
    } catch (err) {
      console.error("Gagal menghapus notifikasi dari database:", err);
    }
  };

  // Helper memformat tanggal relatif sederhana lokalisasi Indonesia
  const formatWaktu = (isoString: string) => {
    const selisihMili = new Date().getTime() - new Date(isoString).getTime();
    const selisihMenit = Math.floor(selisihMili / 60000);
    const selisihJam = Math.floor(selisihMenit / 60);

    if (selisihMenit < 1) return 'Baru saja';
    if (selisihMenit < 60) return `${selisihMenit} menit lalu`;
    if (selisihJam < 24) return `${selisihJam} jam lalu`;
    
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Mengubah string nama pertama di dalam pesan menjadi link profil jika user_id tersedia
  const renderMessageContent = (notif: NotificationItem) => {
    if (!notif.user_id) return notif.message;

    // Menghandle jika tipe pelamar atau peminat klik hubungi jasa
    if (notif.type === 'applicant' || notif.type === 'lead') {
      const kata = notif.message.split(' ');
      const namaPelamar = notif.title.includes('Lamaran') || notif.title.includes('Kontak') 
        ? kata.slice(0, 2).join(' ') 
        : '';
        
      if (namaPelamar) {
        const sisaPesan = notif.message.replace(namaPelamar, '');
        return (
          <>
            <Link 
              href={`/profile/${notif.user_id}`} 
              className="font-bold text-blue-600 hover:underline inline-block"
              onClick={(e) => e.stopPropagation()} // Supaya tidak tabrakan dengan fungsi markAsRead
            >
              {namaPelamar}
            </Link>
            {sisaPesan}
          </>
        );
      }
    }
    return notif.message;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 md:pt-12 lg:pt-4 overflow-x-hidden">
      {/* Header Notifikasi */}
      <header className="flex justify-between items-center mb-6 gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Notifikasi</h1>
          <p className="text-xs md:text-sm text-slate-500">Info terbaru tentang pekerjaan dan akun Anda.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          disabled={loading || !notifications.some(n => !n.is_read)}
          className="text-xs md:text-sm font-bold px-3 py-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 disabled:opacity-40 disabled:hover:bg-transparent transition shrink-0"
        >
          Tandai Semua Dibaca
        </button>
      </header>

      {/* List Notifikasi */}
      <div className="space-y-3">
        {loading ? (
          // Skeleton Loader saat mengambil data
          [1, 2, 3].map((i) => (
            <div key={i} className="p-5 bg-white rounded-3xl border border-slate-100 flex gap-4 animate-pulse">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
                <div className="h-2 bg-slate-100 rounded w-16" />
              </div>
            </div>
          ))
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => markAsRead(notif.id, notif.is_read)}
              className={`group relative p-4 md:p-5 rounded-2xl md:rounded-3xl border transition-all duration-200 flex gap-3 md:gap-4 cursor-pointer ${
                notif.is_read 
                ? 'bg-slate-50/60 border-slate-100 opacity-80 hover:opacity-100' 
                : 'bg-white border-blue-100 shadow-sm ring-1 ring-blue-50/50 hover:shadow-md'
              }`}
            >
              {/* Status Icon */}
              <div className={`p-2.5 md:p-3 h-fit rounded-xl md:rounded-2xl shrink-0 ${getIconBg(notif.type)}`}>
                {getIcon(notif.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-0.5 md:space-y-1">
                <div className="flex justify-between items-center gap-2">
                  <h3 className={`font-bold text-sm md:text-base truncate ${notif.is_read ? 'text-slate-600' : 'text-slate-900'}`}>
                    {notif.title}
                  </h3>
                  {!notif.is_read && (
                    <span className="shrink-0 flex items-center">
                      <FiCircle className="text-blue-600 fill-current w-2 h-2" />
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed break-words">
                  {renderMessageContent(notif)}
                </p>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-0.5">
                  {formatWaktu(notif.created_at)}
                </p>
              </div>

              {/* Action */}
              <div className="flex items-center justify-center self-center md:self-start">
                <button 
                  onClick={(e) => deleteNotification(e, notif.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 md:opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-150"
                  title="Hapus notifikasi"
                >
                  <FiTrash2 size={16} className="md:w-[18px] md:h-[18px]" />
                </button>
              </div>
            </div>
          ))
        ) : (
          // Empty State
          <div className="text-center py-16 md:py-20 bg-white rounded-3xl border border-dashed border-slate-200 px-4">
            <FiBell className="mx-auto text-slate-300 mb-3 md:mb-4" size={40} />
            <p className="text-sm text-slate-500 font-medium">Belum ada notifikasi baru.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;