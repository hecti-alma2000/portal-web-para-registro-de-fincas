'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, Fragment } from 'react';
import dynamic from 'next/dynamic';
import { Transition } from '@headlessui/react';
import { DropdownMenu } from './ui/DropdownMenu';
import { ThemeToggle } from './ui/ThemeToggle';
import { signOut, useSession } from 'next-auth/react';

// 1. DEFINICIÓN DE ICONOS DINÁMICOS
// Cada icono se importa perezosamente, creando su propio JS chunk (si la librería lo soporta).
const DynamicHome = dynamic(() => import('lucide-react').then((mod) => mod.Home), { ssr: false });
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

// Iconos de control (Menú y Auth)
const DynamicMenu = dynamic(() => import('lucide-react').then((mod) => mod.Menu), { ssr: false });
const DynamicX = dynamic(() => import('lucide-react').then((mod) => mod.X), { ssr: false });
const DynamicLogIn = dynamic(() => import('lucide-react').then((mod) => mod.LogIn), { ssr: false });
const DynamicLogOut = dynamic(() => import('lucide-react').then((mod) => mod.LogOut), {
  ssr: false,
});
const DynamicShield = dynamic(() => import('lucide-react').then((mod) => mod.Shield), {
  ssr: false,
});

// 2. LISTA DE NAVEGACIÓN MODIFICADA
// Ahora usamos los componentes dinámicos recién creados.
const navigation = [
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

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await signOut({ redirect: false });
    window.location.reload();
  };

  return (
    <>
      <div className="relative m-0 p-0 border-none shadow-none z-50">
        <div className="w-full">
          <div className="flex justify-between items-center h-16 m-0 p-0">
            {/* Logo */}
            <div className="shrink-0 flex items-center gap-2">
              <Link href="/">
                <span className="flex items-center ">
                  <img src="/icons/logo.png" alt="Logo" className="h-18 w-18" loading="lazy" />
                  <span className="text-green-500 text-2xl font-bold text-shadow-initial">
                    Turismo Alternativo
                  </span>
                </span>
              </Link>
            </div>

            {/* Navegación para escritorio */}
            <div className="hidden lg:flex lg:space-x-8 items-center">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`flex flex-col items-center px-3 py-1  rounded transition-colors duration-200 text-xl mb-1 ${
                      pathname === item.href
                        ? 'text-green-600 font-bold'
                        : ' text-dark font-bold hover:text-gray-300 dark:hover:text-gray-400'
                    }`}
                  >
                    {/*  Uso del componente dinámico */}
                    <item.Icon />
                    <span className="text-xs mt-1">{item.name}</span>
                  </span>
                </Link>
              ))}

              {/* Theme toggle y Dropdown de Usuario/Auth para Escritorio */}
              <div className="ml-4 flex items-center gap-3">
                <ThemeToggle />
                <DropdownMenu />
              </div>
            </div>

            {/* Botón del menú móvil (Hamburguesa) */}
            <div className="flex items-center lg:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                id="menu-button"
                className="inline-flex items-center justify-center p-2 rounded-md text-black dark:text-white hover:text-gray-300 focus:outline-none"
              >
                {/*  Uso de iconos de control dinámicos */}
                {isOpen ? (
                  <DynamicX className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <DynamicMenu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil (Desplegable) */}
        <Transition
          show={isOpen}
          as={Fragment}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            id="navbar-menu"
            className="lg:hidden bg-white dark:bg-slate-900 shadow-md absolute w-full top-16 right-0 z-10"
          >
            <div className="flex flex-col items-start justify-start px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Items de navegación */}
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="w-full">
                  <span
                    onClick={closeMenu}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      pathname === item.href
                        ? 'text-green-600 font-bold bg-gray-100 dark:bg-slate-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {/*  Uso de iconos de navegación dinámicos */}
                    <item.Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </span>
                </Link>
              ))}

              {/* Opciones de Admin (Solo para móvil si es Admin) */}
              {isAdmin && (
                <Link href="/admin" className="w-full">
                  <span
                    onClick={closeMenu}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-gray-700 hover:bg-gray-50 border-t mt-1 pt-3"
                  >
                    {/*  Uso de icono de Admin dinámico */}
                    <DynamicShield className="mr-3 h-5 w-5" />
                    Panel Admin
                  </span>
                </Link>
              )}

              {/* Opciones de Login / Logout para móvil */}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-gray-700 hover:bg-gray-50 border-t mt-1 pt-3"
                >
                  {/*  Uso de icono de Logout dinámico */}
                  <DynamicLogOut className="mr-3 h-5 w-5" />
                  Salir
                </button>
              ) : (
                <Link href="/auth/login" className="w-full">
                  <span
                    onClick={closeMenu}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-gray-700 hover:bg-gray-50 border-t mt-1 pt-3"
                  >
                    {/*  Uso de icono de Login dinámico */}
                    <DynamicLogIn className="mr-3 h-5 w-5" />
                    Ingresar
                  </span>
                </Link>
              )}
            </div>
          </div>
        </Transition>
      </div>
    </>
  );
}
