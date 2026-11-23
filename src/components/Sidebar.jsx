import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Sparkles,
  Receipt,
  BarChart3,
  Users,
  Scissors,
  UserCog,
  Store,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { PERAN, resolvePeran } from '@/lib/peran';
import { menuUntuk } from '@/lib/navigasi';

const IKON = { LayoutDashboard, ShoppingCart, Sparkles, Receipt, BarChart3, Users, Scissors, UserCog, Store };

export default function Sidebar({ terbuka, onTutup }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const peran = resolvePeran(user);
  const menu = menuUntuk(peran);

  return (
    <>
      {terbuka && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onTutup}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-out lg:translate-x-0 ${
          terbuka ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 pb-6 pt-7">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[hsl(var(--gold))] font-display text-lg font-semibold text-[hsl(342_30%_16%)]">
              LS
            </span>
            <div>
              <p className="font-display text-lg leading-tight text-white">Liana Salon</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/50">
                Kasir &amp; Layanan
              </p>
            </div>
          </div>
          <button
            onClick={onTutup}
            className="rounded-full p-1.5 text-sidebar-foreground/70 transition hover:bg-sidebar-accent lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {menu.map((item) => {
            const Ikon = IKON[item.ikon] || LayoutDashboard;
            const aktif =
              item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onTutup}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${
                  aktif
                    ? 'bg-sidebar-accent font-medium text-white'
                    : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-white'
                }`}
              >
                <Ikon
                  className={`h-[18px] w-[18px] ${
                    aktif
                      ? 'text-[hsl(var(--gold))]'
                      : 'text-sidebar-foreground/50 group-hover:text-[hsl(var(--gold))]'
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-2xl bg-sidebar-accent/60 p-4">
          <p className="truncate text-sm font-medium text-white">{user?.full_name || 'Pengguna'}</p>
          <p className="mt-0.5 text-xs text-sidebar-foreground/60">{PERAN[peran]?.label}</p>
          <button
            onClick={() => logout()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-2 text-[11px] uppercase tracking-wider text-sidebar-foreground/80 transition hover:bg-white/20 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Keluar
          </button>
        </div>
      </aside>
    </>
  );
}