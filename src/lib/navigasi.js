const SEMUA = ['pemilik', 'admin_kasir', 'pegawai'];

export const MENU = [
  {
    label: 'Dashboard',
    ikon: 'LayoutDashboard',
    path: '/dashboard',
    peran: SEMUA,
  },
  {
    label: 'Profil Salon',
    ikon: 'Store',
    path: '/profil',
    peran: SEMUA,
  },
  {
    label: 'Transaksi Kasir',
    ikon: 'ShoppingCart',
    path: '/kasir',
    peran: SEMUA,
  },
  {
    label: 'Catat Layanan',
    ikon: 'Sparkles',
    path: '/catat-layanan',
    peran: SEMUA,
  },
  {
    label: 'Riwayat Transaksi',
    ikon: 'Receipt',
    path: '/transaksi',
    peran: SEMUA,
  },
  {
    label: 'Laporan Kas',
    ikon: 'BarChart3',
    path: '/laporan',
    peran: SEMUA,
  },
  {
    label: 'Data Pelanggan',
    ikon: 'Users',
    path: '/pelanggan',
    peran: SEMUA,
  },
  {
    label: 'Layanan & Harga',
    ikon: 'Scissors',
    path: '/layanan',
    peran: SEMUA,
  },
  {
    label: 'Akun & Peran',
    ikon: 'UserCog',
    path: '/pengguna',
    peran: ['pemilik'],
  },
];

export const menuUntuk = (peran) => MENU.filter((item) => item.peran.includes(peran));

export const judulHalaman = (pathname) => {
  const cocok = MENU.filter((item) => item.path !== '/dashboard').find((item) =>
    pathname.startsWith(item.path)
  );
  return cocok?.label || 'Dashboard';
};