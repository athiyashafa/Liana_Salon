import React from 'react';
import { rupiah, formatTanggalWaktu, LABEL_METODE } from '@/lib/format';

function Baris({ label, nilai }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-right text-slate-800">{nilai || '-'}</span>
    </div>
  );
}

export default function NotaView({ transaksi }) {
  if (!transaksi) return null;
  const items = transaksi.items || [];
  const lunas = transaksi.status === 'selesai';

  return (
    <div className="mx-auto w-full max-w-md bg-white px-6 py-6 text-[13px] text-slate-800">
      <p className="mb-4 rounded-full border border-dashed border-slate-300 py-1 text-center text-[10px] uppercase tracking-[0.3em] text-slate-500">
        {lunas ? 'Lunas' : 'Menunggu Pembayaran'}
      </p>

      <div className="text-center">
        <p className="font-display text-2xl tracking-tight text-slate-900">Liana Salon</p>
        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
          Kasir &amp; Layanan Kecantikan
        </p>
      </div>

      <div className="mt-5 space-y-1 border-y border-dashed border-slate-300 py-3 text-[12px]">
        <Baris label="No. Nota" nilai={transaksi.nomor_nota} />
        <Baris label="Tanggal" nilai={formatTanggalWaktu(transaksi.tanggal)} />
        <Baris label="Pelanggan" nilai={transaksi.pelanggan_nama || 'Pelanggan Umum'} />
        <Baris label="Pegawai" nilai={transaksi.pegawai_nama} />
        <Baris label="Kasir" nilai={transaksi.kasir_nama} />
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="text-[12px]">
            <p className="font-medium text-slate-900">{item.nama_layanan}</p>
            <div className="flex justify-between text-slate-600">
              <span>
                {item.qty} x {rupiah(item.harga)}
              </span>
              <span className="text-slate-900">{rupiah(item.subtotal)}</span>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-[12px] text-slate-500">Tidak ada layanan.</p>}
      </div>

      <div className="mt-4 space-y-1 border-t border-dashed border-slate-300 pt-3 text-[12px]">
        <Baris label="Subtotal" nilai={rupiah(transaksi.subtotal)} />
        {!!transaksi.diskon && (
          <Baris label="Diskon" nilai={'- ' + rupiah(transaksi.diskon)} />
        )}
        <div className="flex justify-between pt-1 text-sm font-semibold text-slate-900">
          <span>Total</span>
          <span>{rupiah(transaksi.total)}</span>
        </div>
        {lunas && (
          <div className="space-y-1 pt-1">
            <Baris label="Metode" nilai={LABEL_METODE[transaksi.metode_pembayaran]} />
            {transaksi.bank ? <Baris label="Bank" nilai={transaksi.bank} /> : null}
            <Baris label="Dibayar" nilai={rupiah(transaksi.jumlah_bayar)} />
            <Baris label="Kembalian" nilai={rupiah(transaksi.kembalian)} />
          </div>
        )}
      </div>

      {transaksi.catatan && (
        <p className="mt-3 text-[11px] italic text-slate-500">Catatan: {transaksi.catatan}</p>
      )}

      <p className="mt-6 border-t border-dashed border-slate-300 pt-4 text-center text-[11px] text-slate-500">
        Terima kasih telah mempercayakan kecantikan Anda kepada Liana Salon.
      </p>
    </div>
  );
}