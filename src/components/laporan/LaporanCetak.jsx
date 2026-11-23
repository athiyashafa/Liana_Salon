import React from 'react';
import { rupiah, formatTanggal } from '@/lib/format';

export default function LaporanCetak({ periodeLabel, omzet, jumlah, rataRata, totalLayanan, rincian, metode }) {
  return (
    <div className="bg-white px-2 py-2 text-[12px] text-slate-900">
      <div className="border-b border-slate-300 pb-3 text-center">
        <p className="font-display text-2xl">Liana Salon</p>
        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
          Laporan Transaksi
        </p>
      </div>

      <p className="mt-3 text-[12px]">
        Periode: <span className="font-semibold">{periodeLabel}</span> · Dicetak{' '}
        {formatTanggal(new Date())}
      </p>

      <table className="mt-4 w-full border-collapse text-[12px]">
        <tbody>
          <tr>
            <td className="border border-slate-300 px-3 py-2">Total omzet</td>
            <td className="border border-slate-300 px-3 py-2 text-right font-semibold">
              {rupiah(omzet)}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-300 px-3 py-2">Jumlah transaksi lunas</td>
            <td className="border border-slate-300 px-3 py-2 text-right">{jumlah}</td>
          </tr>
          <tr>
            <td className="border border-slate-300 px-3 py-2">Rata-rata per transaksi</td>
            <td className="border border-slate-300 px-3 py-2 text-right">{rupiah(rataRata)}</td>
          </tr>
          <tr>
            <td className="border border-slate-300 px-3 py-2">Layanan terjual</td>
            <td className="border border-slate-300 px-3 py-2 text-right">{totalLayanan}</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-5 text-[13px] font-semibold">Rincian per layanan</p>
      <table className="mt-2 w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="border border-slate-300 px-3 py-2 text-left">Layanan</th>
            <th className="border border-slate-300 px-3 py-2 text-right">Jumlah</th>
            <th className="border border-slate-300 px-3 py-2 text-right">Omzet</th>
          </tr>
        </thead>
        <tbody>
          {rincian.length === 0 ? (
            <tr>
              <td className="border border-slate-300 px-3 py-2" colSpan={3}>
                Tidak ada data
              </td>
            </tr>
          ) : (
            rincian.map((r) => (
              <tr key={r.nama}>
                <td className="border border-slate-300 px-3 py-2">{r.nama}</td>
                <td className="border border-slate-300 px-3 py-2 text-right">{r.qty}</td>
                <td className="border border-slate-300 px-3 py-2 text-right">{rupiah(r.omzet)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <p className="mt-5 text-[13px] font-semibold">Metode pembayaran</p>
      <table className="mt-2 w-full border-collapse text-[12px]">
        <thead>
          <tr>
            <th className="border border-slate-300 px-3 py-2 text-left">Metode</th>
            <th className="border border-slate-300 px-3 py-2 text-right">Nilai</th>
          </tr>
        </thead>
        <tbody>
          {metode.length === 0 ? (
            <tr>
              <td className="border border-slate-300 px-3 py-2" colSpan={2}>
                Tidak ada data
              </td>
            </tr>
          ) : (
            metode.map((m) => (
              <tr key={m.nama}>
                <td className="border border-slate-300 px-3 py-2">{m.nama}</td>
                <td className="border border-slate-300 px-3 py-2 text-right">{rupiah(m.nilai)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <p className="mt-8 text-[11px] text-slate-500">
        Laporan dibuat otomatis oleh sistem kasir Liana Salon.
      </p>
    </div>
  );
}