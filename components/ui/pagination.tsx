import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  filteredCount: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  onPageChange: (pageNumber: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  filteredCount,
  indexOfFirstItem,
  indexOfLastItem,
  onPageChange,
}) => {
  return (
    <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-between items-center text-center sm:text-left text-sm transition-colors">
      <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold w-full sm:w-auto">
        Menampilkan <span className="text-slate-700 dark:text-slate-300">{indexOfFirstItem + 1}</span> -{" "}
        <span className="text-slate-700 dark:text-slate-300">
          {Math.min(indexOfLastItem, filteredCount)}
        </span>{" "}
        dari <span className="text-slate-700 dark:text-slate-300">{filteredCount}</span> penawaran jasa
      </p>

      <div className="flex items-center justify-center gap-1 mx-auto sm:mx-0">
        {/* Tombol Sebelumnya */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
        >
          <FiChevronLeft size={16} />
        </button>

        {/* Iterasi Angka Halaman */}
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => onPageChange(idx + 1)}
            className={`w-9 h-9 text-xs font-bold rounded-xl transition cursor-pointer ${
              currentPage === idx + 1
                ? "bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-xs"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {idx + 1}
          </button>
        ))}

        {/* Tombol Selanjutnya */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
        >
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};