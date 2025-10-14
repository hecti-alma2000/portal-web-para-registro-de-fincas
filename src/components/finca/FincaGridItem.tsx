'use client';

import { Finca } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  finca: Finca;
}

export const FincaGridItem = ({ finca }: Props) => {
  return (
    <div className="overflow-hidden rounded-lg shadow-xl transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl bg-white">
      <Link href={`/fincas/${finca.id}`} className="contents">
        {/* Sección de la Imagen */}
        <div className="relative w-full h-56 md:h-72">
          {finca.fotoUrl && (
            <Image
              src={finca.fotoUrl}
              alt={finca.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false} // Se puede cambiar a true para las primeras, pero por defecto false para listas grandes
            />
          )}
          {!finca.fotoUrl && (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
              <span className="text-sm">📷 Imagen no disponible</span>
            </div>
          )}
        </div>

        {/* Sección de los Detalles */}
        <div className="p-4 flex flex-col justify-between h-auto">
          <div className="flex-grow">
            {/* Nombre */}
            <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{finca.nombre}</h3>

            {/* Localización */}
            <p className="mt-1 text-sm text-gray-500 line-clamp-1">📍 {finca.localizacion}</p>
          </div>

          {/* Tipo de Propiedad (Badge) */}
          <div className="mt-3">
            <span
              className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium
                ${
                  finca.tipoPropiedad === 'PRIVADA'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }
              `}
            >
              {finca.tipoPropiedad === 'PRIVADA' ? 'Propiedad Privada' : 'Propiedad Estatal'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
