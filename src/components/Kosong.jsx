import React from 'react';

export default function Kosong({ judul = 'Belum ada data', pesan, Ikon, aksi }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      {Ikon && <Ikon className="h-7 w-7 text-primary/40" />}
      <p className="teks-judul mt-4 text-lg">{judul}</p>
      {pesan && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{pesan}</p>}
      {aksi && <div className="mt-5">{aksi}</div>}
    </div>
  );
}