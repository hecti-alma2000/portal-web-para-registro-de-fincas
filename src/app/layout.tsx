// src/app/layout.tsx (Modificado)

import './globals.css';
import { Providers as SessionProviders } from '@/components/providers/Providers';
import { Providers as ThemeProviders } from '@/components/Providers';
// Client ScrollReveal component (client component - can be statically imported)
import ScrollReveal from '@/components/ScrollReveal';
import { auth } from '@/auth.config';
import { Toaster } from 'sonner';
import type { Metadata, Viewport } from 'next';
import { roboto, pacifico } from '@/config/fonts';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const SITE_DESCRIPTION =
  'Sistema web para el registro, certificación y exploración de fincas agroturísticas.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Portal web para el registro de fincas',
    template: '%s | Registro de Fincas',
  },
  description: SITE_DESCRIPTION,
  applicationName: 'Registro de Fincas',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Registro de Fincas',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icons/icon-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: SITE_URL,
    siteName: 'Registro de Fincas',
    title: 'Portal web para el registro de fincas',
    description: SITE_DESCRIPTION,
    images: [{ url: '/icons/icon-512x512.png', width: 512, height: 512, alt: 'Registro de Fincas' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal web para el registro de fincas',
    description: SITE_DESCRIPTION,
    images: ['/icons/icon-512x512.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#16a34a',
};

//  CAMBIO CLAVE: Función asíncrona para obtener la sesión del servidor
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  //  1. Obtener la sesión del lado del servidor (Auth.js v5)
  const session = await auth();

  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={`${roboto.variable} ${pacifico.variable}`}>
        <ThemeProviders
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProviders session={session}>
            <ScrollReveal />
            {children}
            <Toaster position="top-center" richColors />
          </SessionProviders>
        </ThemeProviders>
      </body>
    </html>
  );
}
