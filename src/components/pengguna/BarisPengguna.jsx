import React from 'react';
import { PERAN } from '@/lib/peran';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BarisPengguna({ pengguna, diriSendiri, onUbahPeran }) {
  const jabatan = PERAN[pengguna.jabatan] ? pengguna.jabatan : undefined;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary font-display text-base text-primary">
        {(pengguna.full_name || pengguna.email || 'P').charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{pengguna.full_name || 'Tanpa nama'}</p>
        <p className="truncate text-xs text-muted-foreground">{pengguna.email}</p>
      </div>
      {diriSendiri ? (
        <Badge variant="secondary" className="font-normal">
          {PERAN[jabatan]?.singkat || 'Belum diatur'} · akun Anda
        </Badge>
      ) : (
        <Select value={jabatan} onValueChange={(v) => onUbahPeran(pengguna.id, v)}>
          <SelectTrigger className="sm:w-52">
            <SelectValue placeholder="Pilih peran" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PERAN).map(([kunci, info]) => (
              <SelectItem key={kunci} value={kunci}>
                {info.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}