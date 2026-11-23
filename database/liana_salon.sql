-- ============================================================
-- LIANA SALON - Skema Database MySQL / MariaDB (XAMPP)
-- Cara pakai: buka http://localhost/phpmyadmin -> tab Import
-- -> pilih berkas ini -> Import.
-- (API juga membuat database ini otomatis saat pertama dipanggil.)
-- ============================================================

CREATE DATABASE IF NOT EXISTS liana_salon
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE liana_salon;

CREATE TABLE IF NOT EXISTS pengguna (
  id CHAR(36) NOT NULL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  kata_sandi VARCHAR(255) NOT NULL,
  role ENUM('admin','user') NOT NULL DEFAULT 'user',
  jabatan ENUM('pemilik','admin_kasir','pegawai') NOT NULL DEFAULT 'pegawai',
  aktif TINYINT(1) NOT NULL DEFAULT 1,
  reset_token VARCHAR(120) NULL,
  reset_expired DATETIME NULL,
  created_by_id CHAR(36) NULL,
  created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pendaftaran_tertunda (
  email VARCHAR(160) NOT NULL PRIMARY KEY,
  kode VARCHAR(6) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  kata_sandi VARCHAR(255) NOT NULL,
  dibuat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pelanggan (
  id CHAR(36) NOT NULL PRIMARY KEY,
  nama VARCHAR(120) NOT NULL,
  telepon VARCHAR(40) NULL,
  email VARCHAR(160) NULL,
  alamat TEXT NULL,
  tanggal_lahir DATE NULL,
  catatan TEXT NULL,
  created_by_id CHAR(36) NULL,
  created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_pelanggan_nama (nama),
  INDEX idx_pelanggan_telepon (telepon)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS layanan (
  id CHAR(36) NOT NULL PRIMARY KEY,
  nama VARCHAR(140) NOT NULL,
  kategori VARCHAR(80) NULL,
  harga DECIMAL(14,2) NOT NULL DEFAULT 0,
  durasi_menit INT NOT NULL DEFAULT 60,
  deskripsi TEXT NULL,
  aktif TINYINT(1) NOT NULL DEFAULT 1,
  created_by_id CHAR(36) NULL,
  created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_layanan_nama (nama),
  INDEX idx_layanan_kategori (kategori)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS transaksi (
  id CHAR(36) NOT NULL PRIMARY KEY,
  nomor_nota VARCHAR(40) NOT NULL,
  tanggal DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pelanggan_id CHAR(36) NULL,
  pelanggan_nama VARCHAR(120) NULL,
  items LONGTEXT NULL,
  subtotal DECIMAL(14,2) NOT NULL DEFAULT 0,
  diskon DECIMAL(14,2) NOT NULL DEFAULT 0,
  total DECIMAL(14,2) NOT NULL DEFAULT 0,
  status VARCHAR(40) NOT NULL DEFAULT 'menunggu_pembayaran',
  metode_pembayaran VARCHAR(40) NULL,
  bank VARCHAR(60) NULL,
  jumlah_bayar DECIMAL(14,2) NOT NULL DEFAULT 0,
  kembalian DECIMAL(14,2) NOT NULL DEFAULT 0,
  kasir_nama VARCHAR(120) NULL,
  pegawai_nama VARCHAR(120) NULL,
  catatan TEXT NULL,
  created_by_id CHAR(36) NULL,
  created_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_transaksi_tanggal (tanggal),
  INDEX idx_transaksi_status (status),
  INDEX idx_transaksi_nota (nomor_nota)
) ENGINE=InnoDB;

-- Waktu disimpan dalam UTC; aplikasi menampilkannya sesuai zona waktu browser.

INSERT INTO layanan (id, nama, kategori, harga, durasi_menit, deskripsi, aktif) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Potong Rambut Wanita', 'Potong Rambut', 75000, 45, 'Potong rambut dengan konsultasi gaya.', 1),
  ('11111111-1111-1111-1111-111111111102', 'Potong Rambut Pria', 'Potong Rambut', 50000, 30, 'Potong rapi plus cukur samping.', 1),
  ('11111111-1111-1111-1111-111111111103', 'Cuci & Blow Dry', 'Perawatan Rambut', 65000, 40, 'Cuci rambut, masker ringan, blow dry.', 1),
  ('11111111-1111-1111-1111-111111111104', 'Creambath', 'Perawatan Rambut', 95000, 60, 'Perawatan rambut dengan krim nutrisi.', 1),
  ('11111111-1111-1111-1111-111111111105', 'Hair Mask Premium', 'Perawatan Rambut', 150000, 60, 'Masker rambut premium untuk rambut rusak.', 1),
  ('11111111-1111-1111-1111-111111111106', 'Pewarnaan Rambut', 'Pewarnaan', 350000, 120, 'Cat rambut full warna.', 1),
  ('11111111-1111-1111-1111-111111111107', 'Smoothing', 'Pewarnaan', 450000, 150, 'Pelurusan rambut tahan lama.', 1),
  ('11111111-1111-1111-1111-111111111108', 'Make Up Wisuda', 'Rias', 300000, 90, 'Rias natural untuk acara wisuda.', 1),
  ('11111111-1111-1111-1111-111111111109', 'Make Up Pesta', 'Rias', 400000, 90, 'Rias pesta dengan bulu mata.', 1),
  ('11111111-1111-1111-1111-111111111110', 'Manicure', 'Kuku', 60000, 40, 'Perawatan kuku tangan.', 1),
  ('11111111-1111-1111-1111-111111111111', 'Pedicure', 'Kuku', 75000, 45, 'Perawatan kuku kaki.', 1),
  ('11111111-1111-1111-1111-111111111112', 'Facial Brightening', 'Perawatan Wajah', 180000, 60, 'Facial mencerahkan kulit.', 1)
ON DUPLICATE KEY UPDATE nama = VALUES(nama);

-- Akun awal, kata sandi semuanya: 12345
INSERT IGNORE INTO pengguna (id, full_name, email, kata_sandi, role, jabatan, aktif) VALUES
  ('22222222-2222-2222-2222-222222222201', 'Pemilik Liana Salon', 'pemilik@gmail.com', '$2y$12$79hezVWg0OLxt.gATPW3EuyBSCSwLclbsicIXiCgbyjcRnAlShEsu', 'admin', 'pemilik', 1),
  ('22222222-2222-2222-2222-222222222202', 'Kasir Liana Salon', 'kasir@gmail.com', '$2y$12$79hezVWg0OLxt.gATPW3EuyBSCSwLclbsicIXiCgbyjcRnAlShEsu', 'user', 'admin_kasir', 1),
  ('22222222-2222-2222-2222-222222222203', 'Pegawai Liana Salon', 'pegawai@gmail.com', '$2y$12$79hezVWg0OLxt.gATPW3EuyBSCSwLclbsicIXiCgbyjcRnAlShEsu', 'user', 'pegawai', 1);
