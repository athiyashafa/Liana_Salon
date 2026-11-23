import React, { useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import { api } from '@/api/client';
import { awalHari, akhirHari, formatTanggal, LABEL_METODE } from '@/lib/format';
import RingkasanLaporan from '@/components/laporan/RingkasanLaporan';
import LaporanCetak from '@/components/laporan/LaporanCetak';
import Memuat from '@/components/Memuat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const OPSI = [
  { kunci: 'hari', label: 'Harian' },
  { kunci: 'pekan', label: 'Mingguan' },
  { kunci: 'bulan', label: 'Bulanan' },
  { kunci: 'kustom', label: 'Rentang kustom' },
];

export default function Laporan() {
  const [periode, setPeriode] = useState('hari');
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    let batal = false;
    setData(null);

    const sekarang = new Date();
    let mulai = awalHari(sekarang);
    let selesai = akhirHari(sekarang);
    let label = formatTanggal(sekarang, { day: '2-digit', month: 'long', year: 'numeric' });

    if (periode === 'pekan') {
      const tujuh = new Date();
      tujuh.setDate(tujuh.getDate() - 6);
      mulai = awalHari(tujuh);
      label = `${formatTanggal(mulai, { day: '2-digit', month: 'short' })} - ${formatTanggal(
        selesai,
        { day: '2-digit', month: 'short', year: 'numeric' }
      )}`;
    } else if (periode === 'bulan') {
      mulai = awalHari(new Date(sekarang.getFullYear(), sekarang.getMonth(), 1));
      label = formatTanggal(mulai, { month: 'long', year: 'numeric' });
    } else if (periode === 'kustom') {
      if (!dari || !sampai) return;
      mulai = awalHari(new Date(dari + 'T00:00:00'));
      selesai = akhirHari(new Date(sampai + 'T00:00:00'));
      label = `${formatTanggal(mulai, { day: '2-digit', month: 'short', year: 'numeric' })} - ${formatTanggal(
        selesai,
        { day: '2-digit', month: 'short', year: 'numeric' }
      )}`;
    }

    (async () => {
      const query = {
        status: 'selesai',
        tanggal: { $gte: mulai.toISOString(), $lte: selesai.toISOString() },
      };
      const [ringkas, daftar] = await Promise.all([
        api.entities.Transaksi.aggregate({ query, sum: ['total'] }),
        api.entities.Transaksi.filter(query, { sort: '-tanggal', limit: 300 }),
      ]);
      if (batal) return;

      const omzet = ringkas.rows?.[0]?.sum_total || 0;
      const jumlah = ringkas.rows?.[0]?.count || 0;
      const petaLayanan = {};
      const petaMetode = {};
      let totalLayanan = 0;

      daftar.items.forEach((t) => {
        (t.items || []).forEach((i) => {
          const kunci = i.nama_layanan || 'Layanan lain';
          if (!petaLayanan[kunci]) petaLayanan[kunci] = { nama: kunci, qty: 0, omzet: 0 };
          petaLayanan[kunci].qty += i.qty || 0;
          petaLayanan[kunci].omzet += i.subtotal || 0;
          totalLayanan += i.qty || 0;
        });
        const metode = LABEL_METODE[t.metode_pembayaran] || 'Tidak dicatat';
        petaMetode[metode] = (petaMetode[metode] || 0) + (t.total || 0);
      });

      setData({
        label,
        omzet,
        jumlah,
        rataRata: jumlah ? omzet / jumlah : 0,
        totalLayanan,
        rincian: Object.values(petaLayanan).sort((a, b) => b.omzet - a.omzet),
        metode: Object.entries(petaMetode)
          .map(([nama, nilai]) => ({ nama, nilai }))
          .sort((a, b) => b.nilai - a.nilai),
      });
    })();

    return () => {
      batal = true;
    };
  }, [periode, dari, sampai]);

  return (
    <div className="masuk-halus space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 kartu-lembut">
        <div className="flex flex-wrap gap-2">
          {OPSI.map((o) => (
            <button
              key={o.kunci}
              onClick={() => setPeriode(o.kunci)}
              className={`rounded-full px-4 py-2 text-xs transition ${
                periode === o.kunci
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {periode === 'kustom' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:max-w-md">
            <div className="space-y-2">
              <Label htmlFor="lap-dari">Dari tanggal</Label>
              <Input
                id="lap-dari"
                type="date"
                value={dari}
                onChange={(e) => setDari(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lap-sampai">Sampai tanggal</Label>
              <Input
                id="lap-sampai"
                type="date"
                value={sampai}
                onChange={(e) => setSampai(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
          <p className="text-sm text-muted-foreground">
            Periode laporan:{' '}
            <span className="font-medium text-foreground">
              {data?.label || (periode === 'kustom' ? 'pilih tanggal dulu' : '…')}
            </span>
          </p>
          <Button variant="outline" onClick={() => window.print()} disabled={!data}>
            <Printer className="mr-2 h-4 w-4" /> Cetak laporan
          </Button>
        </div>
      </div>

      {data ? (
        <>
          <RingkasanLaporan
            omzet={data.omzet}
            jumlah={data.jumlah}
            rataRata={data.rataRata}
            totalLayanan={data.totalLayanan}
            rincian={data.rincian}
            metode={data.metode}
          />
          <div className="lembar-cetak">
            <LaporanCetak
              periodeLabel={data.label}
              omzet={data.omzet}
              jumlah={data.jumlah}
              rataRata={data.rataRata}
              totalLayanan={data.totalLayanan}
              rincian={data.rincian}
              metode={data.metode}
            />
          </div>
        </>
      ) : (
        <Memuat baris={4} />
      )}
    </div>
  );
}