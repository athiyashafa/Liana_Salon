import React from 'react';
import { Crown, Calculator, Sparkles, ChevronRight } from 'lucide-react';
import { PERAN } from '@/lib/peran';

const IKON = { pemilik: Crown, admin_kasir: Calculator, pegawai: Sparkles };

export default function PilihPortal({ onPilih }) {
  return (
    <div className="space-y-3">
      {Object.entries(PERAN).map(([kunci, info]) => {
        const Ikon = IKON[kunci];
        return (
          <button
            key={kunci}
            type="button"
            onClick={() => onPilih(kunci)}
            className="flex w-full items-center gap-3 rounded-xl border border-border p-4 text-left transition hover:border-primary/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Ikon className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium">{info.label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{info.deskripsi}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        );
      })}
    </div>
  );
}