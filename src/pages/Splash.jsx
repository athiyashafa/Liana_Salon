import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Splash() {
  const navigate = useNavigate();
  const tujuan = '/kasir';

  useEffect(() => {
    const jeda = setTimeout(() => navigate(tujuan, { replace: true }), 2000);
    return () => clearTimeout(jeda);
  }, [tujuan, navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[hsl(342_26%_14%)] text-center">
      <div className="masuk-halus flex flex-col items-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[hsl(var(--gold))] font-display text-3xl font-semibold text-[hsl(342_30%_16%)]">
          LS
        </span>
        <h1 className="mt-6 font-display text-3xl tracking-[0.18em] text-white sm:text-4xl">
          LIANA SALON
        </h1>
        <p className="mt-3 text-[10px] uppercase tracking-[0.32em] text-white/50">
          Kasir &amp; Layanan
        </p>
        <div className="mt-8 flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--gold))]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--gold))] [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--gold))] [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}