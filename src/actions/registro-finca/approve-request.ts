'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend'; // 1. Importar Resend
import { UserApprovedEmail } from '@/components/emails/UserApprovedEmail'; // 2. Importar template

// Inicializar cliente de correo
const resend = new Resend(process.env.RESEND_API_KEY);
export async function approveFincaRequest(id: number) {
  const session = await auth();

  // Verificación de seguridad
  if (!session?.user || session.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  try {
    // 3. Actualizar estado e INCLUIR el usuario dueño de la finca
    const finca = await prisma.finca.update({
      where: { id },
      data: { status: 'APPROVED' },
      include: {
        user: true, // Para leer finca.user.email
      },
    });

    // 4. Lógica de Notificación (Bloque de seguridad independiente)
    if (finca.user?.email) {
      try {
        const { error } = await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: finca.user.email,
          subject: '¡Tu finca ha sido Aprobada!',
          react: UserApprovedEmail({
            nombreFinca: finca.nombre,
            nombreUsuario: finca.user.name || 'Usuario',
          }),
        });

        if (error) {
          console.error('Error de Resend al enviar correo de aprobación:', error);
        }
      } catch (emailError) {
        console.error('Error intentando enviar el correo:', emailError);
      }
    } else {
      console.warn(`La finca ${finca.id} se aprobó pero el usuario no tenía email registrado.`);
    }

    // 5. Revalidación de rutas
    revalidatePath('/admin/request');
    revalidatePath('/fincas'); // actualizar el catálogo público también

    return { ok: true, data: finca };
  } catch (error) {
    console.error('Error general en approveFincaRequest:', error);
    return { ok: false, message: 'Error al aprobar la finca en base de datos' };
  }
}
