export const SALON = {
  nama: 'LIANA SALON',
  tagline: 'Salon & Perawatan Kecantikan Wanita',
  alamat:
    'Jl. Pancawarga IV, RT.04/RW.02, Cipinang Besar Selatan, Jatinegara, Jakarta Timur',
  telepon: '0813-7116-1851',
  whatsapp: '6281371161851',
  jamBuka: '09.00',
  jamTutup: '20.00',
  operasional: 'Setiap hari',
  rating: '4,6',
  jumlahUlasan: 9,
  lat: -6.2342473,
  lng: 106.8821038,
  googleMapsUrl:
    'https://www.google.com/maps/place/LIANA+SALON./@-6.2342473,106.8821038,19z',
};

const PESAN_BAWAAN = `Halo ${SALON.nama}, saya ingin bertanya tentang layanan dan jadwal salon.`;

export const tautanWhatsApp = (teks = PESAN_BAWAAN) =>
  `https://wa.me/${SALON.whatsapp}?text=${encodeURIComponent(teks)}`;

export const ULASAN = [
  {
    nama: 'MrsL',
    ket: 'Local Guide · 27 ulasan',
    teks:
      'Salon langganan. Sukses, berkah dan lancar selalu usahanya Ibu Iin dan Alya 🥰',
  },
  {
    nama: 'Yuni Wahyuni',
    ket: '10 ulasan · 5 foto',
    teks: 'Salon langganan aku teh Iin 🥰',
  },
  {
    nama: 'Siska Gustiana',
    ket: '1 ulasan · 1 foto',
    teks:
      'Pelayanan ramah dan hasil pengerjaannya sangat rapi. Puas treatment di sini.',
  },
  {
    nama: 'Kiky Amalina',
    ket: '2 ulasan',
    teks:
      'Salon rekomendasi di Pancawarga, pelayanannya ramah dan harga sangat bersahabat.',
  },
];