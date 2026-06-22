/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Link from 'next/link';
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
import { NotificationItem } from '@/app/(private)/types';

interface NotificationItemCardProps {
  notif: NotificationItem;
  onMarkAsRead: (id: string, currentStatus: boolean) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'payment': return <FiDollarSign className="text-green-600 dark:text-green-400" />;
    case 'job': return <FiCheckCircle className="text-blue-600 dark:text-blue-400" />;
    case 'system': return <FiInfo className="text-purple-600 dark:text-purple-400" />;
    case 'applicant': return <FiUserPlus className="text-orange-600 dark:text-orange-400" />;
    case 'lead': return <FiMessageSquare className="text-teal-600 dark:text-teal-400" />;
    default: return <FiBell className="text-slate-600 dark:text-slate-400" />;
  }
};

const getIconBg = (type: string) => {
  switch (type) {
    case 'payment': return 'bg-green-50 dark:bg-green-950/30';
    case 'job': return 'bg-blue-50 dark:bg-blue-950/30';
    case 'system': return 'bg-purple-50 dark:bg-purple-950/30';
    case 'applicant': return 'bg-orange-50 dark:bg-orange-950/30';
    case 'lead': return 'bg-teal-50 dark:bg-teal-950/30';
    default: return 'bg-slate-50 dark:bg-slate-800';
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
      className={`group relative p-4 md:p-5 rounded-2xl md:rounded-3xl border transition-all duration-200 flex gap-3 md:gap-4 cursor-pointer ${
        notif.is_read 
        ? 'bg-slate-50/60 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800/80 opacity-80 hover:opacity-100' 
        : 'bg-white dark:bg-slate-900 border-blue-100 dark:border-blue-900/50 shadow-sm ring-1 ring-blue-50/50 dark:ring-blue-950/30 hover:shadow-md'
      }`}
    >
      {/* Icon Status */}
      <div className={`p-2.5 md:p-3 h-fit rounded-xl md:rounded-2xl shrink-0 transition-colors ${getIconBg(notif.type)}`}>
        {getIcon(notif.type)}
      </div>

      {/* Konten Notifikasi */}
      <div className="flex-1 min-w-0 space-y-0.5 md:space-y-1">
        <div className="flex justify-between items-center gap-2">
          <h3 className={`font-bold text-sm md:text-base truncate transition-colors ${notif.is_read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
            {notif.title}
          </h3>
          {!notif.is_read && (
            <span className="shrink-0 flex items-center">
              <FiCircle className="text-blue-600 dark:text-blue-400 fill-current w-2 h-2" />
            </span>
          )}
        </div>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words">
          {renderMessageContent(notif)}
        </p>
        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-0.5">
          {formatWaktu(notif.created_at)}
        </p>
      </div>

      {/* Tombol Hapus */}
      <div className="flex items-center justify-center self-center md:self-start">
        <button 
          onClick={(e) => onDelete(e, notif.id)}
          className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 md:opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-150 cursor-pointer"
          title="Hapus notifikasi"
        >
          <FiTrash2 size={16} className="md:w-[18px] md:h-[18px]" />
        </button>
      </div>
    </div>
  );
};