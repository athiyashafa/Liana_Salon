import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { rupiah } from '@/lib/format';
import { Wallet, Receipt, TrendingUp, Sparkles } from 'lucide-react';
import StatCard from '@/components/StatCard';

export default function RingkasanLaporan({
  omzet,
  jumlah,
  rataRata,
  totalLayanan,
  rincian,
  metode,
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total omzet"
          nilai={rupiah(omzet)}
          keterangan="Transaksi lunas pada periode ini"
          Ikon={Wallet}
        />
        <StatCard
          label="Jumlah transaksi"
          nilai={jumlah}
          keterangan="Nota yang sudah dibayar"
          Ikon={Receipt}
        />
        <StatCard
          label="Rata-rata per transaksi"
          nilai={rupiah(rataRata)}
          keterangan="Nilai belanja rata-rata"
          Ikon={TrendingUp}
        />
        <StatCard
          label="Layanan terjual"
          nilai={totalLayanan}
          keterangan="Total item layanan"
          Ikon={Sparkles}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="kartu-lembut border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="teks-judul text-lg">Rincian per layanan</CardTitle>
          </CardHeader>
          <CardContent>
            {rincian.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Belum ada layanan terjual pada periode ini.
              </p>
            ) : (
              <div className="space-y-2">
                {rincian.map((r) => (
                  <div
                    key={r.nama}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.nama}</p>
                      <p className="text-xs text-muted-foreground">{r.qty} layanan</p>
                    </div>
                    <p className="text-sm font-semibold">{rupiah(r.omzet)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="kartu-lembut border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="teks-judul text-lg">Metode pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            {metode.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Belum ada pembayaran tercatat.
              </p>
            ) : (
              <div className="space-y-2">
                {metode.map((m) => (
                  <div
                    key={m.nama}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3.5 py-2.5"
                  >
                    <Badge variant="secondary" className="font-normal">
                      {m.nama}
                    </Badge>
                    <p className="text-sm font-semibold">{rupiah(m.nilai)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}