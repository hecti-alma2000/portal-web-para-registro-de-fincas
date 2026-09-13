// src/app/layout.tsx (Modificado)

import './globals.css';
import { Providers as SessionProviders } from '@/components/providers/Providers';
import { Providers as ThemeProviders } from '@/components/Providers';
// Client ScrollReveal component (client component - can be statically imported)
import ScrollReveal from '@/components/ScrollReveal';
import { auth } from '@/auth.config';
import { Toaster } from 'sonner';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Portal web para el registro de fincas',
  description: 'Sistema web para el registro, certificación y exploración de fincas agroturísticas.',
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
      <body>
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
