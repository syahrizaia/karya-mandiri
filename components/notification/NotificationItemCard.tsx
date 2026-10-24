/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Link from 'next/link';
import { 
  FiBell, 
  FiCheckCircle, 
  FiDollarSign, 
  FiInfo, 
  FiTrash2, 
  FiUserPlus,
  FiMessageSquare,
} from 'react-icons/fi';
import { NotificationItem } from '@/app/(private)/types';

interface NotificationItemCardProps {
  notif: NotificationItem;
  onMarkAsRead: (id: string, currentStatus: boolean) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'payment': return <FiDollarSign className="text-emerald-500" size={18} />;
    case 'job': return <FiCheckCircle className="text-blue-500" size={18} />;
    case 'system': return <FiInfo className="text-indigo-500" size={18} />;
    case 'applicant': return <FiUserPlus className="text-amber-500" size={18} />;
    case 'lead': return <FiMessageSquare className="text-teal-500" size={18} />;
    default: return <FiBell className="text-slate-500" size={18} />;
  }
};

const getIconBg = (type: string) => {
  switch (type) {
    case 'payment': return 'bg-emerald-500/10 border-emerald-500/20';
    case 'job': return 'bg-blue-500/10 border-blue-500/20';
    case 'system': return 'bg-indigo-500/10 border-indigo-500/20';
    case 'applicant': return 'bg-amber-500/10 border-amber-500/20';
    case 'lead': return 'bg-teal-500/10 border-teal-500/20';
    default: return 'bg-slate-500/10 border-slate-500/20';
  }
};

export const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  notif,
  onMarkAsRead,
  onDelete,
}) => {
  
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

  const renderMessageContent = (item: NotificationItem) => {
    if (!item.message) return "";

    if (item.message.includes('[') && item.message.includes('](')) {
      const parts = item.message.split(/(\[.*?\]\(.*?\))/g);

      return parts.map((part, index) => {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        
        if (match) {
          const [_, name, userId] = match;
          return (
            <Link 
              key={index} 
              href={`/profile/${userId}`}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-block mx-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              {name}
            </Link>
          );
        }
        return part;
      });
    }

    if (!item.sender_id) return item.message;

    if (item.type === 'lead' && item.message.includes(' tertarik dengan keahlian Anda')) {
      const parameterPemisah = ' tertarik dengan keahlian Anda';
      const parts = item.message.split(parameterPemisah);
      const namaPencari = parts[0];
      const sisaPesan = parameterPemisah + (parts[1] || '');

      return (
        <>
          <Link 
            href={`/profile/${item.sender_id}`}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-block mr-1"
            onClick={(e) => e.stopPropagation()}
          >
            {namaPencari}
          </Link>
          {sisaPesan}
        </>
      );
    }

    if (item.type === 'applicant' && item.message.includes(' telah melamar')) {
      const parts = item.message.split(' telah melamar');
      const namaPelamar = parts[0];
      const sisaPesan = ' telah melamar' + (parts[1] || '');

      return (
        <>
          <Link 
            href={`/profile/${item.sender_id}`}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-block mr-1"
            onClick={(e) => e.stopPropagation()}
          >
            {namaPelamar}
          </Link>
          {sisaPesan}
        </>
      );
    }

    return item.message;
  };

  return (
    <div 
      onClick={() => onMarkAsRead(notif.id, notif.is_read)}
      className={`group relative p-5 md:p-6 rounded-3xl transition-all duration-300 flex gap-4 md:gap-5 cursor-pointer ${
        notif.is_read 
        ? 'glass-card opacity-80 hover:opacity-100 hover:border-white/30' 
        : 'glass-card border-blue-500/40 dark:border-blue-400/30 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/10'
      }`}
    >
      {/* Icon Status Translucent */}
      <div className={`p-3.5 h-fit rounded-2xl shrink-0 border transition-transform group-hover:scale-105 ${getIconBg(notif.type)}`}>
        {getIcon(notif.type)}
      </div>

      {/* Konten Notifikasi */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex justify-between items-center gap-2">
          <h3 className={`font-bold text-sm md:text-base truncate transition-colors ${
            notif.is_read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white font-extrabold'
          }`}>
            {notif.title}
          </h3>
          {!notif.is_read && (
            <span className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
              Baru
            </span>
          )}
        </div>
        <div className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words">
          {renderMessageContent(notif)}
        </div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-1">
          {formatWaktu(notif.created_at)}
        </p>
      </div>

      {/* Tombol Hapus Glass */}
      <div className="flex items-center justify-center self-center md:self-start">
        <button 
          onClick={(e) => onDelete(e, notif.id)}
          className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 rounded-xl md:opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
          title="Hapus notifikasi"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};