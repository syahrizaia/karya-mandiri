"use client";

import React, { useState } from 'react';
import { 
  FiBell, 
  FiCheckCircle, 
  FiDollarSign, 
  FiInfo, 
  FiTrash2, 
  FiCircle,
} from 'react-icons/fi';
import { NotificationItem } from '../types';

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'NT-01',
      title: 'Pembayaran Berhasil',
      message: 'Upah untuk tugas "Pengepakan Sembako" telah dikirim ke dompet Anda.',
      timestamp: '2 menit lalu',
      type: 'payment',
      isRead: false,
    },
    {
      id: 'NT-02',
      title: 'Tugas Baru Tersedia',
      message: 'Ada 5 tugas crowdsourcing baru di kategori Logistik dekat lokasi Anda.',
      timestamp: '1 jam lalu',
      type: 'job',
      isRead: false,
    },
    {
      id: 'NT-03',
      title: 'Update Sistem',
      message: 'KaryaMandiri kini mendukung penarikan saldo via e-wallet.',
      timestamp: 'Kemarin',
      type: 'system',
      isRead: true,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Notifikasi */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifikasi</h1>
          <p className="text-slate-500">Info terbaru tentang pekerjaan dan akun Anda.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-bold text-blue-600 hover:text-blue-700 transition"
        >
          Tandai Semua Dibaca
        </button>
      </header>

      {/* List Notifikasi */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`group relative p-5 rounded-3xl border transition-all duration-300 flex gap-4 ${
                notif.isRead 
                ? 'bg-white border-slate-100 opacity-75' 
                : 'bg-white border-blue-100 shadow-md ring-1 ring-blue-50'
              }`}
            >
              {/* Status Icon */}
              <div className={`p-3 h-fit rounded-2xl ${getIconBg(notif.type)}`}>
                {getIcon(notif.type)}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                    {notif.title}
                  </h3>
                  {!notif.isRead && <FiCircle className="text-blue-600 fill-current w-2 h-2 mt-1.5" />}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {notif.message}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">
                  {notif.timestamp}
                </p>
              </div>

              {/* Action */}
              <div className="flex flex-col justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => deleteNotification(notif.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <FiBell className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">Belum ada notifikasi baru.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Functions
const getIcon = (type: string) => {
  switch (type) {
    case 'payment': return <FiDollarSign className="text-green-600" />;
    case 'job': return <FiCheckCircle className="text-blue-600" />;
    case 'system': return <FiInfo className="text-purple-600" />;
    default: return <FiBell className="text-slate-600" />;
  }
};

const getIconBg = (type: string) => {
  switch (type) {
    case 'payment': return 'bg-green-50';
    case 'job': return 'bg-blue-50';
    case 'system': return 'bg-purple-50';
    default: return 'bg-slate-50';
  }
};

export default Notification;