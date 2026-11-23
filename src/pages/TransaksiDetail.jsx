import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Wallet, Loader2 } from 'lucide-react';
import { api } from '@/api/client';
import { useAuth } from '@/lib/AuthContext';
import { bisa, resolvePeran } from '@/lib/peran';
import NotaView from '@/components/nota/NotaView';
import PembayaranDialog from '@/components/kasir/PembayaranDialog';
import LencanaStatus from '@/components/transaksi/LencanaStatus';
import AksiTransaksi from '@/components/transaksi/AksiTransaksi';
import Kosong from '@/components/Kosong';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function TransaksiDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const peran = resolvePeran(user);
  const [transaksi, setTransaksi] = useState(null);
  const [tidakAda, setTidakAda] = useState(false);
  const [dialogBayar, setDialogBayar] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);

  useEffect(() => {
    let batal = false;
    (async () => {
      try {
        const hasil = await api.entities.Transaksi.get(id);
        if (!batal) setTransaksi(hasil);
      } catch (e) {
        if (!batal) setTidakAda(true);
      }
    })();
    return () => {
      batal = true;
    };
  }, [id]);

  const bayar = async (pembayaran) => {
    setMenyimpan(true);
    const hasil = await api.entities.Transaksi.update(id, {
      status: 'selesai',
      metode_pembayaran: pembayaran.metode_pembayaran,
      bank: pembayaran.bank || '',
      jumlah_bayar: pembayaran.jumlah_bayar,
      kembalian: pembayaran.kembalian,
      kasir_nama: user?.full_name || '',
    });
    setMenyimpan(false);
    setTransaksi(hasil);
    setDialogBayar(false);
    toast({
      title: 'Pembayaran tercatat',
      description: `Nota ${hasil.nomor_nota} kini berstatus lunas.`,
    });
  };

  if (tidakAda) {
    return (
      <div className="space-y-4">
        <Kosong
          judul="Transaksi tidak ditemukan"
          pesan="Nota mungkin sudah tidak tersedia."
        />
        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link to="/transaksi">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke riwayat
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!transaksi) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Memuat nota…
      </p>
    );
  }

  const belumLunas = transaksi.status === 'menunggu_pembayaran';

  return (
    <div className="masuk-halus space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/transaksi" aria-label="Kembali">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <p className="teks-judul text-lg">{transaksi.nomor_nota}</p>
            <div className="mt-1">
              <LencanaStatus status={transaksi.status} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Cetak nota
          </Button>
          {belumLunas && bisa(peran, 'kasir') && (
            <Button onClick={() => setDialogBayar(true)}>
              <Wallet className="mr-2 h-4 w-4" /> Proses pembayaran
            </Button>
          )}
        </div>
      </div>

      <Card className="kartu-lembut border-border/70">
        <CardContent className="p-5 sm:p-8">
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-white shadow-sm">
            <NotaView transaksi={transaksi} />
          </div>
        </CardContent>
      </Card>

      <AksiTransaksi transaksi={transaksi} onBerubah={setTransaksi} />

      <PembayaranDialog
        terbuka={dialogBayar}
        onTutup={setDialogBayar}
        total={transaksi.total}
        onKonfirmasi={bayar}
        menyimpan={menyimpan}
      />

      <div className="lembar-cetak">
        <NotaView transaksi={transaksi} />
      </div>
    </div>
  );
}