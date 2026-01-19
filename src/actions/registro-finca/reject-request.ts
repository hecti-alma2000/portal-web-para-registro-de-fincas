'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { UserRejectEmail } from '@/components/emails/UserRejectEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function deleteFincaRequest(id: number) {
  const session = await auth();

  // 1. Verificación de seguridad
  if (!session?.user || session.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  try {
    // 2. Ejecutar el borrado e INCLUIR el usuario antes de que desaparezca de la relación
    // 🔑 CLAVE: Asignamos el resultado a la constante 'finca'
    const finca = await prisma.finca.delete({
      where: { id },
      include: {
        user: true, // Esto nos permite tener el email aunque el registro se borre
      },
    });

    // 3. Notificación al usuario (Solo si existía un usuario vinculado)
    if (finca.user?.email) {
      try {
        const { error } = await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: finca.user.email,
          subject: `Información sobre su finca: ${finca.nombre}`,
          react: UserRejectEmail({
            nombreFinca: finca.nombre,
            nombreUsuario: finca.user.name || 'Usuario',
          }),
        });

        if (error) {
          console.error('Error de Resend al enviar correo de rechazo:', error);
        }
      } catch (emailError) {
        console.error('Error de red al intentar enviar el correo de rechazo:', emailError);
      }
    }

    // 4. Actualizar la interfaz
    revalidatePath('/admin/request');

    return { ok: true, message: 'Finca eliminada y usuario notificado.' };
  } catch (error) {
    console.error('Error en deleteFincaRequest:', error);
    return { ok: false, message: 'Error al eliminar la finca o solicitud.' };
  }
}
