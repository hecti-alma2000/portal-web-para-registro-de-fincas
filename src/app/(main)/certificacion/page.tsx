// app/certificacion/page.tsx

import { auth } from '@/auth.config';
import { CertificacionForm } from '@/components/ui/CertificacionForm';
import { redirect } from 'next/navigation';

/**
 * Página principal del Sistema de Certificación de Fincas.
 * Usa un componente de cliente para la interactividad y SweetAlert2.
 */
export default async function CertificacionPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/login');
  }
  // 2. Definir el tipo de rol estricto. (Asumiendo que Role es 'user' o 'admin')
  const role: 'user' | 'admin' = session.user.role === 'admin' ? 'admin' : 'user';
  return (
    <div className="py-12 px-4 min-h-screen">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Diagnóstico de Potencial Agroturístico
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Responde este cuestionario y obtén una evaluación inmediata de tu finca.
        </p>
      </header>

      <CertificacionForm role={role} />
    </div>
  );
}
