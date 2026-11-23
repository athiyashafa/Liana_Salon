import React, { useEffect, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Phone, MapPin, Users } from 'lucide-react';
import { api } from '@/api/client';
import { useAuth } from '@/lib/AuthContext';
import { bisa, resolvePeran } from '@/lib/peran';
import PelangganFormDialog from '@/components/pelanggan/PelangganFormDialog';
import Kosong from '@/components/Kosong';
import Memuat from '@/components/Memuat';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

export default function Pelanggan() {
  const { user } = useAuth();
  const { toast } = useToast();
  const bolehKelola = bisa(resolvePeran(user), 'kelolaPelanggan');

  const [cari, setCari] = useState('');
  const [daftar, setDaftar] = useState(null);
  const [dialog, setDialog] = useState({ terbuka: false, pelanggan: null });
  const [hapus, setHapus] = useState(null);
  const [menghapus, setMenghapus] = useState(false);

  const muat = async (kata) => {
    const query = kata
      ? {
          $or: [
            { nama: { $regex: kata, $options: 'i' } },
            { telepon: { $regex: kata, $options: 'i' } },
          ],
        }
      : {};
    const hasil = await api.entities.Pelanggan.filter(query, { sort: 'nama', limit: 60 });
    setDaftar(hasil.items);
  };

  useEffect(() => {
    let batal = false;
    setDaftar(null);
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
      const hasil = await api.entities.Pelanggan.filter(query, { sort: 'nama', limit: 60 });
      if (!batal) setDaftar(hasil.items);
    }, 300);
    return () => {
      batal = true;
      clearTimeout(tunggu);
    };
  }, [cari]);

  const konfirmasiHapus = async () => {
    setMenghapus(true);
    await api.entities.Pelanggan.delete(hapus.id);
    setMenghapus(false);
    setHapus(null);
    await muat(cari.trim());
    toast({ title: 'Data pelanggan dihapus' });
  };

  return (
    <div className="masuk-halus space-y-5">
      <Card className="kartu-lembut border-border/70">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari nama atau telepon pelanggan"
              className="pl-9"
            />
          </div>
          {bolehKelola && (
            <Button onClick={() => setDialog({ terbuka: true, pelanggan: null })}>
              <Plus className="mr-2 h-4 w-4" /> Pelanggan baru
            </Button>
          )}
        </CardContent>
      </Card>

      {daftar === null ? (
        <Memuat baris={5} />
      ) : daftar.length === 0 ? (
        <Kosong
          judul={cari ? 'Pelanggan tidak ditemukan' : 'Belum ada pelanggan'}
          pesan={
            cari
              ? 'Coba kata kunci lain atau tambahkan sebagai pelanggan baru.'
              : 'Data pelanggan yang tersimpan akan tampil di sini.'
          }
          Ikon={Users}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {daftar.map((p) => (
            <Card key={p.id} className="kartu-lembut border-border/70">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary font-display text-lg text-primary">
                    {p.nama.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.nama}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" /> {p.telepon || 'Belum ada nomor'}
                    </p>
                    {p.alamat && (
                      <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="mt-0.5 h-3 w-3 shrink-0" />{' '}
                        <span className="line-clamp-2">{p.alamat}</span>
                      </p>
                    )}
                  </div>
                </div>

                {p.catatan && (
                  <p className="mt-3 rounded-xl bg-secondary/50 px-3 py-2 text-xs italic text-muted-foreground">
                    {p.catatan}
                  </p>
                )}

                {bolehKelola && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setDialog({ terbuka: true, pelanggan: p })}
                    >
                      <Pencil className="mr-2 h-3.5 w-3.5" /> Ubah
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setHapus(p)}
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

      <PelangganFormDialog
        terbuka={dialog.terbuka}
        pelanggan={dialog.pelanggan}
        onTutup={(v) => {
          if (v === false) setDialog({ terbuka: false, pelanggan: null });
        }}
        onTersimpan={() => muat(cari.trim())}
      />

      <AlertDialog open={!!hapus} onOpenChange={(v) => !v && setHapus(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus data pelanggan?</AlertDialogTitle>
            <AlertDialogDescription>
              Data {hapus?.nama} akan dihapus dari buku pelanggan. Riwayat transaksi yang sudah
              tercatat tetap tersimpan.
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