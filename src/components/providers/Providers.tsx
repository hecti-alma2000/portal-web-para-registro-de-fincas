// src/components/providers/Providers.tsx (Modificado)

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { auth } from '@/auth.config';

interface Props {
  children: ReactNode; // 🔑 Ahora el componente puede recibir la sesión
  session: any; // Usa 'any' si tu tipo Session extendido no está disponible aquí
}

export const Providers = ({ children, session }: Props) => {
  // 🔑 Pasa la sesión obtenida del servidor al SessionProvider
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
