export const PERAN = {
  pemilik: {
    label: 'Pemilik Salon',
    singkat: 'Pemilik',
    deskripsi:
      'Akses penuh: kasir, layanan, pelanggan, laporan, kelola akun, serta menghapus riwayat transaksi.',
  },
  admin_kasir: {
    label: 'Kasir',
    singkat: 'Kasir',
    deskripsi:
      'Melayani pelanggan, menambah & mengubah layanan dan data pelanggan, memproses pembayaran, serta melihat laporan.',
  },
  pegawai: {
    label: 'Pegawai / Staf',
    singkat: 'Pegawai',
    deskripsi:
      'Mencatat layanan & pembayaran pelanggan, menambah dan mengubah layanan serta data pelanggan, dan melihat laporan.',
  },
};

export const HAK = {
  pemilik: {
    kasir: true,
    catatLayanan: true,
    kelolaPelanggan: true,
    kelolaLayanan: true,
    kelolaPengguna: true,
    laporan: true,
    ubahStatus: true,
    hapusTransaksi: true,
  },
  admin_kasir: {
    kasir: true,
    catatLayanan: true,
    kelolaPelanggan: true,
    kelolaLayanan: true,
    kelolaPengguna: false,
    laporan: true,
    ubahStatus: true,
    hapusTransaksi: false,
  },
  pegawai: {
    kasir: true,
    catatLayanan: true,
    kelolaPelanggan: true,
    kelolaLayanan: true,
    kelolaPengguna: false,
    laporan: true,
    ubahStatus: true,
    hapusTransaksi: false,
  },
};

export const resolvePeran = (user) => {
  if (!user) return 'pegawai';
  if (user.jabatan && PERAN[user.jabatan]) return user.jabatan;
  return user.role === 'admin' ? 'pemilik' : 'pegawai';
};

export const bisa = (peran, hak) => !!HAK[peran]?.[hak];