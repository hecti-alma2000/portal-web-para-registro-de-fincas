// src/lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import prisma from "./prisma";

// Verifica que la variable esté definida, de lo contrario lanza un error
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("La variable de entorno NEXTAUTH_SECRET no está definida");
}

// Ahora TypeScript sabe que NEXTAUTH_SECRET es un string
const NEXTAUTH_SECRET: string = process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [], // Eliminado el proveedor de credenciales
  callbacks: {
    async jwt({ token, user }) {
      // Si se inicia sesión, agregamos el role al token
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      // Extendemos session.user con role e id
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // Ruta personalizada para el login
  },
  secret: NEXTAUTH_SECRET,
};
