import React from 'react';

const SavedJobSkeleton: React.FC = () => {
  return (
    <div className="glass-card p-5 sm:p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse">
      {/* Sisi Kiri: Ikon dan Teks */}
      <div className="flex gap-4 items-center w-full md:w-auto">
        {/* Mock Ikon Search */}
        <div className="bg-slate-200/50 dark:bg-white/5 p-6 rounded-2xl hidden sm:block w-12 h-12 shrink-0" />
        
        {/* Mock Judul dan Sub-info */}
        <div className="space-y-2 flex-1 sm:flex-none min-w-50">
          <div className="h-5 bg-slate-200/50 dark:bg-white/10 rounded-lg w-3/4 md:w-48" />
          <div className="flex items-center gap-3 mt-1">
            <div className="h-5 bg-slate-200/40 dark:bg-white/5 rounded-md w-16" />
            <div className="h-4 bg-slate-200/40 dark:bg-white/5 rounded-md w-24" />
          </div>
        </div>
      </div>
      
      {/* Sisi Kanan: Upah dan Tombol Aksi */}
      <div className="flex flex-col md:flex-row items-start justify-between w-full md:w-auto gap-6">
        {/* Mock Info Upah */}
        <div className="text-left md:text-right space-y-1.5 min-w-20">
          <div className="h-3 bg-slate-200/40 dark:bg-white/5 rounded w-10 md:ml-auto" />
          <div className="h-5 bg-slate-200/50 dark:bg-white/10 rounded-lg w-24 md:ml-auto" />
        </div>
        
        {/* Mock Tombol Aksi & Bookmark */}
        <div className="grid grid-cols-4 items-center gap-2.5 w-full md:w-auto">
          {/* Mock Tombol Ambil Tugas */}
          <div className="h-10 bg-slate-200/50 dark:bg-white/10 rounded-2xl col-span-3 min-w-30 md:w-32" />
          {/* Mock SaveJobButton */}
          <div className="h-10 bg-slate-200/50 dark:bg-white/10 rounded-2xl w-10" />
        </div>
      </div>
    </div>
  );
};

export default SavedJobSkeleton;