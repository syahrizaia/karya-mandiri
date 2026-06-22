import React from "react";
import { FiChevronLeft } from "react-icons/fi";
import ShareServiceButton from "@/components/services/share-service-button/page";

interface ServiceDetailHeaderProps {
  serviceId: string;
  serviceTitle: string;
  onBack: () => void;
}

export const ServiceDetailHeader: React.FC<ServiceDetailHeaderProps> = ({
  serviceId,
  serviceTitle,
  onBack,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 py-2 transition-colors">
      <div className="max-w-5xl mx-auto px-6 py-2 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 pl-4 md:pl-0 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition text-sm cursor-pointer"
        >
          <FiChevronLeft /> Kembali ke Katalog
        </button>

        <ShareServiceButton serviceId={serviceId} serviceTitle={serviceTitle} />
      </div>
    </div>
  );
};