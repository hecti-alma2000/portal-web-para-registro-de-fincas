import Link from 'next/link';
import Image from 'next/image';
export const FincasValidationShortcut = () => (
  <div className="flex flex-col items-center justify-center p-6 space-y-4">
    <span className="flex items-center space-x-3">
      <div className="relative h-28 w-28 shrink-0">
        <Image
          src="/icons/logo.png"
          alt="Logo FPAT"
          fill // La imagen llena el contenedor padre
          sizes="112px"
          className="object-contain" // Asegura que el logo se ajuste sin cortarse
        />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold">Fincas con Potencial Agroturístico</span>
        <Link
          href="/certificacion"
          className="bg-green-600 px-6 py-2 text-white transition hover:bg-green-700 rounded-lg mt-3 text-center font-medium"
        >
          Descubre el potencial de tu finca
        </Link>
      </div>
    </span>
  </div>
);
// prose dark:prose-invert
