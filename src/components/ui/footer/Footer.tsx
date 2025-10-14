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
    <footer className="bg-gray-100 py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sección principal de logos y colaboradores */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-8">
          {/* Título y descripción del portal */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-800">Portal de Agroturismo Holguín</h2>
            <p className="mt-1 text-base text-gray-600">
              Descubre las maravillas del agroturismo en el municipio holguinero de Calixto García.
            </p>
          </div>

          {/* Contenedor de logos de colaboradores */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
            {logos.map((logo, index) => (
              <div key={index}>
                <Link href={logo.href} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={90}
                    height={90}
                    className="hover:scale-105 transition-transform duration-300 object-contain"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Línea divisora */}
        <hr className="my-8 border-gray-300" />

        {/* Sección de información de proyecto y derechos */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            Este proyecto forma parte de la tesis doctoral{' '}
            <strong>
              Fincas con potencial agrotrístico en el contexto del desarrollo territorial.
            </strong>
          </p>
          <p className="mt-1">
            Realizada por <strong>Lisbet Eunice Pérez Anzardo</strong> con el apoyo y colaboración
            de <strong>cuanticosurl.com</strong>.
          </p>
          <p className="mt-4 text-xs">© {new Date().getFullYear()}Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
