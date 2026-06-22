import supabase from "@/lib/db";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { FiBriefcase, FiTrendingUp, FiUsers, FiZap } from "react-icons/fi";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LiveImpactStatistics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    workers: "0+",
    tasks: "0",
    totalPaid: "Rp0",
    accuracy: "100%"
  });

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        setLoading(true);

        // Catatan: Jika ada kolom 'role', Abang bisa tambahkan .eq('role', 'worker')
        const { count: workerCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        const { count: taskCount } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .eq("status", "completed");

        const { data: transData } = await supabase
          .from("transactions")
          .select("amount")
          .eq("status", "success");
        
        const totalSum = transData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

        const { data: reviewData } = await supabase
          .from("reviews")
          .select("rating");

        let accuracyPercentage = 99.4; // Fallback standar bawaan jika ulasan masih kosong
        if (reviewData && reviewData.length > 0) {
          const totalRating = reviewData.reduce((acc, curr) => acc + curr.rating, 0);
          const avgRating = totalRating / reviewData.length;
          // Mengonversi skala rating 5 ke dalam persentase (misal rata-rata 4.9/5 = 98%)
          accuracyPercentage = (avgRating / 5) * 100;
        }

        // Helper fungsi untuk memformat singkatan angka ala Indonesia (Ribu / Juta / Miliar)
        const formatIndonesianNumber = (num: number, isCurrency = false) => {
          if (num >= 1000000000) {
            return `${isCurrency ? "Rp" : ""}${(num / 1000000000).toFixed(1)} Miliar+`;
          }
          if (num >= 1000000) {
            return `${isCurrency ? "" : ""}${(num / 1000000).toFixed(1)} Juta+`;
          }
          if (num >= 1000) {
            return `${(num / 1000).toFixed(0)} Ribu+`;
          }
          return num.toString();
        };

        setStats({
          workers: workerCount ? workerCount.toLocaleString("id-ID") + "+" : "0+",
          tasks: taskCount ? formatIndonesianNumber(taskCount) : "0",
          totalPaid: totalSum ? formatIndonesianNumber(totalSum, true) : "Rp0",
          accuracy: `${accuracyPercentage.toFixed(1)}%`
        });

      } catch (error) {
        console.error("Gagal mengambil data statistik live Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStats();
  }, []);

  // Menyiapkan array data untuk mapping UI layout
  const statItems = [
    { icon: <FiUsers className="text-blue-500 mx-auto" size={22} />, value: stats.workers, label: "Worker Aktif" },
    { icon: <FiBriefcase className="text-purple-500 mx-auto" size={22} />, value: stats.tasks, label: "Tugas Selesai" },
    { icon: <FiZap className="text-yellow-500 mx-auto" size={22} />, value: stats.totalPaid, label: "Total Terbayar" },
    { icon: <FiTrendingUp className="text-emerald-500 mx-auto" size={22} />, value: stats.accuracy, label: "Akurasi Kerja (QA)" }
  ];

  return (
    <section className="py-12 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {statItems.map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="space-y-1.5">
                {stat.icon}
                <h3 className={`text-xl md:text-3xl font-black text-white transition-opacity ${loading ? 'opacity-40 animate-pulse' : 'opacity-100'}`}>
                  {stat.value}
                </h3>
                <p className="text-[11px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
  );
}