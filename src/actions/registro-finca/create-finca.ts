// src/actions/registro-finca/create-finca.ts

'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth.config'; // Asegúrate de que esta importación exista

export interface FincaInput {
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

// 🔑 Asegúrate de que la firma de la función reciba 'data' como FincaInput
export async function createFinca(data: FincaInput) {
  // 1. Obtener la sesión del usuario
  const session = await auth();

  if (!session?.user) {
    return { ok: false, message: 'No autenticado. Inicie sesión para registrar una finca.' };
  }

  const userId = session.user.id;

  try {
    // La variable 'data' de tipo FincaInput es accesible aquí y NO DEBERÍA haber errores
    const createData: any = {
      // CONEXIÓN DE USUARIO (esto es lo que causó el error anterior)
      user: {
        connect: {
          id: userId,
        },
      },

      // DATOS DE FINCA (las líneas con error de tipado)
      nombre: data.nombre,
      localizacion: data.localizacion,
      propietario: data.propietario,
      descripcion: data.descripcion,
      tipoPropiedad: data.tipoPropiedad,
      entidadPertenece: data.entidadPertenece,
      usoActual: data.usoActual,
      estadoConservacion: data.estadoConservacion,
      problematicaDetectada: data.problematicaDetectada,
      tradicionesHistoria: data.tradicionesHistoria,

      // Relaciones
      elementosInteres: {
        // 🔑 Añade el tipado explícito para 'nombre' para resolver el error 7006
        create: data.elementosInteres.map((nombre: string) => ({ nombre })),
      },
      actividadesAgroturisticas: {
        create: data.actividadesAgroturisticas.map((nombre: string) => ({ nombre })),
      },
      principiosSustentabilidad: {
        create: data.principiosSustentabilidad.map((nombre: string) => ({ nombre })),
      },
      accionesAmbientales: {
        create: data.accionesAmbientales.map((nombre: string) => ({ nombre })),
      },
    };

    if (data.fotoUrl) createData.fotoUrl = data.fotoUrl;

    const finca = await prisma.finca.create({
      data: createData,
      include: {
        elementosInteres: true,
        actividadesAgroturisticas: true,
        principiosSustentabilidad: true,
        accionesAmbientales: true,
      },
    });

    return { ok: true, data: finca };
  } catch (error) {
    console.error('ERROR AL REGISTRAR FINCA:', error);
    return { ok: false, message: 'No se pudo registrar la finca' };
  }
}
