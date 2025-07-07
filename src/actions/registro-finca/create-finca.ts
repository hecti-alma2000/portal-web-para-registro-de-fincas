"use server";
import prisma from "@/lib/prisma";

export interface FincaInput {
  nombre: string;
  localizacion: string;
  propietario: string;
  descripcion?: string;
  tipoPropiedad: "ESTATAL" | "PRIVADA";
  entidadPertenece?: string;
  usoActual?: string;
  estadoConservacion?: string;
  problematicaDetectada?: string;
  tradicionesHistoria?: string;
  disponibilidadAnual?: boolean;
  ofreceAlojamiento?: boolean;
  entornoLimpioSeguro?: boolean;
  elementosInteres: string[];
  actividadesAgroturisticas: string[];
  principiosSustentabilidad: string[];
  accionesAmbientales: string[];
}

export async function createFinca(data: FincaInput) {
  try {
    const finca = await prisma.finca.create({
      data: {
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
        disponibilidadAnual: data.disponibilidadAnual,
        ofreceAlojamiento: data.ofreceAlojamiento,
        entornoLimpioSeguro: data.entornoLimpioSeguro,
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
      include: {
        elementosInteres: true,
        actividadesAgroturisticas: true,
        principiosSustentabilidad: true,
        accionesAmbientales: true,
      },
    });
    return { ok: true, data: finca };
  } catch (error) {
    return { ok: false, message: "No se pudo registrar la finca" };
  }
}
