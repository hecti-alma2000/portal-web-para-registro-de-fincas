'use server';
import { signOut } from '@/auth.config';

export async function logout() {
  // Asegura que la sesión se invalide en el servidor y las cookies se limpien
  await signOut({ redirect: false });

  // Opcional: Si quieres ser *muy* agresivo con Next.js App Router:
  // revalidatePath('/');
  // revalidatePath('/alguna-ruta-de-la-app');
}
