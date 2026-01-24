'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
// Importación corregida: el tipo ahora está en la raíz del paquete
import { type ThemeProviderProps } from 'next-themes';

export function Providers({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
