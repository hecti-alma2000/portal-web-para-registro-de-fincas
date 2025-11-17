'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';
import { revalidatePath } from 'next/cache'; // 👈 Importación necesaria

export async function approveFincaRequest(id: number) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  try {
    const finca = await prisma.finca.update({ where: { id }, data: { status: 'APPROVED' } });

    // 🔑 SOLUCIÓN: Revalidar la ruta para que la lista se actualice
    revalidatePath('/admin/request');

    // Opcional: Si quieres que la finca aprobada aparezca en la página de exploración (si existe)
    // revalidatePath('/explorar');

    return { ok: true, data: finca };
  } catch (error) {
    console.error('approveFincaRequest error', error);
    return { ok: false, message: 'Error al aprobar' };
  }
}
