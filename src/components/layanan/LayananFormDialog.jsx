import React, { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const KOSONG = {
  nama: '',
  kategori: '',
  harga: '',
  durasi_menit: 60,
  deskripsi: '',
  aktif: true,
};

const SARAN_KATEGORI = [
  'Potong Rambut',
  'Perawatan Rambut',
  'Pewarnaan',
  'Styling',
  'Rias',
  'Kuku',
  'Perawatan Wajah',
  'Perawatan Tubuh',
];

export default function LayananFormDialog({ terbuka, onTutup, layanan, onTersimpan }) {
  const [form, setForm] = useState(KOSONG);
  const [menyimpan, setMenyimpan] = useState(false);
  const [galat, setGalat] = useState('');

  useEffect(() => {
    if (terbuka) {
      setForm(
        layanan
          ? {
              nama: layanan.nama || '',
              kategori: layanan.kategori || '',
              harga: String(layanan.harga ?? ''),
              durasi_menit: layanan.durasi_menit ?? 60,
              deskripsi: layanan.deskripsi || '',
              aktif: layanan.aktif !== false,
            }
          : KOSONG
      );
      setGalat('');
    }
  }, [terbuka, layanan]);

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));

  const simpan = async () => {
    if (!form.nama.trim()) {
      setGalat('Nama layanan wajib diisi.');
      return;
    }
    if (!form.harga || Number(form.harga) < 0) {
      setGalat('Harga layanan wajib diisi.');
      return;
    }
    setMenyimpan(true);
    const data = {
      nama: form.nama.trim(),
      kategori: form.kategori || '',
      harga: Number(form.harga) || 0,
      durasi_menit: Number(form.durasi_menit) || 0,
      deskripsi: form.deskripsi || '',
      aktif: !!form.aktif,
    };
    const hasil = layanan?.id
      ? await api.entities.Layanan.update(layanan.id, data)
      : await api.entities.Layanan.create(data);
    setMenyimpan(false);
    onTersimpan(hasil);
    onTutup(false);
  };

  return (
    <Dialog open={terbuka} onOpenChange={onTutup}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="teks-judul text-xl">
            {layanan?.id ? 'Ubah layanan & harga' : 'Layanan baru'}
          </DialogTitle>
          <DialogDescription>
            Layanan aktif otomatis muncul di kasir dan pencatatan layanan.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="nama-layanan">Nama layanan</Label>
            <Input
              id="nama-layanan"
              value={form.nama}
              onChange={ubah('nama')}
              placeholder="Contoh: Hair Spa"
            />
            {galat && <p className="text-xs text-destructive">{galat}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="kategori">Kategori</Label>
            <Input
              id="kategori"
              list="saran-kategori"
              value={form.kategori}
              onChange={ubah('kategori')}
              placeholder="Perawatan Rambut"
            />
            <datalist id="saran-kategori">
              {SARAN_KATEGORI.map((k) => (
                <option key={k} value={k} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <Label htmlFor="harga">Harga (Rp)</Label>
            <Input
              id="harga"
              type="number"
              min="0"
              value={form.harga}
              onChange={ubah('harga')}
              placeholder="150000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="durasi">Durasi (menit)</Label>
            <Input
              id="durasi"
              type="number"
              min="0"
              value={form.durasi_menit}
              onChange={ubah('durasi_menit')}
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <Label htmlFor="aktif" className="cursor-pointer">
              Layanan aktif
            </Label>
            <Switch
              id="aktif"
              checked={!!form.aktif}
              onCheckedChange={(v) => setForm((f) => ({ ...f, aktif: v }))}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              rows={3}
              value={form.deskripsi}
              onChange={ubah('deskripsi')}
              placeholder="Keterangan singkat layanan"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onTutup(false)}>
            Batal
          </Button>
          <Button onClick={simpan} disabled={menyimpan}>
            {menyimpan && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}