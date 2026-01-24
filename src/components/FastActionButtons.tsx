import Link from 'next/link';

export const FastActionButtons = () => (
  <>
    <h1 className="mb-6 mt-5 text-center text-3xl font-bold">
      Gestiona y explora fincas de Agroturismo
    </h1>
    <div className="mb-10 flex flex-col items-center justify-center gap-4 md:flex-row">
      <Link
        href="/registro-finca"
        className="bg-green-600 px-6 py-2 text-white transition hover:bg-green-700 rounded-lg"
      >
        Registrar finca
      </Link>
      <Link
        href="/explorar"
        className="bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 rounded-lg"
      >
        Explorar fincas
      </Link>
    </div>
  </>
);
