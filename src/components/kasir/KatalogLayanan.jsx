import React, { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LayananFormDialog from '@/components/layanan/LayananFormDialog';
import { Search, Plus, Clock, Loader2 } from 'lucide-react';
import { rupiah } from '@/lib/format';

export default function KatalogLayanan({ onTambah }) {
  const [cari, setCari] = useState('');
  const [kategori, setKategori] = useState('Semua');
  const [daftarKategori, setDaftarKategori] = useState([]);
  const [layanan, setLayanan] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [dialogBaru, setDialogBaru] = useState(false);
  const [versi, setVersi] = useState(0);

  useEffect(() => {
    (async () => {
      const hasil = await api.entities.Layanan.list({ distinct: 'kategori' });
      setDaftarKategori(hasil.items || []);
    })();
  }, [versi]);

  useEffect(() => {
    let batal = false;
    setMemuat(true);
    const tunggu = setTimeout(async () => {
      const query = { aktif: true };
      if (cari.trim()) query.nama = { $regex: cari.trim(), $options: 'i' };
      if (kategori !== 'Semua') query.kategori = kategori;
      const hasil = await api.entities.Layanan.filter(query, { sort: 'nama', limit: 60 });
      if (!batal) {
        setLayanan(hasil.items);
        setMemuat(false);
      }
    }, 250);
    return () => {
      batal = true;
      clearTimeout(tunggu);
    };
  }, [cari, kategori, versi]);

  const semuaKategori = ['Semua', ...daftarKategori.filter(Boolean)];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Katalog layanan
        </p>
        <Button variant="outline" size="sm" onClick={() => setDialogBaru(true)}>
          <Plus className="mr-2 h-3.5 w-3.5" /> Layanan baru
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari layanan di katalog"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {semuaKategori.map((k) => (
          <button
            key={k}
            onClick={() => setKategori(k)}
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              kategori === k
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {memuat ? (
        <p className="flex items-center gap-2 py-6 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Memuat katalog layanan…
        </p>
      ) : (
        <div className="grid max-h-[46vh] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {layanan.map((l) => (
            <button
              key={l.id}
              onClick={() => onTambah(l)}
              className="group flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-card p-3.5 text-left transition hover:border-primary/50 hover:shadow-sm"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{l.nama}</span>
                <span className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {l.durasi_menit || 0} menit
                  {l.kategori ? ` · ${l.kategori}` : ''}
                </span>
                <span className="mt-2 block text-sm font-semibold text-primary">
                  {rupiah(l.harga)}
                </span>
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Plus className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
          {layanan.length === 0 && (
            <p className="py-6 text-sm text-muted-foreground sm:col-span-2">
              Tidak ada layanan aktif yang cocok.
            </p>
          )}
        </div>
      )}

      <LayananFormDialog
        terbuka={dialogBaru}
        onTutup={setDialogBaru}
        onTersimpan={() => setVersi((v) => v + 1)}
      />
    </div>
  );
}