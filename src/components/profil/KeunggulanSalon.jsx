import React from 'react';
import { ShieldCheck, Scissors, Clock } from 'lucide-react';
import { SALON } from '@/lib/salon';

const KEUNGGULAN = [
  {
    ikon: ShieldCheck,
    judul: 'Harga Resmi Transparan',
    teks:
      'Seluruh daftar harga layanan tercantum terbuka sesuai brosur fisik salon, tanpa biaya tersembunyi.',
  },
  {
    ikon: Scissors,
    judul: 'Pelayanan Langsung Pemilik',
    teks:
      'Ditangani langsung oleh Ibu Iin Antisah secara teliti, higienis, dan mengutamakan kenyamanan pelanggan.',
  },
  {
    ikon: Clock,
    judul: 'Jadwal Antrean Tertib',
    teks: `Pilih waktu kedatangan sesuai jam operasional (${SALON.jamBuka} – ${SALON.jamTutup} WIB) agar tidak menunggu lama.`,
  },
];

export default function KeunggulanSalon() {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {KEUNGGULAN.map(({ ikon: Ikon, judul, teks }) => (
        <div
          key={judul}
          className="rounded-2xl border border-border/70 bg-card p-5 kartu-lembut"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
            <Ikon className="h-5 w-5" />
          </span>
          <p className="teks-judul mt-3 text-base">{judul}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{teks}</p>
        </div>
      ))}
    </section>
  );
}