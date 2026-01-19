'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';
import { RequestStatus } from '@prisma/client';
import { Resend } from 'resend'; // 1. Importar Resend
import { AdminAlertEmail } from '@/components/emails/AdminAlertEmail'; // 2. Importar tu template

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// --- Tipos de Datos ---
export type FincaFormData = {
  nombre: string;
  localizacion: string;
  propietario: string;
  descripcion?: string | null;
  fotoUrl?: string | null;
  tipoPropiedad: 'ESTATAL' | 'PRIVADA';
  entidadPertenece?: string | null;
  usoActual?: string | null;
  estadoConservacion?: string | null;
  problematicaDetectada?: string | null;
  tradicionesHistoria?: string | null;
  elementosInteres: string[];
  actividadesAgroturisticas: string[];
  principiosSustentabilidad: string[];
  accionesAmbientales: string[];
};

export async function submitFincaRequest(data: FincaFormData, fincaId?: number) {
  const session = await auth();
  if (!session?.user) return { ok: false, message: 'No autenticado' };

  const { user } = session;

  try {
    // 1. LÓGICA DE ESTADO CONDICIONAL
    let newStatus: RequestStatus;

    if (user.role === 'admin') {
      newStatus = RequestStatus.APPROVED;
    } else {
      newStatus = RequestStatus.PENDING;
    }

    // 2. Preparar datos base
    const baseData = {
      nombre: data.nombre,
      localizacion: data.localizacion,
      propietario: data.propietario,
      descripcion: data.descripcion,
      fotoUrl: data.fotoUrl,
      tipoPropiedad: data.tipoPropiedad,
      status: newStatus,
      entidadPertenece: data.entidadPertenece,
      usoActual: data.usoActual,
      estadoConservacion: data.estadoConservacion,
      problematicaDetectada: data.problematicaDetectada,
      tradicionesHistoria: data.tradicionesHistoria,
    };

    let finca;

    // 3. OPERACIÓN DE BASE DE DATOS (Crear o Actualizar)
    if (fincaId) {
      // --- ACTUALIZACIÓN ---
      finca = await prisma.finca.update({
        where: { id: fincaId },
        data: {
          ...baseData,
          // Si no es admin, vuelve a PENDING al editar
          status: user.role === 'admin' ? baseData.status : RequestStatus.PENDING,
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
      // --- CREACIÓN ---
      finca = await prisma.finca.create({
        data: {
          ...baseData,
          user: { connect: { id: user.id } },
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

    // 4. LÓGICA DE NOTIFICACIÓN POR CORREO (Solo si quedó PENDING)
    // Esto significa que un usuario normal hizo la petición y los admins deben saberlo.
    if (finca.status === RequestStatus.PENDING) {
      try {
        // A. Buscar los emails de todos los admins
        const admins = await prisma.user.findMany({
          where: { role: 'admin' },
          select: { email: true },
        });

        // Filtrar nulos y obtener array de strings
        const adminEmails = admins.map((a) => a.email).filter(Boolean) as string[];

        // B. Enviar correo si hay admins
        if (adminEmails.length > 0) {
          const { error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
            to: adminEmails,
            subject: fincaId
              ? `Actualización de Finca Pendiente: ${finca.nombre}`
              : `Nueva Solicitud de Finca: ${finca.nombre}`,
            react: AdminAlertEmail({
              nombreFinca: finca.nombre,
              nombrePropietario: user.name || 'Usuario', // Nombre del usuario que hace la petición
              fincaId: finca.id,
            }),
          });

          if (error) {
            console.error('Error enviando email a admins:', error);
            // No hacemos throw para no cancelar el registro de la finca, solo logueamos.
          }
        }
      } catch (emailError) {
        console.error('Error en el bloque de notificación:', emailError);
      }
    }

    // 5. Retornar respuesta exitosa
    return {
      ok: true,
      data: finca,
      isPending: finca.status === RequestStatus.PENDING,
    };
  } catch (error) {
    console.error('submitFincaRequest error: ', error);
    return { ok: false, message: 'Error al procesar la solicitud de la finca.' };
  }
}
