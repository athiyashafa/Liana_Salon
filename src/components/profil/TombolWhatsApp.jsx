import React from 'react';
import { MessageCircle } from 'lucide-react';
import { tautanWhatsApp } from '@/lib/salon';

export default function TombolWhatsApp() {
  return (
    <a
      href={tautanWhatsApp()}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-[#1eb955] tanp-cetak"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Tanya via WhatsApp</span>
    </a>
  );
}