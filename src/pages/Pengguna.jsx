import React, { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { useAuth } from '@/lib/AuthContext';
import BarisPengguna from '@/components/pengguna/BarisPengguna';
import UndangPenggunaCard from '@/components/pengguna/UndangPenggunaCard';
import Memuat from '@/components/Memuat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function Pengguna() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [daftar, setDaftar] = useState(null);

  const muat = async () => {
    const hasil = await api.entities.User.list();
    const baris = Array.isArray(hasil) ? hasil : hasil?.items || [];
    setDaftar(
      [...baris].sort((a, b) =>
        (a.full_name || a.email || '').localeCompare(b.full_name || b.email || '')
      )
    );
  };

  useEffect(() => {
    muat();
  }, []);

  const ubahPeran = async (id, jabatan) => {
    await api.entities.User.update(id, { jabatan });
    await muat();
    toast({ title: 'Peran akun diperbarui' });
  };

  return (
    <div className="masuk-halus space-y-5">
      <UndangPenggunaCard onTerundang={muat} />

      <Card className="kartu-lembut border-border/70">
        <CardHeader>
          <CardTitle className="teks-judul text-lg">Akun &amp; peran</CardTitle>
          <CardDescription>
            Peran akun menentukan portal masuk serta menu dan fitur yang bisa diakses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {daftar === null ? (
            <Memuat baris={3} />
          ) : (
            daftar.map((p) => (
              <BarisPengguna
                key={p.id}
                pengguna={p}
                diriSendiri={p.id === user?.id}
                onUbahPeran={ubahPeran}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}