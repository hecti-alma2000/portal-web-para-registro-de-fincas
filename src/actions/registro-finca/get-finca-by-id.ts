'use server';

import prisma from '@/lib/prisma';
import { Finca, RequestStatus } from '@prisma/client'; // Importamos tipos base de Prisma

export const getFincaById = async (id: number) => {
  try {
    const finca = await prisma.finca.findUnique({
      where: { id },
      // 🔑 INCLUIR TODAS LAS RELACIONES REQUERIDAS POR FincaDetails
      include: {
        // Relación con el usuario que la creó
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        // Relaciones One-to-Many que se mapean a listas
        elementosInteres: {
          select: {
            nombre: true,
          },
        },
        actividadesAgroturisticas: {
          select: {
            nombre: true,
          },
        },
        principiosSustentabilidad: {
          select: {
            nombre: true,
          },
        },
        accionesAmbientales: {
          select: {
            nombre: true,
          },
        },
      },
    });

    if (!finca) {
      return null;
    }

    // 🔑 Mapear los datos para que coincidan con el tipo FincaWithRelations
    // Convertimos las listas de objetos ({ nombre: string }) a arrays de strings (string[])
    return {
      ...finca,
      elementosInteres: finca.elementosInteres.map((e) => e.nombre),
      actividadesAgroturisticas: finca.actividadesAgroturisticas.map((a) => a.nombre),
      principiosSustentabilidad: finca.principiosSustentabilidad.map((p) => p.nombre),
      accionesAmbientales: finca.accionesAmbientales.map((a) => a.nombre),
      // Aseguramos que 'user' es el objeto mapeado o null
      user: finca.user
        ? {
            id: finca.user.id,
            name: finca.user.name,
            email: finca.user.email,
          }
        : null,
    };
  } catch (error) {
    console.error('Error fetching Finca by id:', error);
    return null;
  }
};

// 🔑 DEFINICIÓN DEL TIPO PARA QUE PAGE.TSX Y FINCADETAILS.TSX PUEDAN USARLO
export type FincaWithRelations = Awaited<ReturnType<typeof getFincaById>>;
// Esto resuelve el error en el componente de página.
