import { auth } from '@/auth.config';
import RegistroFincaPage from './RegistroFincaPage';
// 🔑 Importamos AMBAS acciones
import { getAllFincas } from '@/actions/registro-finca/finca-actions';
import { getFincasByUser } from '@/actions/registro-finca/get-fincas-by-user';
import { getApprovedFincasByUser } from '@/actions/registro-finca/get-approved-fincas-by-user';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

  // 1. Asegurar autenticación
  if (!session?.user) {
    redirect('/auth/login');
  }

  // 2. Determinar el rol y la acción a llamar
  const userRole = session.user.role;
  let fincas: any[] = [];

  if (userRole === 'admin') {
    // Si es ADMIN, obtén TODAS las fincas
    fincas = await getAllFincas();
  } else if (userRole === 'user') {
    // Si es USER, obtén solo sus fincas
    // Mostrar SOLO fincas aprobadas en la vista principal de registro para usuarios normales
    fincas = await getApprovedFincasByUser();
  } else {
    // En caso de un rol no esperado, redirige o maneja el error
    redirect('/');
  }

  // 3. Pasar las fincas relevantes al Cliente Component
  return <RegistroFincaPage fincas={fincas} />;
}
