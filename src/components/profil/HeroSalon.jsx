import React from 'react';
import { Star, Clock, MapPin, MessageCircle, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SALON, tautanWhatsApp } from '@/lib/salon';

export default function HeroSalon() {
  return (
    <section className="overflow-hidden rounded-3xl border border-border/70 bg-card kartu-lembut">
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-primary">
            {SALON.tagline}
          </span>
          <h2 className="teks-judul mt-4 text-3xl leading-tight sm:text-4xl">
            Kenyamanan Perawatan Cantik di{' '}
            <span className="text-primary">{SALON.nama}.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Rambut &amp; styling, facial, hingga bulu mata — ditangani langsung oleh
            Ibu Iin Antisah dengan harga resmi transparan di Jatinegara, Jakarta
            Timur.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild>
              <a href={tautanWhatsApp()} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" /> Chat WhatsApp
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={SALON.googleMapsUrl} target="_blank" rel="noreferrer">
                <Navigation className="mr-2 h-4 w-4" /> Buka di Google Maps
              </a>
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
              <Star className="h-3.5 w-3.5 text-[hsl(var(--gold))]" /> {SALON.rating} ·{' '}
              {SALON.jumlahUlasan} ulasan Google
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" /> {SALON.jamBuka}–
              {SALON.jamTutup} WIB
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Jl. Pancawarga IV
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-[hsl(342_26%_14%)] p-6 text-white">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">
            WhatsApp Salon
          </p>
          <p className="mt-2 font-display text-2xl">{SALON.telepon}</p>
          <p className="mt-4 text-xs leading-relaxed text-white/70">{SALON.alamat}</p>
          <p className="mt-4 text-xs text-white/70">
            Buka {SALON.operasional} · {SALON.jamBuka} – {SALON.jamTutup} WIB
          </p>
        </div>
      </div>
    </section>
  );
}