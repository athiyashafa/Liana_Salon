import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { rupiah } from '@/lib/format';

export default function Keranjang({
  items,
  onUbahQty,
  onHapus,
  subtotal,
  total,
  diskon,
  onDiskon,
  ctaLabel,
  onCta,
  catatanSlot,
}) {
  return (
    <div className="flex flex-col">
      <div className="max-h-[42vh] space-y-2 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Belum ada layanan dipilih.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.layanan_id}
              className="flex items-start gap-3 rounded-xl border border-border/70 bg-card p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.nama_layanan}</p>
                <p className="text-xs text-muted-foreground">{rupiah(item.harga)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onUbahQty(item.layanan_id, item.qty - 1)}
                    aria-label="Kurangi"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm">{item.qty}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onUbahQty(item.layanan_id, item.qty + 1)}
                    aria-label="Tambah"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{rupiah(item.subtotal)}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-1 h-7 w-7 text-muted-foreground"
                  onClick={() => onHapus(item.layanan_id)}
                  aria-label="Hapus layanan"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 space-y-2 border-t border-border pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{rupiah(subtotal)}</span>
        </div>
        {onDiskon && (
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Diskon</span>
            <Input
              type="number"
              min="0"
              value={diskon}
              onChange={(e) => onDiskon(Math.max(0, Number(e.target.value) || 0))}
              className="h-8 w-32 text-right"
            />
          </div>
        )}
        <div className="flex justify-between border-t border-dashed border-border pt-2 text-base font-semibold">
          <span>Total</span>
          <span>{rupiah(total)}</span>
        </div>
        {catatanSlot}
        <Button className="mt-1 w-full" disabled={items.length === 0} onClick={onCta}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}