import React, { useEffect, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Scissors, Clock } from 'lucide-react';
import { api } from '@/api/client';
import { useAuth } from '@/lib/AuthContext';
import { bisa, resolvePeran } from '@/lib/peran';
import LayananFormDialog from '@/components/layanan/LayananFormDialog';
import Kosong from '@/components/Kosong';
import Memuat from '@/components/Memuat';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { rupiah } from '@/lib/format';

export default function Layanan() {
  const { user } = useAuth();
  const { toast } = useToast();
  const bolehKelola = bisa(resolvePeran(user), 'kelolaLayanan');

  const [cari, setCari] = useState('');
  const [kategori, setKategori] = useState('Semua');
  const [daftarKategori, setDaftarKategori] = useState([]);
  const [daftar, setDaftar] = useState(null);
  const [dialog, setDialog] = useState({ terbuka: false, layanan: null });
  const [hapus, setHapus] = useState(null);
  const [menghapus, setMenghapus] = useState(false);

  const muat = async (kata, kat) => {
    const query = {};
    if (kata) query.nama = { $regex: kata, $options: 'i' };
    if (kat && kat !== 'Semua') query.kategori = kat;
    const hasil = await api.entities.Layanan.filter(query, { sort: 'nama', limit: 80 });
    setDaftar(hasil.items);
  };

  const muatKategori = async () => {
    const hasil = await api.entities.Layanan.list({ distinct: 'kategori' });
    setDaftarKategori(hasil.items || []);
  };

  useEffect(() => {
    muatKategori();
  }, []);

  useEffect(() => {
    let batal = false;
    setDaftar(null);
    const tunggu = setTimeout(async () => {
      const kata = cari.trim();
      const query = {};
      if (kata) query.nama = { $regex: kata, $options: 'i' };
      if (kategori !== 'Semua') query.kategori = kategori;
      const hasil = await api.entities.Layanan.filter(query, { sort: 'nama', limit: 80 });
      if (!batal) setDaftar(hasil.items);
    }, 300);
    return () => {
      batal = true;
      clearTimeout(tunggu);
    };
  }, [cari, kategori]);

  const konfirmasiHapus = async () => {
    setMenghapus(true);
    await api.entities.Layanan.delete(hapus.id);
    setMenghapus(false);
    setHapus(null);
    await muat(cari.trim(), kategori);
    await muatKategori();
    toast({ title: 'Layanan dihapus' });
  };

  const semuaKategori = ['Semua', ...daftarKategori.filter(Boolean)];

  return (
    <div className="masuk-halus space-y-5">
      <Card className="kartu-lembut border-border/70">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                placeholder="Cari nama layanan"
                className="pl-9"
              />
            </div>
            {bolehKelola && (
              <Button onClick={() => setDialog({ terbuka: true, layanan: null })}>
                <Plus className="mr-2 h-4 w-4" /> Layanan baru
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {semuaKategori.map((k) => (
              <button
                key={k}
                onClick={() => setKategori(k)}
                className={`rounded-full px-3.5 py-1.5 text-xs transition ${
                  kategori === k
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {daftar === null ? (
        <Memuat baris={4} />
      ) : daftar.length === 0 ? (
        <Kosong
          judul="Layanan tidak ditemukan"
          pesan="Ubah kata kunci, kategori, atau tambahkan layanan baru beserta harganya."
          Ikon={Scissors}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {daftar.map((l) => (
            <Card key={l.id} className="kartu-lembut border-border/70">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{l.nama}</p>
                    {l.kategori && (
                      <Badge variant="secondary" className="mt-2 font-normal">
                        {l.kategori}
                      </Badge>
                    )}
                  </div>
                  <Badge
                    className={
                      l.aktif === false
                        ? 'bg-muted text-muted-foreground hover:bg-muted'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                    }
                  >
                    {l.aktif === false ? 'Nonaktif' : 'Aktif'}
                  </Badge>
                </div>

                <p className="teks-judul mt-4 text-xl">{rupiah(l.harga)}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {l.durasi_menit || 0} menit
                </p>
                {l.deskripsi && (
                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{l.deskripsi}</p>
                )}

                {bolehKelola && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setDialog({ terbuka: true, layanan: l })}
                    >
                      <Pencil className="mr-2 h-3.5 w-3.5" /> Ubah layanan &amp; harga
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setHapus(l)}
                      aria-label={`Hapus ${l.nama}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <LayananFormDialog
        terbuka={dialog.terbuka}
        layanan={dialog.layanan}
        onTutup={(v) => {
          if (v === false) setDialog({ terbuka: false, layanan: null });
        }}
        onTersimpan={async () => {
          await muat(cari.trim(), kategori);
          await muatKategori();
        }}
      />

      <AlertDialog open={!!hapus} onOpenChange={(v) => !v && setHapus(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus layanan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              {hapus?.nama} akan dihapus dari daftar layanan dan tidak lagi muncul di kasir.
              Riwayat transaksi yang sudah tercatat tetap tersimpan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={konfirmasiHapus} disabled={menghapus}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}