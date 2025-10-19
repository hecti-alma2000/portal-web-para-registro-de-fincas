'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, Fragment } from 'react';
import {
  Home,
  Search,
  PlusCircle,
  Menu,
  X,
  LibraryBig,
  ShieldCheck,
  Tractor,
  User,
  LogIn, // Nuevo icono para Ingresar
  LogOut,
  Shield, // Nuevo icono para Salir
} from 'lucide-react';
import { Transition } from '@headlessui/react';
import { DropdownMenu } from './ui/DropdownMenu';
import { signOut, useSession } from 'next-auth/react';

// Navegación con los iconos de Lucide React
const navigation = [
  { href: '/', name: 'Inicio', icon: Home },
  { href: '/explorar', name: 'Explorar', icon: Search },
  { href: '/registro-finca', name: 'Registrar', icon: PlusCircle },
  { href: '/info', name: 'Información', icon: LibraryBig },
  { href: '/fincas', name: 'Fincas', icon: Tractor },
  { href: '/certificacion', name: 'Certificación', icon: ShieldCheck },
];

export default function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';

  // Función auxiliar para el cierre del menú móvil
  const closeMenu = () => setIsOpen(false);

  // 🔑 Función de Logout solicitada
  const handleLogout = async () => {
    closeMenu(); // Cierra el menú antes de hacer logout
    await signOut({ redirect: false });
    // Usamos window.location.reload() para asegurar la actualización de la UI
    window.location.reload();
  };

  return (
    <>
      <div className="relative m-0 p-0 border-none shadow-none">
        <div className="w-full">
          <div className="flex justify-between items-center h-16 m-0 p-0">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link href="/">
                <span className="flex items-center ">
                  <img src="/icons/logo.png" alt="Logo" className="h-18 w-18" loading="lazy" />
                  <span className="text-black text-2xl font-bold">Turismo Alternativo</span>
                </span>
              </Link>
            </div>

            {/* Navegación para escritorio */}
            <div className="hidden lg:flex lg:space-x-8 items-center">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`flex flex-col items-center px-3 py-1 rounded transition-colors duration-200 text-xl mb-1 ${
                      pathname === item.href
                        ? 'text-green-600 font-bold'
                        : 'text-black hover:text-gray-300'
                    }`}
                  >
                    {<item.icon />}
                    <span className="text-xs mt-1">{item.name}</span>
                  </span>
                </Link>
              ))}

              {/* Dropdown de Usuario/Auth para Escritorio */}
              <div className="ml-4">
                <DropdownMenu />
              </div>
            </div>

            {/* Botón del menú móvil (Hamburguesa) */}
            <div className="flex items-center lg:hidden">
              {/* En escritorio el dropdown es suficiente. En móvil, mantenemos el botón hamburguesa */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                id="menu-button"
                className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-300 focus:outline-none"
              >
                {isOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
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
            className="lg:hidden bg-white shadow-md absolute w-full top-16 right-0 z-10"
          >
            <div className="flex flex-col items-start justify-start px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Items de navegación */}
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="w-full">
                  <span
                    onClick={closeMenu}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      pathname === item.href
                        ? 'text-green-600 font-bold bg-gray-100'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {<item.icon className="mr-3 h-5 w-5" />}
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
                    <Shield className="mr-3 h-5 w-5" />
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
                  <LogOut className="mr-3 h-5 w-5" />
                  Salir
                </button>
              ) : (
                <Link href="/auth/login" className="w-full">
                  <span
                    onClick={closeMenu}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-gray-700 hover:bg-gray-50 border-t mt-1 pt-3"
                  >
                    <LogIn className="mr-3 h-5 w-5" />
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
