# Liana Salon (API PHP + database MySQL lokal)

Aplikasi kasir dan layanan salon. Data disimpan di database MySQL pada XAMPP
(bisa dilihat dan diubah lewat phpMyAdmin). Tidak ada ketergantungan ke layanan luar.

## Isi folder

| Folder / berkas | Fungsi |
|---|---|
| `src/` | Kode tampilan aplikasi (React) |
| `api/` | API PHP yang menghubungkan aplikasi ke MySQL |
| `database/liana_salon.sql` | Struktur tabel dan data awal untuk phpMyAdmin |
| `pasang-ke-xampp.bat` | Membangun aplikasi dan menyalinnya ke XAMPP |

## Langkah pemasangan (sekali saja)

1. Pasang **XAMPP** dan **Node.js** (LTS) kalau belum ada.
2. Buka XAMPP Control Panel, klik **Start** pada **Apache** dan **MySQL**.
3. Klik dua kali **`pasang-ke-xampp.bat`**. Skrip ini menjalankan `npm install`,
   `npm run build`, lalu menyalin `api/` dan `index.html` ke `C:\xampp\htdocs\liana-salon\`.
4. Buka **https://localhost/liana-salon/** (atau http://localhost/liana-salon/).
   Pada https, browser memperingatkan sertifikat XAMPP yang ditandatangani sendiri:
   pilih Advanced lalu Continue/Proceed. Peringatan itu normal untuk localhost.

Berkas `dist/index.html` hasil build juga bisa dibuka langsung dengan klik dua kali.
Aplikasi yang dibuka dari berkas akan tetap memakai database MySQL di komputer yang sama,
jadi Apache dan MySQL tetap harus menyala.

## Database

- Nama database: `liana_salon` (pengguna `root`, tanpa kata sandi, bawaan XAMPP).
- **Dibuat otomatis**: saat API pertama kali dipanggil, database dan semua tabel
  dibuat sendiri. Cek di http://localhost/liana-salon/api/index.php (harus tampil `ok: true`).
- **Atau impor manual**: buka http://localhost/phpmyadmin, tab **Import**, pilih
  `database/liana_salon.sql`, klik **Import**.
- Tabel: `pengguna`, `pelanggan`, `layanan`, `transaksi`, `pendaftaran_tertunda`.
- Jika kata sandi MySQL Anda bukan kosong, ubah `api/config.php` (di
  `C:\xampp\htdocs\liana-salon\api\config.php`).

## Akun awal (kata sandi semuanya 12345)

| Portal | Email |
|---|---|
| Pemilik | pemilik@gmail.com |
| Kasir | kasir@gmail.com |
| Pegawai | pegawai@gmail.com |

Akun baru dibuat lewat halaman Daftar (kode verifikasi muncul di kotak pesan layar,
tidak ada email sungguhan) atau lewat menu Pengguna oleh Pemilik (kata sandi awal 12345).

## Mode pengembangan

`npm install`, lalu `npm run dev`, buka http://localhost:5173. Tampilan memanggil API
di http://localhost/liana-salon/api, jadi folder `api` tetap harus sudah dipasang di XAMPP.

## Masalah umum

- **"Tidak dapat terhubung ke server"**: Apache belum Start, atau folder `api` belum ada di
  `htdocs\liana-salon\api`.
- **"Tidak dapat terhubung ke MySQL"**: MySQL belum Start di XAMPP.
- **Port 80/443 bentrok** (Skype, IIS): ubah port Apache di XAMPP, lalu pakai
  alamat dengan port tersebut, misalnya http://localhost:8080/liana-salon/.
  Kalau halaman dibuka dari berkas, ubah alamat API saat build:
  `set VITE_API_URL=http://localhost:8080/liana-salon/api` lalu `npm run build`.
