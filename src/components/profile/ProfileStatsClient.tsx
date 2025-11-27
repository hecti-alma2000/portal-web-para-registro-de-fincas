'use client';

import React, { useEffect, useState } from 'react';
import { StatCard } from '@/components/ui/profile/StatCard';
import { Home, BadgeCheck, Star } from 'lucide-react';

type Stats = {
  isAdmin?: boolean;
  totalFincas?: number;
  userFincas?: number;
  certificaciones?: number;
  ultimaCertificacion?: string | null;
};

export default function ProfileStatsClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchStats() {
      setLoading(true);
      try {
        const res = await fetch('/api/profile/stats', { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (mounted) setStats(data);
      } catch (err) {
        console.error('Error fetching profile stats:', err);
        if (mounted) setError('No se pudieron cargar las estadísticas');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-pulse bg-white rounded-md h-24" />
        <div className="animate-pulse bg-white rounded-md h-24" />
        <div className="animate-pulse bg-white rounded-md h-24" />
        <div className="animate-pulse bg-white rounded-md h-24" />
      </div>
    );
  }

  if (error || !stats) {
    return <div className="text-sm text-red-600">{error ?? 'Sin estadísticas'}</div>;
  }

  const fincasRegistradas = stats.isAdmin ? stats.totalFincas : stats.userFincas;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="reveal">
        <StatCard
          title="Fincas Registradas"
          value={fincasRegistradas ?? 0}
          icon={<Home size={24} className="text-blue-600" />}
          description={
            stats.isAdmin ? 'Total de fincas en el sistema' : 'Total de fincas bajo tu gestión'
          }
        />
      </div>

      <div className="reveal">
        <StatCard
          title="Certificaciones"
          value={stats.certificaciones ?? 0}
          icon={<BadgeCheck size={24} className="text-green-600" />}
          description={
            stats.isAdmin
              ? 'Total de certificaciones en el sistema'
              : 'Certificaciones realizadas en tus fincas'
          }
        />
      </div>

      <div className="reveal">
        <StatCard
          title="Última certificación"
          value={
            stats.ultimaCertificacion
              ? new Date(stats.ultimaCertificacion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Sin registros'
          }
          icon={<Star size={24} className="text-yellow-600" />}
          description={
            stats.isAdmin
              ? 'Fecha de la última certificación en el sistema'
              : 'Tu última certificación registrada'
          }
        />
      </div>
    </div>
  );
}
