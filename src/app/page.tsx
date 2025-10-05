// app/page.tsx
'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Divider } from '@/components/ui/Divider';

const HeroBanner = dynamic(() => import('../components/HeroBanner'), {
  ssr: false,
  loading: () => <div className="w-full h-[50vh] bg-gray-200 animate-pulse"></div>,
});

const LazyCarrusel = dynamic(() => import('../components/ui/carrusel/Carrusel'), {
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
              El agroturismo te invita a sumergirte en la auténtica vida del campo, participando en labores agrícolas y ganaderas que conectan a las personas con la naturaleza de una forma única y educativa. Es una modalidad de turismo sostenible que no solo ofrece una experiencia inolvidable, sino que también contribuye directamente al desarrollo de las comunidades rurales y a la preservación de su rica cultura y tradiciones ancestrales. Al visitar una finca, estás apoyando de manera directa a las familias campesinas, ayudándoles a diversificar sus ingresos y a mantener sus raíces en la tierra. Descubre la belleza de la flora y fauna locales, saborea productos frescos de la huerta a la mesa y vive una aventura diferente en cada rincón, creando recuerdos que te conectarán con lo más genuino de nuestra tierra.
            </p>
          </div>
          <div>
            <LazyCarrusel />
          </div>
        </div>
        <Divider dividerTitle='FPAT' />
          <div className="my-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="animate__animated animate__lightSpeedInLeft flex flex-col justify-center">
            <h2 className="mb-4 text-center text-2xl font-semibold md:text-left">
              ¿En que conciste nuestro sistema de certificacion ?
            </h2>
            <p className="text-justify leading-relaxed text-gray-700">
              Aqui va la explicacion
            </p>
          </div>
          
            <span className="flex items-center ">
              {/* Carga perezosa de la imagen del logo */}
              <img
                src="/icons/logo.png"
                alt="Logo"
                className="h-28 w-28"
                loading="lazy"
              />
              <div className='flex flex-col'>
                <span className="text-black text-2xl font-bold">
                  Fincas con Potencial Agroturístico
                </span>
                <Link
            href="/certificacion"
            className="bg-green-600 px-6 py-2  text-white transition hover:bg-green-700 rounded-lg"
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