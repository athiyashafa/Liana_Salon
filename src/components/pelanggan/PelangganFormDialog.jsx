import React, { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  telepon: '',
  email: '',
  alamat: '',
  tanggal_lahir: '',
  catatan: '',
};

export default function PelangganFormDialog({ terbuka, onTutup, pelanggan, onTersimpan }) {
  const [form, setForm] = useState(KOSONG);
  const [menyimpan, setMenyimpan] = useState(false);
  const [galat, setGalat] = useState('');

  useEffect(() => {
    if (terbuka) {
      setForm(pelanggan ? { ...KOSONG, ...pelanggan } : KOSONG);
      setGalat('');
    }
  }, [terbuka, pelanggan]);

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));

  const simpan = async () => {
    if (!form.nama.trim()) {
      setGalat('Nama pelanggan wajib diisi.');
      return;
    }
    setMenyimpan(true);
    const data = {
      nama: form.nama.trim(),
      telepon: form.telepon || '',
      email: form.email || '',
      alamat: form.alamat || '',
      catatan: form.catatan || '',
    };
    if (form.tanggal_lahir) data.tanggal_lahir = form.tanggal_lahir;
    const hasil = pelanggan?.id
      ? await api.entities.Pelanggan.update(pelanggan.id, data)
      : await api.entities.Pelanggan.create(data);
    setMenyimpan(false);
    onTersimpan(hasil);
    onTutup(false);
  };

  return (
    <Dialog open={terbuka} onOpenChange={onTutup}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="teks-judul text-xl">
            {pelanggan?.id ? 'Ubah data pelanggan' : 'Pelanggan baru'}
          </DialogTitle>
          <DialogDescription>
            Data pelanggan dipakai untuk pencarian saat transaksi kasir.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="nama">Nama lengkap</Label>
            <Input id="nama" value={form.nama} onChange={ubah('nama')} placeholder="Nama pelanggan" />
            {galat && <p className="text-xs text-destructive">{galat}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="telepon">Telepon / WhatsApp</Label>
            <Input id="telepon" value={form.telepon} onChange={ubah('telepon')} placeholder="0812…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={form.email} onChange={ubah('email')} placeholder="opsional" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggal_lahir">Tanggal lahir</Label>
            <Input
              id="tanggal_lahir"
              type="date"
              value={form.tanggal_lahir?.slice(0, 10) || ''}
              onChange={ubah('tanggal_lahir')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Input id="alamat" value={form.alamat} onChange={ubah('alamat')} placeholder="opsional" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="catatan">Catatan</Label>
            <Textarea
              id="catatan"
              rows={3}
              value={form.catatan}
              onChange={ubah('catatan')}
              placeholder="Preferensi layanan, alergi produk, dsb."
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