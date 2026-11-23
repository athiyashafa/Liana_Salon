import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { SALON, ULASAN } from '@/lib/salon';

export default function UlasanGoogle() {
  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 kartu-lembut">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="teks-judul text-xl">Ulasan Pelanggan di Google Maps</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
            {SALON.rating} dari 5.0 · {SALON.jumlahUlasan} ulasan
          </p>
        </div>
        <a
          href={SALON.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          Buka profil Google Maps <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {ULASAN.map((u) => (
          <div key={u.nama} className="rounded-2xl bg-secondary/60 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-xs font-semibold text-primary">
                {u.nama.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{u.nama}</p>
                <p className="truncate text-[11px] text-muted-foreground">{u.ket}</p>
              </div>
              <span className="ml-auto flex items-center gap-1 text-[11px] font-medium text-primary">
                <Star className="h-3 w-3 text-[hsl(var(--gold))]" /> 5.0
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              “{u.teks}”
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}