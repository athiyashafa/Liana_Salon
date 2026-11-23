# Liana Salon

Aplikasi kasir dan pencatatan layanan salon berbasis web. Dipakai untuk mencatat layanan dan pembayaran pelanggan, mengelola data layanan dan pelanggan, serta melihat riwayat transaksi dan laporan.

## 1. Gambaran Umum

Aplikasi memiliki tiga jenis pengguna.

| Peran | Deskripsi dan Hak Akses |
|---|---|
| **Pemilik** | Akses penuh: kasir, layanan, pelanggan, laporan, mengelola akun pengguna, dan menghapus riwayat transaksi. |
| **Kasir** | Melayani pelanggan, menambah dan mengubah layanan serta data pelanggan, memproses pembayaran, dan melihat laporan. |
| **Pegawai / Staf** | Mencatat layanan dan pembayaran pelanggan, menambah dan mengubah layanan serta data pelanggan, dan melihat laporan. |

**Platform:** aplikasi web yang dapat diakses melalui komputer, laptop, maupun smartphone menggunakan browser modern.

## 2. Fitur Utama

- **Autentikasi:** login dengan email dan kata sandi, pendaftaran akun dengan kode verifikasi, atur ulang kata sandi, dan logout.
- **Dashboard:** ringkasan aktivitas dan pendapatan salon.
- **Kasir:** membuat transaksi dari daftar layanan dan memproses pembayaran.
- **Catat Layanan:** mencatat layanan yang diberikan kepada pelanggan.
- **Pengelolaan Layanan:** menambah, mengubah, menonaktifkan, dan menghapus layanan beserta harga, kategori, dan durasi.
- **Pengelolaan Pelanggan:** menyimpan dan mengubah data pelanggan.
- **Riwayat Transaksi:** melihat, mencari, memfilter, dan membuka detail transaksi.
- **Laporan:** ringkasan transaksi berdasarkan periode.
- **Manajemen Akun:** Pemilik mengundang pengguna baru, mengatur peran, dan menonaktifkan akun.
- **Profil Salon:** halaman profil, daftar harga layanan, ulasan, lokasi, dan kontak.

## 3. Teknologi

| Bagian | Teknologi |
|---|---|
| Tampilan | React, Vite, Tailwind CSS |
| API | PHP |
| Database | MySQL / MariaDB (XAMPP, phpMyAdmin) |

## 4. Cara Penggunaan Aplikasi

### A. Pemilik

1. **Login:** masuk dengan akun Pemilik.
2. **Dashboard:** lihat ringkasan aktivitas dan pendapatan.
3. **Mengelola layanan:** buka halaman Layanan untuk menambah atau mengubah layanan dan harganya.
4. **Mengelola pelanggan:** buka halaman Pelanggan untuk menyimpan data pelanggan.
5. **Transaksi:** buat transaksi di Kasir, lalu lihat dan cari riwayatnya di halaman Transaksi. Hanya Pemilik yang dapat menghapus riwayat transaksi.
6. **Laporan:** lihat laporan berdasarkan periode.
7. **Mengelola akun:** buka halaman Pengguna untuk mengundang akun baru, mengatur peran, dan menonaktifkan akun.
8. **Logout** setelah selesai.

### B. Kasir dan Pegawai

1. Login memakai akun masing-masing.
2. Buka halaman Kasir atau Catat Layanan, lalu pilih layanan dan pelanggan.
3. Proses pembayaran, lalu cek hasilnya di halaman Transaksi.
4. Logout setelah selesai.

## 5. Alur Penggunaan Singkat

```
                +--------------------------+
                |          Login           |
                +--------------------------+
                             |
                             v
                +--------------------------+
                |  Dashboard sesuai Peran  |
                +--------------------------+
                      /              \
                     v                v
+--------------------------+   +--------------------------+
|         Pemilik          |   |     Kasir / Pegawai      |
|                          |   |                          |
| - Dashboard              |   | - Kasir & Catat Layanan  |
| - Kasir & Catat Layanan  |   | - Layanan                |
| - Layanan                |   | - Pelanggan              |
| - Pelanggan              |   | - Laporan                |
| - Transaksi              |   |                          |
| - Laporan                |   |                          |
| - Kelola akun            |   |                          |
+--------------------------+   +--------------------------+
                      \              /
                     v                v
                +--------------------------+
                |          Logout          |
                +--------------------------+
```

## 6. Anggota Kelompok

Kelas R7Q

1. Nabila Anwar (202343501376)
2. Alya Hartika (202343501383)
3. Athiya Shafa Habibah (202343501385)

## 7. Catatan

- Fitur yang dapat digunakan setiap pengguna mengikuti peran dan hak akses masing-masing.
- Hanya Pemilik yang dapat mengelola akun dan menghapus riwayat transaksi.
- Laporan mencerminkan transaksi yang telah dicatat di dalam sistem.
- Data disimpan di database MySQL pada komputer masing-masing, sehingga tidak ikut terunggah ke GitHub.
- Masuk dengan Google tidak tersedia pada versi lokal. Kode verifikasi pendaftaran dan tautan atur ulang kata sandi ditampilkan di layar karena tidak ada pengiriman email.

---

**Liana Salon** --- Aplikasi Web Kasir dan Pencatatan Layanan Salon.
