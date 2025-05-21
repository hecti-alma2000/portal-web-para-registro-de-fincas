// src/lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import { compare } from "bcryptjs";

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
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: {
          label: "Correo electrónico",
          type: "email",
          placeholder: "tu@correo.com",
        },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Buscamos al usuario por email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Si el usuario no existe o no tiene contraseña, se rechaza
        if (!user || !user.hashedPassword) return null;

        const isValid = await compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isValid) return null;

        // Retornar con los datos que necesitemos en la sesión
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
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
