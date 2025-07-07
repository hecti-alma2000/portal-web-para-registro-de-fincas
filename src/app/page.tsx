import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">
        Bienvenido al Portal de Fincas
      </h1>
      <p className="mb-8 text-lg text-gray-700">
        Gestiona y explora fincas Agroturísticas.
      </p>
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
