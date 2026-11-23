import React, { useState } from 'react';
import { api } from '@/api/client';
import { useAuth } from '@/lib/AuthContext';
import { nomorNotaBaru, rupiah } from '@/lib/format';
import PelangganPanel from '@/components/kasir/PelangganPanel';
import KatalogLayanan from '@/components/kasir/KatalogLayanan';
import Keranjang from '@/components/kasir/Keranjang';
import NotaDialog from '@/components/nota/NotaDialog';
import NotaView from '@/components/nota/NotaView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function CatatLayanan() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pelanggan, setPelanggan] = useState(null);
  const [items, setItems] = useState([]);
  const [catatan, setCatatan] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);
  const [nota, setNota] = useState(null);

  const subtotal = items.reduce((t, i) => t + i.subtotal, 0);

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

  const simpan = async () => {
    setMenyimpan(true);
    const transaksi = await api.entities.Transaksi.create({
      nomor_nota: nomorNotaBaru(),
      tanggal: new Date().toISOString(),
      pelanggan_id: pelanggan?.id || '',
      pelanggan_nama: pelanggan?.nama || 'Pelanggan Umum',
      items,
      subtotal,
      diskon: 0,
      total: subtotal,
      status: 'menunggu_pembayaran',
      pegawai_nama: user?.full_name || '',
      catatan,
    });
    setMenyimpan(false);
    setNota(transaksi);
    setItems([]);
    setCatatan('');
    setPelanggan(null);
    toast({
      title: 'Layanan tercatat',
      description: `Nota ${transaksi.nomor_nota} menunggu pembayaran di kasir.`,
    });
  };

  return (
    <div className="masuk-halus grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <Card className="kartu-lembut border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="teks-judul text-lg">1. Pelanggan yang dilayani</CardTitle>
          </CardHeader>
          <CardContent>
            <PelangganPanel pelanggan={pelanggan} onPilih={setPelanggan} bolehTambah />
          </CardContent>
        </Card>

        <Card className="kartu-lembut border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="teks-judul text-lg">2. Layanan yang dikerjakan</CardTitle>
          </CardHeader>
          <CardContent>
            <KatalogLayanan onTambah={tambah} />
          </CardContent>
        </Card>
      </div>

      <div className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="kartu-lembut border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="teks-judul text-lg">3. Catatan layanan</CardTitle>
          </CardHeader>
          <CardContent>
            <Keranjang
              items={items}
              onUbahQty={ubahQty}
              onHapus={hapus}
              subtotal={subtotal}
              total={subtotal}
              ctaLabel={`Simpan catatan · ${rupiah(subtotal)}`}
              onCta={simpan}
              catatanSlot={
                <div className="space-y-2 pt-2">
                  <Label htmlFor="catatan-staf" className="text-xs text-muted-foreground">
                    Catatan pengerjaan (opsional)
                  </Label>
                  <Textarea
                    id="catatan-staf"
                    rows={2}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: pewarna merek A, hasil sesuai permintaan"
                  />
                </div>
              }
            />
            {menyimpan && (
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyimpan catatan layanan…
              </p>
            )}
          </CardContent>
        </Card>
      </div>

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