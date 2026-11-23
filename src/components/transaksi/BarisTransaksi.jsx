import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Receipt } from 'lucide-react';
import { formatTanggalWaktu, rupiah, LABEL_METODE } from '@/lib/format';
import LencanaStatus from '@/components/transaksi/LencanaStatus';

export default function BarisTransaksi({ transaksi }) {
  const jumlahLayanan = (transaksi.items || []).length;
  const metode =
    transaksi.status === 'selesai'
      ? `${LABEL_METODE[transaksi.metode_pembayaran] || ''}${
          transaksi.bank ? ` ${transaksi.bank}` : ''
        }`
      : null;

  return (
    <Link
      to={`/transaksi/${transaksi.id}`}
      className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 transition hover:border-primary/40 hover:shadow-sm"
    >
      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary sm:flex">
        <Receipt className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">{transaksi.nomor_nota}</p>
          <LencanaStatus status={transaksi.status} />
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {transaksi.pelanggan_nama || 'Pelanggan Umum'} · {jumlahLayanan} layanan ·{' '}
          {metode ? `${metode} · ` : ''}
          {formatTanggalWaktu(transaksi.tanggal)}
        </p>
      </div>
      <p className="text-sm font-semibold">{rupiah(transaksi.total)}</p>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}