import type { MetadataRoute } from 'next';
import { getPublicFincas } from '@/actions/registro-finca/finca-actions';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/explorar`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/certificacion`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/info`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const fincas = await getPublicFincas().catch(() => []);
  const fincaRoutes: MetadataRoute.Sitemap = (fincas || []).map((finca: { id: number; updatedAt?: Date }) => ({
    url: `${SITE_URL}/fincas/${finca.id}`,
    lastModified: finca.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...fincaRoutes];
}
