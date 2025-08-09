import Link from "next/link";
import HeroBanner from "../components/HeroBanner";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-0 m-0">
      <HeroBanner />
      <h1 className="text-3xl font-bold mb-6 mt-5 ">
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
