import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function Layout() {
  const [menuTerbuka, setMenuTerbuka] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(var(--canvas))]">
      <Sidebar terbuka={menuTerbuka} onTutup={() => setMenuTerbuka(false)} />
      <div className="lg:pl-72">
        <Topbar onBukaMenu={() => setMenuTerbuka(true)} />
        <main className="mx-auto w-full max-w-[1200px] px-4 pb-24 pt-6 sm:px-6 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}