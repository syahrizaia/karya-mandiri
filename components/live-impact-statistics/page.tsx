import { motion, Variants } from "framer-motion";
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
            {[
              { icon: <FiUsers className="text-blue-500 mx-auto" size={22} />, value: "50,000+", label: "Worker Aktif" },
              { icon: <FiBriefcase className="text-purple-500 mx-auto" size={22} />, value: "1.2 Juta+", label: "Tugas Selesai" },
              { icon: <FiZap className="text-yellow-500 mx-auto" size={22} />, value: "Rp4.5 Miliar+", label: "Total Terbayar" },
              { icon: <FiTrendingUp className="text-emerald-500 mx-auto" size={22} />, value: "99.4%", label: "Akurasi Kerja (QA)" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="space-y-1.5">
                {stat.icon}
                <h3 className="text-xl md:text-3xl font-black text-white">{stat.value}</h3>
                <p className="text-[11px] md:text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
  );
}