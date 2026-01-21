// app/page.tsx
'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image'; //  Importamos el componente Image
import { Divider } from '@/components/ui/Divider';

const HeroBanner = dynamic(() => import('../../components/HeroBanner'), {
  ssr: false,
  loading: () => <div className="w-full h-[50vh] bg-gray-200 animate-pulse"></div>,
});

const LazyCarrusel = dynamic(() => import('../../components/ui/carrusel/Carrusel'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-125 bg-gray-200 animate-pulse flex items-center justify-center">
      <p>Cargando Carrusel...</p>
    </div>
  ),
});

export default function Home() {
  // Contenido de la descripción del Agroturismo (lo he agregado para completar la primera sección)
  const AgroturismoDescription = (
    <div className="animate__animated animate__lightSpeedInLeft flex flex-col justify-center">
      <h2 className="mb-4 text-center text-2xl font-semibold md:text-left">
        ¿Qué es el Agroturismo?
      </h2>
      <p className="text-justify leading-relaxed text-gray-700 prose dark:prose-invert">
        El agroturismo te invita a sumergirte en la auténtica vida del campo, participando en
        labores agrícolas y ganaderas que conectan a las personas con la naturaleza de una forma
        única y educativa. Es una modalidad de turismo sostenible que no solo ofrece una experiencia
        inolvidable, sino que también contribuye directamente al desarrollo de las comunidades
        rurales y a la preservación de su rica cultura y tradiciones ancestrales.
      </p>
    </div>
  );

  // Contenido del Sistema de Certificación (reducido y corregido para reuso)
  const CertificacionContent = (
    <div className="animate__animated animate__lightSpeedInLeft flex flex-col justify-center">
      <h2 className="mb-4 text-center text-2xl font-semibold md:text-left prose dark:prose-invert">
        ¿En qué consiste nuestro sistema de certificación?
      </h2>
      <p className="text-justify leading-relaxed text-gray-700 prose dark:prose-invert">
        Nuestro sistema de certificación se basa en el
        <b className="text-blue-600 font-extrabold">
          {' '}
          índice de Finca con Potencial Agroturístico (FPAT)
        </b>
        , una herramienta que valora la <b className="text-blue-600">viabilidad y calidad</b> de tu
        propiedad rural como destino turístico. El índice de <b className="text-blue-600">FPAT</b>{' '}
        utiliza un <b className="text-green-600">sistema de puntaje ponderado</b> para evaluar 11
        criterios clave asociados a las dimensiones del desarrollo territorial , incluyendo{' '}
        <b className="text-green-600">sustentabilidad agrícola</b>, infraestructura y accesibilidad.
        La calificación final determina si la finca es <b className="text-red-600">APTA</b>,
        certificando su sólido <b className="text-red-600">potencial agroturístico</b> y ofreciendo
        una guía para el desarrollo sostenible.
      </p>
    </div>
  );

  return (
    <main className="flex flex-col items-center overflow-x-hidden">
      <HeroBanner />
      <div className="w-full max-w-7xl px-4 mx-auto md:px-8 lg:px-12">
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

        {/* ==================== SECCIÓN 1: DESCUBRE AGROTURISMO Y CARRUSEL ==================== */}
        <Divider dividerTitle="Descubre el Agroturismo" />
        <div className="my-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {AgroturismoDescription} {/* Contenido en Columna 1 */}
          <div>
            <LazyCarrusel /> {/* Carrusel en Columna 2 */}
          </div>
        </div>

        {/* ==================== SECCIÓN 2: FPAT Y CERTIFICACIÓN (Diseño de Mitad/Mitad) ==================== */}
        <Divider dividerTitle="FPAT" />
        <div className="my-10 grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
          {/* COLUMNA 1: Contenido del Sistema de Certificación (Ocupa la mitad) */}
          <div className="p-6 bg-white shadow-lg rounded-xl">{CertificacionContent}</div>

          {/* COLUMNA 2: Logo y Enlace (Ocupa la otra mitad) */}
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
                <span className="text-black text-2xl font-bold">
                  Fincas con Potencial Agroturístico
                </span>
                <Link
                  href="/certificacion"
                  className="bg-green-600 px-6 py-2 text-white transition hover:bg-green-700 rounded-lg mt-3 text-center font-medium"
                >
                  Descubre si tu finca cuenta con el potencial agroturístico
                </Link>
              </div>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
