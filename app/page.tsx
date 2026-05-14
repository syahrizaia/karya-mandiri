"use client";

import Link from "next/link";
import { FiLayers } from "react-icons/fi";
import { MdWork } from "react-icons/md";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const text = "Selamat Datang di\nKaryaMandiri!";
  const letters = Array.from(text);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.04 * i 
      },
    }),
  };

  const childVariants: Variants = {
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
    <div className="flex flex-col min-h-screen items-center justify-center bg-linear-to-r from-blue-600 to-indigo-700 font-sans p-4 relative overflow-hidden">
      {/* Container Utama: Ukuran lebar dinamis sesuai layar */}
      <main className="z-10 flex w-full max-w-3xl flex-col items-center justify-between text-center py-12 px-6 md:py-24 md:px-16 bg-white rounded-3xl shadow-2xl">
        
        <div className="flex flex-col items-center justify-center gap-4 md:gap-5">
          {/* Logo Box: Ukuran lebih kecil di HP */}
          <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl md:text-6xl shadow-lg">
            K
          </div>

          {/* Heading: Ukuran teks adaptif (text-4xl di HP, text-6xl di Desktop) */}
          <motion.h1 
            className="text-4xl md:text-6xl font-black text-center text-slate-900 leading-tight whitespace-pre-line"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                variants={childVariants}
                className="inline-block"
              >
                {letter === "\n" ? <br /> : letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        <p className="text-base md:text-xl text-slate-600 text-center mt-6 max-w-md">
          Temukan Pekerjaan yang Sesuai dengan Kebutuhanmu
        </p>

        {/* Grid Tombol: 1 kolom di HP, 2 kolom di Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 mt-10 w-full max-w-sm sm:max-w-none">
          <Link href="/employer" className="px-6 py-4 rounded-2xl text-lg text-center font-bold bg-indigo-600 text-white transition-all hover:bg-white hover:text-indigo-600 border-2 border-transparent hover:border-indigo-600 shadow-md">
            Pemberi Kerja
          </Link>

          <Link href="/worker" className="px-6 py-4 rounded-2xl text-lg text-center font-bold bg-indigo-600 text-white transition-all hover:bg-white hover:text-indigo-600 border-2 border-transparent hover:border-indigo-600 shadow-md">
            Pekerja
          </Link>
        </div>
      </main>

      {/* Dekorasi Icon: Ukuran mengecil di HP dan posisi lebih aman agar tidak menutupi teks */}
      <FiLayers className="absolute left-40 top-5 md:left-5 md:top-20 text-white/10 w-40 h-40 md:w-80 md:h-80 animate-pulse pointer-events-none" />
      <MdWork className="absolute right-40 bottom-5 md:right-5 md:bottom-20 text-white/10 w-40 h-40 md:w-80 md:h-80 animate-pulse pointer-events-none" />
    </div>
  );
}

// "use client";

// import Link from "next/link";
// import { FiLayers } from "react-icons/fi";
// import { MdWork } from "react-icons/md";
// import { motion, Variants } from "framer-motion";

// export default function Home() {
//   const text = "Selamat Datang di\nKaryaMandiri!";

//   // Mengubah kalimat menjadi array karakter agar bisa dianimasikan satu per satu
//   const letters = Array.from(text);

//   const containerVariants: Variants = {
//     hidden: { opacity: 0 },
//     visible: (i: number = 1) => ({
//       opacity: 1,
//       transition: { 
//         staggerChildren: 0.15, // Jeda antar huruf (semakin besar semakin lambat)
//         delayChildren: 0.04 * i 
//       },
//     }),
//   };

//   const childVariants: Variants = {
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         damping: 12,
//         stiffness: 100,
//       },
//     },
//     hidden: {
//       opacity: 0,
//       y: 20,
//     },
//   };

//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 font-sans">
//       <main className="flex w-full max-w-3xl flex-col items-center justify-between text-center py-24 px-16 bg-white rounded-2xl">
//         <div className="flex flex-col items-center justify-center gap-5">
//           <div className="w-25 h-25 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-7xl">
//             K
//           </div>
//           {/* <h1 className="text-7xl font-bold text-center text-gray-800">
//             Selamat Datang di KaryaMandiri!
//           </h1> */}
//           <motion.h1 
//             className="text-6xl font-bold text-center text-slate-900 leading-tight whitespace-pre-line"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             {letters.map((letter, index) => (
//               <motion.span
//                 key={index}
//                 variants={childVariants}
//                 className="inline"
//               >
//                 {letter === "\n" ? <br /> : letter === " " ? "\u00A0" : letter}
//               </motion.span>
//             ))}
//           </motion.h1>
//         </div>

//         <p className="text-lg text-slate-600 text-center mt-5">Temukan Pekerjaan yang Sesuai dengan Kebutuhanmu</p>

//         <div className="grid grid-cols-2 items-center gap-5 mt-10 w-full">
//           <Link href="/employer" className="px-4 py-2 rounded-xl text-lg text-center font-medium bg-indigo-500 text-white transition delay-150 hover:bg-white hover:text-indigo-500 hover:border">
//             Pemberi Kerja
//           </Link>

//           <Link href="/worker" className="px-4 py-2 rounded-xl text-lg text-center font-medium bg-indigo-500 text-white transition delay-150 hover:bg-white hover:text-indigo-500 hover:border">
//             Pekerja
//           </Link>
//         </div>
//       </main>
//       <FiLayers className="absolute left-40 top-5 text-white/25 w-60 h-60 animate-pulse" />
//       <MdWork className="absolute right-40 bottom-5 text-white/25 w-60 h-60 animate-pulse" />
//     </div>
//   );
// }
