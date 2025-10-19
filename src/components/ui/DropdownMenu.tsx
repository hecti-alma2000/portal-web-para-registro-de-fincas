'use client';

import { useState, useRef, useEffect, Fragment, startTransition } from 'react';
import Link from 'next/link';
import { LogOut, LogIn, User, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { logout } from '@/actions/auth/logout'; // Server Action

// Icono simple de flecha para indicar que es un desplegable
const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
      isOpen ? 'rotate-180' : 'rotate-0'
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
       {' '}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path> {' '}
  </svg>
);

// Definición de las opciones del menú
interface DropdownOption {
  label: string;
  href: string;
  icon: React.ElementType;
  action?: () => void;
}

export const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user; // ⬅️ Definido dentro del scope
  const isAdmin = session?.user?.role === 'admin'; // ⬅️ Definido dentro del scope // Lógica para cerrar el menú al hacer clic fuera (se mantiene igual)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // 🔑 FUNCIÓN DE LOGOUT CORREGIDA Y REUBICADA DENTRO DEL COMPONENTE

  const handleSignOut = () => {
    setIsOpen(false); // Usamos startTransition para ejecutar la Server Action

    startTransition(async () => {
      // 1. Esperar a que el servidor cierre la sesión (limpie las cookies)
      await logout(); // 2. Forzar la recarga/navegación una vez que la acción asíncrona haya finalizado.
      // window.location.replace() es la forma más robusta de forzar un hard reload/navegación.
      window.location.replace(window.location.href);
    });
  }; // 🛠️ Opciones dinámicas
  // ⬅️ La función handleSignOut ahora termina aquí.

  const authenticatedOptions: DropdownOption[] = [
    { label: 'Mi Perfil', href: '/profile', icon: User },
  ];
  const adminOptions: DropdownOption[] = [{ label: 'Usuarios', href: '/users', icon: Shield }];

  const authAction: DropdownOption = isAuthenticated
    ? { label: 'Salir', href: '#', icon: LogOut, action: handleSignOut } // ⬅️ handleSignOut es accesible aquí
    : { label: 'Ingresar', href: '/auth/login', icon: LogIn };

  const menuOptions: DropdownOption[] = [
    ...(isAuthenticated ? authenticatedOptions : []),
    ...(isAdmin ? adminOptions : []),
    authAction,
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botón Principal del Desplegable (se mantiene igual) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center items-center w-full rounded-md px-3 py-1 text-sm font-medium text-black transition-all hover:bg-gray-100 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User className="h-6 w-6 text-black" />
        <ChevronDownIcon isOpen={isOpen} />
      </button>
      {/* Menú Desplegable (se mantiene igual) */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30 border border-gray-100">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {/* Si está autenticado, muestra el nombre o correo del usuario */}
            {isAuthenticated && (
              <div className="block px-4 py-2 text-sm text-gray-900 border-b mb-1 font-semibold truncate">
                {session?.user?.name || session?.user?.email}
              </div>
            )}
            {menuOptions.map((option) => {
              const Content = (
                <span
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 transition-all hover:bg-indigo-500 hover:text-white cursor-pointer"
                  role="menuitem"
                >
                  <option.icon className="h-4 w-4 mr-3" />
                  {option.label}
                </span>
              );

              return (
                <Fragment key={option.label}>
                  {option.href !== '#' ? (
                    <Link
                      href={option.href}
                      onClick={() => setIsOpen(false)}
                      className="w-full block"
                    >
                      {Content}
                    </Link>
                  ) : (
                    <button
                      key={option.label}
                      onClick={option.action}
                      className="w-full block text-left focus:outline-none"
                    >
                      {Content}
                    </button>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
