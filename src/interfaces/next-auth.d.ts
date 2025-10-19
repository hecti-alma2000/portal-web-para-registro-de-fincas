// src/next-auth.d.ts (o src/types/next-auth.d.ts)

import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Role } from '@prisma/client'; // Importa el enum Role de Prisma si es necesario

// 1. Extender la interfaz Session para incluir tu propiedad 'user' personalizada
declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // Asegúrate de que el ID esté presente
      role: Role; // Agrega la propiedad 'role' con el tipo Role
      name?: string | null;
      email: string;
      // Agrega cualquier otra propiedad que quieras exponer en la sesión
    } & DefaultSession['user'];
  }

  // 2. Extender la interfaz User (cuando se inicia sesión)
  interface User extends DefaultUser {
    id: string;
    role: Role; // Agrega la propiedad 'role'
    // Agrega las mismas propiedades que tiene tu modelo de Prisma
  }
}

// 3. Extender la interfaz JWT para incluir la data del usuario
declare module 'next-auth/jwt' {
  interface JWT {
    data: {
      id: string;
      role: Role; // Agrega la propiedad 'role'
      name?: string | null;
      email: string;
      // Debe coincidir con lo que asignas en el callback jwt de auth.config.ts
    };
  }
}
