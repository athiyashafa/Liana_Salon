import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Wallet, ShoppingCart, Sparkles, Users, Clock, ArrowRight } from 'lucide-react';
import { api } from '@/api/client';
import { useAuth } from '@/lib/AuthContext';
import { bisa, resolvePeran, PERAN } from '@/lib/peran';
import {
  awalHari,
  toISODate,
  rupiah,
  rupiahSingkat,
  formatTanggalWaktu,
} from '@/lib/format';
import StatCard from '@/components/StatCard';
import Kosong from '@/components/Kosong';
import Memuat from '@/components/Memuat';
import BarisTransaksi from '@/components/transaksi/BarisTransaksi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user } = useAuth();
  const peran = resolvePeran(user);
  const [data, setData] = useState(null);

  useEffect(() => {
    let batal = false;
    (async () => {
      const mulaiHariIni = awalHari().toISOString();
      const tujuhHariLalu = new Date();
      tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 6);
      const mulaiPekan = awalHari(tujuhHariLalu).toISOString();

      const [hariIni, pekan, jumlahPelanggan, jumlahLayanan, menunggu, jumlahMenunggu, terbaru] =
        await Promise.all([
          api.entities.Transaksi.aggregate({
            query: { status: 'selesai', tanggal: { $gte: mulaiHariIni } },
            sum: ['total'],
          }),
          api.entities.Transaksi.aggregate({
            query: { status: 'selesai', tanggal: { $gte: mulaiPekan } },
            sum: ['total'],
            dateBucket: { field: 'tanggal', unit: 'day' },
          }),
          api.entities.Pelanggan.count({}),
          api.entities.Layanan.count({ aktif: true }),
          api.entities.Transaksi.filter(
            { status: 'menunggu_pembayaran' },
            { sort: '-tanggal', limit: 4 }
          ),
          api.entities.Transaksi.count({ status: 'menunggu_pembayaran' }),
          api.entities.Transaksi.list('-tanggal', 5),
        ]);

      if (batal) return;

      const peta = {};
      (pekan.rows || []).forEach((r) => {
        peta[r.tanggal] = r.sum_total || 0;
      });
      const seri = [];
      for (let i = 6; i >= 0; i--) {
        const hari = new Date();
        hari.setDate(hari.getDate() - i);
        seri.push({
          hari: hari.toLocaleDateString('id-ID', { weekday: 'short' }),
          total: peta[toISODate(hari)] || 0,
        });
      }

      setData({
        omzetHariIni: hariIni.rows?.[0]?.sum_total || 0,
        transaksiHariIni: hariIni.rows?.[0]?.count || 0,
        seri,
        jumlahPelanggan,
        jumlahLayanan,
        menunggu: menunggu.items,
        jumlahMenunggu,
        terbaru,
      });
    })();
    return () => {
      batal = true;
    };
  }, []);

  if (!data) return <Memuat baris={5} />;

  return (
    <div className="masuk-halus space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card p-6 kartu-lembut sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {PERAN[peran]?.label}
          </p>
          <h2 className="teks-judul mt-1 text-2xl sm:text-3xl">
            Selamat datang, {(user?.full_name || 'Sahabat').split(' ')[0]}
          </h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {PERAN[peran]?.deskripsi}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {bisa(peran, 'kasir') && (
            <Button asChild>
              <Link to="/kasir">
                <ShoppingCart className="mr-2 h-4 w-4" /> Transaksi baru
              </Link>
            </Button>
          )}
          {bisa(peran, 'catatLayanan') && (
            <Button asChild>
              <Link to="/catat-layanan">
                <Sparkles className="mr-2 h-4 w-4" /> Catat layanan
              </Link>
            </Button>
          )}
          {bisa(peran, 'laporan') && (
            <Button variant="outline" asChild>
              <Link to="/laporan">
                Lihat laporan <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Omzet hari ini"
          nilai={rupiah(data.omzetHariIni)}
          keterangan={`${data.transaksiHariIni} transaksi lunas`}
          Ikon={Wallet}
        />
        <StatCard
          label="Menunggu pembayaran"
          nilai={data.jumlahMenunggu}
          keterangan="Nota layanan pegawai"
          Ikon={Clock}
        />
        <StatCard
          label="Total pelanggan"
          nilai={data.jumlahPelanggan}
          keterangan="Tersimpan di buku pelanggan"
          Ikon={Users}
        />
        <StatCard
          label="Layanan aktif"
          nilai={data.jumlahLayanan}
          keterangan="Siap dipilih di kasir"
          Ikon={Sparkles}
        />
      </div>

      <Card className="kartu-lembut border-border/70">
        <CardHeader className="pb-2">
          <CardTitle className="teks-judul text-lg">Omzet 7 hari terakhir</CardTitle>
        </CardHeader>
        <CardContent className="h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.seri} margin={{ left: 8, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="hari" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                tickFormatter={(v) => rupiahSingkat(v)}
                tickLine={false}
                axisLine={false}
                fontSize={11}
                width={70}
              />
              <Tooltip
                formatter={(v) => [rupiah(v), 'Omzet']}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid hsl(var(--border))',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="teks-judul text-lg">Menunggu pembayaran</h3>
            <Link to="/transaksi" className="text-xs text-primary hover:underline">
              Lihat semua
            </Link>
          </div>
          {data.menunggu.length === 0 ? (
            <Kosong judul="Tidak ada tagihan tertunda" pesan="Semua layanan sudah lunas." Ikon={Clock} />
          ) : (
            <div className="space-y-2">
              {data.menunggu.map((t) => (
                <BarisTransaksi key={t.id} transaksi={t} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="teks-judul text-lg">Transaksi terbaru</h3>
            <Link to="/transaksi" className="text-xs text-primary hover:underline">
              Riwayat lengkap
            </Link>
          </div>
          {data.terbaru.length === 0 ? (
            <Kosong
              judul="Belum ada transaksi"
              pesan="Transaksi pertama akan tampil di sini."
              Ikon={ShoppingCart}
            />
          ) : (
            <div className="space-y-2">
              {data.terbaru.map((t) => (
                <BarisTransaksi key={t.id} transaksi={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}