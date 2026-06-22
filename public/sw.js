const CACHE_NAME = 'karyamandiri-cache-v1';

// Daftar aset statis dasar untuk di-cache awal
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon.png'
];

// 1. Fase Install: Menyimpan aset statis inti
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Fase Aktivasi: Membersihkan cache versi lama jika ada pembaruan
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Menghapus cache usang:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fase Fetch: Strategi Network-First dengan Fallback Cache (Sangat cocok untuk web dinamis Supabase)
self.addEventListener('fetch', (event) => {
  // Hanya tangani request HTTP/HTTPS (abaikan ekstensi chrome atau skema internal)
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Jika respons sukses, klon dan simpan ke cache untuk backup offline
        if (event.request.method === 'GET' && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Jika jaringan mati/gagal, ambil dari cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Jika tidak ada di cache sama sekali (misal halaman baru), return respons kosong
          return new Response('Koneksi internet terputus.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
          });
        });
      })
  );
});

// MENDENGARKAN EVENT PUSH DARI HP
self.addEventListener('push', (event) => {
  let data = { title: 'KaryaMandiri', body: 'Ada info terbaru untuk Anda!' };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'KaryaMandiri', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: '/icon.png',      // Ikon besar di kanan notifikasi
    badge: '/icon.png',     // Ikon kecil di status bar HP
    vibrate: [100, 50, 100], // Pola getar HP
    data: {
      url: data.url || '/'  // URL tujuan saat diklik
    },
    actions: [
      { action: 'open', title: 'Buka Aplikasi' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// MENANGANI KLIK PADA NOTIFIKASI HP
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Tutup pop-up notifikasi

  // Buka aplikasi dan arahkan ke URL tertentu (misal: halaman lowongan/profil)
  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Jika aplikasi sudah terbuka, fokuskan saja
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika belum terbuka, buka tab/jendela baru
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});