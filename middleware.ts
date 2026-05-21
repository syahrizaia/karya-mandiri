import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Inisialisasi Supabase Client khusus untuk lingkungan Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(({ name, value }) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set({ name, value, ...options }));
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set({ name, value, ...options }));
        },
      },
    }
  );

  // Ambil data sesi user yang sedang aktif
  const { data: { user } } = await supabase.auth.getUser();

  // LOGIKA PROTEKSI RUTE
  const protectedRoutes = ['/employer', '/worker', '/history', '/notification', '/settings'];

  // Periksa apakah URL saat ini diawali oleh salah satu rute di atas
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // 3. LOGIKA PROTEKSI RUTE
  // Jika user mencoba mengakses rute /employer tetapi BELUM LOGIN (user null)
  if (isProtectedRoute && !user) {
    // Alihkan (redirect) paksa ke halaman login
    const url = request.nextUrl.clone();
    url.pathname = '/login'; // Ganti dengan rute halaman login Anda
    
    // Opsional: Simpan rute asal agar setelah login bisa langsung diarahkan kembali ke /employer
    url.searchParams.set('next', request.nextUrl.pathname); 
    
    return NextResponse.redirect(url);
  }

  return response;
}

// KONFIGURASI MATCHER (SANGAT KRUSIAL)
// Tentukan rute mana saja yang akan memicu jalannya middleware ini
export const config = {
  matcher: [
    /*
     * Cocokkan semua rute request KECUALI:
     * - _next/static (file statis)
     * - _next/image (optimasi gambar)
     * - favicon.ico (ikon browser)
     * - file dengan ekstensi (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};