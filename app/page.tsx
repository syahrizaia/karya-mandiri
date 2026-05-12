"use client";

import Link from "next/link";
import { FiLayers } from "react-icons/fi";
import { MdWork } from "react-icons/md";
import { motion } from "framer-motion";

export default function Home() {
  const text = "Selamat Datang di\nKaryaMandiri!";

  // Mengubah kalimat menjadi array karakter agar bisa dianimasikan satu per satu
  const letters = Array.from(text);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.15, // Jeda antar huruf (semakin besar semakin lambat)
        delayChildren: 0.04 * i 
      },
    }),
  };

  const childVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 font-sans">
      <main className="flex w-full max-w-3xl flex-col items-center justify-between text-center py-24 px-16 bg-white rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="w-25 h-25 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-7xl">
            K
          </div>
          {/* <h1 className="text-7xl font-bold text-center text-gray-800">
            Selamat Datang di KaryaMandiri!
          </h1> */}
          <motion.h1 
            className="text-6xl font-bold text-center text-slate-900 leading-tight whitespace-pre-line"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                variants={childVariants}
                className="inline"
              >
                {letter === "\n" ? <br /> : letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        <p className="text-lg text-slate-600 text-center mt-5">Temukan Pekerjaan yang Sesuai dengan Kebutuhanmu</p>

        <div className="grid grid-cols-2 items-center gap-5 mt-10 w-full">
          <Link href="/employer" className="px-4 py-2 rounded-xl text-lg text-center font-medium bg-indigo-500 text-white transition delay-150 hover:bg-white hover:text-indigo-500 hover:border">
            Pemberi Kerja
          </Link>

          <Link href="/worker" className="px-4 py-2 rounded-xl text-lg text-center font-medium bg-indigo-500 text-white transition delay-150 hover:bg-white hover:text-indigo-500 hover:border">
            Pekerja
          </Link>
        </div>
      </main>
      <FiLayers className="absolute left-40 top-5 text-white/25 w-60 h-60 animate-pulse" />
      <MdWork className="absolute right-40 bottom-5 text-white/25 w-60 h-60 animate-pulse" />
    </div>
  );
}
