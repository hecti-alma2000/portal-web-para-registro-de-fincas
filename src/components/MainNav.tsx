"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FaHome, FaSearch, FaPlusCircle } from "react-icons/fa";

const navItems = [
  { href: "/", label: "Inicio", icon: <FaHome /> },
  { href: "/explorar", label: "Explorar", icon: <FaSearch /> },
  { href: "/registro-finca", label: "Registrar", icon: <FaPlusCircle /> },
];

export default function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-40">
      <ul className="flex justify-center gap-8 py-3">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center px-3 py-1 rounded transition-colors duration-200 ${
                  pathname === item.href
                    ? "text-green-600 font-bold"
                    : "text-gray-600"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </motion.div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
