import React from 'react';
import { Card } from '@/components/ui/card';

export default function StatCard({ label, nilai, keterangan, Ikon }) {
  return (
    <Card className="kartu-lembut border-border/70 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        {Ikon && <Ikon className="h-4 w-4 text-primary/70" />}
      </div>
      <p className="teks-judul mt-3 text-2xl">{nilai}</p>
      {keterangan && <p className="mt-1 text-xs text-muted-foreground">{keterangan}</p>}
    </Card>
  );
}