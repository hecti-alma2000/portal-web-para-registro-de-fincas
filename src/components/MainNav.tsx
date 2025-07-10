"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, Fragment } from "react";
import {
  FaHome,
  FaSearch,
  FaPlusCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Transition } from "@headlessui/react";

const navigation = [
  { href: "/", name: "Inicio", icon: FaHome },
  { href: "/explorar", name: "Explorar", icon: FaSearch },
  { href: "/registro-finca", name: "Registrar", icon: FaPlusCircle },
];

export default function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="relative m-0 p-0 border-none shadow-none">
        <div className="w-full">
          <div className="flex justify-between items-center h-16 m-0 p-0">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <Link href="/">
                <span className="flex items-center ">
                  <img src="/icons/logo.png" alt="Logo" className="h-18 w-18" />
                  <span className="text-black text-2xl font-bold">
                    Turismo Agroecológico
                  </span>
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
                        ? "text-green-600 font-bold"
                        : "text-black hover:text-gray-300"
                    }`}
                  >
                    {<item.icon />}
                    <span className="text-xs mt-1">{item.name}</span>
                  </span>
                </Link>
              ))}
            </div>
            <div className="hidden lg:flex lg:space-x-8 items-center">
              {/* Un comentario para btn a futuro */}
            </div>
            {/* Botón del menú móvil */}
            <div className="-mr-2 flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                id="menu-button"
                className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-300 focus:outline-none"
              >
                {isOpen ? (
                  <FaTimes className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <FaBars className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Menú móvil */}
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
          <div id="navbar-menu" className="lg:hidden bg-nav shadow-md">
            <div className="flex flex-col items-start justify-start px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    onClick={() => setIsOpen(false)}
                    className={`flex flex-col items-center w-full px-3 py-2 rounded-md text-xl mb-1 transition-colors duration-200 ${
                      pathname === item.href
                        ? "text-green-600 font-bold"
                        : "text-white-500 hover:text-gray-300"
                    }`}
                  >
                    {<item.icon />}
                    <span className="text-xs mt-1">{item.name}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Transition>
      </div>
    </>
  );
}
