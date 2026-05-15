import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Tambahkan pengecekan ini
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Peringatan: Supabase URL atau Anon Key tidak ditemukan!")
}

const supabase = createClient(
  supabaseUrl || '', // Fallback ke string kosong agar tidak error tipe
  supabaseAnonKey || ''
)

export default supabase;