import React, { useState } from 'react';
import { api } from '@/api/client';
import { UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function UndangPenggunaCard({ onTerundang }) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [galat, setGalat] = useState('');
  const [memproses, setMemproses] = useState(false);

  const undang = async () => {
    if (!email.trim()) {
      setGalat('Email wajib diisi.');
      return;
    }
    setGalat('');
    setMemproses(true);
    try {
      await api.users.inviteUser(email.trim(), 'user');
      setEmail('');
      await onTerundang();
      toast({
        title: 'Undangan terkirim',
        description: 'Atur peran akun setelah undangan diterima.',
      });
    } catch (e) {
      setGalat(e.message || 'Undangan gagal dikirim.');
    } finally {
      setMemproses(false);
    }
  };

  return (
    <Card className="kartu-lembut border-border/70">
      <CardHeader>
        <CardTitle className="teks-judul text-lg">Undang akun baru</CardTitle>
        <CardDescription>
          Kirim undangan ke email kasir atau pegawai. Setelah akun aktif, atur perannya di daftar
          bawah.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="email-undangan">Email</Label>
            <Input
              id="email-undangan"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
            />
          </div>
          <Button onClick={undang} disabled={memproses}>
            {memproses ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Kirim undangan
          </Button>
        </div>
        {galat && <p className="text-xs text-destructive">{galat}</p>}
      </CardContent>
    </Card>
  );
}