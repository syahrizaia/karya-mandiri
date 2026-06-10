/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { text, type, skills, title, category } = await req.json();

    if (!text || !type) {
      return NextResponse.json(
        { error: "Teks dan tipe AI wajib diisi" },
        { status: 400 }
      );
    }

    // Pastikan API Key sudah terisi
    if (!process.env.GEMINI_API_KEY) {
      console.error("ERROR: GEMINI_API_KEY belum dikonfigurasi di .env.local");
      return NextResponse.json(
        { error: "Konfigurasi server belum lengkap (API Key kosong)" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    let systemPrompt = "";

    if (type === "brief") {
      systemPrompt = `
        Anda adalah seorang Professional Project Manager di platform KaryaMandiri. 
        Tugas Anda adalah merapikan, memperjelas, dan mempercantik draf deskripsi proyek (project brief) yang ditulis oleh klien berikut agar terlihat profesional, menarik bagi freelancer berbakat, dan terstruktur.
        
        Aturan output:
        1. Gunakan Bahasa Indonesia yang formal namun ramah.
        2. Buat struktur yang rapi menggunakan markdown (Gunakan poin-poin/bullet points jika diperlukan, tapi DILARANG menggunakan tanda pagar #, bintang *, atau **).
        3. Tambahkan bagian: 'Deskripsi Proyek', 'Ruang Lingkup Pekerjaan (Scope of Work)', dan 'Kualifikasi yang Dicari' jika draf mendukung.
        4. Jangan berikan teks pembuka seperti "Tentu, ini hasilnya:". Langsung berikan hasil perbaikannya saja.
      `;
    } else if (type === "profile") {
        const skillsContext = skills && skills.length > 0 
            ? `Gunakan dan integrasikan keahlian berikut secara natural ke dalam narasi profil: ${skills.join(", ")}.`
            : "Fokus pada draf yang diberikan oleh user.";

      systemPrompt = `
        Anda adalah seorang Ahli Personal Branding dan HR Specialist di platform KaryaMandiri.
        Tugas Anda adalah menulis ulang deskripsi profil atau portofolio seorang freelancer berikut agar terlihat jauh lebih menjual, profesional, percaya diri, dan memikat calon klien.

        Draf dari user: "${text}"
        ${skillsContext}
        
        Aturan output:
        1. Gunakan Bahasa Indonesia yang profesional dan persuasif.
        2. Soroti keahlian utama, pengalaman, dan nilai jual (value proposition) mereka dengan kalimat yang mengalir dan enak dibaca.
        3. Jaga agar panjang teks tetap ringkas (maksimal 2-3 paragraf pendek) atau gunakan format ringkasan yang rapi.
        4. Jangan berikan teks pembuka apa pun. Langsung berikan hasil teks profilnya saja.
      `;
    } else if (type === "service") {
        systemPrompt = `
            Anda adalah konsultan bisnis & copywriter expert untuk platform crowdsourcing KaryaMandiri.
            Tugas Anda adalah memoles deskripsi penawaran jasa dari user agar terstruktur dengan rapi dan persuasif bagi calon klien.

            Judul Jasa: "${title}"
            Kategori Jasa: "${category}"
            Draf Deskripsi Awal: "${text}"

            Struktur Output yang Harus Anda Hasilkan:
            1. Paragraf pembuka yang menarik (mengapa jasa ini adalah solusi terbaik).
            2. Bagian "APA YANG AKAN ANDA DAPATKAN (APA SAJA YANG TERMASUK):" diikuti poin strip (-).
            3. Bagian "ALUR & KETENTUAN KERJA (TERMASUK BATAS REVISI):" diikuti poin strip (-).
            4. Jangan berikan teks pembuka apa pun, seperti "Tentu, ini hasilnya:". Langsung berikan hasil teks deskripsinya saja.

            Aturan Ketat: JANGAN gunakan markdown asteris (**), gunakan HURUF KAPITAL untuk subjudul demi kerapian layout. JANGAN mengada-ada perangkat teknis jika tidak tercantum di draf asal.
        `;
    } else {
      return NextResponse.json({ error: "Tipe AI tidak valid" }, { status: 400 });
    }

    // Jalankan ke Gemini AI
    const result = await model.generateContent([systemPrompt, text]);
    const responseText = result.response.text();

    return NextResponse.json({ success: true, enhancedText: responseText });
  } catch (error: any) {
    // Ini akan memunculkan detail error asli di terminal VS Code / Server Anda
    console.error("Detail Error di Terminal Server:", error); 
    return NextResponse.json(
      { error: error.message || "Gagal memproses teks dengan AI" },
      { status: 500 }
    );
  }
}