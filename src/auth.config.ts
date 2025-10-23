// auth.config.ts

import { NextAuthConfig, User as NextAuthUser } from 'next-auth'; // Importamos el User de NextAuth para tipar
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';

import { z } from 'zod';

// Tipado base para el usuario retornado por authorize
// Esto asume que Role está disponible globalmente, si no, defínelo aquí
interface CustomUser extends NextAuthUser {
  id: string;
  role: 'admin' | 'user';
  email: string;
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // El usuario retornado por authorize es de tipo CustomUser (o AdapterUser),
        // que ahora incluye la propiedad 'role'.
        // Lo asignamos a una propiedad 'data' en el token.
        token.data = user as CustomUser; // Forzamos el tipado aquí
      }
      return token;
    },
    session({ session, token }) {
      // Asignamos la propiedad 'data' del token a session.user
      // El 'as any' es necesario aquí para evitar conflictos con la interfaz base de NextAuth
      session.user = token.data as any;
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials): Promise<CustomUser | null> {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLocaleLowerCase() },
        });

        // Si no hay usuario o la contraseña es incorrecta, devuelve null
        if (!user || !bcryptjs.compareSync(password, user.password)) return null;

        // Aseguramos que el email no sea null ni undefined
        if (!user.email) return null;

        const { password: _, ...rest } = user;

        // Aseguramos que el objeto retornado coincida con CustomUser
        const userForToken: CustomUser = {
          ...rest,
          id: user.id.toString(), // Convertimos el ID a string
          email: user.email, // Aseguramos que sea string (no null)
          role: user.role as 'admin' | 'user', // Forzamos el tipo del role
        };

        return userForToken;
      },
    }),
  ],
};

// ... el resto de las exportaciones ...
export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
