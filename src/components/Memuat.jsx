import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Memuat({ baris = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: baris }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-2xl" />
      ))}
    </div>
  );
}