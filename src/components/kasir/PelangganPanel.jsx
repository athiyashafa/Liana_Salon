import React, { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, X, Loader2, UserRound } from 'lucide-react';
import PelangganFormDialog from '@/components/pelanggan/PelangganFormDialog';

export default function PelangganPanel({ pelanggan, onPilih, bolehTambah = false }) {
  const [cari, setCari] = useState('');
  const [hasil, setHasil] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [dialogBaru, setDialogBaru] = useState(false);

  useEffect(() => {
    let batal = false;
    setMemuat(true);
    const tunggu = setTimeout(async () => {
      const kata = cari.trim();
      const query = kata
        ? {
            $or: [
              { nama: { $regex: kata, $options: 'i' } },
              { telepon: { $regex: kata, $options: 'i' } },
            ],
          }
        : {};
      const hasilCari = await api.entities.Pelanggan.filter(query, { sort: 'nama', limit: 6 });
      if (!batal) {
        setHasil(hasilCari.items);
        setMemuat(false);
      }
    }, 300);
    return () => {
      batal = true;
      clearTimeout(tunggu);
    };
  }, [cari]);

  if (pelanggan) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-secondary/50 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-sm font-semibold text-primary">
            {pelanggan.nama.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{pelanggan.nama}</p>
            <p className="truncate text-xs text-muted-foreground">
              {pelanggan.telepon || 'Tanpa nomor telepon'}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onPilih(null)} aria-label="Ganti pelanggan">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama atau telepon pelanggan"
            className="pl-9"
          />
        </div>
        {bolehTambah && (
          <Button
            variant="outline"
            onClick={() => setDialogBaru(true)}
            className="shrink-0"
            aria-label="Tambah pelanggan baru"
          >
            <UserPlus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Pelanggan baru</span>
          </Button>
        )}
      </div>

      {memuat ? (
        <p className="flex items-center gap-2 px-1 py-3 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Mencari pelanggan…
        </p>
      ) : hasil.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-6 text-center">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <UserRound className="h-3.5 w-3.5" /> Pelanggan tidak ditemukan.
          </p>
          {bolehTambah && (
            <Button size="sm" onClick={() => setDialogBaru(true)}>
              <UserPlus className="mr-2 h-3.5 w-3.5" /> Tambah pelanggan baru
            </Button>
          )}
        </div>
      ) : (
        <div className="max-h-52 space-y-1 overflow-y-auto pr-1">
          {hasil.map((p) => (
            <button
              key={p.id}
              onClick={() => onPilih(p)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-secondary"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">
                {p.nama.charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{p.nama}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {p.telepon || 'Tanpa nomor telepon'}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      <PelangganFormDialog
        terbuka={dialogBaru}
        onTutup={setDialogBaru}
        onTersimpan={(baru) => onPilih(baru)}
      />
    </div>
  );
}