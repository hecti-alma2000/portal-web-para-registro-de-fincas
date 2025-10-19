// En tu archivo de Server Actions (ej: '@/actions/registro-finca/update-finca')

'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';
import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation'; // ⚠️ Ya no se usa para evitar la interrupción

// Esta interfaz es la que DEBE ser usada en el parámetro 'data'
export interface FincaUpdateInput {
  id: number;
  nombre: string;
  localizacion: string;
  propietario: string;
  descripcion?: string;
  fotoUrl?: string;
  tipoPropiedad: 'ESTATAL' | 'PRIVADA';
  entidadPertenece?: string;
  usoActual?: string;
  estadoConservacion?: string;
  problematicaDetectada?: string;
  tradicionesHistoria?: string;
  elementosInteres: string[];
  actividadesAgroturisticas: string[];
  principiosSustentabilidad: string[];
  accionesAmbientales: string[];
}

// ASEGÚRATE que la función reciba 'data: FincaUpdateInput'
export async function updateFinca(data: FincaUpdateInput) {
  const session = await auth();
  const fincaId = data.id;

  if (!session?.user) {
    return { ok: false, message: 'No autenticado. Inicie sesión.' };
  }

  const userId = session.user.id;
  const isAdmin = session.user.role === 'admin';

  try {
    // 1. VERIFICACIÓN DE PROPIEDAD Y EXISTENCIA (SEGURIDAD RBAC)
    const fincaToUpdate = await prisma.finca.findUnique({
      where: { id: fincaId },
      select: { userId: true },
    });

    if (!fincaToUpdate) {
      return { ok: false, message: 'Finca no encontrada.' };
    }

    if (!isAdmin && fincaToUpdate.userId !== userId) {
      return { ok: false, message: 'No tiene permisos para actualizar esta finca.' };
    }

    // 2. PREPARACIÓN DE DATOS
    const {
      nombre,
      localizacion,
      propietario,
      descripcion,
      fotoUrl,
      tipoPropiedad,
      entidadPertenece,
      usoActual,
      estadoConservacion,
      problematicaDetectada,
      tradicionesHistoria,
      id,
      elementosInteres,
      actividadesAgroturisticas,
      principiosSustentabilidad,
      accionesAmbientales,
    } = data;

    const updateData = {
      nombre,
      localizacion,
      propietario,
      descripcion,
      fotoUrl,
      tipoPropiedad,
      entidadPertenece,
      usoActual,
      estadoConservacion,
      problematicaDetectada,
      tradicionesHistoria,
    };

    // 3. EJECUTAR TRANSACCIÓN (Eliminar y Crear)
    const [_, finca] = await prisma.$transaction([
      // Eliminar dependencias
      prisma.elementoInteres.deleteMany({ where: { fincaId: id } }),
      prisma.actividadAgroturistica.deleteMany({ where: { fincaId: id } }),
      prisma.principioSustentabilidad.deleteMany({ where: { fincaId: id } }),
      prisma.accionAmbiental.deleteMany({ where: { fincaId: id } }),

      // Actualizar Finca y Crear nuevas dependencias
      prisma.finca.update({
        where: { id: id },
        data: {
          ...updateData,
          elementosInteres: {
            create: elementosInteres.map((nombre: string) => ({ nombre })),
          },
          actividadesAgroturisticas: {
            create: actividadesAgroturisticas.map((nombre: string) => ({ nombre })),
          },
          principiosSustentabilidad: {
            create: principiosSustentabilidad.map((nombre: string) => ({ nombre })),
          },
          accionesAmbientales: {
            create: accionesAmbientales.map((nombre: string) => ({ nombre })),
          },
        },
        include: {
          elementosInteres: true,
          actividadesAgroturisticas: true,
          principiosSustentabilidad: true,
          accionesAmbientales: true,
        },
      }),
    ]);

    // ✅ CORRECCIÓN: Revalida la caché para refrescar la lista.
    revalidatePath('/registro-finca');

    // ✅ CORRECCIÓN: Devuelve una respuesta de éxito explícita al cliente.
    return { ok: true, message: 'Finca actualizada exitosamente.', data: finca };
  } catch (error) {
    console.error('ERROR AL ACTUALIZAR FINCA:', error);
    return { ok: false, message: 'No se pudo actualizar la finca' };
  }
}
// Asegúrate de hacer el mismo ajuste en 'createFinca' si también usas redirect() allí.
