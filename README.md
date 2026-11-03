# My Prayer Journal — Jurnal Sholat Digital

Aplikasi pencatatan ibadah berbasis HTML, CSS, dan Vanilla JavaScript.

## Menjalankan
1. Ekstrak folder `my-prayer-journal`.
2. Buka `index.html` menggunakan browser modern.
3. Data akan tersimpan di LocalStorage browser yang digunakan.

## Fitur
- Dashboard dan grafik perkembangan 7 hari.
- Jurnal lima sholat wajib dan empat sholat sunnah.
- Kalender bulanan dengan penanda tanggal yang memiliki jurnal.
- Statistik 7, 30, dan 90 hari.
- Catatan refleksi (tambah, edit, hapus).
- Target ibadah harian.
- Pengingat manual dengan Notification API.
- Rekap laporan dan cetak.
- Backup JSON: ekspor dan impor tersedia pada halaman Rekap Laporan. Impor akan mengganti data lokal saat ini setelah file JSON valid dipilih.

## Catatan teknis
- Chart.js dan Google Fonts dimuat dari CDN sehingga memerlukan internet untuk tampilan grafik dan font eksternal. Fitur pencatatan inti tetap berjalan lokal.
- Notification API memerlukan izin pengguna dan umumnya hanya berjalan saat halaman masih terbuka. Browser dapat menerapkan batasan tambahan.
- Jadwal pengingat adalah contoh waktu manual; sesuaikan dengan lokasi dan jadwal resmi setempat.
- Data LocalStorage hanya tersedia pada browser dan profil yang sama. Hapus data situs/browser dapat menghapus jurnal.
- Ayat yang ditampilkan: QS. Al-'Ankabut [29]:45. Periksa mushaf terverifikasi untuk kebutuhan tilawah dan publikasi.
