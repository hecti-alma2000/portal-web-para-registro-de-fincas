'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';
import { RequestStatus } from '@prisma/client'; // 🔑 IMPORTANTE: Usar el enum de Prisma

// --- Tipos de Datos (Deben coincidir con los del formulario) ---
export type FincaFormData = {
  nombre: string;
  localizacion: string;
  propietario: string;

  // Campos opcionales String? (Prisma: String | Null)
  descripcion?: string | null;
  fotoUrl?: string | null;
  tipoPropiedad: 'ESTATAL' | 'PRIVADA';

  entidadPertenece?: string | null;
  usoActual?: string | null;
  estadoConservacion?: string | null;
  problematicaDetectada?: string | null;
  tradicionesHistoria?: string | null;

  // Listas (Relaciones One-to-Many)
  elementosInteres: string[];
  actividadesAgroturisticas: string[];
  principiosSustentabilidad: string[];
  accionesAmbientales: string[];
};

// El parámetro de la función incluye el ID opcional para la edición
export async function submitFincaRequest(data: FincaFormData, fincaId?: number) {
  const session = await auth();
  if (!session?.user) return { ok: false, message: 'No autenticado' };

  const { user } = session;

  try {
    // 1. LÓGICA DE ESTADO CONDICIONAL
    let newStatus: RequestStatus;

    if (user.role === 'admin') {
      // Si es admin, se aprueba directamente
      newStatus = RequestStatus.APPROVED;
    } else {
      // Si es usuario normal, se requiere aprobación (PENDING)
      newStatus = RequestStatus.PENDING;
    }

    // 2. Base de datos para la creación/actualización
    const baseData = {
      nombre: data.nombre,
      localizacion: data.localizacion,
      propietario: data.propietario,
      descripcion: data.descripcion,
      fotoUrl: data.fotoUrl,
      tipoPropiedad: data.tipoPropiedad,
      // 🔑 CORRECCIÓN CLAVE: Usamos el enum de Prisma
      status: newStatus,
      entidadPertenece: data.entidadPertenece,
      usoActual: data.usoActual,
      estadoConservacion: data.estadoConservacion,
      problematicaDetectada: data.problematicaDetectada,
      tradicionesHistoria: data.tradicionesHistoria,
    };

    let finca;

    // 3. CREACIÓN vs. ACTUALIZACIÓN
    if (fincaId) {
      // --- A. ACTUALIZACIÓN (Edición) ---

      finca = await prisma.finca.update({
        where: { id: fincaId },
        data: {
          ...baseData,
          // Si el usuario NO es admin, forzamos PENDING para la revisión
          status: user.role === 'admin' ? baseData.status : RequestStatus.PENDING,

          // Actualización de relaciones (eliminar todos y crear nuevos)
          elementosInteres: {
            deleteMany: {},
            create: data.elementosInteres.map((nombre) => ({ nombre })),
          },
          actividadesAgroturisticas: {
            deleteMany: {},
            create: data.actividadesAgroturisticas.map((nombre) => ({ nombre })),
          },
          principiosSustentabilidad: {
            deleteMany: {},
            create: data.principiosSustentabilidad.map((nombre) => ({ nombre })),
          },
          accionesAmbientales: {
            deleteMany: {},
            create: data.accionesAmbientales.map((nombre) => ({ nombre })),
          },
        },
      });
    } else {
      // --- B. CREACIÓN (Nuevo Registro) ---
      finca = await prisma.finca.create({
        data: {
          ...baseData,
          user: { connect: { id: user.id } },
          // Creación de relaciones
          elementosInteres: {
            create: data.elementosInteres.map((nombre) => ({ nombre })),
          },
          actividadesAgroturisticas: {
            create: data.actividadesAgroturisticas.map((nombre) => ({ nombre })),
          },
          principiosSustentabilidad: {
            create: data.principiosSustentabilidad.map((nombre) => ({ nombre })),
          },
          accionesAmbientales: {
            create: data.accionesAmbientales.map((nombre) => ({ nombre })),
          },
        },
      });
    }

    return {
      ok: true,
      data: finca,
      isPending: finca.status === RequestStatus.PENDING,
    };
  } catch (error) {
    console.error('submitFincaRequest error (Create/Update): ', error);
    return { ok: false, message: 'Error al procesar la solicitud de la finca.' };
  }
}
