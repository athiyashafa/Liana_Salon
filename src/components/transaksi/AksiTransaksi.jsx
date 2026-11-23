import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CheckCircle2, RotateCcw, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/AuthContext';
import { bisa, resolvePeran } from '@/lib/peran';

export default function AksiTransaksi({ transaksi, onBerubah }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const peran = resolvePeran(user);
  const [memproses, setMemproses] = useState(false);
  const lunas = transaksi.status === 'selesai';

  const ubahStatus = async () => {
    setMemproses(true);
    const statusBaru = lunas ? 'menunggu_pembayaran' : 'selesai';
    const hasil = await api.entities.Transaksi.update(transaksi.id, {
      status: statusBaru,
    });
    setMemproses(false);
    onBerubah(hasil);
    toast({
      title: statusBaru === 'selesai' ? 'Nota ditandai lunas' : 'Nota ditandai belum lunas',
    });
  };

  const hapus = async () => {
    await api.entities.Transaksi.delete(transaksi.id);
    toast({ title: 'Riwayat transaksi dihapus' });
    navigate('/transaksi', { replace: true });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-4 kartu-lembut">
      <div>
        <p className="text-sm font-medium">Status pembayaran</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {lunas
            ? 'Nota sudah lunas. Bisa ditandai belum lunas bila perlu dikoreksi.'
            : 'Tandai lunas bila pembayaran sudah diterima tanpa melalui proses kasir.'}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={lunas ? 'outline' : 'default'}
          onClick={ubahStatus}
          disabled={memproses}
        >
          {memproses ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : lunas ? (
            <RotateCcw className="mr-2 h-4 w-4" />
          ) : (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          )}
          {lunas ? 'Tandai belum lunas' : 'Tandai lunas'}
        </Button>

        {bisa(peran, 'hapusTransaksi') && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus riwayat transaksi ini?</AlertDialogTitle>
                <AlertDialogDescription>
                  Nota {transaksi.nomor_nota} akan dihapus permanen dan tidak lagi
                  masuk ke laporan kas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={hapus}>Hapus</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}