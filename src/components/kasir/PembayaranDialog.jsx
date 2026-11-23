import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { rupiah, LABEL_METODE, METODE_PEMBAYARAN, DAFTAR_BANK } from '@/lib/format';
import { Loader2, Banknote, QrCode, CreditCard, Wallet, AlertCircle, Zap } from 'lucide-react';

const IKON_METODE = { tunai: Banknote, transfer: Wallet, qris: QrCode, kartu: CreditCard };
const PILIHAN_CEPAT = [50000, 100000, 150000, 200000, 500000];

export default function PembayaranDialog({ terbuka, onTutup, total, onKonfirmasi, menyimpan }) {
  const [metode, setMetode] = useState('tunai');
  const [bank, setBank] = useState(DAFTAR_BANK[0]);
  const [otomatis, setOtomatis] = useState(false);
  const [bayar, setBayar] = useState('');
  const [galat, setGalat] = useState('');

  useEffect(() => {
    if (terbuka) {
      setMetode('tunai');
      setBank(DAFTAR_BANK[0]);
      setOtomatis(false);
      setBayar(String(total));
      setGalat('');
    }
  }, [terbuka, total]);

  const pilihMetode = (m) => {
    setMetode(m);
    setGalat('');
    setOtomatis(m !== 'tunai');
    setBayar(String(total));
  };

  const jumlah = metode === 'tunai' && !otomatis ? Number(bayar) || 0 : total;
  const kembalian = metode === 'tunai' ? Math.max(0, jumlah - total) : 0;
  const nonTunai = metode !== 'tunai';

  const kirim = () => {
    if (metode === 'tunai' && jumlah < total) {
      setGalat('Uang diterima kurang dari total tagihan.');
      return;
    }
    onKonfirmasi({
      metode_pembayaran: metode,
      bank: metode === 'transfer' ? bank : '',
      jumlah_bayar: jumlah,
      kembalian,
    });
  };

  const cepats = Array.from(
    new Set([total, ...PILIHAN_CEPAT.filter((n) => n >= total)])
  ).slice(0, 4);

  return (
    <Dialog open={terbuka} onOpenChange={onTutup}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="teks-judul text-xl">Validasi &amp; catat pembayaran</DialogTitle>
          <DialogDescription>
            Total tagihan <span className="font-semibold text-foreground">{rupiah(total)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Metode pembayaran</Label>
            <div className="grid grid-cols-2 gap-2">
              {METODE_PEMBAYARAN.map((m) => {
                const Ikon = IKON_METODE[m];
                return (
                  <button
                    key={m}
                    onClick={() => pilihMetode(m)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs transition ${
                      metode === m
                        ? 'border-primary bg-secondary/60 text-primary'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <Ikon className="h-4 w-4" /> {LABEL_METODE[m]}
                  </button>
                );
              })}
            </div>
          </div>

          {metode === 'transfer' && (
            <div className="space-y-2">
              <Label>Bank yang dipakai</Label>
              <Select value={bank} onValueChange={setBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bank" />
                </SelectTrigger>
                <SelectContent>
                  {DAFTAR_BANK.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-start justify-between gap-3 rounded-xl border border-border px-3 py-2.5">
            <div className="flex gap-2">
              <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-medium">Pembayaran otomatis</p>
                <p className="text-[11px] text-muted-foreground">
                  Jumlah dibayar langsung pas dengan total tagihan.
                </p>
              </div>
            </div>
            <Switch
              checked={otomatis}
              onCheckedChange={(v) => {
                setOtomatis(v);
                if (v) setBayar(String(total));
                setGalat('');
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bayar">
              {metode === 'tunai' ? 'Uang diterima' : 'Jumlah dibayar'}
            </Label>
            <Input
              id="bayar"
              type="number"
              min="0"
              value={nonTunai || otomatis ? String(total) : bayar}
              disabled={nonTunai || otomatis}
              onChange={(e) => {
                setBayar(e.target.value);
                setGalat('');
              }}
              className="text-right text-lg"
            />
            {metode === 'tunai' && !otomatis && (
              <div className="flex flex-wrap gap-2">
                {cepats.map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setBayar(String(n));
                      setGalat('');
                    }}
                    className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground transition hover:bg-secondary/70"
                  >
                    {n === total ? 'Uang pas' : rupiah(n)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-secondary/60 px-4 py-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Kembalian</span>
              <span className="font-semibold">{rupiah(kembalian)}</span>
            </div>
          </div>

          {galat && (
            <p className="flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5" /> {galat}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onTutup(false)}>
            Batal
          </Button>
          <Button onClick={kirim} disabled={menyimpan}>
            {menyimpan && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan &amp; Cetak Nota
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}