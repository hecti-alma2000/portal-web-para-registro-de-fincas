import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { ProfileCard } from '@/components/ui/profile/ProfileCard';
import { StatCard } from '@/components/ui/profile/StatCard';
import { getProfileStats } from '@/actions/registro-finca/get-profile-stats';

// Lucide icons
import { Home, BadgeCheck, Star, Leaf } from 'lucide-react';
import ProfileReload from '@/components/profile/ProfileReload';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  // Mantener la verificación de sesión en el servidor y cargar las estadísticas en el servidor
  // para que estén disponibles sin depender de peticiones cliente adicionales.

  const stats = await getProfileStats();
  // Si es admin, mostrar totalFincas; si es user, mostrar userFincas
  const fincasRegistradas = stats?.isAdmin ? stats.totalFincas : stats?.userFincas;

  return (
    <div className="py-12 px-4 min-h-screen bg-gradient-to-b from-white to-slate-100">
      <header className="text-center mb-10 reveal" data-delay="100">
        <h1 className="text-4xl font-extrabold text-gray-900">Mi Perfil</h1>
        <p className="text-lg text-gray-600 mt-2">
          Gestiona tu información y visualiza tus estadísticas
        </p>
      </header>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Tarjeta de Perfil */}
        <div className="reveal" data-delay="200">
          <ProfileCard user={session.user} />
        </div>

        {/* Componente cliente que fuerza un reload cuando la navegación fue cliente->cliente */}
        <ProfileReload />

        {/* Estadísticas (renderizado en servidor usando actions) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="reveal" data-delay="300">
            <StatCard
              title="Fincas Registradas"
              value={fincasRegistradas ?? 0}
              icon={<Home size={24} className="text-blue-600" />}
              description={
                stats?.isAdmin ? 'Total de fincas en el sistema' : 'Total de fincas bajo tu gestión'
              }
            />
          </div>
          <div className="reveal" data-delay="350">
            <StatCard
              title="Certificaciones"
              value={stats?.certificaciones ?? 0}
              icon={<BadgeCheck size={24} className="text-green-600" />}
              description={
                stats?.isAdmin
                  ? 'Total de certificaciones en el sistema'
                  : 'Certificaciones realizadas en tus fincas'
              }
            />
          </div>
          <div className="reveal" data-delay="400">
            <StatCard
              title="Última certificación"
              value={
                stats?.ultimaCertificacion
                  ? new Date(stats.ultimaCertificacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Sin registros'
              }
              icon={<Star size={24} className="text-yellow-600" />}
              description={
                stats?.isAdmin
                  ? 'Fecha de la última certificación en el sistema'
                  : 'Tu última certificación registrada'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
