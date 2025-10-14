'use server';
import prisma from '@/lib/prisma';

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
  disponibilidadAnual?: boolean;
  ofreceAlojamiento?: boolean;
  entornoLimpioSeguro?: boolean;
  elementosInteres: string[];
  actividadesAgroturisticas: string[];
  principiosSustentabilidad: string[];
  accionesAmbientales: string[];
}

export async function updateFinca(data: FincaUpdateInput) {
  try {
    // Eliminar relaciones previas y crear nuevas (simplificado para SQLite)
    await prisma.elementoInteres.deleteMany({ where: { fincaId: data.id } });
    await prisma.actividadAgroturistica.deleteMany({
      where: { fincaId: data.id },
    });
    await prisma.principioSustentabilidad.deleteMany({
      where: { fincaId: data.id },
    });
    await prisma.accionAmbiental.deleteMany({ where: { fincaId: data.id } });
    const updateData: any = {
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
    };
    if (data.fotoUrl) updateData.fotoUrl = data.fotoUrl;
    const finca = await prisma.finca.update({
      where: { id: data.id },
      data: updateData,
      include: {
        elementosInteres: true,
        actividadesAgroturisticas: true,
        principiosSustentabilidad: true,
        accionesAmbientales: true,
      },
    });
    return { ok: true, data: finca };
  } catch (error) {
    return { ok: false, message: 'No se pudo actualizar la finca' };
  }
}
