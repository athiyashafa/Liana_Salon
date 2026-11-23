export const rupiah = (value) => {
  const angka = Number(value || 0);
  return 'Rp ' + angka.toLocaleString('id-ID');
};

export const rupiahSingkat = (value) => {
  const angka = Number(value || 0);
  if (angka >= 1000000) return 'Rp ' + (angka / 1000000).toFixed(1).replace('.0', '') + 'jt';
  if (angka >= 1000) return 'Rp ' + Math.round(angka / 1000) + 'rb';
  return rupiah(angka);
};

export const formatTanggal = (value, opsi) => {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', opsi || { day: '2-digit', month: 'long', year: 'numeric' });
};

export const formatWaktu = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

export const formatTanggalWaktu = (value) => {
  if (!value) return '-';
  return `${formatTanggal(value, { day: '2-digit', month: 'short', year: 'numeric' })}, ${formatWaktu(value)}`;
};

export const awalHari = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const akhirHari = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const toISODate = (date) => {
  const d = new Date(date);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export const nomorNotaBaru = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `LS-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
};

export const LABEL_STATUS = {
  menunggu_pembayaran: 'Menunggu Pembayaran',
  selesai: 'Lunas',
};

export const LABEL_METODE = {
  tunai: 'Tunai',
  transfer: 'Transfer Bank',
  qris: 'QRIS',
  kartu: 'Kartu Debit / Kredit',
};

export const METODE_PEMBAYARAN = ['tunai', 'transfer', 'qris', 'kartu'];

export const DAFTAR_BANK = [
  'BCA',
  'Mandiri',
  'BRI',
  'BNI',
  'BSI',
  'CIMB Niaga',
  'Permata',
  'Danamon',
  'BTN',
  'Bank Jago',
  'SeaBank',
  'Lainnya',
];