import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { PERAN, resolvePeran } from '@/lib/peran';
import { judulHalaman } from '@/lib/navigasi';

export default function Topbar({ onBukaMenu }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const peran = resolvePeran(user);

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-[hsl(var(--canvas))]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-3 px-4 sm:px-6 lg:px-10">
        <button
          onClick={onBukaMenu}
          className="rounded-xl border border-border bg-card p-2 transition hover:border-primary/40 lg:hidden"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="teks-judul text-lg sm:text-xl">{judulHalaman(pathname)}</h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:inline-block">
            {PERAN[peran]?.label}
          </span>
          <span className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">
              {(user?.full_name || user?.email || 'P').charAt(0).toUpperCase()}
            </span>
            <span className="hidden max-w-[130px] truncate sm:inline-block">
              {user?.full_name || 'Pengguna'}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}