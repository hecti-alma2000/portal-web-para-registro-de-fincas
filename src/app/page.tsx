'use client'
import Link from "next/link";
import dynamic from "next/dynamic";

// Carga perezosa del componente HeroBanner
const HeroBanner = dynamic(() => import("../components/HeroBanner"), {
  ssr: false, // Deshabilita el renderizado del lado del servidor si el banner es muy interactivo
  loading: () => <div className="w-full h-[50vh] bg-gray-200 animate-pulse"></div>, // Placeholder
});

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-0 m-0">
      <HeroBanner />
      <h1 className="text-3xl font-bold mb-6 mt-5">
        Gestiona y explora fincas de turismo rural.
      </h1>
      <div className="flex gap-4">
        <Link
          href="/explorar"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Explorar fincas
        </Link>
        <Link
          href="/registro-finca"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Registrar finca
        </Link>
      </div>
    </main>
  );
}