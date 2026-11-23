import React from 'react';
import HeroSalon from '@/components/profil/HeroSalon';
import KeunggulanSalon from '@/components/profil/KeunggulanSalon';
import DaftarHargaLayanan from '@/components/profil/DaftarHargaLayanan';
import UlasanGoogle from '@/components/profil/UlasanGoogle';
import LokasiKontak from '@/components/profil/LokasiKontak';
import TombolWhatsApp from '@/components/profil/TombolWhatsApp';

export default function ProfilSalon() {
  return (
    <div className="masuk-halus space-y-5 pb-10">
      <HeroSalon />
      <KeunggulanSalon />
      <DaftarHargaLayanan />
      <UlasanGoogle />
      <LokasiKontak />
      <TombolWhatsApp />
    </div>
  );
}