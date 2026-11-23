import React, { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { rupiah } from '@/lib/format';

export default function DaftarHargaLayanan() {
  const [layanan, setLayanan] = useState(null);

  useEffect(() => {
    let aktif = true;
    api.entities.Layanan
      .filter({ aktif: true }, { sort: 'kategori', limit: 100 })
      .then((hasil) => {
        if (aktif) setLayanan(hasil?.items || hasil || []);
      });
    return () => {
      aktif = false;
    };
  }, []);

  const grup = (layanan || []).reduce((acc, l) => {
    const kunci = l.kategori || 'Lainnya';
    acc[kunci] = acc[kunci] || [];
    acc[kunci].push(l);
    return acc;
  }, {});

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 kartu-lembut">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h3 className="teks-judul text-xl">Daftar Harga Layanan</h3>
        <p className="text-xs text-muted-foreground">
          {layanan === null ? 'Memuat…' : `${layanan.length} layanan aktif`}
        </p>
      </div>

      {layanan === null ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-secondary/70" />
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-5">
          {Object.keys(grup).map((kategori) => (
            <div key={kategori}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {kategori}
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {grup[kategori].map((l) => (
                  <div
                    key={l.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border/60 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm">{l.nama}</p>
                      {l.durasi_menit ? (
                        <p className="text-[11px] text-muted-foreground">
                          {l.durasi_menit} menit
                        </p>
                      ) : null}
                    </div>
                    <p className="shrink-0 text-sm font-medium text-primary">
                      {rupiah(l.harga)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}