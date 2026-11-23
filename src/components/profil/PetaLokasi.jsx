import React from 'react';
import { SALON } from '@/lib/salon';

export default function PetaLokasi() {
  const src = `https://www.google.com/maps?q=${SALON.lat},${SALON.lng}&hl=id&z=17&output=embed`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70">
      <iframe
        title={`Peta lokasi ${SALON.nama}`}
        src={src}
        className="h-72 w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}