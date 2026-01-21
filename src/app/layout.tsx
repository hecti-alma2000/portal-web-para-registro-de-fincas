// src/app/layout.tsx (Modificado)

import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Providers as ThemeProviders } from '@/components/Providers';
// Client ScrollReveal component (client component - can be statically imported)
import ScrollReveal from '@/components/ScrollReveal';
import { auth } from '@/auth.config';

export const metadata = {
  title: 'Portal web para el registro de fincas',
  description: '',
};

//  CAMBIO CLAVE: Función asíncrona para obtener la sesión del servidor
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  //  1. Obtener la sesión del lado del servidor (Auth.js v5)
  const session = await auth();

  return (
    <html lang="es">
      <head />
      <body>
        {/* 2. Pasar la sesión al componente Providers */}
        <Providers session={session}>
          <ScrollReveal />
          <ThemeProviders>{children}</ThemeProviders>
        </Providers>
      </body>
    </html>
  );
}
