'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, Fragment, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Transition } from '@headlessui/react';
import { DropdownMenu } from './ui/DropdownMenu';
import { ThemeToggle } from './ui/ThemeToggle';
import { useSession, signIn, signOut } from 'next-auth/react';
import { getPendingRequestsCount } from '@/actions/registro-finca/get-pending-count';

// ICONOS DINÁMICOS
const DynamicHome = dynamic(() => import('lucide-react').then((mod) => mod.Home), {
  ssr: false,
});
const DynamicSearch = dynamic(() => import('lucide-react').then((mod) => mod.Search), {
  ssr: false,
});
const DynamicPlusCircle = dynamic(() => import('lucide-react').then((mod) => mod.PlusCircle), {
  ssr: false,
});
const DynamicLibraryBig = dynamic(() => import('lucide-react').then((mod) => mod.LibraryBig), {
  ssr: false,
});
const DynamicTractor = dynamic(() => import('lucide-react').then((mod) => mod.Tractor), {
  ssr: false,
});
const DynamicShieldCheck = dynamic(() => import('lucide-react').then((mod) => mod.ShieldCheck), {
  ssr: false,
});
const DynamicMenu = dynamic(() => import('lucide-react').then((mod) => mod.Menu), {
  ssr: false,
});
const DynamicX = dynamic(() => import('lucide-react').then((mod) => mod.X), {
  ssr: false,
});
const DynamicBell = dynamic(() => import('lucide-react').then((mod) => mod.BellRing), {
  ssr: false,
});
const DynamicLogIn = dynamic(() => import('lucide-react').then((mod) => mod.LogIn), {
  ssr: false,
});
const DynamicLogOut = dynamic(() => import('lucide-react').then((mod) => mod.LogOut), {
  ssr: false,
});

const baseNavigation = [
  { href: '/', name: 'Inicio', Icon: DynamicHome },
  { href: '/registro-finca', name: 'Registrar', Icon: DynamicPlusCircle },
  { href: '/certificacion', name: 'Certificar', Icon: DynamicShieldCheck },
  { href: '/explorar', name: 'Explorar', Icon: DynamicSearch },
  { href: '/info', name: 'Información', Icon: DynamicLibraryBig },
  { href: '/fincas', name: 'Fincas', Icon: DynamicTractor },
];

export default function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const isAdmin = session?.user?.role === 'admin';

  // NOTIFICACIONES ADMIN
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (isAdmin) {
      const fetchCount = async () => {
        const count = await getPendingRequestsCount();
        setPendingCount(count);
      };

      fetchCount();

      const interval = setInterval(fetchCount, 60000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  // CONSTRUCCIÓN NAV FINAL
  const navigation = [...baseNavigation];

  if (isAdmin) {
    navigation.push({
      href: '/admin/request',
      name: 'Solicitudes',
      Icon: DynamicBell,
    });
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 transition-colors duration-500 prose dark:prose-invert">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/icons/logo.png"
            alt="Logo"
            className="h-12 w-12 transition-transform group-hover:rotate-6"
          />
          <span className="text-green-700 dark:text-green-500 text-2xl font-bold tracking-tight hidden md:block">
            Turismo Alternativo
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center space-x-2">
          {navigation.map((item) => {
            const active = pathname === item.href;
            const isRequestsItem = item.name === 'Solicitudes';

            return (
              <Link key={item.name} href={item.href} className="relative group">
                <span
                  className={`flex flex-col items-center px-4 py-2 rounded-2xl transition-all ${
                    active
                      ? 'text-green-700 dark:text-green-500 font-bold bg-green-50/50 dark:bg-green-900/10'
                      : 'text-zinc-800 dark:text-zinc-400 hover:text-green-600 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <div className="relative">
                    <item.Icon className="w-5 h-5 mb-1" />

                    {isRequestsItem && pendingCount > 0 && (
                      <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white animate-pulse">
                        {pendingCount > 9 ? '+9' : pendingCount}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {item.name}
                  </span>
                </span>
              </Link>
            );
          })}

          <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-4" />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <DropdownMenu />
          </div>
        </div>

        {/* MOBILE HEADER */}
        <div className="lg:hidden flex items-center gap-3">
          {isAdmin && pendingCount > 0 && (
            <Link
              href="/admin/requests"
              className="relative p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full mr-2"
            >
              <DynamicBell className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
              <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
            </Link>
          )}

          <ThemeToggle />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
          >
            {isOpen ? <DynamicX /> : <DynamicMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition duration-200 ease-out"
        enterFrom="opacity-0 -translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition duration-150 ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-4"
      >
        <div className="absolute top-20 inset-x-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-2xl lg:hidden">
          <div className="p-4 space-y-2">
            {navigation.map((item) => {
              const isRequestsItem = item.name === 'Solicitudes';

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  <span
                    className={`flex items-center justify-between p-4 rounded-xl text-lg font-semibold ${
                      pathname === item.href
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'text-zinc-900 dark:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.Icon className="mr-4 w-6 h-6" />
                      {item.name}
                    </div>

                    {isRequestsItem && pendingCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {pendingCount} Nuevas
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}

            {/* ?? NUEVA SECCIÓN LOGIN / LOGOUT EN MOBILE */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4 space-y-2">
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signIn();
                  }}
                  className="w-full flex items-center p-4 rounded-xl text-lg font-semibold text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <DynamicLogIn className="mr-4 w-6 h-6" />
                  Ingresar
                </button>
              )}

              {isAuthenticated && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center p-4 rounded-xl text-lg font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <DynamicLogOut className="mr-4 w-6 h-6" />
                  Salir
                </button>
              )}
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  );
}
