import React from 'react';
import { MapPin, Clock, Phone, MessageCircle, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SALON, tautanWhatsApp } from '@/lib/salon';
import PetaLokasi from '@/components/profil/PetaLokasi';

export default function LokasiKontak() {
  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 kartu-lembut">
      <h3 className="teks-judul text-xl">Lokasi &amp; Kontak</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Titik lokasi mengikuti profil Google Maps resmi {SALON.nama}.
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <PetaLokasi />

        <div className="space-y-3">
          <div className="flex gap-3 rounded-2xl bg-secondary/60 p-4">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">{SALON.nama}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {SALON.alamat}
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-2xl bg-secondary/60 p-4">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">
                {SALON.jamBuka} – {SALON.jamTutup} WIB
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Operasional {SALON.operasional}
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-2xl bg-secondary/60 p-4">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">{SALON.telepon}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                WhatsApp untuk reservasi &amp; tanya jadwal
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild>
              <a href={tautanWhatsApp()} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" /> Hubungi via WhatsApp
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={SALON.googleMapsUrl} target="_blank" rel="noreferrer">
                <Navigation className="mr-2 h-4 w-4" /> Petunjuk Arah
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}