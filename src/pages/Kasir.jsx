import React, { useState } from 'react';
import { api } from '@/api/client';
import { useAuth } from '@/lib/AuthContext';
import { nomorNotaBaru, rupiah } from '@/lib/format';
import PelangganPanel from '@/components/kasir/PelangganPanel';
import KatalogLayanan from '@/components/kasir/KatalogLayanan';
import Keranjang from '@/components/kasir/Keranjang';
import PembayaranDialog from '@/components/kasir/PembayaranDialog';
import NotaDialog from '@/components/nota/NotaDialog';
import NotaView from '@/components/nota/NotaView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function Kasir() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pelanggan, setPelanggan] = useState(null);
  const [items, setItems] = useState([]);
  const [diskon, setDiskon] = useState(0);
  const [catatan, setCatatan] = useState('');
  const [dialogBayar, setDialogBayar] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);
  const [nota, setNota] = useState(null);

  const subtotal = items.reduce((t, i) => t + i.subtotal, 0);
  const total = Math.max(0, subtotal - (Number(diskon) || 0));

  const tambah = (layanan) => {
    setItems((lama) => {
      const ada = lama.find((i) => i.layanan_id === layanan.id);
      if (ada) {
        return lama.map((i) =>
          i.layanan_id === layanan.id
            ? { ...i, qty: i.qty + 1, subtotal: (i.qty + 1) * i.harga }
            : i
        );
      }
      return [
        ...lama,
        {
          layanan_id: layanan.id,
          nama_layanan: layanan.nama,
          harga: layanan.harga,
          qty: 1,
          subtotal: layanan.harga,
        },
      ];
    });
  };

  const ubahQty = (id, qty) => {
    if (qty <= 0) {
      setItems((lama) => lama.filter((i) => i.layanan_id !== id));
      return;
    }
    setItems((lama) =>
      lama.map((i) => (i.layanan_id === id ? { ...i, qty, subtotal: qty * i.harga } : i))
    );
  };

  const hapus = (id) => setItems((lama) => lama.filter((i) => i.layanan_id !== id));

  const simpan = async (pembayaran) => {
    setMenyimpan(true);
    const transaksi = await api.entities.Transaksi.create({
      nomor_nota: nomorNotaBaru(),
      tanggal: new Date().toISOString(),
      pelanggan_id: pelanggan?.id || '',
      pelanggan_nama: pelanggan?.nama || 'Pelanggan Umum',
      items,
      subtotal,
      diskon: Number(diskon) || 0,
      total,
      status: 'selesai',
      metode_pembayaran: pembayaran.metode_pembayaran,
      jumlah_bayar: pembayaran.jumlah_bayar,
      kembalian: pembayaran.kembalian,
      kasir_nama: user?.full_name || '',
      catatan,
    });
    setMenyimpan(false);
    setDialogBayar(false);
    setNota(transaksi);
    setItems([]);
    setDiskon(0);
    setCatatan('');
    setPelanggan(null);
    toast({
      title: 'Pembayaran tercatat',
      description: `Nota ${transaksi.nomor_nota} tersimpan dan siap dicetak.`,
    });
  };

  return (
    <div className="masuk-halus grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <Card className="kartu-lembut border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="teks-judul text-lg">1. Cari atau tambah pelanggan</CardTitle>
          </CardHeader>
          <CardContent>
            <PelangganPanel pelanggan={pelanggan} onPilih={setPelanggan} bolehTambah />
          </CardContent>
        </Card>

        <Card className="kartu-lembut border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="teks-judul text-lg">2. Pilih layanan</CardTitle>
          </CardHeader>
          <CardContent>
            <KatalogLayanan onTambah={tambah} />
          </CardContent>
        </Card>
      </div>

      <div className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="kartu-lembut border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="teks-judul text-lg">3. Hitung total &amp; bayar</CardTitle>
          </CardHeader>
          <CardContent>
            <Keranjang
              items={items}
              onUbahQty={ubahQty}
              onHapus={hapus}
              subtotal={subtotal}
              total={total}
              diskon={diskon}
              onDiskon={setDiskon}
              ctaLabel={`Proses pembayaran · ${rupiah(total)}`}
              onCta={() => setDialogBayar(true)}
              catatanSlot={
                <div className="space-y-2 pt-2">
                  <Label htmlFor="catatan-kasir" className="text-xs text-muted-foreground">
                    Catatan (opsional)
                  </Label>
                  <Textarea
                    id="catatan-kasir"
                    rows={2}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Permintaan khusus pelanggan"
                  />
                </div>
              }
            />
          </CardContent>
        </Card>
      </div>

      <PembayaranDialog
        terbuka={dialogBayar}
        onTutup={setDialogBayar}
        total={total}
        onKonfirmasi={simpan}
        menyimpan={menyimpan}
      />

      <NotaDialog
        terbuka={!!nota}
        onTutup={(v) => {
          if (v === false) setNota(null);
        }}
        transaksi={nota}
      />

      {nota && (
        <div className="lembar-cetak">
          <NotaView transaksi={nota} />
        </div>
      )}
    </div>
  );
}