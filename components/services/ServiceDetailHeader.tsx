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
    <div className="sticky top-2 z-30 px-4 max-w-5xl mx-auto mb-6">
      <div className="glass-capsule px-6 py-3 flex justify-between items-center shadow-lg">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition text-sm cursor-pointer"
        >
          <FiChevronLeft size={18} /> Kembali ke Katalog
        </button>

        <ShareServiceButton serviceId={serviceId} serviceTitle={serviceTitle} />
      </div>
    </div>
  );
};