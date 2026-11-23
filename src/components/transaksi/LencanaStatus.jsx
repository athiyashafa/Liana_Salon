import React from 'react';
import { LABEL_STATUS } from '@/lib/format';

export default function LencanaStatus({ status }) {
  const lunas = status === 'selesai';
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        lunas ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${lunas ? 'bg-emerald-500' : 'bg-amber-500'}`}
      />
      {LABEL_STATUS[status] || status}
    </span>
  );
}