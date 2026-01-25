'use client';
import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => {
  // Lista de logos de instituciones colaboradoras
  const logos = [
    {
      src: '/logos/cuantico.webp',
      alt: 'Cuantico',
      href: 'http://cuanticosurl.com/',
    },
    {
      src: '/logos/universidad-holguin.webp',
      alt: 'Universidad de Holguín',
      href: 'https://www.uho.edu.cu/',
    },
  ];

  return (
    /* Cambiamos bg-gray-100 por un fondo que responda al tema */
    <footer className="bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-md py-10 mt-12 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección principal de logos y colaboradores */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-8">
          {/* Título y descripción del portal */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">
              Portal de Agroturismo Holguín
            </h2>
            <p className="mt-1 text-base text-zinc-600 dark:text-zinc-400">
              Descubre las maravillas del agroturismo en el municipio holguinero de Calixto García.
            </p>
          </div>

          {/* Contenedor de logos de colaboradores */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-sm dark:shadow-none transition-colors"
              >
                <Link href={logo.href} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={90}
                    height={90}
                    priority={true}
                    sizes="(max-width: 768px) 90px, 90px"
                    /* Invertimos logos si son oscuros o simplemente aplicamos hover */
                    className="hover:scale-105 transition-transform duration-300 object-contain dark:brightness-110"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Línea divisora adaptable */}
        <hr className="my-8 border-zinc-300 dark:border-zinc-700" />

        {/* Sección de información de proyecto y derechos */}
        <div className="text-center text-zinc-500 dark:text-zinc-400 text-sm">
          <p>
            Este proyecto forma parte de la tesis doctoral{' '}
            <strong className="text-zinc-700 dark:text-zinc-200">
              Fincas con potencial agrotrístico en el contexto del desarrollo territorial
            </strong>
          </p>
          <p className="mt-1">
            desarrollada por{' '}
            <strong className="text-zinc-700 dark:text-zinc-200">
              Lisbet Eunice Pérez Anzardo
            </strong>{' '}
            con el apoyo y colaboración de{' '}
            <Link
              href={'https://cuanticosurl.com/'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
            >
              cuanticosurl.com
            </Link>
          </p>
          <p className="mt-4 text-xs opacity-70">
            © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
