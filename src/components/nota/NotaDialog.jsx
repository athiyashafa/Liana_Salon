import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import NotaView from '@/components/nota/NotaView';

export default function NotaDialog({ terbuka, onTutup, transaksi, judul = 'Nota Transaksi' }) {
  return (
    <Dialog open={terbuka} onOpenChange={onTutup}>
      <DialogContent className="max-w-lg p-0">
        <DialogTitle className="sr-only">{judul}</DialogTitle>
        <div className="max-h-[68vh] overflow-y-auto bg-secondary/40 p-5">
          <div className="rounded-2xl border border-border bg-white shadow-sm">
            <NotaView transaksi={transaksi} />
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border p-4">
          <Button variant="outline" onClick={() => onTutup(false)}>
            Tutup
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Cetak Nota
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}