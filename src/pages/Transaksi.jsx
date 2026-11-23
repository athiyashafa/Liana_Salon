import React, { useEffect, useState } from 'react';
import { api } from '@/api/client';
import BarisTransaksi from '@/components/transaksi/BarisTransaksi';
import Kosong from '@/components/Kosong';
import Memuat from '@/components/Memuat';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Receipt } from 'lucide-react';

const BATAS = 15;

const susunQuery = (q, status, dari, sampai) => {
  const query = {};
  if (status !== 'semua') query.status = status;
  const kata = q.trim();
  if (kata) {
    query.$or = [
      { nomor_nota: { $regex: kata, $options: 'i' } },
      { pelanggan_nama: { $regex: kata, $options: 'i' } },
    ];
  }
  const rentang = {};
  if (dari) rentang.$gte = new Date(dari + 'T00:00:00').toISOString();
  if (sampai) rentang.$lte = new Date(sampai + 'T23:59:59').toISOString();
  if (Object.keys(rentang).length) query.tanggal = rentang;
  return query;
};

export default function Transaksi() {
  const [cari, setCari] = useState('');
  const [status, setStatus] = useState('semua');
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');
  const [daftar, setDaftar] = useState(null);
  const [kursor, setKursor] = useState(null);
  const [memuatLagi, setMemuatLagi] = useState(false);

  useEffect(() => {
    let batal = false;
    setDaftar(null);
    const tunggu = setTimeout(async () => {
      const hasil = await api.entities.Transaksi.filter(susunQuery(cari, status, dari, sampai), {
        sort: '-tanggal',
        limit: BATAS,
      });
      if (batal) return;
      setDaftar(hasil);
      setKursor(hasil.next_cursor);
    }, 300);
    return () => {
      batal = true;
      clearTimeout(tunggu);
    };
  }, [cari, status, dari, sampai]);

  const muatLagi = async () => {
    setMemuatLagi(true);
    const hasil = await api.entities.Transaksi.filter(susunQuery(cari, status, dari, sampai), {
      sort: '-tanggal',
      limit: BATAS,
      cursor: kursor,
    });
    setDaftar((lama) => ({ ...hasil, items: [...(lama?.items || []), ...hasil.items] }));
    setKursor(hasil.next_cursor);
    setMemuatLagi(false);
  };

  const adaFilter = cari || status !== 'semua' || dari || sampai;

  return (
    <div className="masuk-halus space-y-5">
      <Card className="kartu-lembut border-border/70">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="cari-transaksi">Cari transaksi</Label>
            <Input
              id="cari-transaksi"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Nomor nota atau nama pelanggan"
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua status</SelectItem>
                <SelectItem value="selesai">Lunas</SelectItem>
                <SelectItem value="menunggu_pembayaran">Menunggu pembayaran</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dari">Dari tanggal</Label>
            <Input id="dari" type="date" value={dari} onChange={(e) => setDari(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sampai">Sampai tanggal</Label>
            <Input
              id="sampai"
              type="date"
              value={sampai}
              onChange={(e) => setSampai(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {daftar === null ? (
        <Memuat baris={5} />
      ) : daftar.items.length === 0 ? (
        <Kosong
          judul={adaFilter ? 'Transaksi tidak ditemukan' : 'Belum ada transaksi'}
          pesan={
            adaFilter
              ? 'Coba ubah kata kunci, status, atau rentang tanggal.'
              : 'Setiap pembayaran dan catatan layanan akan muncul di sini.'
          }
          Ikon={Receipt}
        />
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            {daftar.items.length} transaksi ditampilkan
          </p>
          <div className="space-y-2">
            {daftar.items.map((t) => (
              <BarisTransaksi key={t.id} transaksi={t} />
            ))}
          </div>
          {daftar.has_more && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={muatLagi} disabled={memuatLagi}>
                {memuatLagi ? 'Memuat…' : 'Muat transaksi lain'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}