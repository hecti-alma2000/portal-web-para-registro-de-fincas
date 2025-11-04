// app/page.tsx
'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image'; //  Importamos el componente Image
import { Divider } from '@/components/ui/Divider';

const HeroBanner = dynamic(() => import('../../components/HeroBanner'), {
  ssr: false,
  loading: () => <div className="w-full h-[50vh] bg-gray-200 animate-pulse"></div>,
});

const LazyCarrusel = dynamic(() => import('../../components/ui/carrusel/Carrusel'), {
  ssr: false,
  loading: () => (
    // Se elimina 'max-w-lg' y 'mx-auto' ya que el carrusel ocupará la mitad del espacio
    <div className="w-full h-[500px] bg-gray-200 animate-pulse flex items-center justify-center">
      <p>Cargando Carrusel...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="flex flex-col items-center overflow-x-hidden">
      <HeroBanner />
      <div className="w-full max-w-screen-xl px-4 mx-auto md:px-8 lg:px-12">
        <h1 className="mb-6 mt-5 text-center text-3xl font-bold">
          Gestiona y explora fincas de Agroturismo.
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
        <Divider dividerTitle="Descubre el Agroturismo" />
        {/* Vuelve a la configuración de dos columnas de igual tamaño */}
        <div className="my-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="animate__animated animate__lightSpeedInLeft flex flex-col justify-center">
            <h2 className="mb-4 text-center text-2xl font-semibold md:text-left">
              ¿Qué es el Agroturismo?
            </h2>
            <p className="text-justify leading-relaxed text-gray-700">
              El agroturismo te invita a sumergirte en la auténtica vida del campo, participando en
              labores agrícolas y ganaderas que conectan a las personas con la naturaleza de una
              forma única y educativa. Es una modalidad de turismo sostenible que no solo ofrece una
              experiencia inolvidable, sino que también contribuye directamente al desarrollo de las
              comunidades rurales y a la preservación de su rica cultura y tradiciones ancestrales.
              Al visitar una finca, estás apoyando de manera directa a las familias campesinas,
              ayudándoles a diversificar sus ingresos y a mantener sus raíces en la tierra. Descubre
              la belleza de la flora y fauna locales, saborea productos frescos de la huerta a la
              mesa y vive una aventura diferente en cada rincón, creando recuerdos que te conectarán
              con lo más genuino de nuestra tierra.
            </p>
          </div>
          <div>
            <LazyCarrusel />
          </div>
        </div>
        <Divider dividerTitle="FPAT" />
        <div className="my-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="animate__animated animate__lightSpeedInLeft flex flex-col justify-center">
            <h2 className="mb-4 text-center text-2xl font-semibold md:text-left">
              ¿En qué consiste nuestro sistema de certificación?
            </h2>
            <p className="text-justify leading-relaxed text-gray-700">
              Nuestro sistema de certificación se fundamenta en la aplicación del{' '}
              <b className="text-blue-600">Índice de Potencial Agroturístico (FPAT)</b>, una
              herramienta de evaluación diseñada para determinar la{' '}
              <b className="text-blue-600">viabilidad y calidad</b> de una propiedad rural como
              destino de agroturismo.
              <br />
              <br />
              Este método consiste en un{' '}
              <b className="text-green-600">proceso de asignación de puntaje ponderado</b>. Cada
              dimensión de la finca incluyendo factores como la accesibilidad, el manejo de la
              sustentabilidad agrícola, la infraestructura disponible y el atractivo sociocultural
              del entorno es evaluada. Posteriormente, cada calificación es multiplicada por un{' '}
              <b className="text-green-600">peso de importancia</b> específico. La suma de estas
              puntuaciones ponderadas arroja un{' '}
              <b className="text-green-600">diagnóstico preciso</b> sobre el potencial de la
              propiedad.
              <br />
              <br />
              <b className="text-red-600">El resultado del diagnóstico es categórico:</b> si la
              puntuación obtenida supera el umbral establecido por el índice, la propiedad se
              clasifica como <b className="text-red-600">APTA</b> para el desarrollo agroturístico,
              indicando un potencial sólido para la generación de ingresos y el desarrollo local. Si
              la calificación es inferior, se declara "No Apta", proporcionando de manera inherente
              una guía clara para la formulación de planes de mejora estratégicos. Este sistema
              garantiza una certificación rigurosa y justa, esencial para el crecimiento sostenible
              del sector.
            </p>
          </div>

          <span className="flex items-center ">
            {/*  OPTIMIZACIÓN: Usar next/image para el logo */}
            <Image
              src="/icons/logo.png"
              alt="Logo"
              width={112} // Equivalente a h-28 w-28 (112px en Tailwind por defecto)
              height={112} // Si la imagen es crítica, puedes usar 'priority' aquí.
              sizes="112px"
              className="h-28 w-28 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-black text-2xl font-bold">
                Fincas con Potencial Agroturístico
              </span>
              <Link
                href="/certificacion"
                className="bg-green-600 px-6 py-2  text-white transition hover:bg-green-700 rounded-lg"
              >
                Descubre si tu finca cuenta con el potencial agroturístico
              </Link>
            </div>
          </span>
        </div>
      </div>
    </main>
  );
}
